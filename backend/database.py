from tinydb import TinyDB, Query
from typing import Dict, Any, cast
from tinydb.table import Document

db = TinyDB('db.json')
User = Query()

def get_user_retries(user_id: str) -> int:
    result = db.get(User.user_id == user_id)
    
    if result is not None:
        data = cast(Dict[str, Any], result)
        return int(data.get('retry_count', 0))
    
    return 0

def increment_retry(user_id: str) -> None:
    current_count = get_user_retries(user_id)
    db.upsert(
        {'user_id': user_id, 'retry_count': current_count + 1}, 
        User.user_id == user_id
    )

def save_generated_site(data: Any, compiled_html: str) -> None:
    current_retries = get_user_retries(data.user_id)
    db.upsert(
        {
            'user_id': data.user_id,
            'brand_name': data.brand_name,
            'category': data.category,
            'tone': data.tone,
            'intro': data.intro,
            'compiled_html': compiled_html,
            'retry_count': current_retries + 1
        }, 
        User.user_id == data.user_id
    )

def get_all_generated_sites() -> list[Document]:
    return db.all()