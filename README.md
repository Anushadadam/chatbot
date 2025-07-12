# Snello SDE Internship - Take-Home Assignment

This project is a fully functional AI chatbot built with an agentic architecture. It features a conversational AI powered by Google's Gemini Pro, a persistent to-do list, and a sleek web interface built with React.

## Demo

 <!-- Replace with a screenshot of your app -->

## Features

-   **Conversational Memory:** The agent remembers past interactions within a session and persists them in a database for future sessions.
-   **To-Do List Management:** Users can add, view, and remove items from a personal to-do list.
-   **Tool-Using Agent:** The agent uses specific tools (`add_todo`, `list_todos`, `remove_todo`) to interact with the user's data, demonstrating a core principle of agentic design.
-   **Deadline Support:** Users can add optional deadlines to their to-do items (e.g., "Add 'review PRs' with deadline EOD").
-   **Persistent Storage:** All user data, to-do lists, and chat histories are stored in a local SQLite database.
-   **Web UI:** A clean and responsive user interface built with React and Material-UI, featuring a separate login and chat page.
-   **User Suggestions:** The UI provides helpful suggestion chips to guide the user on what they can ask.

## Architecture

The application follows a classic three-tier architecture: a React frontend, a Python (Flask) backend, and an SQLite database.

### Agentic Flow Diagram

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

### Key Components

-   **LLM (Planner):** `Google Gemini Pro` is used as the brain of the agent. It decides whether to make a direct conversational reply or to use one of the provided tools based on the user's input.
-   **Tools (Executor):** The `tools.py` module defines three functions decorated with LangChain's `@tool` decorator: `add_todo`, `list_todos`, and `remove_todo`. These functions contain the logic to interact directly with the SQLite database. Pydantic schemas are used to enforce typed arguments for the tools.
-   **Memory:**
    1.  **Conversation History:** Chat history is explicitly stored in the `chat_history` table in SQLite, linked to a `user_id`. It is loaded at the start of each interaction and passed to the agent's prompt, providing long-term memory.
    2.  **To-Do List State:** The to-do list is not stored in conversational memory but as structured data in the `todos` table. The agent accesses and modifies this state *only* through its tools, preventing hallucination and ensuring data integrity.
-   **Prompt:** The `agent.py` file contains a carefully crafted `ChatPromptTemplate`. It gives the LLM its persona, instructions on how and when to use tools, and injects the `user_name` directly into the instructions to ensure the agent always acts on behalf of the correct user.

## Setup and Run Instructions

### Prerequisites

-   Python 3.8+
-   Node.js and npm
-   A Google AI Studio API Key

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd snello-agent-project
```

### 2. Backend Setup

```bash
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows, use `venv\Scripts\activate`

# Install dependencies
pip install -r requirements.txt

# Create the .env file and add your API key
echo "GOOGLE_API_KEY='YOUR_GOOGLE_AI_STUDIO_API_KEY'" > .env

# Run the backend server
python app.py
```
The backend will be running at `http://localhost:5001`.

### 3. Frontend Setup

Open a new terminal window.

```bash
cd frontend

# Install dependencies
npm install

# Run the frontend development server
npm start
```
Your browser will automatically open to `http://localhost:3000`.

## Example Conversation

**User:** Hey!

**Agent:** Hey! What can I help you with today?

**User:** Add "Finish LangChain tutorial" to my to-do list.

**Agent:** Got it! I've added "Finish LangChain tutorial" to your to-do list.

**User:** What's on my list?

**Agent:** Current to-do list:
1. Finish LangChain tutorial

**User:** Also add "Submit the take-home assignment by Friday"

**Agent:** I've added "Submit the take-home assignment by Friday" to your to-do list with a deadline of Friday.

## Limitations & Future Improvements

-   **Streaming:** Responses are not streamed, so the user has to wait for the full agent chain to complete. Implementing streaming would significantly improve the user experience.
-   **Error Handling:** The current error handling is basic. A more robust system would provide more specific feedback to the user on the frontend.
-   **Authentication:** The current login system is for demonstration purposes. A real-world application would require a secure authentication system (e.g., JWT, OAuth).
-   **Scalability:** For a production environment, SQLite would be replaced with a more scalable database like PostgreSQL, and the Flask app would be deployed behind a production-grade web server like Gunicorn or Nginx.
