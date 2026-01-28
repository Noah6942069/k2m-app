
# Use official Python runtime as a parent image
FROM python:3.11-slim

# Set working directory
WORKDIR /code

# Install system dependencies (needed for some python packages)
RUN apt-get update && apt-get install -y gcc

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Expose port (Cloud Run defaults to 8080)
ENV PORT=8080

# Command to run the application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
