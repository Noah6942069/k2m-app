"""
K2M Analytics - Database Configuration
=======================================
SQLite database setup using SQLModel.
Handles connection pooling and session management.
"""

import os
from sqlmodel import SQLModel, create_engine, Session
from typing import Generator

# Database configuration
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///database.db")

# SQLite-specific settings
connect_args = {"check_same_thread": False}

# Create engine with configurable logging
# Set echo=False in production for better performance
engine = create_engine(
    DATABASE_URL,
    echo=os.getenv("DEBUG", "false").lower() == "true",
    connect_args=connect_args
)


def create_db_and_tables() -> None:
    """
    Initialize database tables.
    Called once during application startup.
    """
    SQLModel.metadata.create_all(engine)


def get_session() -> Generator[Session, None, None]:
    """
    Database session dependency.
    Yields a session and ensures proper cleanup.
    
    Usage:
        @router.get("/items")
        def get_items(session: Session = Depends(get_session)):
            ...
    """
    with Session(engine) as session:
        yield session

