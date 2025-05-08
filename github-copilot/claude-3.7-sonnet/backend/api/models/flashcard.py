class FlashCard:
    def __init__(self, id: int, content: str, tags: list[str]):
        self.id = id
        self.content = content
        self.tags = tags

    def __repr__(self):
        return f"FlashCard(id={self.id}, content='{self.content}', tags={self.tags})"