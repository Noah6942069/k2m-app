import pandas as pd
import os

print("Creating dummy excel...")
df = pd.DataFrame({'a': [1, 2], 'b': [3, 4]})
df.to_excel('test.xlsx', index=False)
print("Excel created.")

print("Reading excel...")
try:
    df2 = pd.read_excel('test.xlsx')
    print("Read success!")
    print(df2)
except Exception as e:
    print(f"Read failed: {e}")
