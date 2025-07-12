# test_gemini_direct.py
import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

def test_gemini():
    try:
        api_key = os.getenv("GOOGLE_API_KEY")
        print(f"Using API key: {api_key[:5]}...{api_key[-5:]}")
        
        # Configure the API
        genai.configure(api_key=api_key)
        
        # Create the model
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        
        # Start a chat
        chat = model.start_chat(history=[])
        response = chat.send_message("Hello world!")
        
        print("Success! Response:", response.text)
        return True
    except Exception as e:
        print("Error:", str(e))
        return False

if __name__ == "__main__":
    test_gemini()