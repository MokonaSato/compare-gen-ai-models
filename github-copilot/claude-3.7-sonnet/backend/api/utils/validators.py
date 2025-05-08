def validate_vocabulary_list_title(title: str) -> bool:
    if not title or len(title) < 3:
        return False
    return True

def validate_flashcard_content(content: str) -> bool:
    if not content or len(content) < 1:
        return False
    return True

def validate_tags(tags: list) -> bool:
    if not isinstance(tags, list):
        return False
    return all(isinstance(tag, str) for tag in tags) and len(tags) > 0