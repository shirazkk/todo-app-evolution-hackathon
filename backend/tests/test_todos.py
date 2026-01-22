# import pytest
# from httpx import AsyncClient



# # Use fixtures from conftest.py:
# # - client: AsyncClient for making requests
# # - test_db: Test database session
# # - auth_user_1: First authenticated user with token
# # - auth_user_2: Second authenticated user with token (for isolation tests)


# @pytest.mark.asyncio
# async def test_create_todo_success(client: AsyncClient, auth_user_1: dict):
#     """
#     Test successful todo creation with valid data.

#     Expected:
#     - Status code: 201
#     - Response contains all todo fields
#     - user_id matches authenticated user
#     - completed is False by default
#     - created_at and updated_at are set
#     """
#     todo_data = {
#         "title": "Test Todo",
#         "description": "This is a test todo",
#         "priority": "medium"
#     }

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo_data
#     )

#     assert response.status_code == 201
#     response_data = response.json()

#     assert "id" in response_data
#     assert response_data["title"] == todo_data["title"]
#     assert response_data["description"] == todo_data["description"]
#     assert response_data["priority"] == todo_data["priority"]
#     assert response_data["user_id"] == auth_user_1["user_id"]
#     assert response_data["completed"] is False
#     assert "created_at" in response_data
#     assert "updated_at" in response_data


# @pytest.mark.asyncio
# async def test_create_todo_required_fields_only(client: AsyncClient, auth_user_1: dict):
#     """
#     Test creating todo with only required field (title).

#     Expected:
#     - Status code: 201
#     - Response contains all fields with defaults set appropriately
#     """
#     todo_data = {
#         "title": "Minimal Todo"
#     }

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo_data
#     )

#     assert response.status_code == 201
#     response_data = response.json()

#     assert "id" in response_data
#     assert response_data["title"] == todo_data["title"]
#     assert response_data["priority"] == "medium"  # Default value
#     assert response_data["user_id"] == auth_user_1["user_id"]
#     assert response_data["completed"] is False


# @pytest.mark.asyncio
# async def test_create_todo_empty_title(client: AsyncClient, auth_user_1: dict):
#     """
#     Test todo creation fails with empty title.

#     Expected:
#     - Status code: 400
#     - Error message about title validation
#     """
#     todo_data = {
#         "title": "",
#         "description": "This is a test todo",
#         "priority": "medium"
#     }

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo_data
#     )

#     assert response.status_code == 400


# @pytest.mark.asyncio
# async def test_create_todo_title_too_long(client: AsyncClient, auth_user_1: dict):
#     """
#     Test todo creation fails with title exceeding 200 characters.

#     Expected:
#     - Status code: 400
#     - Error message about title length validation
#     """
#     todo_data = {
#         "title": "A" * 201,  # 201 characters, exceeding the 200 limit
#         "description": "This is a test todo",
#         "priority": "medium"
#     }

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo_data
#     )

#     assert response.status_code == 400


# @pytest.mark.asyncio
# async def test_create_todo_invalid_priority(client: AsyncClient, auth_user_1: dict):
#     """
#     Test todo creation fails with invalid priority value.

#     Expected:
#     - Status code: 400
#     - Error message about priority validation
#     """
#     todo_data = {
#         "title": "Test Todo",
#         "description": "This is a test todo",
#         "priority": "invalid_priority"  # Not one of 'high', 'medium', 'low'
#     }

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo_data
#     )

#     assert response.status_code == 400


# @pytest.mark.asyncio
# async def test_create_todo_without_authentication(client: AsyncClient, auth_user_1: dict):
#     """
#     Test creating todo without authentication.

#     Expected:
#     - Status code: 401
#     - Error message about authentication
#     """
#     todo_data = {
#         "title": "Test Todo",
#         "description": "This is a test todo",
#         "priority": "medium"
#     }

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         # No authentication headers
#         json=todo_data
#     )

