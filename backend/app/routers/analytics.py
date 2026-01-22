from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
import pandas as pd
import os
from ..database import get_session
from ..models import Dataset
from ..schemas import DashboardStats, ColumnStats

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"]
)

def get_column_type(series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
    elif pd.api.types.is_datetime64_any_dtype(series):
        return "datetime"
    else:
        return "categorical"

@router.get("/{dataset_id}/stats", response_model=DashboardStats)
def get_dataset_stats(dataset_id: int, session: Session = Depends(get_session)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    if not os.path.exists(dataset.file_path):
         raise HTTPException(status_code=404, detail="File missing from disk")
    
    try:
        df = pd.read_csv(dataset.file_path)
        
        total_rows = len(df)
        total_cols = len(df.columns)
        missing_cells = int(df.isna().sum().sum())
        total_cells = total_rows * total_cols
        missing_pct = round((missing_cells / total_cells) * 100, 2) if total_cells > 0 else 0
        duplicate_rows = int(df.duplicated().sum())
        
        col_stats_list = []
        
        for col in df.columns:
            series = df[col]
            col_type = get_column_type(series)
            missing = int(series.isna().sum())
            unique = int(series.nunique())
            
            stats = ColumnStats(
                name=col,
                type=col_type,
                missing_count=missing,
                unique_count=unique
            )
            
            if col_type == "numeric":
                stats.min = float(series.min()) if not series.empty else 0
                stats.max = float(series.max()) if not series.empty else 0
                stats.mean = float(series.mean()) if not series.empty else 0
                stats.median = float(series.median()) if not series.empty else 0
                stats.std = float(series.std()) if not series.empty else 0
                
            elif col_type == "categorical":
                # Top 10 frequent values
                counts = series.value_counts().head(10).reset_index()
                counts.columns = ["name", "value"] 
                dist_data = []
                for _, row in counts.iterrows():
                    dist_data.append({
                        "name": str(row["name"]),
                        "value": int(row["value"])
                    })
                stats.distribution = dist_data
                
            col_stats_list.append(stats)
        
        return DashboardStats(
            dataset_id=dataset_id,
            filename=dataset.filename,
            total_rows=total_rows,
            total_columns=total_cols,
            missing_cells=missing_cells,
            missing_percentage=missing_pct,
            duplicate_rows=duplicate_rows,
            column_stats=col_stats_list
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing file: {str(e)}")
