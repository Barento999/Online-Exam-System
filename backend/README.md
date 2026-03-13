# Online Exam System - Backend API

RESTful API for the Online Exam System built with Node.js, Express, MongoDB, and JWT authentication.

## Features

- JWT-based authentication
- Role-based access control (Admin, Teacher, Student)
- RESTful API endpoints
- Request validation using express-validator
- Error handling middleware
- Rate limiting
- CORS enabled
- Pagination, filtering, and search support
- Logging with Morgan
- Password hashing with bcrypt

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for validation
- express-rate-limit for rate limiting
- Morgan for logging
- CORS for cross-origin requests

## Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your configuration
```

## Environment Variables

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/online-exam-system
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

## Database Setup

Make sure MongoDB is running on your system.

### Seed Initial Data

```bash
npm run seed
```

This will create:

- Admin user (admin@exam.com / admin123)
- Teacher users (teacher@exam.com / teacher123)
- Student users (student@exam.com / student123)
- Sample courses, exams, and questions

## Running the Server

```bash
# Development mode with nodemon
npm run dev

# Production mode
npm start
```

The server will run on `http://localhost:3000`

## API Endpoints

### Authentication

| Method | Endpoint           | Access  | Description       |
| ------ | ------------------ | ------- | ----------------- |
| POST   | /api/auth/register | Public  | Register new user |
| POST   | /api/auth/login    | Public  | Login user        |
| GET    | /api/auth/me       | Private | Get current user  |
| POST   | /api/auth/logout   | Private | Logout user       |

### Users

| Method | Endpoint       | Access  | Description               |
| ------ | -------------- | ------- | ------------------------- |
| GET    | /api/users     | Admin   | Get all users (paginated) |
| GET    | /api/users/:id | Private | Get user by ID            |
| POST   | /api/users     | Admin   | Create new user           |
| PUT    | /api/users/:id | Admin   | Update user               |
| DELETE | /api/users/:id | Admin   | Delete user               |

### Courses

| Method | Endpoint         | Access        | Description      |
| ------ | ---------------- | ------------- | ---------------- |
| GET    | /api/courses     | Private       | Get all courses  |
| GET    | /api/courses/:id | Private       | Get course by ID |
| POST   | /api/courses     | Admin/Teacher | Create course    |
| PUT    | /api/courses/:id | Admin/Teacher | Update course    |
| DELETE | /api/courses/:id | Admin         | Delete course    |

### Exams

| Method | Endpoint              | Access        | Description         |
| ------ | --------------------- | ------------- | ------------------- |
| GET    | /api/exams            | Private       | Get all exams       |
| GET    | /api/exams/available  | Student       | Get available exams |
| GET    | /api/exams/:id        | Private       | Get exam by ID      |
| POST   | /api/exams            | Admin/Teacher | Create exam         |
| PUT    | /api/exams/:id        | Admin/Teacher | Update exam         |
| DELETE | /api/exams/:id        | Admin/Teacher | Delete exam         |
| POST   | /api/exams/:id/submit | Student       | Submit exam answers |

### Questions

| Method | Endpoint            | Access        | Description           |
| ------ | ------------------- | ------------- | --------------------- |
| GET    | /api/questions      | Admin/Teacher | Get all questions     |
| GET    | /api/questions/:id  | Admin/Teacher | Get question by ID    |
| POST   | /api/questions      | Admin/Teacher | Create question       |
| POST   | /api/questions/bulk | Admin/Teacher | Bulk create questions |
| PUT    | /api/questions/:id  | Admin/Teacher | Update question       |
| DELETE | /api/questions/:id  | Admin/Teacher | Delete question       |

### Results

| Method | Endpoint                        | Access        | Description            |
| ------ | ------------------------------- | ------------- | ---------------------- |
| GET    | /api/results                    | Admin/Teacher | Get all results        |
| GET    | /api/results/:id                | Private       | Get result by ID       |
| GET    | /api/results/student/:studentId | Private       | Get results by student |
| GET    | /api/results/exam/:examId       | Admin/Teacher | Get results by exam    |

### Dashboard

| Method | Endpoint               | Access  | Description            |
| ------ | ---------------------- | ------- | ---------------------- |
| GET    | /api/dashboard/admin   | Admin   | Get admin statistics   |
| GET    | /api/dashboard/teacher | Teacher | Get teacher statistics |
| GET    | /api/dashboard/student | Student | Get student statistics |

## Request Examples

### Register User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "student"
}
```

### Login

```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@exam.com",
  "password": "admin123"
}
```

### Create Exam

```bash
POST /api/exams
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Final Exam",
  "courseId": "65f1234567890abcdef12345",
  "duration": 120,
  "totalMarks": 100,
  "passingMarks": 40,
  "startTime": "2026-04-01T10:00:00Z",
  "endTime": "2026-04-01T12:00:00Z",
  "status": "published"
}
```

### Submit Exam

```bash
POST /api/exams/:examId/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "answers": {
    "65f1234567890abcdef12345": "A",
    "65f1234567890abcdef12346": "B",
    "65f1234567890abcdef12347": "C"
  }
}
```

## Response Format

### Success Response

```json
{
  "data": { ... },
  "message": "Success message"
}
```

### Error Response

```json
{
  "message": "Error message",
  "error": "Error details (development only)"
}
```

## Roles & Permissions

### Admin

- Full access to all endpoints
- Manage users, courses, exams, questions
- View all results and analytics

### Teacher

- Create and manage courses
- Create and manage exams
- Add questions to exams
- View student results for their exams

### Student

- View available exams
- Take exams
- View own results
- Cannot manage courses or users

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based authorization
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Error handling without exposing sensitive data

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── examController.js
│   │   ├── questionController.js
│   │   └── resultController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js
│   │   ├── errorHandler.js
│   │   └── validateRequest.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Exam.js
│   │   ├── Question.js
│   │   └── Result.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── examRoutes.js
│   │   ├── questionRoutes.js
│   │   └── resultRoutes.js
│   ├── utils/
│   │   └── seed.js
│   └── server.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Testing

Use tools like Postman or Thunder Client to test the API endpoints.

## License

MIT