#     assert response.status_code == 401


# @pytest.mark.asyncio
# async def test_create_todo_different_user_id(client: AsyncClient, auth_user_1: dict, auth_user_2: dict):
#     """
#     Test creating todo for different user_id than JWT token.

#     Expected:
#     - Status code: 403
#     - Error message about authorization
#     """
#     todo_data = {
#         "title": "Test Todo",
#         "description": "This is a test todo",
#         "priority": "medium"
#     }

#     # Use auth_user_1's token but try to create for auth_user_2's ID
#     response = await client.post(
#         f"/api/users/{auth_user_2['user_id']}/todos",  # Different user_id
#         headers=auth_user_1["headers"],  # Token from different user
#         json=todo_data
#     )

#     assert response.status_code == 403


# @pytest.mark.asyncio
# async def test_get_todos_success(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test getting all todos for authenticated user.

#     Expected:
#     - Status code: 200
#     - Response contains todos array
#     - Contains the created todo
#     """
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     assert "todos" in response_data
#     assert len(response_data["todos"]) >= 1
#     assert response_data["total"] >= 1

#     # Check if the sample todo is in the response
#     todo_ids = [todo["id"] for todo in response_data["todos"]]
#     assert sample_todo["id"] in todo_ids


# @pytest.mark.asyncio
# async def test_get_todos_empty_list(client: AsyncClient, auth_user_2: dict):
#     """
#     Test getting todos returns empty list when user has no todos.

#     Expected:
#     - Status code: 200
#     - Response contains empty todos array
#     - Total count is 0
#     """
#     response = await client.get(
#         f"/api/users/{auth_user_2['user_id']}/todos",
#         headers=auth_user_2["headers"]
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     assert "todos" in response_data
#     assert len(response_data["todos"]) == 0
#     assert response_data["total"] == 0


# @pytest.mark.asyncio
# async def test_get_todos_filter_status(client: AsyncClient, auth_user_1: dict):
#     """
#     Test getting todos with status filter: "all", "pending", "completed".

#     Expected:
#     - Status code: 200
#     - Response respects the status filter
#     """
#     # Create a completed todo
#     completed_todo = {
#         "title": "Completed Todo",
#         "description": "This is a completed todo",
#         "priority": "high"
#     }

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=completed_todo
#     )
#     assert response.status_code == 201
#     completed_todo_id = response.json()["id"]

#     # Mark the todo as completed
#     completion_data = {"completed": True}
#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{completed_todo_id}/complete",
#         headers=auth_user_1["headers"],
#         json=completion_data
#     )
#     assert response.status_code == 200

#     # Test filtering for completed todos
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos?status=completed",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     completed_todos = response_data["todos"]
#     for todo in completed_todos:
#         assert todo["completed"] is True


# @pytest.mark.asyncio
# async def test_get_todos_sorting(client: AsyncClient, auth_user_1: dict):
#     """
#     Test getting todos with sorting: by created_at, priority, title.

#     Expected:
#     - Status code: 200
#     - Response todos are sorted as requested
#     """
#     # Create multiple todos with different titles and priorities
#     todo1_data = {"title": "Alpha Todo", "priority": "high"}
#     todo2_data = {"title": "Zeta Todo", "priority": "low"}

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo1_data
#     )
#     assert response.status_code == 201

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo2_data
#     )
#     assert response.status_code == 201

#     # Test sorting by title ascending
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos?sort_by=title&order=asc",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     todos = response_data["todos"]
#     if len(todos) >= 2:
#         assert todos[0]["title"] <= todos[1]["title"]  # Alpha should come before Zeta


# @pytest.mark.asyncio
# async def test_get_todos_ordering(client: AsyncClient, auth_user_1: dict):
#     """
#     Test getting todos with ordering: asc, desc.

