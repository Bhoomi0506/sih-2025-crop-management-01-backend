# SIH 2025 Crop Management Backend

This repository contains the backend services for the SIH 2025 Crop Management project.

## Project Structure
- `src/controllers`: Handlers for API requests.
- `src/models`: Mongoose schemas for data models.
- `src/routes`: Express route definitions.
- `src/services`: Business logic and database interactions.
- `src/middleware`: Express middleware for authentication, authorization, and logging.
- `src/config`: Configuration files (e.g., database connection).
- `src/utils`: Utility functions.

## Technologies Used
- Node.js
- Express.js
- TypeScript
- MongoDB
- Mongoose

## Setup and Installation
1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd sih-2025-crop-management-01-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add environment variables:
   ```
   PORT=9501
   MONGO_URI=mongodb://localhost:27017/crop-management
   # JWT_SECRET=your_jwt_secret_key (if authentication is implemented)
   ```
4. Build the project:
   ```bash
   npm run build
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```
6. Start the production server:
   ```bash
   npm start
   ```

## API Documentation
(To be generated from Swagger/OpenAPI specifications)

## Activity Logging Feature

The system implements comprehensive activity logging for user actions, providing an audit trail for significant events within the application.

### Logged Actions
- **User Authentication**:
    - `USER_LOGIN`: Logged upon successful user login. Details include `ipAddress` and `userAgent`.
    - `USER_LOGOUT`: Logged upon successful user logout. Details include a `message`.
- **Crop Management**:
    - `CROP_CREATED`: Logged when a new crop is created. Details include `cropName`.
    - `CROP_UPDATED`: Logged when a crop's details are updated. Details include `before` and `after` states of the crop, and `changes` made.
    - `CROP_DELETED`: Logged when a crop is deleted. Details include `cropName` and `deletedCropData`.
- **Field Management**:
    - `FIELD_CREATED`: Logged when a new field is created. Details include `fieldName`.
    - `FIELD_UPDATED`: Logged when a field's details are updated. Details include `before` and `after` states of the field, and `changes` made.
    - `FIELD_DELETED`: Logged when a field is deleted. Details include `fieldName` and `deletedFieldData`.

### API Usage: Retrieve Activity Logs

Activity logs can be retrieved via a dedicated API endpoint. Access to this endpoint is restricted to `admin` users only.

- **Endpoint**: `GET /api/v1/activities`
- **Authentication**: Required (admin role)
- **Query Parameters**:
    - `userId`: Filter activities by the ID of the user who performed the action.
    - `action`: Filter activities by action type (e.g., `USER_LOGIN`, `CROP_CREATED`).
    - `entityType`: Filter activities by the type of entity affected (e.g., `User`, `Crop`, `Field`).
    - `startDate`: Filter activities starting from this date/time (ISO 8601 format).
    - `endDate`: Filter activities up to this date/time (ISO 8601 format).
    - `page`: Page number for pagination (default: 1).
    - `limit`: Number of items per page (default: 10, max: 100).

**Example Response (200 OK):**
```json
{
  "success": true,
  "message": "Activity logs retrieved successfully",
  "data": [
    {
      "_id": "65b9a8e0a1b2c3d4e5f6a7b8",
      "userId": "60d0fe4f5b5e7e001c8c9c0f",
      "action": "USER_LOGIN",
      "entityType": "User",
      "entityId": "60d0fe4f5b5e7e001c8c9c0f",
      "details": {
        "message": "User logged in successfully",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/..."
      },
      "createdAt": "2025-12-25T10:00:00.000Z",
      "updatedAt": "2025-12-25T10:00:00.000Z"
    }
  ],
  "meta": {
    "totalDocs": 1,
    "limit": 10,
    "page": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPrevPage": false
  }
}
```

### Data Retention
Activity logs are retained for a period of 1 year. Logs older than this period are automatically hard-deleted.


