"""
K2M Analytics - Database Models
================================
SQLModel ORM models for database tables.
These define the structure of data persisted to SQLite.
"""

from typing import Optional, List
from sqlmodel import Field, SQLModel
from datetime import datetime


# ============ Dataset Models ============
class DatasetBase(SQLModel):
    filename: str
    file_path: str
    file_size: int
    total_rows: Optional[int] = None
    total_columns: Optional[int] = None
    uploaded_at: datetime = Field(default_factory=datetime.utcnow)

# Database Table
class Dataset(DatasetBase, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    company_id: str = Field(default="nexus-demo-001", index=True)

# API Response
class DatasetRead(DatasetBase):
    id: int
    company_id: str = "nexus-demo-001"

class DatasetUpdate(SQLModel):
    filename: Optional[str] = None

# Visualization Model (For saving charts later)
class Visualization(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str
    chart_type: str
    config_json: str # JSON string of axis/cols
    dataset_id: int = Field(foreign_key="dataset.id")
    company_id: str = Field(default="nexus-demo-001", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Analysis Log (For tracking operations)
class AnalysisLog(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    dataset_id: int = Field(foreign_key="dataset.id")
    operation: str # e.g., "Clean Missing"
    details: str
    company_id: str = Field(default="nexus-demo-001", index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Dashboard Preferences (For per-user widget customization)
class DashboardPreference(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_email: str = Field(index=True)  # Use email as user identifier
    company_id: str = Field(default="nexus-demo-001", index=True)
    widget_config: str  # JSON string: {"kpi_revenue": true, "chart_trend": false, ...}
    layout_order: Optional[str] = None  # JSON array of widget order
    updated_at: datetime = Field(default_factory=datetime.utcnow)