#     Expected:
#     - Status code: 200
#     - Response todos are ordered as requested
#     """
#     # Create multiple todos
#     todo1_data = {"title": "First Todo", "priority": "high"}
#     todo2_data = {"title": "Second Todo", "priority": "low"}

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo1_data
#     )
#     assert response.status_code == 201

#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo2_data
#     )
#     assert response.status_code == 201

#     # Test descending order by created_at
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos?sort_by=created_at&order=desc",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     todos = response_data["todos"]
#     # With descending order, newer items should come first
#     if len(todos) >= 2:
#         # Second todo was created last, so it should be first in desc order
#         assert todos[0]["title"] == "Second Todo"


# @pytest.mark.asyncio
# async def test_get_todos_without_authentication(client: AsyncClient, auth_user_1: dict):
#     """
#     Test getting todos without authentication.

#     Expected:
#     - Status code: 401
#     - Error message about authentication
#     """
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         # No authentication headers
#     )

#     assert response.status_code == 401


# @pytest.mark.asyncio
# async def test_get_todos_different_user(client: AsyncClient, auth_user_1: dict, auth_user_2: dict):
#     """
#     Test getting todos for different user_id than JWT token.

#     Expected:
#     - Status code: 403
#     - Error message about authorization
#     """
#     response = await client.get(
#         f"/api/users/{auth_user_2['user_id']}/todos",  # Different user's todos
#         headers=auth_user_1["headers"]  # Token from different user
#     )

#     assert response.status_code == 403


# @pytest.mark.asyncio
# async def test_get_todos_data_isolation(client: AsyncClient, auth_user_1: dict, auth_user_2: dict):
#     """
#     Test data isolation: User A cannot see User B's todos.

#     Expected:
#     - Each user can only see their own todos
#     - User A's todos don't appear in User B's list
#     """
#     # Create a todo for user 1
#     user1_todo_data = {"title": "User 1 Todo", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=user1_todo_data
#     )
#     assert response.status_code == 201
#     user1_todo_id = response.json()["id"]

#     # Create a todo for user 2
#     user2_todo_data = {"title": "User 2 Todo", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_2['user_id']}/todos",
#         headers=auth_user_2["headers"],
#         json=user2_todo_data
#     )
#     assert response.status_code == 201
#     user2_todo_id = response.json()["id"]

#     # User 1 should only see their own todo
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"]
#     )
#     assert response.status_code == 200
#     user1_todos = response.json()["todos"]
#     user1_todo_ids = [todo["id"] for todo in user1_todos]
#     assert user1_todo_id in user1_todo_ids
#     assert user2_todo_id not in user1_todo_ids  # User 1 should not see user 2's todo

#     # User 2 should only see their own todo
#     response = await client.get(
#         f"/api/users/{auth_user_2['user_id']}/todos",
#         headers=auth_user_2["headers"]
#     )
#     assert response.status_code == 200
#     user2_todos = response.json()["todos"]
#     user2_todo_ids = [todo["id"] for todo in user2_todos]
#     assert user2_todo_id in user2_todo_ids
#     assert user1_todo_id not in user2_todo_ids  # User 2 should not see user 1's todo


# @pytest.mark.asyncio
# async def test_get_single_todo_success(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test getting specific todo by ID.

#     Expected:
#     - Status code: 200
#     - Response contains the requested todo
#     """
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     assert response_data["id"] == sample_todo["id"]
#     assert response_data["title"] == sample_todo["title"]


# @pytest.mark.asyncio
# async def test_get_nonexistent_todo(client: AsyncClient, auth_user_1: dict):
#     """
#     Test getting non-existent todo.

#     Expected:
#     - Status code: 404
#     - Error message about todo not found
#     """
#     fake_todo_id = "00000000-0000-0000-0000-000000000000"  # A fake UUID

#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos/{fake_todo_id}",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 404


# @pytest.mark.asyncio
# async def test_get_other_users_todo(client: AsyncClient, auth_user_1: dict, auth_user_2: dict):
#     """
#     Test getting another user's todo.

