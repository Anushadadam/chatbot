# Snello Agent: To-Do List Chatbot with Agentic Architecture


This project is a AI chatbot built with an agentic architecture. It features a conversational AI powered by Google's Gemini Flash, a persistent to-do list, and a sleek web interface built with React.

## Features

- **Conversational Memory**: The agent remembers past interactions within a session and persists them in a database for future sessions
- **To-Do List Management**: Users can add, view, and remove items from their personal to-do list
- **Tool-Using Agent**: The agent uses specific tools (`add_todo`, `list_todos`, `remove_todo`) to interact with user data
- **Persistent Storage**: All user data, to-do lists, and chat histories are stored in a local SQLite database
- **Web UI**: Clean and responsive user interface with separate login and chat pages
- **Structured Architecture**: Clear separation of concerns with well-defined agentic components

## Architecture

The application follows a classic three-tier architecture with clear agentic components:

```
[React Frontend] --- (HTTP POST /api/chat) ---> [Flask Backend]
      |                                                |
      |                                     [LangChain Agent Executor]
      |                                                |
      |     +------------------------------------------+-----------------------------------------+
      |     |                                          |                                         |
[Reads/Writes to DB]                             [Gemini LLM]                           [Loads Chat History]
      ^                                                | (Decides action)                        ^
      |                                                |                                         |
      +--- [Python Tools (add/list/remove)] <--- (Invokes tool)                                  |
            (Interacts with SQLite)                                                    [SQLite Database]
```

### Agentic Components

| Component       | Implementation Location | Description |
|-----------------|--------------------------|-------------|
| **LLM (Planner)** | `agent.py` | Google Gemini 1.5 Flash model that decides whether to use tools or generate a response |
| **Tools (Executor)** | `tools.py` | Three functions decorated with LangChain's `@tool` that interact with the database |
| **Memory** | `memory.py` | Manages storage and retrieval of conversation history in SQLite |
| **Prompt** | `agent.py` | Carefully crafted ChatPromptTemplate with system instructions and placeholders |
| **Agent Executor** | `agent.py` | Orchestrates the agent's decision-making process |

## Memory System

### How Memory is Stored and Retrieved

**Storage:**
- Messages are stored in an SQLite database (`chat_history` table)
- Each message is recorded with:
  - `user_id`: Links to user table
  - `role`: 'human' or 'ai'
  - `content`: Message text
  - `timestamp`: Automatic timestamp

**Retrieval:**
- History is fetched chronologically using `get_chat_history()` function
- Converted to LangChain message objects (HumanMessage/AIMessage)
- Added to agent context via `MessagesPlaceholder` in prompt template

## Tool System

### How Tools are Defined and Registered

**Tool Definition (tools.py):**
- Each tool is defined with the `@tool` decorator
- Pydantic schemas validate parameters
- Tools contain database interaction logic
- Three core tools:
  1. `add_todo`: Adds task to user's to-do list
  2. `list_todos`: Returns formatted task list with indexes
  3. `remove_todo`: Marks task as completed by index

**Tool Registration (agent.py):**
- Tools are imported from `tools.py`
- Passed to agent during creation:
  ```python
  agent = create_tool_calling_agent(
      llm=llm,
      tools=all_tools,
      prompt=prompt
  )
  ```

## Setup and Run Instructions

### Prerequisites
- Python 3.9+
- Node.js 16+
- Google API key (for Gemini)

### Installation Steps

1. **Backend Setup**:
   ```bash
   cd backend
   
   # Create virtual environment
   python -m venv venv
   source venv/bin/activate  # Linux/MacOS
   venv\Scripts\activate    # Windows
   
   # Install dependencies
   pip install -r requirements.txt
   
   # Set up environment variables
   echo "GOOGLE_API_KEY='your_api_key_here'" > .env
   ```

2. **Frontend Setup**:
   ```bash
   cd ../frontend
   npm install
   ```

### Running the Application

1. **Start Backend** (in backend directory):
   ```bash
   python app.py
   # Server runs at http://localhost:5002
   ```

2. **Start Frontend** (in frontend directory):
   ```bash
   npm start
   # Application opens at http://localhost:3000
   ```

3. **Database Initialization**:
   - SQLite database auto-initializes on first run
   - Creates `snello_agent.db` with necessary tables

## Example Prompts

Try these interactions with your chatbot:

1. **Add task**  
   "Add 'Buy groceries' to my to-do list"
   
2. **List tasks**  
   "What's on my to-do list?"
   
3. **Remove task**  
   "Remove the second item from my list"
   
4. **Complex workflow**  
   "I finished my homework, please remove it from my list"

**Sample Conversation:**  
**User**: Add "Prepare presentation" to my list  
**Agent**: ✅ Added 'Prepare presentation' to your todo list  
**User**: What do I need to do today?  
**Agent**: Here's your to-do list:  
1. Buy groceries  
2. Prepare presentation  
**User**: Remove the first item  
**Agent**: 🗑️ Removed: Buy groceries  

## Limitations & Future Improvements

### Current Limitations
1. **Basic Authentication**: Only uses names for user identification
2. **Limited Toolset**: Only supports add/list/remove operations
3. **No Streaming**: Responses are delivered all at once
4. **Error Handling**: Basic error messages with limited recovery
5. **Scalability**: SQLite not suitable for large-scale deployment

### Future Improvements
| Improvement Area | Description |
|------------------|-------------|
| **Enhanced Tools** | Add task modification, deadlines, and prioritization |
| **Authentication** | Implement JWT or OAuth for secure login |
| **Streaming Responses** | Deliver responses incrementally for better UX |
| **Advanced Memory** | Implement conversation summarization for long histories |
| **Multi-Agent System** | Create specialized agents for different tasks |
| **Production Deployment** | Switch to PostgreSQL and add Gunicorn/Nginx |
| **Frontend Enhancements** | Add task management UI and real-time updates |