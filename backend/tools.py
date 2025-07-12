from langchain_core.tools import tool
from pydantic.v1 import BaseModel, Field
from database import get_db_connection, get_user_id

# Simplified schemas for better LLM understanding
class AddTodoSchema(BaseModel):
    task: str = Field(description="The todo item description")
    user_name: str = Field(description="The user's name")

class ListTodosSchema(BaseModel):
    user_name: str = Field(description="The user's name")

class RemoveTodoSchema(BaseModel):
    index: int = Field(description="Numeric index of the todo (1-based)")
    user_name: str = Field(description="The user's name")

@tool("add_todo", args_schema=AddTodoSchema)
def add_todo(task: str, user_name: str) -> str:
    """Adds a new item to the user's todo list"""
    try:
        user_id = get_user_id(user_name)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO todos (user_id, item) VALUES (?, ?)",
            (user_id, task)
        )
        conn.commit()
        conn.close()
        return f"✅ Added '{task}' to your todo list"
    except Exception as e:
        return f"❌ Error adding todo: {str(e)}"

@tool("list_todos", args_schema=ListTodosSchema)
def list_todos(user_name: str) -> str:
    """Lists all todos with indexes"""
    try:
        user_id = get_user_id(user_name)
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute(
            "SELECT id, item FROM todos WHERE user_id = ? AND completed = 0",
            (user_id,)
        )
        todos = cursor.fetchall()
        conn.close()
        
        if not todos:
            return "📭 Your todo list is empty"
        
        return "\n".join([f"{idx+1}. {t['item']}" for idx, t in enumerate(todos)])
    except Exception as e:
        return f"❌ Error listing todos: {str(e)}"

@tool("remove_todo", args_schema=RemoveTodoSchema)
def remove_todo(index: int, user_name: str) -> str:
    """Removes a todo by index"""
    try:
        user_id = get_user_id(user_name)
        conn = get_db_connection()
        cursor = conn.cursor()
        
        # Get all active todos
        cursor.execute(
            "SELECT id, item FROM todos WHERE user_id = ? AND completed = 0",
            (user_id,)
        )
        todos = cursor.fetchall()
        
        if not todos:
            return "📭 No todos to remove"
        
        if 1 <= index <= len(todos):
            todo_id = todos[index-1]['id']
            task = todos[index-1]['item']
            cursor.execute(
                "UPDATE todos SET completed = 1 WHERE id = ?",
                (todo_id,)
            )
            conn.commit()
            conn.close()
            return f"🗑️ Removed: {task}"
        else:
            return f"❌ Invalid index. Please use 1-{len(todos)}"
    except Exception as e:
        return f"❌ Error removing todo: {str(e)}"

all_tools = [add_todo, list_todos, remove_todo]