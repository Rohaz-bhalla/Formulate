import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import cast

from database import get_user_retries, increment_retry
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
    
    if get_user_retries(data.user_id) >= 10:
        raise HTTPException(status_code=403, detail="Max retries reached.")

    initial_state = cast(AgentState, {
        "request": data,
        "retry_count": 0,
        "feedback": data.feedback or "",
        "generated_config": None
    })

    result = app_graph.invoke(initial_state)

    increment_retry(data.user_id)

    return result["generated_config"]