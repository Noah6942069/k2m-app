from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from fastapi.responses import FileResponse, StreamingResponse
from typing import List
from sqlmodel import Session, select
import pandas as pd
import shutil
import os
import io
from ..database import get_session
from ..models import Dataset, DatasetRead, DatasetUpdate
from ..schemas import AnalysisResult
from ..services.storage_service import storage_service
from google.cloud import storage

router = APIRouter(
    prefix="/datasets",
    tags=["datasets"]
)

@router.patch("/{dataset_id}", response_model=DatasetRead)
def update_dataset(dataset_id: int, dataset_update: DatasetUpdate, session: Session = Depends(get_session)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    if dataset_update.filename:
        # Note: Renaming files in GCS is complex (requires copy+delete). 
        # For MVP, we simply update the display name in DB, not the actual blob name.
        dataset.filename = dataset_update.filename

    session.add(dataset)
    session.commit()
    session.refresh(dataset)
    return dataset

@router.post("/upload", response_model=DatasetRead)
async def upload_dataset(file: UploadFile = File(...), session: Session = Depends(get_session)):
    if not (file.filename.endswith('.csv') or file.filename.endswith('.xlsx') or file.filename.endswith('.xls')):
        raise HTTPException(status_code=400, detail="Only CSV and Excel files are supported.")
    
    try:
        # Use Storage Service (GCS or Local)
        # We append a timestamp or UUID in production to avoid collisions, but keeping it simple for now
        file_path = storage_service.upload_file(file, file.filename)
        
        # Analyze file basic stats (Requires reading it back)
        # Pandas can read gs:// directly if gcsfs is installed
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file_path)
        else:
            df = pd.read_excel(file_path)
            
        total_rows, total_columns = df.shape
        # For GCS, getting size might need an extra API call, but we can approximate or skip
        file_size = 0 # Placeholder if not local
        if not file_path.startswith("gs://"):
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
        import traceback
        traceback.print_exc()
        print(f"Upload Error: {e}")
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
    
    # Check if local file missing (skip check for GCS)
    if not dataset.file_path.startswith("gs://") and not os.path.exists(dataset.file_path):
         raise HTTPException(status_code=404, detail="File missing from disk")
         
    try:
        # Pandas supports gs:// paths automatically with gcsfs installed
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
        print(f"Read Error: {e}")
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

@router.delete("/{dataset_id}")
def delete_dataset(dataset_id: int, session: Session = Depends(get_session)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    
    # Delete file from disk/GCS (TODO: Implementing Delete in StorageService)
    # For now, we leave the blob to avoid accidental data loss
    if not dataset.file_path.startswith("gs://") and os.path.exists(dataset.file_path):
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
    
    # For GCS, we could generate a signed URL, but for now we stream it through backend
    if dataset.file_path.startswith("gs://"):
         # This is a bit heavy for large files, but works for MVP
         try:
            df = pd.read_csv(dataset.file_path) if dataset.filename.endswith('.csv') else pd.read_excel(dataset.file_path)
            stream = io.StringIO()
            df.to_csv(stream, index=False)
            response = StreamingResponse(iter([stream.getvalue()]), media_type="text/csv")
            response.headers["Content-Disposition"] = f"attachment; filename={dataset.filename}"
            return response
         except Exception as e:
             raise HTTPException(status_code=500, detail=f"Failed to stream from cloud: {e}")

    if not os.path.exists(dataset.file_path):
        raise HTTPException(status_code=404, detail="File missing from disk")
    
    return FileResponse(
        path=dataset.file_path,
        filename=dataset.filename,
        media_type="text/csv"
    )