#     Expected:
#     - Status code: 403
#     - Error message about authorization
#     """
#     # Create a todo for user 2
#     user2_todo_data = {"title": "User 2 Todo", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_2['user_id']}/todos",
#         headers=auth_user_2["headers"],
#         json=user2_todo_data
#     )
#     assert response.status_code == 201
#     user2_todo_id = response.json()["id"]

#     # User 1 tries to access user 2's todo
#     response = await client.get(
#         f"/api/users/{auth_user_2['user_id']}/todos/{user2_todo_id}",
#         headers=auth_user_1["headers"]  # Using user 1's token
#     )

#     assert response.status_code == 403


# @pytest.mark.asyncio
# async def test_get_todo_without_authentication(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test getting todo without authentication.

#     Expected:
#     - Status code: 401
#     - Error message about authentication
#     """
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         # No authentication headers
#     )

#     assert response.status_code == 401


# @pytest.mark.asyncio
# async def test_update_todo_success(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test updating todo with all fields.

#     Expected:
#     - Status code: 200
#     - Response contains updated todo
#     - updated_at timestamp is updated
#     """
#     update_data = {
#         "title": "Updated Todo Title",
#         "description": "Updated description",
#         "priority": "high"
#     }

#     response = await client.put(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"],
#         json=update_data
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     assert response_data["id"] == sample_todo["id"]
#     assert response_data["title"] == update_data["title"]
#     assert response_data["description"] == update_data["description"]
#     assert response_data["priority"] == update_data["priority"]
#     # updated_at should be different from created_at for a proper update
#     assert response_data["updated_at"] != response_data["created_at"]


# @pytest.mark.asyncio
# async def test_update_todo_timestamp(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test updating todo with valid data updates updated_at timestamp.

#     Expected:
#     - updated_at timestamp is updated after modification
#     """
#     original_updated_at = sample_todo["updated_at"]

#     update_data = {
#         "title": "Updated Title",
#         "description": "Updated description"
#     }

#     response = await client.put(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"],
#         json=update_data
#     )

#     assert response.status_code == 200
#     updated_todo = response.json()

#     # updated_at should be different from the original
#     assert updated_todo["updated_at"] != original_updated_at


# @pytest.mark.asyncio
# async def test_update_nonexistent_todo(client: AsyncClient, auth_user_1: dict):
#     """
#     Test updating non-existent todo.

#     Expected:
#     - Status code: 404
#     - Error message about todo not found
#     """
#     fake_todo_id = "00000000-0000-0000-0000-000000000000"  # A fake UUID
#     update_data = {
#         "title": "Updated Title",
#         "description": "Updated description",
#         "priority": "high"
#     }

#     response = await client.put(
#         f"/api/users/{auth_user_1['user_id']}/todos/{fake_todo_id}",
#         headers=auth_user_1["headers"],
#         json=update_data
#     )

#     assert response.status_code == 404


# @pytest.mark.asyncio
# async def test_update_other_users_todo(client: AsyncClient, auth_user_1: dict, auth_user_2: dict):
#     """
#     Test updating another user's todo.

#     Expected:
#     - Status code: 403
#     - Error message about authorization
#     """
#     # Create a todo for user 2
#     user2_todo_data = {"title": "User 2 Todo", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_2['user_id']}/todos",
#         headers=auth_user_2["headers"],
#         json=user2_todo_data
#     )
#     assert response.status_code == 201
#     user2_todo_id = response.json()["id"]

#     # User 1 tries to update user 2's todo
#     update_data = {
#         "title": "Hacked Todo",
#         "description": "Trying to update someone else's todo",
#         "priority": "high"
#     }

#     response = await client.put(
#         f"/api/users/{auth_user_2['user_id']}/todos/{user2_todo_id}",
#         headers=auth_user_1["headers"],  # Using user 1's token
#         json=update_data
#     )

