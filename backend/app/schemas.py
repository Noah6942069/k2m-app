from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class UserBase(BaseModel):
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

class DatasetBase(BaseModel):
    filename: str
    description: Optional[str] = None

class DatasetCreate(DatasetBase):
    pass

class Dataset(DatasetBase):
    id: int
    file_path: Optional[str] = None
    rows: Optional[int] = None
    columns: Optional[List[str]] = None

    class Config:
        from_attributes = True

class AnalysisResult(BaseModel):
    columns: List[str]
    head: List[Dict[str, Any]]
    shape: List[int]

# --- Analytics / Stats Schemas ---

class ColumnStats(BaseModel):
    name: str
    type: str  # numeric, categorical, datetime, other
    missing_count: int
    unique_count: int
    # Numeric only
    min: Optional[float] = None
    max: Optional[float] = None
    mean: Optional[float] = None
    median: Optional[float] = None
    std: Optional[float] = None
    # Categorical only (Top 10 distribution)
    distribution: Optional[List[Dict[str, Any]]] = None # [{"name": "A", "value": 10}, ...]

class DashboardStats(BaseModel):
    dataset_id: int
    filename: str
    total_rows: int
    total_columns: int
    missing_cells: int
    missing_percentage: float
    duplicate_rows: int
    
    column_stats: List[ColumnStats]
