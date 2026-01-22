"""
Complete workflow test for the todo application.
Tests the full functionality of the todo application including all features.
"""
import sys
import os

# Add src directory to path so we can import the modules
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

from todo_app.todo_manager import TodoManager


def test_complete_workflow():
    """
    Test the complete workflow of the todo application.
    """
    print("Testing complete workflow...")

    # Create a todo manager instance
    todo_manager = TodoManager()

    # Test 1: Add multiple tasks with different properties
    print("\nTest 1: Adding various tasks")
    try:
        task1 = todo_manager.add_task("Complete project proposal", "Write and submit the project proposal to stakeholders")
        print(f"+ Added task with title and description: {task1.title}")

        task2 = todo_manager.add_task("Buy groceries")
        print(f"+ Added task with only title: {task2.title}")

        task3 = todo_manager.add_task("Fix bug in login", "Resolve the authentication issue reported by QA")
        print(f"+ Added another task with title and description: {task3.title}")

        print(f"+ Successfully added {len(todo_manager.get_all_tasks())} tasks")
    except Exception as e:
        print(f"- Failed to add tasks: {e}")
        return False

    # Test 2: View all tasks
    print("\nTest 2: Viewing all tasks")
    try:
        all_tasks = todo_manager.get_all_tasks()
        print(f"+ Retrieved {len(all_tasks)} tasks:")
        for i, task in enumerate(all_tasks, 1):
            status = "Completed" if task.completed else "Pending"
            print(f"  {i}. [{status}] {task.title}")
            if task.description:
                print(f"      Description: {task.description}")
    except Exception as e:
        print(f"- Failed to retrieve tasks: {e}")
        return False

    # Test 3: Mark a task as completed
    print("\nTest 3: Marking a task as completed")
    try:
        # Get the first task ID
        tasks = todo_manager.get_all_tasks()
        if tasks:
            task_to_complete = tasks[0]
            completed_task = todo_manager.mark_task_completed(task_to_complete.id)
            print(f"+ Marked task as completed: {completed_task.title}")
            print(f"  Status: {'Completed' if completed_task.completed else 'Pending'}")

            # Verify the task is actually marked as completed
            retrieved_task = todo_manager.get_task(task_to_complete.id)
            if retrieved_task.completed:
                print("+ Task status correctly updated to completed")
            else:
                print("- Task status not updated correctly")
                return False
    except Exception as e:
        print(f"- Failed to mark task as completed: {e}")
        return False

    # Test 4: Update a task
    print("\nTest 4: Updating a task")
    try:
        tasks = todo_manager.get_all_tasks()
        if len(tasks) > 1:
            task_to_update = tasks[1]  # Second task
            original_title = task_to_update.title

            updated_task = todo_manager.update_task(
                task_to_update.id,
                title=f"Updated: {original_title}",
                description="This task has been updated with new information"
            )
            print(f"+ Updated task: {updated_task.title}")
            print(f"  New description: {updated_task.description}")

            # Verify the update worked
            retrieved_task = todo_manager.get_task(task_to_update.id)
            if "Updated:" in retrieved_task.title:
                print("+ Task title correctly updated")
            else:
                print("- Task title not updated correctly")
                return False

    except Exception as e:
        print(f"- Failed to update task: {e}")
        return False

    # Test 5: View tasks after updates
    print("\nTest 5: Viewing tasks after updates")
    try:
        all_tasks = todo_manager.get_all_tasks()
        print(f"+ Current tasks ({len(all_tasks)} total):")
        for i, task in enumerate(all_tasks, 1):
            status = "Completed" if task.completed else "Pending"
            print(f"  {i}. [{status}] {task.title}")
    except Exception as e:
        print(f"- Failed to retrieve updated tasks: {e}")
        return False

    # Test 6: Delete a task
    print("\nTest 6: Deleting a task")
    try:
        tasks_before = todo_manager.get_all_tasks()
        task_to_delete = tasks_before[-1]  # Last task
        print(f"+ About to delete: {task_to_delete.title}")

        todo_manager.delete_task(task_to_delete.id)

        tasks_after = todo_manager.get_all_tasks()
        print(f"+ Tasks after deletion: {len(tasks_after)}")

        if len(tasks_after) == len(tasks_before) - 1:
            print("+ Task deletion successful")
        else:
            print("- Task deletion failed - count mismatch")
            return False

        # Verify the specific task was deleted
        try:
            todo_manager.get_task(task_to_delete.id)
            print("- Task was not actually deleted - still retrievable")
            return False
        except KeyError:
            print("+ Task properly removed from storage")

    except Exception as e:
        print(f"- Failed to delete task: {e}")
        return False

    # Test 7: Try to operate on non-existent task (should fail appropriately)
    print("\nTest 7: Testing operations on non-existent task")
    try:
        fake_id = "non-existent-task-id"
        todo_manager.get_task(fake_id)
        print("- Should have failed to get non-existent task")
        return False
    except KeyError:
        print("+ Correctly failed to get non-existent task")
    except Exception as e:
        print(f"- Unexpected error getting non-existent task: {e}")
        return False

    print("\n+ Complete workflow test passed!")
    return True


if __name__ == "__main__":
    success = test_complete_workflow()
    if success:
        print("\n+ Complete workflow testing completed successfully!")
    else:
        print("\n- Some workflow tests failed!")
        sys.exit(1)