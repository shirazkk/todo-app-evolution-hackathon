"""
Test for task creation with title only functionality.
"""
import sys
import os

# Add src directory to path so we can import the modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from todo_app.todo_manager import TodoManager


def test_title_only_creation():
    """
    Test task creation with title only (no description).
    """
    print("Testing task creation with title only...")

    # Create a todo manager instance
    todo_manager = TodoManager()

    # Test: Add a task with only title (no description provided)
    print("\nTest: Adding a task with only title (no description parameter)")
    try:
        task = todo_manager.add_task("Test Task Title Only")
        print(f"+ Successfully created task: {task.title}")
        print(f"  ID: {task.id}")
        print(f"  Description: '{task.description}' (should be empty)")
        print(f"  Completed: {task.completed}")

        # Verify that description is indeed empty
        if task.description == "":
            print("+ Description is correctly empty when not provided")
        else:
            print(f"- Expected empty description but got: '{task.description}'")
            return False

        # Verify that title is preserved
        if task.title == "Test Task Title Only":
            print("+ Title is correctly preserved")
        else:
            print(f"- Expected title 'Test Task Title Only' but got: '{task.title}'")
            return False

    except Exception as e:
        print(f"- Failed to create task with title only: {e}")
        return False

    # Test: Add a task with title and empty string description
    print("\nTest: Adding a task with title and empty string description")
    try:
        task2 = todo_manager.add_task("Test Task with Empty Desc", "")
        print(f"+ Successfully created task: {task2.title}")
        print(f"  Description: '{task2.description}' (should be empty)")

        # Verify that description is empty
        if task2.description == "":
            print("+ Description is correctly empty when empty string provided")
        else:
            print(f"- Expected empty description but got: '{task2.description}'")
            return False

    except Exception as e:
        print(f"- Failed to create task with empty description: {e}")
        return False

    print("\n+ Title-only task creation tests passed!")
    return True


if __name__ == "__main__":
    success = test_title_only_creation()
    if success:
        print("\n+ Title-only functionality verification completed successfully!")
    else:
        print("\n- Some tests failed!")
        sys.exit(1)