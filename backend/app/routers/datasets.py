from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse
from typing import List
from sqlmodel import Session, select
import pandas as pd
import shutil
import os
from ..database import get_session
from ..models import Dataset, DatasetRead
from ..schemas import AnalysisResult

router = APIRouter(
    prefix="/datasets",
    tags=["datasets"]
)

@router.post("/upload", response_model=DatasetRead)
async def upload_dataset(file: UploadFile = File(...), session: Session = Depends(get_session)):
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx') or file.filename.endswith('.xls')):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported.")
    
    file_path = f"uploads/{file.filename}"
    
    try:
        # Save file to disk
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Analyze file basic stats
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
        total_rows, total_columns = df.shape
        file_size = os.path.getsize(file_path)
        
        # Save to DB
        dataset = Dataset(
            filename=file.filename,
            file_path=file_path,
            file_size=file_size,
            total_rows=total_rows,
            total_columns=total_columns
        )
        session.add(dataset)
        session.commit()
        session.refresh(dataset)
        
        return dataset
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing file: {str(e)}")

@router.get("/", response_model=List[DatasetRead])
def get_datasets(session: Session = Depends(get_session)):
    datasets = session.exec(select(Dataset)).all()
    return datasets

@router.get("/{dataset_id}/content")
def get_dataset_content(dataset_id: int, limit: int = 50, offset: int = 0, session: Session = Depends(get_session)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    if not os.path.exists(dataset.file_path):
         raise HTTPException(status_code=404, detail="File missing from disk")
         
    try:
        if dataset.filename.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
        
        total_rows = len(df)
        chunk = df.iloc[offset : offset + limit].fillna("")
        data = chunk.to_dict(orient='records')
        columns = df.columns.tolist()
        
        return {
            "id": dataset_id,
            "filename": dataset.filename,
            "total_rows": total_rows,
            "columns": columns,
            "data": data,
            "limit": limit,
            "offset": offset
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: int, session: Session = Depends(get_session)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Delete file from disk
    if os.path.exists(dataset.file_path):
        os.remove(dataset.file_path)
    
    # Delete from database
    session.delete(dataset)
    session.commit()
    
    return {"message": "Dataset deleted successfully"}

@router.get("/{dataset_id}/download")
def download_dataset(dataset_id: int, session: Session = Depends(get_session)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    if not os.path.exists(dataset.file_path):
        raise HTTPException(status_code=404, detail="File missing from disk")
    
    return FileResponse(
        path=dataset.file_path,
        filename=dataset.filename,
        media_type="text/csv"
    )
