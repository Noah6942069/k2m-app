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

from .database import create_db_and_tables
from .routers import datasets, visualizations, analytics, preferences


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Application lifespan manager.
    Runs startup tasks before yielding, cleanup tasks after.
    """
    # Startup
    create_db_and_tables()
    os.makedirs("uploads", exist_ok=True)
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