#     assert response.status_code == 403


# @pytest.mark.asyncio
# async def test_update_todo_without_authentication(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test updating todo without authentication.

#     Expected:
#     - Status code: 401
#     - Error message about authentication
#     """
#     update_data = {
#         "title": "Unauthorized Update",
#         "description": "This should fail",
#         "priority": "high"
#     }

#     response = await client.put(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         # No authentication headers
#         json=update_data
#     )

#     assert response.status_code == 401


# @pytest.mark.asyncio
# async def test_update_todo_invalid_data(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test updating with invalid data (empty title, too long fields).

#     Expected:
#     - Status code: 400
#     - Error message about validation
#     """
#     update_data = {
#         "title": "",  # Empty title should fail validation
#         "description": "Valid description",
#         "priority": "medium"
#     }

#     response = await client.put(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"],
#         json=update_data
#     )

#     assert response.status_code == 400


# @pytest.mark.asyncio
# async def test_patch_update_only_title(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test updating only title with PATCH.

#     Expected:
#     - Status code: 200
#     - Only title is updated, other fields remain unchanged
#     """
#     original_description = sample_todo["description"]
#     original_priority = sample_todo["priority"]

#     patch_data = {
#         "title": "Updated Title Only"
#     }

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"],
#         json=patch_data
#     )

#     assert response.status_code == 200
#     patched_todo = response.json()

#     assert patched_todo["title"] == patch_data["title"]
#     assert patched_todo["description"] == original_description  # Should remain unchanged
#     assert patched_todo["priority"] == original_priority  # Should remain unchanged


# @pytest.mark.asyncio
# async def test_patch_update_only_description(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test updating only description with PATCH.

#     Expected:
#     - Status code: 200
#     - Only description is updated, other fields remain unchanged
#     """
#     original_title = sample_todo["title"]
#     original_priority = sample_todo["priority"]

#     patch_data = {
#         "description": "Updated description only"
#     }

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"],
#         json=patch_data
#     )

#     assert response.status_code == 200
#     patched_todo = response.json()

#     assert patched_todo["description"] == patch_data["description"]
#     assert patched_todo["title"] == original_title  # Should remain unchanged
#     assert patched_todo["priority"] == original_priority  # Should remain unchanged


# @pytest.mark.asyncio
# async def test_patch_update_only_priority(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test updating only priority with PATCH.

#     Expected:
#     - Status code: 200
#     - Only priority is updated, other fields remain unchanged
#     """
#     original_title = sample_todo["title"]
#     original_description = sample_todo["description"]

#     patch_data = {
#         "priority": "high"
#     }

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"],
#         json=patch_data
#     )

#     assert response.status_code == 200
#     patched_todo = response.json()

#     assert patched_todo["priority"] == patch_data["priority"]
#     assert patched_todo["title"] == original_title  # Should remain unchanged
#     assert patched_todo["description"] == original_description  # Should remain unchanged


# @pytest.mark.asyncio
# async def test_patch_multiple_fields(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test updating multiple fields but not all with PATCH.

#     Expected:
#     - Status code: 200
#     - Only specified fields are updated, others remain unchanged
#     """
#     original_title = sample_todo["title"]

#     patch_data = {
#         "description": "Updated description",
#         "priority": "high"
#     }

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"],
#         json=patch_data
#     )

#     assert response.status_code == 200
#     patched_todo = response.json()

#     assert patched_todo["description"] == patch_data["description"]
#     assert patched_todo["priority"] == patch_data["priority"]
#     assert patched_todo["title"] == original_title  # Should remain unchanged


# @pytest.mark.asyncio
# async def test_patch_updates_provided_fields_only(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test PATCH updates only provided fields, keeps others unchanged.

#     Expected:
#     - Status code: 200
#     - Only the fields sent in the request are updated
#     - Fields not in the request remain unchanged
#     """
#     original_title = sample_todo["title"]
#     original_priority = sample_todo["priority"]

