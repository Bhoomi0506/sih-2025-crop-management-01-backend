# Feature Specification: Implement Activity Logging for User Actions

## 1. Overview

This feature introduces a new `Activity` model to track significant user actions within the Crop Management Backend API. This will provide an audit trail for various operations performed by users, such as logging in, creating crops, updating fields, etc.

## 2. Functional Requirements

*   **FR1:** The system MUST log successful user login events.
*   **FR2:** The system MUST log successful user logout events.
*   **FR3:** The system MUST log the creation, update, and deletion of `Crop` entities.
*   **FR4:** The system MUST log the creation, update, and deletion of `Field` entities.
*   **FR5:** Each activity log entry MUST include:
    *   `userId`: The ID of the user performing the action.
    *   `action`: A descriptive string of the action performed (e.g., "USER_LOGIN", "CROP_CREATED").
    *   `entityType`: The type of entity affected (e.g., "User", "Crop", "Field").
    *   `entityId`: The ID of the entity affected (if applicable).
    *   `timestamp`: The time the action occurred.
    *   `details`: (Optional) A JSON object containing additional, **action-specific** context. **The specific fields for `details` MUST be defined for each action type during implementation. For update actions (e.g., CROP_UPDATED, FIELD_UPDATED), the `details` MUST include 'before' and 'after' values of the modified fields.**
*   **FR6:** Provide an API endpoint to retrieve activity logs (e.g., `/api/v1/activities`).
*   **FR7:** Activity log retrieval MUST support filtering by `userId`, `action`, `entityType`, and date range.
*   **FR8:** Activity log retrieval MUST support pagination.

## 3. Non-Functional Requirements

*   **NFR1 (Performance):** Logging activities MUST NOT significantly impact the response time of the primary user actions.
*   **NFR2 (Security):** Access to activity logs MUST be restricted to `admin` users only.
*   **NFR3 (Reliability):** The logging mechanism should be robust and gracefully handle failures without affecting the core application.
*   **NFR4 (Data Retention):** Activity logs MUST be retained for a period of 1 year. After this period, logs SHOULD be automatically archived or soft-deleted.

## 4. Technical Considerations

*   **Database:** A new `Activity` model will be created in MongoDB.
*   **Implementation:** Middleware or service-level integration will be used to trigger activity logging.
*   **API:** New routes and controllers for `Activity` retrieval will be implemented.

## 5. Open Questions

*   What specific `details` should be captured for each action type?

## Clarifications
### Session 2025-12-25
- Q: What specific `details` (fields) should be captured within the JSON object for each activity `action` type (e.g., USER_LOGIN, CROP_CREATED, CROP_UPDATED, CROP_DELETED, FIELD_CREATED, FIELD_UPDATED, FIELD_DELETED, USER_LOGOUT)? → A: The specific fields for `details` MUST be defined for each action type during implementation.
- Q: Should activity logs have a retention policy (e.g., automatically delete older logs), and if so, for how long? → A: 1 year.
- Q: For actions like CROP_UPDATED or FIELD_UPDATED, should the `details` field include the 'before' and 'after' values of the modified fields? → A: Yes.
- **Details for USER_LOGIN**: MUST include `ipAddress` (string) and `userAgent` (string).
- **Details for USER_LOGOUT**: SHOULD include `message` (string) indicating successful logout.
