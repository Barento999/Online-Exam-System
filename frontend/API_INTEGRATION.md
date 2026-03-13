# API Integration Guide

All mock data has been removed from the application. The app now uses real API endpoints.

## Configuration

1. Create a `.env` file in the root directory (copy from `.env.example`):

```bash
VITE_API_URL=http://localhost:3000/api
```

2. Update the URL to match your backend server.

## API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/register` - User registration
- `POST /auth/logout` - User logout
- `GET /auth/me` - Get current user

### Users

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Courses

- `GET /courses` - Get all courses
- `GET /courses/:id` - Get course by ID
- `POST /courses` - Create new course
- `PUT /courses/:id` - Update course
- `DELETE /courses/:id` - Delete course
- `GET /courses/:id/students` - Get enrolled students
- `POST /courses/:id/enroll` - Enroll student

### Exams

- `GET /exams` - Get all exams
- `GET /exams/available` - Get available exams for student
- `GET /exams/:id` - Get exam by ID
- `POST /exams` - Create new exam
- `PUT /exams/:id` - Update exam
- `DELETE /exams/:id` - Delete exam
- `POST /exams/:id/submit` - Submit exam answers

### Questions

- `GET /questions?examId=:id` - Get questions by exam
- `GET /questions/:id` - Get question by ID
- `POST /questions` - Create new question
- `PUT /questions/:id` - Update question
- `DELETE /questions/:id` - Delete question
- `POST /questions/bulk` - Bulk create questions

### Results

- `GET /results` - Get all results
- `GET /results/student/:id` - Get results by student
- `GET /results/exam/:id` - Get results by exam
- `GET /results/:id` - Get result by ID

### Dashboard

- `GET /dashboard/admin` - Get admin statistics
- `GET /dashboard/teacher` - Get teacher statistics
- `GET /dashboard/student` - Get student statistics

## Authentication

The app uses JWT tokens for authentication:

- Token is stored in `localStorage` as `token`
- Token is automatically added to all API requests via interceptor
- On 401 response, user is redirected to login

## Error Handling

All API errors are handled by axios interceptors:

- 401: Redirects to login page
- Other errors: Propagated to calling component

## Usage Example

```javascript
import { authApi, usersApi } from "@/services/api";

// Login
try {
  const response = await authApi.login(email, password);
  localStorage.setItem("token", response.data.token);
  localStorage.setItem("user", JSON.stringify(response.data.user));
} catch (error) {
  console.error("Login failed:", error.response?.data?.message);
}

// Get users
try {
  const response = await usersApi.getAll();
  setUsers(response.data);
} catch (error) {
  console.error("Failed to fetch users:", error);
}
```

## Backend Requirements

Your backend should:

1. Accept JSON requests
2. Return JSON responses
3. Use JWT for authentication
4. Include proper CORS headers
5. Follow RESTful conventions

## Response Format

Expected response format:

```json
{
  "data": { ... },
  "message": "Success message",
  "error": null
}
```

Or for errors:

```json
{
  "data": null,
  "message": "Error message",
  "error": "ERROR_CODE"
}
```