#     # Send patch with only description
#     patch_data = {
#         "description": "Changed description"
#     }

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         headers=auth_user_1["headers"],
#         json=patch_data
#     )

#     assert response.status_code == 200
#     patched_todo = response.json()

#     # Only description should change
#     assert patched_todo["description"] == patch_data["description"]
#     assert patched_todo["title"] == original_title  # Should remain unchanged
#     assert patched_todo["priority"] == original_priority  # Should remain unchanged


# @pytest.mark.asyncio
# async def test_patch_nonexistent_todo(client: AsyncClient, auth_user_1: dict):
#     """
#     Test PATCH on non-existent todo.

#     Expected:
#     - Status code: 404
#     - Error message about todo not found
#     """
#     fake_todo_id = "00000000-0000-0000-0000-000000000000"  # A fake UUID
#     patch_data = {
#         "title": "Updated Title"
#     }

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{fake_todo_id}",
#         headers=auth_user_1["headers"],
#         json=patch_data
#     )

#     assert response.status_code == 404


# @pytest.mark.asyncio
# async def test_patch_other_users_todo(client: AsyncClient, auth_user_1: dict, auth_user_2: dict):
#     """
#     Test PATCH on another user's todo.

#     Expected:
#     - Status code: 403
#     - Error message about authorization
#     """
#     # Create a todo for user 2
#     user2_todo_data = {"title": "User 2 Todo", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_2['user_id']}/todos",
#         headers=auth_user_2["headers"],
#         json=user2_todo_data
#     )
#     assert response.status_code == 201
#     user2_todo_id = response.json()["id"]

#     # User 1 tries to patch user 2's todo
#     patch_data = {
#         "title": "Hacked Title"
#     }

#     response = await client.patch(
#         f"/api/users/{auth_user_2['user_id']}/todos/{user2_todo_id}",
#         headers=auth_user_1["headers"],  # Using user 1's token
#         json=patch_data
#     )

#     assert response.status_code == 403


# @pytest.mark.asyncio
# async def test_mark_todo_complete(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test marking incomplete todo as complete.

#     Expected:
#     - Status code: 200
#     - Todo's completed field is True
#     - completed_at timestamp is set
#     """
#     completion_data = {"completed": True}

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}/complete",
#         headers=auth_user_1["headers"],
#         json=completion_data
#     )

#     assert response.status_code == 200
#     completed_todo = response.json()

#     assert completed_todo["completed"] is True
#     assert "completed_at" in completed_todo
#     assert completed_todo["completed_at"] is not None


# @pytest.mark.asyncio
# async def test_mark_todo_incomplete(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test marking complete todo as incomplete.

#     Expected:
#     - Status code: 200
#     - Todo's completed field is False
#     - completed_at timestamp is cleared (set to None)
#     """
#     # First, mark as complete
#     completion_data = {"completed": True}
#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}/complete",
#         headers=auth_user_1["headers"],
#         json=completion_data
#     )
#     assert response.status_code == 200
#     completed_todo = response.json()
#     assert completed_todo["completed"] is True

#     # Now mark as incomplete
#     completion_data = {"completed": False}
#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}/complete",
#         headers=auth_user_1["headers"],
#         json=completion_data
#     )

#     assert response.status_code == 200
#     incomplete_todo = response.json()

#     assert incomplete_todo["completed"] is False
#     # completed_at should be None when marked as incomplete
#     assert incomplete_todo["completed_at"] is None


# @pytest.mark.asyncio
# async def test_completion_sets_completed_at(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test completion sets completed_at timestamp when true.

#     Expected:
#     - completed_at field is set to current timestamp when marking complete
#     """
#     completion_data = {"completed": True}

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}/complete",
#         headers=auth_user_1["headers"],
#         json=completion_data
#     )

