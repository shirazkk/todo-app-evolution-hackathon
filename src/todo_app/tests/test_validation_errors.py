"""
Test for validation error scenarios in the todo application.
"""
import sys
import os

# Add src directory to path so we can import the modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from todo_app.todo_manager import TodoManager


def test_validation_errors():
    """
    Test various validation error scenarios.
    """
    print("Testing validation error scenarios...")

    # Create a todo manager instance
    todo_manager = TodoManager()

    # Test 1: Empty title should fail
    print("\nTest 1: Adding task with empty title (should fail)")
    try:
        task = todo_manager.add_task("")
        print(f"✗ Should have failed but created task: {task.title}")
        return False
    except ValueError as e:
        print(f"+ Correctly rejected empty title: {e}")
    except Exception as e:
        print(f"- Unexpected error: {e}")
        return False

    # Test 2: Whitespace-only title should fail
    print("\nTest 2: Adding task with whitespace-only title (should fail)")
    try:
        task = todo_manager.add_task("   ")  # Only spaces
        print(f"- Should have failed but created task: {task.title}")
        return False
    except ValueError as e:
        print(f"+ Correctly rejected whitespace-only title: {e}")
    except Exception as e:
        print(f"- Unexpected error: {e}")
        return False

    # Test 3: Very long title (over 200 chars) should fail
    print("\nTest 3: Adding task with very long title (should fail)")
    try:
        long_title = "A" * 201  # 201 characters, exceeding the 200 limit
        task = todo_manager.add_task(long_title)
        print(f"- Should have failed but created task: {task.title}")
        return False
    except ValueError as e:
        print(f"+ Correctly rejected long title: {e}")
    except Exception as e:
        print(f"- Unexpected error: {e}")
        return False

    # Test 4: Very long description (over 1000 chars) should fail
    print("\nTest 4: Adding task with very long description (should fail)")
    try:
        long_desc = "A" * 1001  # 1001 characters, exceeding the 1000 limit
        task = todo_manager.add_task("Valid Title", long_desc)
        print(f"- Should have failed but created task: {task.title}")
        return False
    except ValueError as e:
        print(f"+ Correctly rejected long description: {e}")
    except Exception as e:
        print(f"- Unexpected error: {e}")
        return False

    # Test 5: Valid inputs should work
    print("\nTest 5: Adding task with valid inputs (should succeed)")
    try:
        valid_title = "A" * 200  # Exactly 200 characters
        valid_desc = "B" * 1000  # Exactly 1000 characters
        task = todo_manager.add_task(valid_title, valid_desc)
        print(f"+ Successfully created task with max-length title and description")
        if len(task.title) == 200 and len(task.description) == 1000:
            print("+ Lengths are correct")
        else:
            print(f"- Length mismatch - title: {len(task.title)}, desc: {len(task.description)}")
            return False
    except Exception as e:
        print(f"- Failed to create valid task: {e}")
        return False

    # Test 6: Title with exactly 200 chars should work
    print("\nTest 6: Adding task with exactly 200 char title (should succeed)")
    try:
        title_200 = "T" * 200
        task = todo_manager.add_task(title_200)
        if len(task.title) == 200:
            print("+ Successfully created task with 200-char title")
        else:
            print(f"- Title length incorrect: {len(task.title)}")
            return False
    except Exception as e:
        print(f"- Failed to create task with 200-char title: {e}")
        return False

    # Test 7: Description with exactly 1000 chars should work
    print("\nTest 7: Adding task with exactly 1000 char description (should succeed)")
    try:
        desc_1000 = "D" * 1000
        task = todo_manager.add_task("Valid Title", desc_1000)
        if len(task.description) == 1000:
            print("+ Successfully created task with 1000-char description")
        else:
            print(f"- Description length incorrect: {len(task.description)}")
            return False
    except Exception as e:
        print(f"- Failed to create task with 1000-char description: {e}")
        return False

    print("\n+ All validation error tests passed!")
    return True


if __name__ == "__main__":
    success = test_validation_errors()
    if success:
        print("\n+ Validation error testing completed successfully!")
    else:
        print("\n- Some validation tests failed!")
        sys.exit(1)