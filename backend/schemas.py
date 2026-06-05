from pydantic import BaseModel, Field

class BrandRequest(BaseModel):
    user_id: str
    brand_name: str
    category: str
    tone: str
    intro: str
    products: str
    price_range: str = "Mid-range"
    feedback: str = Field(default="", description="Used for iterative refinements")

class WebsiteSchema(BaseModel):
    compiled_html: str = Field(
        description="The complete, self-contained index.html source code string containing standard HTML structure, a Tailwind CSS browser script tag, and fully styled responsive body content."
    )