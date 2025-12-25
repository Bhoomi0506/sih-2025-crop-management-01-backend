# Tasks: Implement Activity Logging for User Actions

**Input**: Design documents from `C:\Users\ANANT\WebstormProject\sih-2025-crop-management-01-backend\specs\main\`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/activity.openapi.yaml

**Tests**: The feature specification does not explicitly request test tasks. However, writing tests (unit, integration, end-to-end) is highly recommended to ensure correctness and prevent regressions.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `src/`, `tests/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure (already largely handled in previous steps, focus on new file creation)

- [ ] T001 Create `activity.model.ts` in `src/models/activity.model.ts` based on `data-model.md`
- [ ] T002 Create `activity.service.ts` in `src/services/activity.service.ts` with basic CRUD operations for activity logs
- [ ] T003 Create `activityLogger.middleware.ts` in `src/middleware/activityLogger.middleware.ts` to encapsulate logging logic

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 Implement `ActivitySchema` in `src/models/activity.model.ts` including `userId`, `action`, `entityType`, `entityId`, `details`, `timestamp`, and indexes.
- [ ] T005 Implement `ActivityService` methods for creating and querying activity logs in `src/services/activity.service.ts`.
- [ ] T006 Implement a function within `src/middleware/activityLogger.middleware.ts` to accept `action` and `details` and log to `ActivityService`.

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Log User Authentication Events (Priority: P1) 🎯 MVP

**Goal**: The system logs successful user login and logout events.

**Independent Test**: Manually verify that user login and logout events create corresponding entries in the `Activity` collection in the database, with correct `userId`, `action`, `entityType`, and `timestamp`. Verify that `details` are appropriate for these actions.

### Implementation for User Story 1

- [ ] T007 [US1] Integrate activity logging for user login events in `src/controllers/user.controller.ts` (or relevant auth service).
- [ ] T008 [US1] Integrate activity logging for user logout events in `src/controllers/user.controller.ts` (or relevant auth service).
- [ ] T009 [US1] Define specific `details` content for `USER_LOGIN` and `USER_LOGOUT` actions.

---

## Phase 4: User Story 2 - Log Crop Management Events (Priority: P1)

**Goal**: The system logs the creation, update, and deletion of `Crop` entities.

**Independent Test**: Manually verify that `Crop` creation, update, and deletion operations create corresponding entries in the `Activity` collection. For updates, confirm 'before' and 'after' values are present in `details`.

### Implementation for User Story 2

- [ ] T010 [US2] Integrate activity logging for `Crop` creation events in `src/controllers/crop.controller.ts` (or relevant crop service).
- [ ] T011 [US2] Integrate activity logging for `Crop` update events in `src/controllers/crop.controller.ts` (or relevant crop service), including 'before' and 'after' values in `details`.
- [ ] T012 [US2] Integrate activity logging for `Crop` deletion events in `src/controllers/crop.controller.ts` (or relevant crop service).
- [ ] T013 [US2] Define specific `details` content for `CROP_CREATED`, `CROP_UPDATED`, `CROP_DELETED` actions.

---

## Phase 5: User Story 3 - Log Field Management Events (Priority: P1)

**Goal**: The system logs the creation, update, and deletion of `Field` entities.

**Independent Test**: Manually verify that `Field` creation, update, and deletion operations create corresponding entries in the `Activity` collection. For updates, confirm 'before' and 'after' values are present in `details`.

### Implementation for User Story 3

- [ ] T014 [US3] Integrate activity logging for `Field` creation events in `src/controllers/field.controller.ts` (or relevant field service).
- [ ] T015 [US3] Integrate activity logging for `Field` update events in `src/controllers/field.controller.ts` (or relevant field service), including 'before' and 'after' values in `details`.
- [ ] T016 [US3] Integrate activity logging for `Field` deletion events in `src/controllers/field.controller.ts` (or relevant field service).
- [ ] T017 [US3] Define specific `details` content for `FIELD_CREATED`, `FIELD_UPDATED`, `FIELD_DELETED` actions.

---

<h2>Phase 6: User Story 4 - Retrieve Activity Logs (Priority: P1)</h2>

**Goal**: Provide an API endpoint to retrieve activity logs with filtering, pagination, and admin-only access.

**Independent Test**: Use API client (e.g., Postman) to verify `/api/v1/activities` endpoint:
- Returns activity logs.
- Supports filtering by `userId`, `action`, `entityType`, `startDate`, `endDate`.
- Implements pagination (`page`, `limit`).
- Restricts access to `admin` users only (returns 403 for non-admins).

<h3>Implementation for User Story 4</h3>

