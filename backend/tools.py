from langchain.tools import tool
from supabase_manager import SupabaseManager

class TodoTools:
    def __init__(self, session_id: str):
        self.session_id = session_id
        self.supabase = SupabaseManager()
    
    @tool("add_todo")
    def add_todo(self, task: str):
        """Add task to user's todo list. Returns confirmation."""
        todos = self.supabase.add_todo(self.session_id, task)
        return f"Added '{task}' to your todo list. Current todos: {', '.join(todos)}"
    
    @tool("list_todos")
    def list_todos(self):
        """List all tasks in user's todo list. Returns formatted list."""
        todos = self.supabase.get_todos(self.session_id)
        if not todos:
            return "Your todo list is empty!"
        return "\n".join([f"{i+1}. {task}" for i, task in enumerate(todos)])
    
    @tool("remove_todo")
    def remove_todo(self, task: str):
        """Remove task from todo list. Returns confirmation."""
        todos = self.supabase.remove_todo(self.session_id, task)
        return f"Removed '{task}'. Current todos: {', '.join(todos) or 'None'}"
    
    @tool("clear_todos")
    def clear_todos(self):
        """Clear entire todo list. Returns confirmation."""
        self.supabase.clear_todos(self.session_id)
        return "Your todo list has been cleared!"