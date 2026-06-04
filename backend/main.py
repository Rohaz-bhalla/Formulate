from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

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

@app.post("/generate-site")
async def generate_site(data: BrandRequest):
    initial_state = {
        "request": data,
        "retry_count": 0,
        "feedback": data.feedback
    }
    return {"message": "Generation triggered", "data": "Output from graph"}