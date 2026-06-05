from typing import Optional, TypedDict
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
    You are an expert frontend developer and web designer. 
    Your task is to write a single, complete, beautiful, and fully-responsive 'index.html' landing page file.

    Brand Profile:
    - Name: {state['request'].brand_name}
    - Category: {state['request'].category}
    - Aesthetic / Tone: {state['request'].tone}
    - Products/Services: {state['request'].products}

    Requirements:
    1. Output a complete HTML document starting with <!DOCTYPE html>.
    2. Include the Tailwind CSS Play CDN script tag in the <head> for styling: <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
    3. Ensure the design matches the requested tone (e.g., sleek/dark for modern tech, warm/pastel for bakery).
    4. Include interactive elements with vanilla Javascript inside <script> tags if necessary (like custom interactions or mobile navbar toggles).
    5. The output must fit perfectly into the `compiled_html` property of the schema. Do not escape formatting or wrap it in conversational text.
    """
    
    if state.get("feedback"):
        prompt += f"\n\nCRITICAL MODIFICATION REQUEST: The user wants edits based on this feedback: {state['feedback']}. Revise the HTML code accordingly."
    
    response = structured_llm.invoke(prompt)
    return {"generated_config": response, "retry_count": state["retry_count"] + 1}

workflow = StateGraph(AgentState)
workflow.add_node("generator", generate_site_node)
workflow.set_entry_point("generator")
workflow.add_edge("generator", END)

app_graph = workflow.compile()