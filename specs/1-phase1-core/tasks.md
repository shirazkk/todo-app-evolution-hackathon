# Tasks: Phase 1 - Console Todo Application

## Feature Overview

Implement the complete console todo application with all 5 basic features: Add, View, Update, Delete, and Mark Complete tasks.

## Dependencies

- User Story 1 (P1) must be completed before User Story 2
- User Story 2 must be completed before User Story 3
- Foundational components (models, validation) are prerequisites for all user stories

## Parallel Execution Opportunities

- Models and basic validation can be developed in parallel with UI components
- Unit tests can be written in parallel with implementation components

## Implementation Strategy

Start with MVP: basic task creation with title only, then add description functionality and validation.

---

## Phase 1: Setup

- [ ] T001 Create a project using uv
- [x] T002 Initialize Python project with pyproject.toml
- [ ] T003 Set up src/todo_app directory structure

## Phase 2: Foundational Components

- [x] T004 [P] Create Task model in src/todo_app/models.py
- [x] T005 [P] Create input validation utilities in src/todo_app/validation.py
- [x] T006 Create in-memory task storage in src/todo_app/storage.py

## Phase 3: User Story 1 - Add New Task with Title and Description (P1)

- [x] T007 [P] [US1] Implement add_task function in src/todo_app/todo_manager.py
- [x] T008 [US1] Create console interface for task creation in src/todo_app/main.py
- [x] T009 [US1] Add user prompts for title and description input
- [x] T010 [US1] Integrate task creation with console interface
- [x] T011 [US1] Test basic task creation functionality

## Phase 4: User Story 2 - Add Task with Title Only (P2)

- [x] T012 [P] [US2] Update add_task function to handle optional description
- [x] T013 [US2] Modify console interface to allow skipping description
- [x] T014 [US2] Test task creation with title only

## Phase 5: User Story 3 - Handle Invalid Input During Task Creation (P3)

- [x] T015 [P] [US3] Add input validation to add_task function
- [x] T016 [US3] Implement error handling and user feedback
- [x] T017 [US3] Add validation for title length (max 200 chars)
- [x] T018 [US3] Add validation for description length (max 1000 chars)
- [x] T019 [US3] Add validation for empty/whitespace-only titles
- [x] T020 [US3] Test error scenarios and validation

## Phase 6: Polish & Cross-Cutting Concerns

- [x] T021 Add comprehensive error messages to console interface
- [x] T022 Improve user experience with clear prompts and feedback
- [x] T023 Add type hints throughout the codebase
- [x] T024 Write documentation for public functions
- [x] T025 Test complete workflow with all validation scenarios