# Snello AI Agent System

Advanced chatbot with memory persistence and to-do management using agentic architecture.

## Features
- 💬 Conversational AI with Gemini Pro
- 📝 Persistent to-do list management
- 🧠 Long-term memory with Supabase
- 🎨 Beautiful React UI with real-time updates
- 🤖 Agentic workflow with LangGraph
- ⚙️ Tool integration (add/remove/list todos)

## Architecture
![Agentic Architecture Diagram](architecture.png)

## Setup

### Backend
1. Create `.env` file:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
GOOGLE_API_KEY=your_gemini_key