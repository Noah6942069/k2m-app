import os
from google.cloud import storage
from fastapi import UploadFile
import shutil

class StorageService:
    def __init__(self):
        # Assumes GOOGLE_APPLICATION_CREDENTIALS is set in env or default credentials work
        # If running locally without env var, valid gcloud auth login setup is needed
        try:
            self.client = storage.Client()
            self.bucket_name = os.getenv("GCS_BUCKET_NAME", "k2m-uploads")
            self.bucket = self.client.bucket(self.bucket_name)
        except Exception as e:
            print(f"Warning: GCS Client failed to initialize. {e}")
            self.client = None

    def upload_file(self, file: UploadFile, destination_blob_name: str) -> str:
        if not self.client:
            # Fallback to local storage if GCS is not configured
            # Ensure directory exists
            os.makedirs("uploads", exist_ok=True)
            
            local_path = f"uploads/{destination_blob_name}"
            print(f"Using Local Storage: Saving to {local_path}")
            
            with open(local_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            return local_path

        blob = self.bucket.blob(destination_blob_name)
        
        # Reset file pointer just in case
        file.file.seek(0)
        blob.upload_from_file(file.file, content_type=file.content_type)
        
        return f"gs://{self.bucket_name}/{destination_blob_name}"

    def get_file_url(self, file_path_or_uri: str) -> str:
        # Generate a signed URL for frontend download if needed
        # For now, just return the path
        return file_path_or_uri

storage_service = StorageService()
