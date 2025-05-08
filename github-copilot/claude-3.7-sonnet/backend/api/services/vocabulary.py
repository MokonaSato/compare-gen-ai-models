from typing import List, Dict
# from backend.api.utils.db import get_db_connection
from ..utils.db import get_db as get_db_connection

class VocabularyService:
    def __init__(self):
        self.db_connection = get_db_connection()

    def create_vocabulary_list(self, title: str, user_id: int) -> Dict:
        query = "INSERT INTO vocabulary_lists (title, user_id) VALUES (%s, %s)"
        with self.db_connection.cursor() as cursor:
            cursor.execute(query, (title, user_id))
            self.db_connection.commit()
            return {"id": cursor.lastrowid, "title": title, "user_id": user_id}

    def get_vocabulary_lists(self, user_id: int) -> List[Dict]:
        query = "SELECT * FROM vocabulary_lists WHERE user_id = %s"
        with self.db_connection.cursor() as cursor:
            cursor.execute(query, (user_id,))
            results = cursor.fetchall()
            return [{"id": row[0], "title": row[1], "user_id": row[2]} for row in results]

    def delete_vocabulary_list(self, list_id: int) -> None:
        query = "DELETE FROM vocabulary_lists WHERE id = %s"
        with self.db_connection.cursor() as cursor:
            cursor.execute(query, (list_id,))
            self.db_connection.commit()

    def update_vocabulary_list(self, list_id: int, title: str) -> None:
        query = "UPDATE vocabulary_lists SET title = %s WHERE id = %s"
        with self.db_connection.cursor() as cursor:
            cursor.execute(query, (title, list_id))
            self.db_connection.commit()