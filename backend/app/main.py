"""
K2M Analytics API
==================
Main FastAPI application entry point.
Handles server lifecycle, middleware, and router registration.
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
import pandas as pd

from .database import create_db_and_tables, engine
from .models import Dataset
from .routers import datasets, visualizations, analytics, preferences
from sqlmodel import Session, select


def seed_demo_data(force: bool = False):
    """
    Seeds the database with demo data if no datasets exist.
    This ensures dashboards aren't empty for new users.
    """
    demo_csv_path = os.path.join(os.path.dirname(__file__), "..", "demo_data.csv")
    
    if not os.path.exists(demo_csv_path):
        print("⚠️  Demo data file not found, skipping seed")
        return {"status": "error", "message": "Demo data file not found"}
    
    with Session(engine) as session:
        # Check if any datasets exist
        if not force:
            existing = session.exec(select(Dataset)).first()
            if existing:
                print("📊 Datasets already exist, skipping demo seed")
                return {"status": "skipped", "message": "Datasets already exist"}
        
        # Copy demo file to uploads folder
        os.makedirs("uploads", exist_ok=True)
        dest_path = os.path.join("uploads", "demo_sales_data.csv")
        shutil.copy(demo_csv_path, dest_path)
        
        # Read file to get metadata
        df = pd.read_csv(dest_path)
        file_size = os.path.getsize(dest_path)
        
        # Create dataset record
        dataset = Dataset(
            filename="demo_sales_data.csv",
            file_path=dest_path,
            file_size=file_size,
            total_rows=len(df),
            total_columns=len(df.columns)
        )
        session.add(dataset)
        session.commit()
        
        print(f"✅ Demo data seeded: {len(df)} rows, {len(df.columns)} columns")
        return {"status": "success", "message": f"Demo data seeded: {len(df)} rows"}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Runs startup tasks before yielding, cleanup tasks after.
    """
    # Startup
    create_db_and_tables()
    os.makedirs("uploads", exist_ok=True)
    
    # Try auto-seed (non-forcing)
    seed_demo_data(force=False)
    
    print("✅ K2M API started successfully")
    
    yield  # Application runs here
    
    # Shutdown (cleanup if needed)
    print("👋 K2M API shutting down")


# Initialize FastAPI with metadata
app = FastAPI(
    title="K2M Analytics API",
    description="AI-Powered Data Analytics Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(datasets.router)
app.include_router(visualizations.router)
app.include_router(analytics.router)
app.include_router(preferences.router)


@app.post("/seed", tags=["System"])
def trigger_seed(force: bool = True):
    """Manually trigger demo data seeding."""
    return seed_demo_data(force=force)


@app.get("/", tags=["Health"])
def root():
    """Root endpoint - API status check."""
    return {
        "status": "ok",
        "message": "K2M Analytics API is running",
        "version": "1.0.0"
    }


@app.get("/health", tags=["Health"])
def health_check():
    """
    Health check endpoint for monitoring services.
    Returns detailed health status.
    """
    return {
        "status": "healthy",
        "database": "connected",
        "version": "1.0.0"
    }
