import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class SupabaseManager:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        self.client: Client = create_client(self.url, self.key)
    
    def get_session_data(self, session_id: str):
        response = self.client.table('sessions').select('*').eq('session_id', session_id).execute()
        return response.data[0] if response.data else None
    
    def update_session(self, session_id: str, conversation: list, todos: list, user_name: str = None):
        data = {
            "session_id": session_id,
            "conversation": conversation,
            "todos": todos,
            "user_name": user_name
        }
        
        if self.get_session_data(session_id):
            self.client.table('sessions').update(data).eq('session_id', session_id).execute()
        else:
            self.client.table('sessions').insert(data).execute()
    
    def get_todos(self, session_id: str):
        data = self.get_session_data(session_id)
        return data['todos'] if data else []
    
    def add_todo(self, session_id: str, todo: str):
        todos = self.get_todos(session_id)
        todos.append(todo)
        self.update_session(session_id, None, todos)
        return todos
    
    def remove_todo(self, session_id: str, todo: str):
        todos = self.get_todos(session_id)
        if todo in todos:
            todos.remove(todo)
        self.update_session(session_id, None, todos)
        return todos
    
    def clear_todos(self, session_id: str):
        self.update_session(session_id, None, [])
        return []