from tinydb import TinyDB, Query
from typing import Dict, Any, cast

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