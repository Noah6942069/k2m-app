
import pandas as pd
import os

# Mock the function from analytics.py
def perform_smart_analysis(df: pd.DataFrame) -> dict:
    print("--- Debugging Smart Analysis ---")
    print(f"Columns found: {df.columns.tolist()}")
    
    columns = [c.lower() for c in df.columns]
    
    # 1. Identify Key Columns
    date_col = next((c for c in df.columns if any(x in c.lower() for x in ['date', 'time', 'day', 'month', 'year'])), None)
    value_col = next((c for c in df.columns if any(x in c.lower() for x in ['sales', 'revenue', 'amount', 'price', 'total', 'profit', 'cost'])), None)
    category_col = next((c for c in df.columns if any(x in c.lower() for x in ['product', 'item', 'category', 'region', 'client', 'customer']) and df[c].nunique() < 50), None)
    
    print(f"Identified Date Col: {date_col}")
    print(f"Identified Value Col: {value_col}")
    print(f"Identified Category Col: {category_col}")

    result = {
        "identified_date_col": date_col,
        "identified_value_col": value_col,
        "identified_category_col": category_col,
        "sales_over_time": [],
        "top_categories": []
    }

    # 2. Sales Over Time
    if date_col:
        try:
            temp_df = df.copy()
            temp_df[date_col] = pd.to_datetime(temp_df[date_col], errors='coerce')
            temp_df = temp_df.dropna(subset=[date_col])
            
            temp_df['_month_str'] = temp_df[date_col].dt.strftime('%b')
            temp_df['_month_num'] = temp_df[date_col].dt.month
            
            if value_col:
                monthly = temp_df.groupby(['_month_num', '_month_str'])[value_col].sum().reset_index()
            else:
                monthly = temp_df.groupby(['_month_num', '_month_str']).size().reset_index(name='count')
                
            print(f"Sales/Activity Over Time (First 3): {monthly.head(3).to_dict('records')}")
        except Exception as e:
            print(f"Smart Analysis (Date) failed: {e}")

    return result

# Load the file
file_path = "uploads/Online-Store-Orders.xlsx"
if os.path.exists(file_path):
    print(f"Loading {file_path}...")
    try:
        df = pd.read_excel(file_path)
        print(f"Loaded DataFrame with shape: {df.shape}")
        
        # Check Total Cells calculation
        total_rows = len(df)
        total_cols = len(df.columns)
        total_cells = total_rows * total_cols
        print(f"Total Cells Calculation: {total_rows} * {total_cols} = {total_cells}")
        
        # Run analysis
        perform_smart_analysis(df)
        
    except Exception as e:
        print(f"Error reading file: {e}")
else:
    print("File not found.")
