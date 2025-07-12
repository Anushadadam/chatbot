from langchain_core.messages import AIMessage, HumanMessage
from database import get_db_connection, get_user_id

def get_chat_history(user_name: str):
    """Retrieves and formats chat history for LangChain"""
    user_id = get_user_id(user_name)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "SELECT role, content FROM chat_history WHERE user_id = ? ORDER BY timestamp ASC",
        (user_id,)
    )
    history = cursor.fetchall()
    conn.close()
    
    # Convert to LangChain message types
    messages = []
    for record in history:
        if record['role'] == 'human':
            messages.append(HumanMessage(content=record['content']))
        elif record['role'] == 'ai':
            messages.append(AIMessage(content=record['content']))
    return messages

# add_message_to_history remains the same

def add_message_to_history(user_name: str, role: str, content: str):
    """Adds a new message to the user's chat history."""
    user_id = get_user_id(user_name)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute(
        "INSERT INTO chat_history (user_id, role, content) VALUES (?, ?, ?)",
        (user_id, role, content)
    )
    conn.commit()
    conn.close()
