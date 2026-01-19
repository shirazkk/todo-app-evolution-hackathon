#!/usr/bin/env python3
"""
Console application for managing todo tasks.
"""
from typing import Optional
import sys
from todo_manager import TodoManager


def get_user_input(prompt: str) -> str:
    """
    Safely gets input from the user.

    Args:
        prompt: The prompt to display to the user

    Returns:
        The user's input
    """
    try:
        return input(prompt).strip()
    except KeyboardInterrupt:
        print("\nOperation cancelled by user.")
        sys.exit(0)
    except EOFError:
        print("\nExiting...")
        sys.exit(0)


def display_menu():
    """
    Displays the main menu options.
    """
    print("\n=== Todo Application ===")
    print("1. Add Task")
    print("2. View All Tasks")
    print("3. Mark Task as Completed")
    print("4. Delete Task")
    print("5. Update Task")
    print("6. Exit")
    print("========================")


def add_task_ui(todo_manager: TodoManager):
    """
    Handles the UI for adding a task.

    Args:
        todo_manager: The TodoManager instance
    """
    print("\n--- Add New Task ---")
    title = get_user_input("Enter task title (required): ")

    if not title:
        print("Error: Task title cannot be empty.")
        return

    description = get_user_input("Enter task description (optional, press Enter to skip): ")
    if not description:  # If user pressed Enter without typing anything
        description = ""

    try:
        task = todo_manager.add_task(title, description)
        print(f"✓ Task added successfully!")
        print(f"  ID: {task.id}")
        print(f"  Title: {task.title}")
        if task.description:
            print(f"  Description: {task.description}")
        print(f"  Completed: {'Yes' if task.completed else 'No'}")
    except ValueError as e:
        print(f"✗ Error: {e}")


def view_tasks_ui(todo_manager: TodoManager):
    """
    Handles the UI for viewing all tasks.

    Args:
        todo_manager: The TodoManager instance
    """
    print("\n--- All Tasks ---")
    tasks = todo_manager.get_all_tasks()

    if not tasks:
        print("No tasks found.")
        return

    for i, task in enumerate(tasks, 1):
        status = "✓" if task.completed else "○"
        print(f"{i}. [{status}] {task.title} (ID: {task.id})")
        if task.description:
            print(f"    Description: {task.description}")


def mark_task_completed_ui(todo_manager: TodoManager):
    """
    Handles the UI for marking a task as completed.

    Args:
        todo_manager: The TodoManager instance
    """
    print("\n--- Mark Task as Completed ---")
    task_id = get_user_input("Enter task ID to mark as completed: ")

    if not task_id:
        print("Error: Task ID cannot be empty.")
        return

    try:
        task = todo_manager.mark_task_completed(task_id)
        print(f"✓ Task marked as completed!")
        print(f"  ID: {task.id}")
        print(f"  Title: {task.title}")
    except KeyError:
        print(f"✗ Error: No task found with ID {task_id}")


def delete_task_ui(todo_manager: TodoManager):
    """
    Handles the UI for deleting a task.

    Args:
        todo_manager: The TodoManager instance
    """
    print("\n--- Delete Task ---")
    task_id = get_user_input("Enter task ID to delete: ")

    if not task_id:
        print("Error: Task ID cannot be empty.")
        return

    try:
        todo_manager.delete_task(task_id)
        print(f"✓ Task deleted successfully!")
    except KeyError:
        print(f"✗ Error: No task found with ID {task_id}")


def update_task_ui(todo_manager: TodoManager):
    """
    Handles the UI for updating a task.

    Args:
        todo_manager: The TodoManager instance
    """
    print("\n--- Update Task ---")
    task_id = get_user_input("Enter task ID to update: ")

    if not task_id:
        print("Error: Task ID cannot be empty.")
        return

    try:
        # Get current task to show current values
        current_task = todo_manager.get_task(task_id)
        print(f"Current task: {current_task.title}")

        new_title = get_user_input(f"Enter new title (or press Enter to keep '{current_task.title}'): ")
        if not new_title:
            new_title = current_task.title

        new_description = get_user_input(f"Enter new description (or press Enter to keep current): ")
        # If user entered nothing, keep current description
        if new_description == "":
            new_description = current_task.description

        try:
            updated_task = todo_manager.update_task(
                task_id,
                title=new_title if new_title != current_task.title else None,
                description=new_description if new_description != current_task.description else None
            )
            print(f"✓ Task updated successfully!")
            print(f"  ID: {updated_task.id}")
            print(f"  Title: {updated_task.title}")
            if updated_task.description:
                print(f"  Description: {updated_task.description}")
        except ValueError as e:
            print(f"✗ Error: {e}")

    except KeyError:
        print(f"✗ Error: No task found with ID {task_id}")


def main():
    """
    Main function to run the todo application.
    """
    todo_manager = TodoManager()

    print("Welcome to the Todo Application!")

    while True:
        display_menu()
        choice = get_user_input("Select an option (1-6): ")

        if choice == "1":
            add_task_ui(todo_manager)
        elif choice == "2":
            view_tasks_ui(todo_manager)
        elif choice == "3":
            mark_task_completed_ui(todo_manager)
        elif choice == "4":
            delete_task_ui(todo_manager)
        elif choice == "5":
            update_task_ui(todo_manager)
        elif choice == "6":
            print("Goodbye!")
            break
        else:
            print("Invalid option. Please select 1-6.")

        # Pause to let user see results
        if choice in ["1", "2", "3", "4", "5"]:
            input("\nPress Enter to continue...")


if __name__ == "__main__":
    main()