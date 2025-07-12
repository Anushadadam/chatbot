import os
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import create_tool_calling_agent, AgentExecutor
from tools import all_tools

# Load environment variables
load_dotenv()

# Get API key from environment
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise ValueError("GOOGLE_API_KEY not found in .env file")

# Initialize LLM with explicit API key
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash-latest",  # Use a model from your available list
    temperature=0,
    api_key=GOOGLE_API_KEY
)

def create_agent_executor(user_name: str):
    """Creates the agent executor for a specific user"""
    # System message template
    system_template = f"""You are a helpful personal assistant for a user named {user_name}.
    
    **STRICT RULES:**
    1. Use tools for ALL to-do list operations
    2. ALWAYS provide 'user_name' in tool calls with value '{user_name}'
    3. For vague removal requests, list todos first to clarify
    """
    
    prompt = ChatPromptTemplate.from_messages([
        ("system", system_template),
        MessagesPlaceholder(variable_name="chat_history"),
        ("human", "{input}"),
        MessagesPlaceholder(variable_name="agent_scratchpad"),
    ])
    
    # Create agent
    agent = create_tool_calling_agent(
        llm=llm,
        tools=all_tools,
        prompt=prompt
    )
    
    # Create executor
    return AgentExecutor(
        agent=agent,
        tools=all_tools,
        verbose=True,
        handle_parsing_errors=(
            "Check your output and make sure it conforms! "
            "If you're trying to use a tool, make sure to use the exact format."
        ),
        max_iterations=5,
        return_intermediate_steps=False
    )
# Create a single executor instance
agent_executor = create_agent_executor("Anusha")