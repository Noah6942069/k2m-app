from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, create_db_and_tables
from .routers import datasets, visualizations, analytics, preferences
import os

app = FastAPI(title="Data Analyst App API")

@app.on_event("startup")
def on_startup():
    create_db_and_tables()
    os.makedirs("uploads", exist_ok=True)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for Vercel deployment
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets.router)
app.include_router(visualizations.router)
app.include_router(analytics.router)
app.include_router(preferences.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Data Analyst API is running with SQLite Persistence"}
 
