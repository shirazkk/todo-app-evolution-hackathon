"""
Input validation utilities for the todo application.
"""

def validate_title(title: str) -> tuple[bool, str]:
    """
    Validates a task title according to the specification.

    Args:
        title: The title to validate

    Returns:
        A tuple of (is_valid, error_message)
    """
    if not title or not title.strip():
        return False, "Task title cannot be empty or contain only whitespace"

    if len(title) > 200:
        return False, "Task title cannot exceed 200 characters"

    return True, ""


def validate_description(description: str) -> tuple[bool, str]:
    """
    Validates a task description according to the specification.

    Args:
        description: The description to validate

    Returns:
        A tuple of (is_valid, error_message)
    """
    if description and len(description) > 1000:
        return False, "Task description cannot exceed 1000 characters"

    return True, ""