- [ ] T018 [US4] Create `activity.controller.ts` in `src/controllers/activity.controller.ts` with methods for retrieving activity logs.
- [ ] T019 [US4] Create `activity.routes.ts` in `src/routes/activity.routes.ts` and register `/api/v1/activities` endpoint.
- [ ] T020 [US4] Implement logic for filtering activity logs in `src/services/activity.service.ts` (based on `userId`, `action`, `entityType`, date range).
- [ ] T021 [US4] Implement logic for pagination in `src/services/activity.service.ts`.
- [ ] T022 [US4] Apply RBAC middleware (`src/middleware/rbac.middleware.ts`) to restrict access to `/api/v1/activities` endpoint to `admin` users.
- [ ] T023 [US4] Update `src/routes/index.ts` to include `activity.routes.ts`.

---

<h2>Phase 7: Polish & Cross-Cutting Concerns</h2>

**Purpose**: Improvements that affect multiple user stories

- [ ] T024 Implement data retention mechanism (e.g., scheduled job) to soft-delete or archive logs older than 1 year, as per NFR4.
- [ ] T025 Ensure logging activities do not significantly impact the response time of primary user actions (NFR1). Perform basic performance checks.
- [ ] T026 Ensure the logging mechanism is robust and handles failures gracefully (NFR3).
- [ ] T027 Update OpenAPI/Swagger documentation for `/api/v1/activities` based on `contracts/activity.openapi.yaml`.
- [ ] T028 Update `README.md` with details on activity logging and API usage.

---

<h2>Dependencies & Execution Order</h2>

<h3>Phase Dependencies</h3>

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

<h3>User Story Dependencies</h3>

- All user stories (US1-US4) are primarily dependent on the Foundational phase being complete.
- US1, US2, US3, US4 can be implemented in parallel if resources allow.

<h3>Within Each User Story</h3>

- Implementation tasks should generally follow a logical flow (e.g., logging integration before API retrieval).

<h3>Parallel Opportunities</h3>

- All tasks in Phase 1 (Setup) are [P] eligible.
- Tasks T007-T009 (US1), T010-T013 (US2), T014-T017 (US3) can be worked on in parallel once Foundational tasks are done.
- T018-T023 (US4) can be worked on in parallel with other user stories.
- Within each user story, tasks involving different files (e.g., controller vs. service) can potentially be parallelized.

---

<h2>Parallel Example: User Story 1</h2>

```bash
# Example parallel tasks for User Story 1
# Assuming T007, T008, T009 are worked on concurrently
- [ ] T007 [US1] Integrate activity logging for user login events in src/controllers/user.controller.ts
- [ ] T008 [US1] Integrate activity logging for user logout events in src/controllers/user.controller.ts
- [ ] T009 [US1] Define specific `details` content for `USER_LOGIN` and `USER_LOGOUT` actions.
```

---

<h2>Implementation Strategy</h2>

<h3>MVP First (User Story 1, 2, 3 + basic API for 4)</h3>

The logging of events (US1, US2, US3) forms the core value. A basic retrieval API (US4 - without advanced filtering) could be an early MVP.

1.  Complete Phase 1: Setup
2.  Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3.  Complete Phase 3: User Story 1
4.  Complete Phase 4: User Story 2
5.  Complete Phase 5: User Story 3
6.  Complete a basic implementation of Phase 6: User Story 4 (API endpoint, no advanced filtering/pagination initially)
7.  **STOP and VALIDATE**: Test the core logging and basic retrieval independently.
8.  Deploy/demo if ready.

<h3>Incremental Delivery</h3>

1.  Complete Setup + Foundational → Foundation ready
2.  Add User Story 1 → Test independently → Deploy/Demo
3.  Add User Story 2 → Test independently → Deploy/Demo
4.  Add User Story 3 → Test independently → Deploy/Demo
5.  Add User Story 4 → Test independently → Deploy/Demo
6.  Each story adds value without breaking previous stories

<h3>Parallel Team Strategy</h3>

With multiple developers:

1.  Team completes Setup + Foundational together
2.  Once Foundational is done:
    -   Developer A: User Story 1
    -   Developer B: User Story 2
    -   Developer C: User Story 3
    -   Developer D: User Story 4 (API retrieval)
3.  Stories complete and integrate independently

---

<h2>Notes</h2>

-   [P] tasks = different files, no dependencies
-   [Story] label maps task to specific user story for traceability
-   Each user story should be independently completable and testable
-   Verify tests fail before implementing (even if test tasks are not explicitly listed, this principle should be followed)
-   Commit after each task or logical group
-   Stop at any checkpoint to validate story independently
-   Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
