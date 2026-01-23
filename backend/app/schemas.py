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
    total_cells: int
    missing_cells: int
    missing_percentage: float
    duplicate_rows: int
    
    column_stats: List[ColumnStats]
    smart_analysis: Optional['SmartAnalysis'] = None

class TimeSeriesPoint(BaseModel):
    date: str
    value: float

class CategoryPoint(BaseModel):
    name: str
    value: float
    growth: Optional[float] = 0.0

    top_product: Optional[str] = "-"

class Insight(BaseModel):
    text: str
    type: str = "info" # positive, warning, info

class SmartAnalysis(BaseModel):
    identified_date_col: Optional[str] = None
    identified_value_col: Optional[str] = None # e.g. Sales, Revenue
    identified_category_col: Optional[str] = None # e.g. Product, Region
    
    sales_over_time: List[TimeSeriesPoint] = []
    top_categories: List[CategoryPoint] = []

    # Summary Metrics for KPI Cards
    total_sales: Optional[float] = 0.0
    average_sales: Optional[float] = 0.0
    best_month: Optional[str] = "-"
    top_product: Optional[str] = "-"
    
    insights: List[Insight] = []
    summary: Optional[str] = None


# --- Advanced Dashboard Stats ---

class AdvancedStats(BaseModel):
    """Extended analytics for enhanced dashboard"""
    dataset_id: int
    
    # Growth & Trends
    growth_rate: Optional[float] = None  # % change from previous period
    growth_direction: str = "neutral"  # up, down, neutral
    
    # Data Health
    data_health_score: float = 100.0  # % of non-null values
    data_quality_issues: List[str] = []
    
    # Counts
    transaction_count: int = 0
    unique_categories: int = 0
    unique_products: int = 0
    
    # Date Range
    date_range_start: Optional[str] = None
    date_range_end: Optional[str] = None
    date_span_days: Optional[int] = None
    
    # Numeric Summary
    numeric_columns: List[Dict[str, Any]] = []  # [{name, min, max, median, sum}]
    
    # Trend data for comparison chart
    current_period_data: List[Dict[str, Any]] = []
    previous_period_data: List[Dict[str, Any]] = []


# --- Dashboard Preferences ---

class WidgetConfig(BaseModel):
    widget_id: str
    enabled: bool = True
    order: int = 0

class DashboardPreferenceBase(BaseModel):
    widget_config: Dict[str, bool]  # {"kpi_revenue": true, ...}
    layout_order: Optional[List[str]] = None  # ["kpi_revenue", "chart_trend", ...]

class DashboardPreferenceCreate(DashboardPreferenceBase):
    pass

class DashboardPreferenceRead(DashboardPreferenceBase):
    user_email: str

