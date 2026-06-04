import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional, cast

from fastapi.middleware.cors import CORSMiddleware

from database import get_user_retries, increment_retry
from graph import app_graph, AgentState

load_dotenv()

api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    raise ValueError("OPENAI_API_KEY is not set! Check your .env file.")

class BrandRequest(BaseModel):
    brand_name: str
    category: str
    tone: str
    intro: str
    products: list[str]
    price_range: str
    user_id: str
    feedback: Optional[str] = ""

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"], # Your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/generate-site")
async def generate_site(data: BrandRequest):
    
    if get_user_retries(data.user_id) >= 2:
        raise HTTPException(status_code=403, detail="Max retries reached.")

    initial_state = cast(AgentState, {
        "request": data,
        "retry_count": 0,
        "feedback": data.feedback or "",
        "generated_config": None
    })

    result = app_graph.invoke(initial_state)

    # Increment database counter
    increment_retry(data.user_id)

    return result["generated_config"]