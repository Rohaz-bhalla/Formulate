from pydantic import BaseModel, Field
from typing import List

class WebsiteSchema(BaseModel):
    hero_title: str = Field(description="Catchy headline for the website")
    hero_subtitle: str = Field(description="Sub-headline explaining the value proposition")
    about_text: str = Field(description="50-60 word brand introduction")
    products: List[str] = Field(description="List of top 5 products")
    color_palette: str = Field(description="Suggested Tailwind CSS color classes")

class BrandRequest(BaseModel):
    brand_name: str
    category: str
    tone: str
    intro: str
    products: List[str]
    price_range: str
    user_id: str
    feedback: str = Field(default="", description="Used for retries/refinements")