#     assert response.status_code == 200
#     completed_todo = response.json()

#     assert completed_todo["completed"] is True
#     assert completed_todo["completed_at"] is not None


# @pytest.mark.asyncio
# async def test_completion_clears_completed_at(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test completion clears completed_at timestamp when false.

#     Expected:
#     - completed_at field is set to None when marking incomplete
#     """
#     # First mark as complete to set completed_at
#     completion_data = {"completed": True}
#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}/complete",
#         headers=auth_user_1["headers"],
#         json=completion_data
#     )
#     assert response.status_code == 200
#     completed_todo = response.json()
#     assert completed_todo["completed"] is True
#     assert completed_todo["completed_at"] is not None

#     # Now mark as incomplete to clear completed_at
#     completion_data = {"completed": False}
#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}/complete",
#         headers=auth_user_1["headers"],
#         json=completion_data
#     )

#     assert response.status_code == 200
#     incomplete_todo = response.json()

#     assert incomplete_todo["completed"] is False
#     assert incomplete_todo["completed_at"] is None


# @pytest.mark.asyncio
# async def test_toggle_completion_nonexistent_todo(client: AsyncClient, auth_user_1: dict):
#     """
#     Test toggle completion on non-existent todo.

#     Expected:
#     - Status code: 404
#     - Error message about todo not found
#     """
#     fake_todo_id = "00000000-0000-0000-0000-000000000000"  # A fake UUID
#     completion_data = {"completed": True}

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{fake_todo_id}/complete",
#         headers=auth_user_1["headers"],
#         json=completion_data
#     )

#     assert response.status_code == 404


# @pytest.mark.asyncio
# async def test_toggle_completion_other_users_todo(client: AsyncClient, auth_user_1: dict, auth_user_2: dict):
#     """
#     Test toggle completion on another user's todo.

#     Expected:
#     - Status code: 403
#     - Error message about authorization
#     """
#     # Create a todo for user 2
#     user2_todo_data = {"title": "User 2 Todo", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_2['user_id']}/todos",
#         headers=auth_user_2["headers"],
#         json=user2_todo_data
#     )
#     assert response.status_code == 201
#     user2_todo_id = response.json()["id"]

#     # User 1 tries to toggle user 2's todo completion
#     completion_data = {"completed": True}

#     response = await client.patch(
#         f"/api/users/{auth_user_2['user_id']}/todos/{user2_todo_id}/complete",
#         headers=auth_user_1["headers"],  # Using user 1's token
#         json=completion_data
#     )

#     assert response.status_code == 403


# @pytest.mark.asyncio
# async def test_toggle_completion_without_authentication(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test toggle completion without authentication.

#     Expected:
#     - Status code: 401
#     - Error message about authentication
#     """
#     completion_data = {"completed": True}

#     response = await client.patch(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}/complete",
#         # No authentication headers
#         json=completion_data
#     )

#     assert response.status_code == 401


# @pytest.mark.asyncio
# async def test_delete_todo_success(client: AsyncClient, auth_user_1: dict):
#     """
#     Test deleting existing todo.

#     Expected:
#     - Status code: 200
#     - Success message returned
#     - Todo is no longer accessible
#     """
#     # Create a todo to delete
#     todo_data = {"title": "Todo to Delete", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo_data
#     )
#     assert response.status_code == 201
#     todo_to_delete = response.json()
#     todo_id = todo_to_delete["id"]

#     # Delete the todo
#     response = await client.delete(
#         f"/api/users/{auth_user_1['user_id']}/todos/{todo_id}",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     assert "message" in response_data
#     assert "deleted_id" in response_data
#     assert response_data["deleted_id"] == todo_id

#     # Verify the todo is no longer accessible
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos/{todo_id}",
#         headers=auth_user_1["headers"]
#     )
#     assert response.status_code == 404


