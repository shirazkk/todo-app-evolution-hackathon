"""
Basic functionality test for the todo application.
This is a simple test to verify the basic functionality works as expected.
"""
import sys
import os

# Add src directory to path so we can import the modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from todo_app.todo_manager import TodoManager


def test_basic_task_creation():
    """
    Test basic task creation functionality.
    """
    print("Testing basic task creation functionality...")

    # Create a todo manager instance
    todo_manager = TodoManager()

    # Test 1: Add a task with title and description
    print("\nTest 1: Adding a task with title and description")
    try:
        task1 = todo_manager.add_task("Test Task 1", "This is a test description")
        print(f"+ Successfully created task: {task1.title}")
        print(f"  ID: {task1.id}")
        print(f"  Description: {task1.description}")
        print(f"  Completed: {task1.completed}")
    except Exception as e:
        print(f"- Failed to create task: {e}")
        return False

    # Test 2: Add a task with only title (no description)
    print("\nTest 2: Adding a task with only title")
    try:
        task2 = todo_manager.add_task("Test Task 2")
        print(f"+ Successfully created task: {task2.title}")
        print(f"  ID: {task2.id}")
        print(f"  Description: '{task2.description}' (empty as expected)")
        print(f"  Completed: {task2.completed}")
    except Exception as e:
        print(f"- Failed to create task: {e}")
        return False

    # Test 3: Try to add a task with empty title (should fail)
    print("\nTest 3: Trying to add a task with empty title (should fail)")
    try:
        task3 = todo_manager.add_task("")
        print(f"- Should have failed but created task: {task3.title}")
        return False
    except ValueError as e:
        print(f"+ Correctly rejected empty title: {e}")
    except Exception as e:
        print(f"- Unexpected error: {e}")
        return False

    # Test 4: Try to add a task with very long title (should fail)
    print("\nTest 4: Trying to add a task with very long title (should fail)")
    try:
        long_title = "A" * 201  # 201 characters, exceeding the 200 limit
        task4 = todo_manager.add_task(long_title)
        print(f"- Should have failed but created task: {task4.title}")
        return False
    except ValueError as e:
        print(f"+ Correctly rejected long title: {e}")
    except Exception as e:
        print(f"- Unexpected error: {e}")
        return False

    # Test 5: View all tasks
    print("\nTest 5: Viewing all tasks")
    try:
        all_tasks = todo_manager.get_all_tasks()
        print(f"+ Retrieved {len(all_tasks)} tasks:")
        for task in all_tasks:
            status = "Completed" if task.completed else "Pending"
            print(f"  - {task.title} [{status}]")
    except Exception as e:
        print(f"- Failed to retrieve tasks: {e}")
        return False

    print("\n+ All basic functionality tests passed!")
    return True


if __name__ == "__main__":
    success = test_basic_task_creation()
    if success:
        print("\n+ Basic functionality verification completed successfully!")
    else:
        print("\n- Some tests failed!")
        sys.exit(1)