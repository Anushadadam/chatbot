from langgraph.graph import END, StateGraph
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, AIMessage
from tools import TodoTools
from supabase_manager import SupabaseManager
import json

# Define agent state
class AgentState(dict):
    session_id: str
    messages: list
    user_name: str = None

# Initialize tools
def init_tools(session_id):
    todo_tools = TodoTools(session_id)
    return [todo_tools.add_todo, todo_tools.list_todos, 
            todo_tools.remove_todo, todo_tools.clear_todos]

# Create agent workflow
def create_agent(session_id: str):
    tools = init_tools(session_id)
    llm = ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.7)
    supabase = SupabaseManager()
    
    # Define graph nodes
    def agent_node(state: AgentState):
        messages = state["messages"]
        response = llm.invoke(messages)
        state["messages"].append(AIMessage(content=response.content))
        return state
    
    def tool_node(state: AgentState):
        last_message = state["messages"][-1]
        tool_input = json.loads(last_message.additional_kwargs["tool_calls"][0]["function"]["arguments"])
        
        # Execute tool
        tool_name = last_message.additional_kwargs["tool_calls"][0]["function"]["name"]
        tool = next(t for t in tools if t.name == tool_name)
        result = tool.invoke(tool_input)
        
        # Update state
        state["messages"].append(AIMessage(
            content=result,
            name=tool_name
        ))
        
        # Update memory
        messages = [{"role": "user" if isinstance(m, HumanMessage) else "assistant", 
                    "content": m.content} for m in state["messages"]]
        supabase.update_session(
            session_id=state["session_id"],
            conversation=messages,
            todos=supabase.get_todos(state["session_id"]),
            user_name=state["user_name"]
        )
        
        return state
    
    # Build graph
    workflow = StateGraph(AgentState)
    workflow.add_node("agent", agent_node)
    workflow.add_node("tool", tool_node)
    
    workflow.set_entry_point("agent")
    workflow.add_conditional_edges(
        "agent",
        lambda state: "tool_calls" in state["messages"][-1].additional_kwargs,
        {
            True: "tool",
            False: END
        }
    )
    workflow.add_edge("tool", "agent")
    
    return workflow.compile()

# Initialize session
def init_agent(session_id: str):
    supabase = SupabaseManager()
    data = supabase.get_session_data(session_id)
    
    state = AgentState(
        session_id=session_id,
        messages=[],
        user_name=data["user_name"] if data else None
    )
    
    if data:
        for msg in data["conversation"]:
            state["messages"].append(
                HumanMessage(content=msg["content"]) if msg["role"] == "user" 
                else AIMessage(content=msg["content"])
            )
    
    return state