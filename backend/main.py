import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import cast

from database import get_user_retries, increment_retry, save_generated_site, get_all_generated_sites
from graph import app_graph, AgentState
from schemas import BrandRequest

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set! Check your .env file.")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-site")
async def generate_site(data: BrandRequest):
    #retries
    if get_user_retries(data.user_id) >= 10:
        raise HTTPException(status_code=403, detail="Max retries reached.")

    initial_state: AgentState = {
        "request": data,
        "retry_count": 0,
        "feedback": data.feedback or "",
        "generated_config": None
    }
    #start langgraph
    result = app_graph.invoke(initial_state)
    generated_config = result.get("generated_config")

    html_output = generated_config.compiled_html if generated_config else ""

    save_generated_site(data, html_output)

    return generated_config

@app.get("/explore-sites")
async def explore_sites():
    try:
        sites = get_all_generated_sites()
        #filter
        valid_sites = [s for s in sites if "compiled_html" in s and s["compiled_html"]]
        return valid_sites
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))