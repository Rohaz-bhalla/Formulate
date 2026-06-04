from typing import Annotated, Optional, TypedDict
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
from schemas import WebsiteSchema, BrandRequest

class AgentState(TypedDict):
    request: BrandRequest
    generated_config: Optional[WebsiteSchema]
    retry_count: int
    feedback: str

def generate_site_node(state: AgentState):
    llm = ChatOpenAI(model="openai/gpt-oss-120b:free", temperature=0.7)
    structured_llm = llm.with_structured_output(WebsiteSchema)

    prompt = f"""
    You are an expert website builder. Generate a website landing page based on:
    Brand: {state['request'].brand_name}
    Category: {state['request'].category}
    Tone: {state['request'].tone}
    Products: {state['request'].products}
    
    You must strictly follow the schema provided. Do not include conversational filler like 
    'I'm sorry' or 'Here is your site'. Return ONLY the structured data.
    """
    if state.get("feedback"):
        prompt += f" Refine based on feedback: {state['feedback']}"
    
    response = structured_llm.invoke(prompt)
    return {"generated_config": response, "retry_count": state["retry_count"] + 1}

def should_continue(state: AgentState):
    if state["retry_count"] >= 2:
        return END
    return "generator"

workflow = StateGraph(AgentState)
workflow.add_node("generator", generate_site_node)
workflow.set_entry_point("generator")

workflow.add_conditional_edges(
    "generator", 
    should_continue,
    {
        "generator": "generator",
        "__end__": END
    }
)

app_graph = workflow.compile()