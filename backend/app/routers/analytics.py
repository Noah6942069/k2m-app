from fastapi import APIRouter, HTTPException, Depends
from sqlmodel import Session
import pandas as pd
import os
import asyncio
import numpy as np
from ..database import get_session
from ..models import Dataset
from ..schemas import DashboardStats, ColumnStats, AdvancedStats
from ..services.ai_service import ai_service
from ..deps import get_current_user

router = APIRouter(
    prefix="/analytics",
    tags=["analytics"],
)


def _check_dataset_access(dataset: Dataset, current_user: dict):
    """Raises 403 if a non-admin user tries to access another company's dataset."""
    if current_user.get("role") != "admin" and dataset.company_id != current_user["company_id"]:
        raise HTTPException(status_code=403, detail="Access denied")

def get_column_type(series: pd.Series) -> str:
    if pd.api.types.is_numeric_dtype(series):
        return "numeric"
    elif pd.api.types.is_datetime64_any_dtype(series):
        return "datetime"
    else:
        return "categorical"

async def perform_smart_analysis(df: pd.DataFrame, filename: str = "") -> dict:
    """
    Heuristic + AI analysis with timeout fallback.
    """
    ai_result = None
    try:
        # 5 second timeout for AI analysis to prevent hanging the server
        ai_result = await asyncio.wait_for(ai_service.analyze_dataset(df, filename), timeout=5.0)
    except asyncio.TimeoutError:
        print(f"AI Analysis timed out for {filename}")
    except Exception as e:
        print(f"AI Analysis Error: {e}")
    
    columns = [c.lower() for c in df.columns]
    
    # 1. Identify Key Columns
    # prioritized list for value columns
    high_priority_value = ['sales', 'revenue', 'total', 'profit', 'turnover', 'billing', 'gross', 'net']
    low_priority_value = ['amount', 'price', 'cost', 'value', 'sum']
    
    value_col = None
    if ai_result and ai_result.get("identified_value_col"):
        value_col = ai_result["identified_value_col"]
    
    if not value_col:
        value_col = next((c for c in df.columns if any(x in c.lower() for x in high_priority_value)), None)
        if not value_col:
            value_col = next((c for c in df.columns if any(x in c.lower() for x in low_priority_value)), None)
            
    date_col = None
    if ai_result and ai_result.get("identified_date_col"):
        date_col = ai_result["identified_date_col"]

    if not date_col:    
        date_col = next((c for c in df.columns if any(x in c.lower() for x in ['date', 'time', 'day', 'month', 'year', 'timestamp', 'period', 'created'])), None)
    
    # Exclude ID columns from category detection to avoid "OrderID"
    category_col = None
    if ai_result and ai_result.get("identified_category_col"):
        category_col = ai_result["identified_category_col"]

    if not category_col:
        # First priority: explicit 'product' or 'item' column, less strict on unique count
        category_col = next((c for c in df.columns if 
                             any(x in c.lower() for x in ['product', 'item', 'model', 'sku']) 
                             and not any(x in c.lower() for x in ['id', 'date', 'time'])
                             and df[c].nunique() < 2000), None)
                             
        if not category_col:
            # Second priority: other categories with strict limit
            category_col = next((c for c in df.columns if 
                                 any(x in c.lower() for x in ['category', 'region', 'client', 'customer', 'brand', 'market', 'segment', 'type', 'style']) 
                                 and not any(x in c.lower() for x in ['id', 'date', 'time'])
                                 and df[c].nunique() < 100), None)
    
    result = {
        "identified_date_col": date_col,
        "identified_value_col": value_col,
        "identified_category_col": category_col,
        "sales_over_time": [],
        "top_categories": []
    }

    # 2. Sales Over Time (if date + value/row_count)
    if date_col:
        try:
            temp_df = df.copy()
            # Try to convert to datetime
            temp_df[date_col] = pd.to_datetime(temp_df[date_col], errors='coerce')
            temp_df = temp_df.dropna(subset=[date_col])
            
            # Helper to clean currency/strings
            def clean_currency(x):
                if isinstance(x, str):
                    return pd.to_numeric(x.replace('$', '').replace(',', ''), errors='coerce')
                return x

            # Extract Month-Year for grouping
            temp_df['_month_str'] = temp_df[date_col].dt.strftime('%b')
            temp_df['_month_num'] = temp_df[date_col].dt.month
            
            if value_col:
                # Ensure numeric
                temp_df[value_col] = temp_df[value_col].apply(clean_currency)
                # Sum of value per month
                monthly = temp_df.groupby(['_month_num', '_month_str'])[value_col].sum().reset_index()
            else:
                # Count of rows per month (Analysis of Volume)
                monthly = temp_df.groupby(['_month_num', '_month_str']).size().reset_index(name='count')
                
            monthly = monthly.sort_values('_month_num')
            
            for _, row in monthly.iterrows():
                val = row[value_col] if value_col else row['count']
                if pd.notna(val):
                     result["sales_over_time"].append({
                         "date": row['_month_str'],
                         "value": float(val)
                     })
        except Exception as e:
            print(f"Smart Analysis (Date) failed: {e}")

    # 3. Top Categories (if category + value/row_count)
    if category_col:
        try:
            if value_col:
                # Ensure numeric (re-use clean logic if needed, but temp_df usage above handles it for date block, need to do it for DF here or reuse temp_df)
                 # We'll work on a copy to be safe
                cat_df = df.copy()
                cat_df[value_col] = cat_df[value_col].apply(clean_currency)
                top = cat_df.groupby(category_col)[value_col].sum().sort_values(ascending=False).head(5)
            else:
                top = df[category_col].value_counts().head(5)
                
            for name, val in top.items():
                result["top_categories"].append({
                    "name": str(name),
                    "value": float(val),
                    "growth": 0 # Placeholder
                })
        except Exception as e:
             print(f"Smart Analysis (Category) failed: {e}")
             
    # ... (existing code)
    
    # 4. Calculate Summary Metrics
    total_sales = 0.0
    average_sales = 0.0
    
    if value_col:
        try:
            # Create a working copy for global stats if not already created
            clean_df = df.copy()
            clean_df[value_col] = clean_df[value_col].apply(clean_currency)
            # Remove NaNs for stat calc
            clean_series = pd.to_numeric(clean_df[value_col], errors='coerce').dropna()
            
            total_sales = float(clean_series.sum())
            average_sales = float(clean_series.mean()) if not clean_series.empty else 0.0
        except Exception as e:
            print(f"Summary Stats failed: {e}")

    # Best Month
    best_month = "-"
    if result["sales_over_time"]:
        # sales_over_time is a list of dicts: {'date': 'Jan', 'value': 100}
        try:
            best_period = max(result["sales_over_time"], key=lambda x: x['value'])
            best_month = best_period['date']
        except:
            pass

    # Top Product/Category
    top_product = "-"
    if result["top_categories"]:
        try:
            # top_categories is already sorted descending
            top_product = result["top_categories"][0]['name']
        except:
            pass
            
    result["total_sales"] = total_sales
    result["average_sales"] = average_sales
    result["best_month"] = best_month
    result["top_product"] = top_product
    
    # 5. Generate AI Insights
    insights = []
    
    # Prioritize AI Insights from Gemini
    if ai_result and ai_result.get("insights"):
        for ins in ai_result["insights"]:
            insights.append({
                "text": ins["text"],
                "type": ins.get("type", "info")
            })
    
    # Supplement with Heuristic Insights if AI missed them
    # Sales Performance
    if not any("revenue" in i["text"].lower() or "sales" in i["text"].lower() for i in insights):
        if total_sales > 0:
            insights.append({
                "text": f"Heuristic: Total detected revenue is ${total_sales:,.0f}",
                "type": "positive"
            })
        elif len(df) > 0:
            insights.append({
                "text": f"Analyzed {len(df)} rows of data successfully",
                "type": "info"
            })

    # Best Period
    if not any("month" in i["text"].lower() or "strongest" in i["text"].lower() for i in insights):
        if best_month != "-" and best_month:
            insights.append({
                "text": f"{best_month} was the strongest performing month",
                "type": "positive"
            })
        
    # Data Quality
    total_cells_count = df.size
    missing_count = df.isna().sum().sum()
    if total_cells_count > 0:
         miss_pct = (missing_count / total_cells_count) * 100
         if miss_pct > 20 and not any("quality" in i["text"].lower() for i in insights):
             insights.append({
                 "text": f"Data Quality Warning: {miss_pct:.1f}% missing values",
                 "type": "warning"
             })
    
    # Fallback if empty
    if not insights:
        insights.append({
             "text": "Using AI-powered analysis for your data",
             "type": "info"
        })
        
    result["insights"] = insights
    # Add summary if AI provided one
    if ai_result and ai_result.get("summary"):
        result["summary"] = ai_result["summary"]
    else:
        result["summary"] = f"Analysis for {filename} completed. Detected {total_sales:,.0f} in value across {len(df)} records."

    return result

