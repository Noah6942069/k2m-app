try:
    import google.generativeai as genai
    HAS_GENAI = True
except ImportError:
    HAS_GENAI = False

import os
import pandas as pd
import json
try:
    from dotenv import load_dotenv
    HAS_DOTENV = True
except ImportError:
    HAS_DOTENV = False

if HAS_DOTENV:
    # backend/app/services/ai_service.py -> backend/.env
    # Go up 3 levels: services -> app -> backend
    base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    env_path = os.path.join(base_dir, ".env")
    load_dotenv(env_path)

API_KEY = os.getenv("GEMINI_API_KEY")

class AiService:
    def __init__(self):
        self.model = None
        
        if HAS_GENAI and API_KEY:
            try:
                genai.configure(api_key=API_KEY)
                # Use standard 1.5 flash model
                self.model = genai.GenerativeModel('gemini-1.5-flash')
            except Exception as e:
                print(f"Failed to configure Gemini AI: {e}")
                self.model = None
        else:
            if not HAS_GENAI:
                print("AI_SERVICE: Warning: google-generativeai package not installed. AI features disabled.")
            if not API_KEY:
                print("AI_SERVICE: Warning: GEMINI_API_KEY not found. AI features disabled.")

    async def analyze_dataset(self, df: pd.DataFrame, filename: str) -> dict:
        if not self.model:
            print("AI Model not available, returning None for analysis")
            return None

        # Prepare snippet safely - limit data sent to AI for speed and cost
        columns = list(df.columns)
        # Take a small sample, dropping rows with all NaNs to save tokens
        sample_df = df.dropna(how='all').head(15)
        head_data = sample_df.to_string(index=False)
        
        prompt = f"""
        You are a Data Analyst expert. Analyze this dataset snippet from '{filename}'.
        
        Columns: {columns}
        Data Snippet:
        {head_data}
        
        Return a valid JSON object with the following schema:
        {{
            "identified_date_col": "exact_column_name_or_null",
            "identified_value_col": "exact_column_name_for_primary_sales_or_revenue_or_null",
            "identified_category_col": "exact_column_name_for_primary_product_or_segment_or_null",
            "insights": [
                {{ "text": "Insight string", "type": "positive|warning|info" }}
            ],
            "summary": "Executive summary"
        }}
        
        Strictly JSON. No extra text.
        """
        
        try:
            # generate_content_async is available in newest SDK
            response = await self.model.generate_content_async(prompt)
            text = response.text.strip()
            # Handle potential JSON markdown blocks
            if text.startswith("```json"):
                text = text[7:]
            if text.endswith("```"):
                text = text[:-3]
            return json.loads(text.strip())
        except Exception as e:
            print(f"AI Analysis Request Failed: {e}")
            return None

    async def chat_with_data(self, df: pd.DataFrame, filename: str, user_message: str, history: list = []) -> str:
        # Prepare basic local stats for fallback
        numeric_summary = {}
        numeric_df = df.select_dtypes(include=['number'])
        if not numeric_df.empty:
            try:
                numeric_summary = {
                    "means": numeric_df.mean().to_dict(),
                    "totals": numeric_df.sum().to_dict(),
                    "maximums": numeric_df.max().to_dict()
                }
            except:
                numeric_summary = "Error calculating numeric stats"
        else:
            numeric_summary = "No numeric data available"

        columns = list(df.columns)

        if not self.model:
            return self._local_fallback_response(df, user_message, numeric_summary, columns, reason="Configuration Missing")

        # Prepare global context for the AI
        total_rows = len(df)
        
        # 1. Identify category-like columns for summary (heuristic)
        cat_summaries = []
        for col in df.columns[:15]: # Limit search
            if df[col].nunique() < 50:
                counts = df[col].value_counts().head(20).to_dict()
                cat_summaries.append(f"Top values in '{col}': {counts}")
        
        summary_context = "\n".join(cat_summaries)
        sample_data = df.dropna(how='all').head(10).to_string(index=False)
        
        prompt = f"""
        You are a Data Analyst expert for the Altech platform.
        You are talking about the complete dataset '{filename}'.
        
        [DATASET OVERVIEW]
        Total Rows: {total_rows}
        Columns: {columns}
        
        [GLOBAL SUMMARIES (Calculated across ALL {total_rows} rows)]
        {summary_context}
        
        [NUMERIC TRENDS]
        {numeric_summary}
        
        [FIRST 10 ROWS SAMPLE]
        {sample_data}
        
        [USER MESSAGE]
        {user_message}
        
        Answer EXACTLY based on the provided Global Summaries and Numeric Trends. 
        Do NOT say it is a 'sample' if the Global Summaries cover the whole dataset.
        Be professional, concise, and accurate.
        """
        
        try:
            response = await self.model.generate_content_async(prompt)
            return response.text
        except Exception as e:
            err_msg = str(e).lower()
            if "429" in str(e) or "quota" in err_msg or "rate" in err_msg:
                # Provide a local fallback analysis instead of just an error
                return self._local_fallback_response(df, user_message, numeric_summary, columns, reason="Daily Quota Exceeded")
            return f"I'm sorry, I couldn't reach the AI service right now. Error: {str(e)}"

    def _local_fallback_response(self, df, user_message: str, numeric_summary: dict, columns: list, reason: str = "Unavailable") -> str:
        """Provides basic local analysis when the AI service is rate-limited or unavailable."""
        msg_lower = user_message.lower()
        
        # Try to answer common questions locally
        if any(word in msg_lower for word in ["total", "sum", "how much", "revenue", "sales"]):
            if isinstance(numeric_summary, dict) and "totals" in numeric_summary:
                totals = numeric_summary["totals"]
                top_total = max(totals.items(), key=lambda x: x[1]) if totals else ("N/A", 0)
                return f"📊 **Local Analysis**\n\nBased on your data:\n- **Highest total column**: {top_total[0]} = ${top_total[1]:,.2f}\n- **Total rows**: {len(df):,}\n\n*System Note: Advanced AI is currently unavailable ({reason}). Using local stats.*"
        
        if any(word in msg_lower for word in ["average", "avg", "mean"]):
            if isinstance(numeric_summary, dict) and "means" in numeric_summary:
                means = numeric_summary["means"]
                formatted = ", ".join([f"{k}: {v:.2f}" for k, v in list(means.items())[:3]])
                return f"📊 **Local Analysis**\n\n**Averages**: {formatted}\n\n*System Note: Advanced AI is currently unavailable ({reason}). Using local stats.*"
        
        if any(word in msg_lower for word in ["best", "top", "highest", "max"]):
            if isinstance(numeric_summary, dict) and "maximums" in numeric_summary:
                maxs = numeric_summary["maximums"]
                top_max = max(maxs.items(), key=lambda x: x[1]) if maxs else ("N/A", 0)
                return f"📊 **Local Analysis**\n\n**Highest value**: {top_max[0]} = {top_max[1]:,.2f}\n\n*System Note: Advanced AI is currently unavailable ({reason}). Using local stats.*"
        
        # Generic fallback
        return f"⏳ **AI Service Unavailable ({reason})**\n\nThe AI service cannot be reached.\n\n**Your dataset summary**:\n- Rows: {len(df):,}\n- Columns: {len(columns)}\n- Columns: {', '.join(columns[:5])}{'...' if len(columns) > 5 else ''}\n\n*Try asking about totals, averages, or top values - I can still calculate those locally!*"

ai_service = AiService()
