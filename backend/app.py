from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from dotenv import load_dotenv
import traceback

from database import init_db, get_user_id
from memory import add_message_to_history, get_chat_history
from agent import create_agent_executor  # Import the function, not the instance

# --- CRITICAL: LOAD ENV AND CHECK FOR API KEY ---
load_dotenv()
if not os.getenv("GOOGLE_API_KEY"):
    raise ValueError("GOOGLE_API_KEY not found in .env file. Please make sure it's set.")

# Initialize Flask App
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

# Initialize Database on startup
with app.app_context():
    init_db()

# --- Login and History routes ---
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    user_name = data.get('name')
    if not user_name:
        return jsonify({"error": "Name is required"}), 400
    get_user_id(user_name)
    return jsonify({"message": f"Welcome, {user_name}!"}), 200

@app.route('/api/history', methods=['GET'])
def history():
    user_name = request.args.get('name')
    if not user_name:
        return jsonify({"error": "User name is required"}), 400
    history_messages = get_chat_history(user_name)
    serializable_history = [
        {"role": "human" if msg.type == 'human' else "ai", "content": msg.content}
        for msg in history_messages
    ]
    return jsonify({"history": serializable_history})

# --- Fixed Chat Endpoint ---
@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.get_json()
    user_input = data.get('message', '').strip()
    user_name = data.get('userName', '').strip()

    if not user_input or not user_name:
        return jsonify({"error": "Message and userName are required"}), 400

    print(f"\n--- NEW REQUEST ---")
    print(f"User: {user_name}")
    print(f"Input: {user_input}")

    try:
        # 1. Get chat history
        chat_history = get_chat_history(user_name)
        print(f"History: {len(chat_history)} messages")
        
        # 2. Create agent executor for this user
        agent_executor = create_agent_executor(user_name)
        print("Agent executor created")
        
        # 3. Invoke the agent
        response = agent_executor.invoke({
            "input": user_input,
            "chat_history": chat_history
        })
        agent_response = response['output']
        print(f"Agent response: {agent_response}")
        
        # 4. Save conversation
        add_message_to_history(user_name, 'human', user_input)
        add_message_to_history(user_name, 'ai', agent_response)
        
        return jsonify({"response": agent_response})

    except Exception as e:
        print(f"\n!!! ERROR: {str(e)}")
        traceback.print_exc()
        return jsonify({
            "response": f"Backend error: {str(e)}"
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5002, debug=True)