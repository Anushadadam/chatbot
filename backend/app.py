from flask import Flask, request, jsonify
from flask_cors import CORS
from agent import create_agent, init_agent, AgentState
import uuid

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

agents = {}  # SessionID -> Agent

@app.route('/start_session', methods=['POST'])
def start_session():
    session_id = str(uuid.uuid4())
    agents[session_id] = create_agent(session_id)
    return jsonify({"session_id": session_id})

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    session_id = data['session_id']
    message = data['message']
    
    if session_id not in agents:
        return jsonify({"error": "Invalid session ID"}), 400
    
    # Initialize state
    state = init_agent(session_id)
    state["messages"].append(HumanMessage(content=message))
    
    # Execute agent
    result = agents[session_id].invoke(state)
    
    return jsonify({
        "response": result["messages"][-1].content,
        "todos": SupabaseManager().get_todos(session_id),
        "user_name": result["user_name"]
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001, debug=True)