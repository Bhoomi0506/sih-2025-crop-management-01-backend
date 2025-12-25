# Data Model for Activity Logging

## Entity: Activity

### Description
Represents a single logged action performed by a user within the system. Provides an audit trail for various operations.

### Fields

*   `_id`: MongoDB ObjectId (Primary Key, automatically generated)
*   `userId`:
    *   **Type**: `mongoose.Schema.Types.ObjectId` (References `User` model)
    *   **Required**: Yes
    *   **Description**: The ID of the user who performed the action.
*   `action`:
    *   **Type**: `String`
    *   **Required**: Yes
    *   **Description**: A descriptive string identifying the action performed (e.g., "USER_LOGIN", "CROP_CREATED", "FIELD_UPDATED").
    *   **Example values**: "USER_LOGIN", "CROP_CREATED", "FIELD_UPDATED", "CROP_DELETED", "FIELD_DELETED", "USER_LOGOUT".
*   `entityType`:
    *   **Type**: `String`
    *   **Required**: Yes
    *   **Description**: The type of entity primarily affected by the action (e.g., "User", "Crop", "Field").
    *   **Example values**: "User", "Crop", "Field".
*   `entityId`:
    *   **Type**: `mongoose.Schema.Types.ObjectId` (References respective model based on `entityType`)
    *   **Required**: No (e.g., for login/logout actions, there might not be a specific entityId beyond the user).
    *   **Description**: The ID of the specific entity affected by the action (e.g., `Crop._id`, `Field._id`).
*   `details`:
    *   **Type**: `Object` (Schema.Types.Mixed)
    *   **Required**: No
    *   **Description**: A flexible JSON object to store additional context relevant to the action (e.g., old/new values for updates, IP address, device info).
*   `timestamp`:
    *   **Type**: `Date`
    *   **Required**: Yes (automatically managed by Mongoose `timestamps: true`)
    *   **Description**: The exact date and time the action occurred.

### Relationships
*   `Activity` -> `User`: Many-to-one (An activity is performed by one user, a user can perform many activities).
*   `Activity` -> `Crop` (conditional): Many-to-one (An activity can relate to one crop).
*   `Activity` -> `Field` (conditional): Many-to-one (An activity can relate to one field).

### Validation Rules
*   `userId` must be a valid ObjectId and refer to an existing `User`.
*   `action` and `entityType` fields should have defined enumerations or be validated against a whitelist of allowed values to maintain consistency.
*   If `entityId` is present, it must be a valid ObjectId and refer to an existing entity of `entityType`.

### Indexes
*   `userId`: For efficient retrieval of activities by a specific user.
*   `action`: For efficient retrieval of activities of a specific type.
*   `entityType` + `entityId`: For efficient retrieval of activities related to a specific entity.
*   `timestamp`: For efficient time-based queries (e.g., date range filtering).

### State Transitions
N/A (Activity records are immutable once created).