# list_models.py
import os
from dotenv import load_dotenv
from google.generativeai import configure, list_models

load_dotenv()
configure(api_key=os.getenv("GOOGLE_API_KEY"))

print("Available models:")
for model in list_models():
    if 'generateContent' in model.supported_generation_methods:
        print(f"- {model.name} (Supports content generation)")