# @pytest.mark.asyncio
# async def test_delete_return_success_message(client: AsyncClient, auth_user_1: dict):
#     """
#     Test deletion returns success message with deleted_id.

#     Expected:
#     - Response contains success message
#     - Response contains the deleted todo ID
#     """
#     # Create a todo to delete
#     todo_data = {"title": "Another Todo to Delete", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo_data
#     )
#     assert response.status_code == 201
#     todo_to_delete = response.json()
#     todo_id = todo_to_delete["id"]

#     # Delete the todo
#     response = await client.delete(
#         f"/api/users/{auth_user_1['user_id']}/todos/{todo_id}",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 200
#     response_data = response.json()

#     assert "message" in response_data
#     assert "deleted_id" in response_data
#     assert response_data["deleted_id"] == todo_id
#     assert "successfully" in response_data["message"].lower()


# @pytest.mark.asyncio
# async def test_delete_nonexistent_todo(client: AsyncClient, auth_user_1: dict):
#     """
#     Test deleting non-existent todo.

#     Expected:
#     - Status code: 404
#     - Error message about todo not found
#     """
#     fake_todo_id = "00000000-0000-0000-0000-000000000000"  # A fake UUID

#     response = await client.delete(
#         f"/api/users/{auth_user_1['user_id']}/todos/{fake_todo_id}",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 404


# @pytest.mark.asyncio
# async def test_delete_other_users_todo(client: AsyncClient, auth_user_1: dict, auth_user_2: dict):
#     """
#     Test deleting another user's todo.

#     Expected:
#     - Status code: 403
#     - Error message about authorization
#     """
#     # Create a todo for user 2
#     user2_todo_data = {"title": "User 2 Todo", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_2['user_id']}/todos",
#         headers=auth_user_2["headers"],
#         json=user2_todo_data
#     )
#     assert response.status_code == 201
#     user2_todo_id = response.json()["id"]

#     # User 1 tries to delete user 2's todo
#     response = await client.delete(
#         f"/api/users/{auth_user_2['user_id']}/todos/{user2_todo_id}",
#         headers=auth_user_1["headers"]  # Using user 1's token
#     )

#     assert response.status_code == 403


# @pytest.mark.asyncio
# async def test_delete_without_authentication(client: AsyncClient, auth_user_1: dict, sample_todo: dict):
#     """
#     Test deleting without authentication.

#     Expected:
#     - Status code: 401
#     - Error message about authentication
#     """
#     response = await client.delete(
#         f"/api/users/{auth_user_1['user_id']}/todos/{sample_todo['id']}",
#         # No authentication headers
#     )

#     assert response.status_code == 401


# @pytest.mark.asyncio
# async def test_deleted_todo_cannot_be_retrieved(client: AsyncClient, auth_user_1: dict):
#     """
#     Test deleted todo cannot be retrieved afterwards.

#     Expected:
#     - Status code: 404 when trying to get deleted todo
#     """
#     # Create a todo to delete
#     todo_data = {"title": "Final Todo to Delete", "priority": "medium"}
#     response = await client.post(
#         f"/api/users/{auth_user_1['user_id']}/todos",
#         headers=auth_user_1["headers"],
#         json=todo_data
#     )
#     assert response.status_code == 201
#     todo_to_delete = response.json()
#     todo_id = todo_to_delete["id"]

#     # Verify the todo exists first
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos/{todo_id}",
#         headers=auth_user_1["headers"]
#     )
#     assert response.status_code == 200

#     # Delete the todo
#     response = await client.delete(
#         f"/api/users/{auth_user_1['user_id']}/todos/{todo_id}",
#         headers=auth_user_1["headers"]
#     )
#     assert response.status_code == 200

#     # Try to retrieve the deleted todo
#     response = await client.get(
#         f"/api/users/{auth_user_1['user_id']}/todos/{todo_id}",
#         headers=auth_user_1["headers"]
#     )

#     assert response.status_code == 404