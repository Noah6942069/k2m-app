import os
import sys

print(f"Python Executable: {sys.executable}")
print(f"CWD: {os.getcwd()}")

try:
    import google.generativeai as genai
    print("SUCCESS: google.generativeai imported")
except ImportError as e:
    print(f"FAILURE: google.generativeai not found: {e}")

try:
    from dotenv import load_dotenv
    print("SUCCESS: python-dotenv imported")
    load_dotenv()
    key = os.getenv("GEMINI_API_KEY")
    if key:
        print(f"SUCCESS: API Key found (starts with {key[:4]}...)")
        
        try:
            genai.configure(api_key=key)
            print("Configured genai...")
            model = genai.GenerativeModel('models/gemini-flash-latest')
            print("SUCCESS: Model instantiated 'models/gemini-flash-latest'")
        except Exception as e:
            print(f"FAILURE: Model instantiation failed: {e}")
            try:
                print("Retrying with 'gemini-1.5-flash'...")
                model = genai.GenerativeModel('gemini-1.5-flash')
                print("SUCCESS: Model instantiated 'gemini-1.5-flash'")
            except Exception as e2:
                 print(f"FAILURE: All model attempts failed: {e2}")

    else:
        print("FAILURE: API Key NOT found in env")
        # Try finding the file manually
        if os.path.exists(".env"):
            print("INFO: .env file exists in CWD")
            with open(".env", "r") as f:
                content = f.read()
                print(f"INFO: .env content length: {len(content)}")
        else:
            print("FAILURE: .env file NOT found in CWD")
except ImportError as e:
    print(f"FAILURE: python-dotenv not found: {e}")