@router.get("/{dataset_id}/stats", response_model=DashboardStats)
async def get_dataset_stats(dataset_id: int, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    _check_dataset_access(dataset, current_user)
        
    if not os.path.exists(dataset.file_path):
         raise HTTPException(status_code=404, detail="File missing from disk")
    
    try:
        if dataset.filename.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
        
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
            
        # --- Perform Smart Analysis ---
        smart_data = await perform_smart_analysis(df, dataset.filename)
        
        return DashboardStats(
            dataset_id=dataset_id,
            filename=dataset.filename,
            total_rows=total_rows,
            total_columns=total_cols,
            total_cells=total_cells,
            missing_cells=missing_cells,
            missing_percentage=missing_pct,
            duplicate_rows=duplicate_rows,
            column_stats=col_stats_list,
            smart_analysis=smart_data
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing file: {str(e)}")

@router.post("/{dataset_id}/chat")
async def chat_with_dataset(dataset_id: int, request: dict, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    _check_dataset_access(dataset, current_user)
        
    user_message = request.get("message")
    if not user_message:
        raise HTTPException(status_code=400, detail="Message is required")
        
    try:
        if dataset.filename.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
            
        ai_response = await ai_service.chat_with_data(df, dataset.filename, user_message)
        return {"response": ai_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat failed: {str(e)}")

@router.get("/{dataset_id}/filters")
def get_suggested_filters(dataset_id: int, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    """
    Analyze the dataset and suggest good columns to use as filters.
    Returns columns with low cardinality (categorical) that would be useful for filtering.
    """
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    _check_dataset_access(dataset, current_user)
        
    try:
        if dataset.filename.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
        
        filters = []
        
        for col in df.columns:
            nunique = df[col].nunique()
            total = len(df)
            
            # Good filter candidates: categorical columns with 2-30 unique values
            # Also check for date-like columns
            is_date_like = any(x in col.lower() for x in ['date', 'month', 'year', 'period', 'quarter', 'week'])
            is_categorical = nunique >= 2 and nunique <= 30 and nunique < total * 0.1
            
            if is_date_like or is_categorical:
                # Get unique values (sorted if possible)
                try:
                    unique_values = sorted(df[col].dropna().unique().tolist())
                except:
                    unique_values = df[col].dropna().unique().tolist()
                
                # Limit to first 50 values
                unique_values = unique_values[:50]
                
                # Determine filter type
                filter_type = "date" if is_date_like else "categorical"
                
                # Calculate priority (lower is better)
                # Prioritize: date columns, then columns with 3-15 values
                priority = 0
                if is_date_like:
                    priority = 1
                elif 3 <= nunique <= 15:
                    priority = 2
                else:
                    priority = 3
                
                filters.append({
                    "column": col,
                    "type": filter_type,
                    "values": unique_values,
                    "count": nunique,
                    "priority": priority
                })
        
        # Sort by priority and return top 5
        filters.sort(key=lambda x: (x["priority"], -x["count"]))
        return {"filters": filters[:5]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing filters: {str(e)}")

@router.post("/{dataset_id}/stats/filtered")
async def get_filtered_stats(dataset_id: int, request: dict, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    """
    Get stats for a dataset with filters applied.
    Request body: {"filters": {"Column1": "Value1", "Column2": "Value2"}}
    """
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    _check_dataset_access(dataset, current_user)
    
    filters = request.get("filters", {})
    
    try:
        if dataset.filename.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
        
        # Apply filters
        filtered_df = df.copy()
        for col, value in filters.items():
            if col in filtered_df.columns and value and value != "All":
                filtered_df = filtered_df[filtered_df[col] == value]
        
        # Calculate basic stats
        total_rows = len(filtered_df)
        total_cols = len(filtered_df.columns)
        
        # Run smart analysis on filtered data
        smart_data = await perform_smart_analysis(filtered_df, dataset.filename)
        
        return {
            "dataset_id": dataset_id,
            "filename": dataset.filename,
            "total_rows": total_rows,
            "total_columns": total_cols,
            "filters_applied": filters,
            "smart_analysis": smart_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error with filtered stats: {str(e)}")

@router.get("/{dataset_id}/anomalies")
def detect_anomalies(dataset_id: int, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    """
    Detect statistical anomalies in the dataset using z-score and IQR methods.
    Returns a list of detected anomalies with severity.
    """
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    _check_dataset_access(dataset, current_user)
    
    try:
        if dataset.filename.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
        
        anomalies = []
        
        # Analyze numeric columns for outliers
        numeric_cols = df.select_dtypes(include=['number']).columns.tolist()
        
        for col in numeric_cols[:10]:  # Limit to first 10 numeric columns
            series = df[col].dropna()
            if len(series) < 10:
                continue
            
            mean = series.mean()
            std = series.std()
            
            if std == 0:
                continue
            
            # Z-score method
            z_scores = (series - mean) / std
            high_outliers = (z_scores > 3).sum()
            low_outliers = (z_scores < -3).sum()
            
            if high_outliers > 0:
                max_val = series.max()
                anomalies.append({
                    "id": f"high_{col}",
                    "title": f"Unusually High Values in {col}",
                    "description": f"Found {high_outliers} values that are more than 3 standard deviations above the mean. Max value: {max_val:,.2f}",
                    "severity": "high" if high_outliers > 5 else "medium",
                    "metric": col,
                    "change": round((max_val - mean) / mean * 100, 1) if mean != 0 else 0,
                    "timestamp": "Just now",
                    "status": "new"
                })
            
            if low_outliers > 0:
                min_val = series.min()
                anomalies.append({
                    "id": f"low_{col}",
                    "title": f"Unusually Low Values in {col}",
                    "description": f"Found {low_outliers} values that are more than 3 standard deviations below the mean. Min value: {min_val:,.2f}",
                    "severity": "medium",
                    "metric": col,
                    "change": round((min_val - mean) / mean * 100, 1) if mean != 0 else 0,
                    "timestamp": "Just now",
                    "status": "new"
                })
        
        # Check for missing data anomalies
        total_cells = df.size
        missing_cells = df.isna().sum().sum()
        missing_pct = (missing_cells / total_cells) * 100 if total_cells > 0 else 0
        
        if missing_pct > 10:
            anomalies.append({
                "id": "missing_data",
                "title": "High Missing Data Rate",
                "description": f"The dataset has {missing_pct:.1f}% missing values. This may affect analysis accuracy.",
                "severity": "high" if missing_pct > 25 else "medium",
                "metric": "Data Quality",
                "change": round(missing_pct, 1),
                "timestamp": "Just now",
                "status": "new"
            })
        
        # Check for duplicate rows
        duplicate_count = df.duplicated().sum()
        duplicate_pct = (duplicate_count / len(df)) * 100 if len(df) > 0 else 0
        
        if duplicate_pct > 5:
            anomalies.append({
                "id": "duplicates",
                "title": "Duplicate Entries Detected",
                "description": f"Found {duplicate_count} duplicate rows ({duplicate_pct:.1f}% of data). Consider deduplication.",
                "severity": "low",
                "metric": "Data Quality",
                "change": round(duplicate_pct, 1),
                "timestamp": "Just now",
                "status": "new"
            })
        
        return {"anomalies": anomalies}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error detecting anomalies: {str(e)}")


@router.get("/{dataset_id}/advanced-stats", response_model=AdvancedStats)
def get_advanced_stats(dataset_id: int, session: Session = Depends(get_session), current_user: dict = Depends(get_current_user)):
    """
    Returns extended analytics for the enhanced dashboard:
    - growth_rate: % change from previous period
    - data_health_score: % of non-null values
    - transaction_count: total row count
    - unique_categories/products: distinct category counts
    - date_range: min/max dates if date column exists
    - numeric_summary: min/max/median for key columns
    - trend comparison data for charts
    """
    # Fetch dataset
    dataset = session.get(Dataset, dataset_id)
    if not dataset:
        raise HTTPException(status_code=404, detail="Dataset not found")
    _check_dataset_access(dataset, current_user)
    
    if not os.path.exists(dataset.file_path):
        raise HTTPException(status_code=404, detail="Dataset file not found")
    
    try:
        # Load data
        if dataset.file_path.endswith('.csv'):
            df = pd.read_csv(dataset.file_path)
        else:
            df = pd.read_excel(dataset.file_path)
        
        result = AdvancedStats(dataset_id=dataset_id)
        
        # Transaction count (row count)
        result.transaction_count = len(df)
        
        # Data Health Score
        total_cells = df.size
        non_null_cells = df.count().sum()
        result.data_health_score = round((non_null_cells / total_cells) * 100, 1) if total_cells > 0 else 100.0
        
        # Data quality issues
        issues = []
        missing_pct = 100 - result.data_health_score
        if missing_pct > 10:
            issues.append(f"{missing_pct:.1f}% missing values")
        
        duplicate_count = df.duplicated().sum()
        if duplicate_count > 0:
            dup_pct = (duplicate_count / len(df)) * 100
            if dup_pct > 5:
                issues.append(f"{dup_pct:.1f}% duplicate rows")
        
        result.data_quality_issues = issues
        
        # Identify key columns (similar to perform_smart_analysis)
        date_col = next((c for c in df.columns if any(x in c.lower() for x in ['date', 'time', 'day', 'month', 'year', 'timestamp', 'period'])), None)
        value_col = next((c for c in df.columns if any(x in c.lower() for x in ['sales', 'revenue', 'total', 'profit', 'amount', 'price', 'value'])), None)
        category_col = next((c for c in df.columns if any(x in c.lower() for x in ['product', 'item', 'category', 'region', 'client', 'brand']) and 'id' not in c.lower()), None)
        
        # Unique categories/products count
        if category_col:
            result.unique_categories = int(df[category_col].nunique())
            result.unique_products = result.unique_categories
        
        # Date range
        if date_col:
            try:
                temp_dates = pd.to_datetime(df[date_col], errors='coerce').dropna()
                if not temp_dates.empty:
                    result.date_range_start = temp_dates.min().strftime('%Y-%m-%d')
                    result.date_range_end = temp_dates.max().strftime('%Y-%m-%d')
                    result.date_span_days = (temp_dates.max() - temp_dates.min()).days
            except:
                pass
        
        # Numeric columns summary
        numeric_cols = df.select_dtypes(include=[np.number]).columns
        numeric_summary = []
        for col in numeric_cols[:5]:  # Limit to first 5 numeric columns
            series = df[col].dropna()
            if not series.empty:
                numeric_summary.append({
                    "name": col,
                    "min": float(series.min()),
                    "max": float(series.max()),
                    "median": float(series.median()),
                    "sum": float(series.sum())
                })
        result.numeric_columns = numeric_summary
        
        # Growth rate calculation (if date and value columns exist)
        if date_col and value_col:
            try:
                temp_df = df.copy()
                temp_df[date_col] = pd.to_datetime(temp_df[date_col], errors='coerce')
                temp_df = temp_df.dropna(subset=[date_col])
                
                # Clean value column
                def clean_currency(x):
                    if isinstance(x, str):
                        return pd.to_numeric(x.replace('$', '').replace(',', ''), errors='coerce')
                    return x
                
                temp_df[value_col] = temp_df[value_col].apply(clean_currency)
                temp_df[value_col] = pd.to_numeric(temp_df[value_col], errors='coerce')
                
                # Get midpoint date
                min_date = temp_df[date_col].min()
                max_date = temp_df[date_col].max()
                mid_date = min_date + (max_date - min_date) / 2
                
                # Split into periods
                first_half = temp_df[temp_df[date_col] < mid_date]
                second_half = temp_df[temp_df[date_col] >= mid_date]
                
                first_sum = first_half[value_col].sum()
                second_sum = second_half[value_col].sum()
                
                if first_sum > 0:
                    result.growth_rate = round(((second_sum - first_sum) / first_sum) * 100, 1)
                    result.growth_direction = "up" if result.growth_rate > 0 else ("down" if result.growth_rate < 0 else "neutral")
                
                # Generate period comparison data for charts
                temp_df['month'] = temp_df[date_col].dt.to_period('M')
                monthly_data = temp_df.groupby('month')[value_col].sum().reset_index()
                monthly_data['month'] = monthly_data['month'].astype(str)
                
                # Split into current vs previous
                midpoint = len(monthly_data) // 2
                if midpoint > 0:
                    result.previous_period_data = [
                        {"period": row['month'], "value": float(row[value_col])}
                        for _, row in monthly_data.iloc[:midpoint].iterrows()
                    ]
                    result.current_period_data = [
                        {"period": row['month'], "value": float(row[value_col])}
                        for _, row in monthly_data.iloc[midpoint:].iterrows()
                    ]
            except Exception as e:
                print(f"Growth calculation error: {e}")
        
        return result
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error calculating advanced stats: {str(e)}")
