from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, List, Optional
from sqlmodel import Session
from pydantic import BaseModel
import pandas as pd
import os
from ..database import get_session
from ..models import Dataset

router = APIRouter(
    prefix="/visualizations",
    tags=["visualizations"]
)

class ChartData(BaseModel):
    type: str 
    title: str
    data: List[Dict[str, Any]]
    config: Dict[str, Any] 

@router.get("/dataset/{dataset_id}/columns", response_model=List[str])
def get_dataset_columns(dataset_id: int, session: Session = Depends(get_session)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
        
    try:
        df = pd.read_csv(dataset.file_path, nrows=1) # Read header only
        return df.columns.tolist()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

@router.get("/dataset/{dataset_id}/generate", response_model=ChartData)
def generate_chart(dataset_id: int, type: str, x_axis: str, y_axis: Optional[str] = None, session: Session = Depends(get_session)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    try:
        df = pd.read_csv(dataset.file_path)
        
        if x_axis not in df.columns:
            raise HTTPException(status_code=400, detail=f"Column {x_axis} not found")

        chart_data = []
        chart_config = {}

        if type == "bar":
            if not y_axis or y_axis == "count_ops":
                counts = df[x_axis].value_counts().head(10).reset_index()
                counts.columns = [x_axis, "count"]
                chart_data = counts.to_dict(orient="records")
                chart_config = {
                    x_axis: {"label": x_axis.title(), "color": "hsl(var(--chart-1))"},
                    "count": {"label": "Count", "color": "hsl(var(--chart-2))"}
                }
            else:
                if y_axis not in df.columns:
                     raise HTTPException(status_code=400, detail=f"Column {y_axis} not found")
                grouped = df.groupby(x_axis)[y_axis].sum().head(10).reset_index()
                chart_data = grouped.to_dict(orient="records")
                chart_config = {
                    x_axis: {"label": x_axis.title(), "color": "hsl(var(--chart-1))"},
                    y_axis: {"label": y_axis.title(), "color": "hsl(var(--chart-2))"}
                }

        elif type == "line":
            if not y_axis or y_axis == "count_ops":
                 raise HTTPException(status_code=400, detail="Line chart requires a Y axis")
            
            subset = df.sort_values(by=x_axis).head(50)
            chart_data = subset[[x_axis, y_axis]].to_dict(orient="records")
            chart_config = {
                 x_axis: {"label": x_axis.title(), "color": "hsl(var(--chart-1))"},
                 y_axis: {"label": y_axis.title(), "color": "hsl(var(--chart-2))"}
            }
            
        else:
             raise HTTPException(status_code=400, detail=f"Chart type {type} not supported yet")

        return ChartData(
            type=type,
            title=f"{type.title()} Chart: {x_axis}" + (f" vs {y_axis}" if y_axis else ""),
            data=chart_data,
            config=chart_config
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chart generation failed: {str(e)}")
