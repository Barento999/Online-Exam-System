# Online Exam System - Architecture

## System Overview

A full-stack web application for conducting online examinations with role-based access control.

## Technology Stack

### Backend

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** express-validator
- **Security:** bcryptjs, express-rate-limit, CORS
- **Logging:** Morgan

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS 4
- **UI Components:** shadcn/ui
- **Routing:** React Router 7
- **HTTP Client:** Axios
- **State Management:** React Context API
- **Icons:** Lucide React

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React Application (Port 5173)                       │  │
│  │  ├── Pages (Login, Dashboard, Exams, etc.)          │  │
│  │  ├── Components (UI, Layout, Common)                │  │
│  │  ├── Context (Auth, Theme)                          │  │
│  │  ├── Services (API calls via Axios)                 │  │
│  │  └── Routes (Protected routes)                      │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/HTTPS
                            │ REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Express Server (Port 3000)                          │  │
│  │  ├── Routes (API endpoints)                          │  │
│  │  ├── Controllers (Business logic)                    │  │
│  │  ├── Middlewares (Auth, Validation, Error)          │  │
│  │  ├── Models (Mongoose schemas)                      │  │
│  │  └── Config (Database connection)                   │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ Mongoose
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                      MongoDB Database                        │
│  ├── users (Admin, Teacher, Student)                        │
│  ├── courses                                                 │
│  ├── exams                                                   │
│  ├── questions                                               │
│  └── results                                                 │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow

```
1. User enters credentials → Frontend
2. Frontend sends POST /api/auth/login → Backend
3. Backend validates credentials → MongoDB
4. Backend generates JWT token → Frontend
5. Frontend stores token in localStorage
6. Frontend includes token in all subsequent requests
```

### Exam Submission Flow

```
1. Student takes exam → Frontend
2. Student submits answers → POST /api/exams/:id/submit
3. Backend validates exam availability
4. Backend calculates score by comparing with correct answers
5. Backend creates result record → MongoDB
6. Backend returns result → Frontend
7. Frontend displays score and status
```

## Database Schema

### User

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['student', 'teacher', 'admin'],
  status: Enum ['active', 'inactive'],
  timestamps: true
}
```

### Course

```javascript
{
  name: String,
  description: String,
  teacherId: ObjectId (ref: User),
  teacherName: String,
  studentsCount: Number,
  status: Enum ['active', 'inactive'],
  timestamps: true
}
```

### Exam

```javascript
{
  title: String,
  courseId: ObjectId (ref: Course),
  courseName: String,
  duration: Number (minutes),
  totalMarks: Number,
  passingMarks: Number,
  startTime: Date,
  endTime: Date,
  status: Enum ['draft', 'published', 'completed', 'cancelled'],
  questionsCount: Number,
  createdBy: ObjectId (ref: User),
  timestamps: true
}
```

### Question

```javascript
{
  examId: ObjectId (ref: Exam),
  questionText: String,
  optionA: String,
  optionB: String,
  optionC: String,
  optionD: String,
  correctAnswer: Enum ['A', 'B', 'C', 'D'],
  marks: Number,
  timestamps: true
}
```

### Result

```javascript
{
  studentId: ObjectId (ref: User),
  studentName: String,
  examId: ObjectId (ref: Exam),
  examName: String,
  score: Number,
  totalMarks: Number,
  percentage: Number,
  answers: [{
    questionId: ObjectId (ref: Question),
    selectedAnswer: Enum ['A', 'B', 'C', 'D']
  }],
  status: Enum ['passed', 'failed'],
  submittedAt: Date,
  timestamps: true
}
```

## API Architecture

### RESTful Endpoints

```
/api/auth
  POST   /register      - Register new user
  POST   /login         - Login user
  GET    /me            - Get current user
  POST   /logout        - Logout user

/api/users
  GET    /              - Get all users (paginated)
  GET    /:id           - Get user by ID
  POST   /              - Create user
  PUT    /:id           - Update user
  DELETE /:id           - Delete user

/api/courses
  GET    /              - Get all courses
  GET    /:id           - Get course by ID
  POST   /              - Create course
  PUT    /:id           - Update course
  DELETE /:id           - Delete course

/api/exams
  GET    /              - Get all exams
  GET    /available     - Get available exams (student)
  GET    /:id           - Get exam by ID
  POST   /              - Create exam
  PUT    /:id           - Update exam
  DELETE /:id           - Delete exam
  POST   /:id/submit    - Submit exam answers

/api/questions
  GET    /              - Get questions
  GET    /:id           - Get question by ID
  POST   /              - Create question
  POST   /bulk          - Bulk create questions
  PUT    /:id           - Update question
  DELETE /:id           - Delete question

/api/results
  GET    /              - Get all results
  GET    /:id           - Get result by ID
  GET    /student/:id   - Get results by student
  GET    /exam/:id      - Get results by exam

/api/dashboard
  GET    /admin         - Admin statistics
  GET    /teacher       - Teacher statistics
  GET    /student       - Student statistics
```

## Security Architecture

### Authentication

- JWT tokens with configurable expiration
- Tokens stored in localStorage (frontend)
- Tokens sent in Authorization header
- Automatic token validation on protected routes

### Authorization

- Role-based access control (RBAC)
- Three roles: Admin, Teacher, Student
- Middleware checks user role before allowing access
- Route-level and resource-level permissions

### Data Protection

- Passwords hashed with bcrypt (10 salt rounds)
- Sensitive data excluded from API responses
- Input validation on all endpoints
- SQL injection prevention via Mongoose
- XSS protection via input sanitization

### Rate Limiting

- 100 requests per 15 minutes per IP
- Configurable via environment variables
- Prevents brute force attacks

## Frontend Architecture

### Component Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components
│   ├── layout/          # Layout components (Navbar, Sidebar)
│   ├── common/          # Common components (Loader, Dialog)
│   └── figma/           # Figma-specific components
├── pages/               # Page components (one per route)
├── context/             # React Context providers
├── routes/              # Route configuration
├── services/            # API service layer
├── lib/                 # Utility functions
└── styles/              # Global styles
```

### State Management

- React Context API for global state (auth, theme)
- Local state with useState for component-specific data
- No external state management library needed

### Routing

- React Router for navigation
- Protected routes with authentication check
- Role-based route access
- Automatic redirect to login if not authenticated

## Backend Architecture

### Layered Architecture

```
Routes → Controllers → Models → Database
   ↓
Middlewares (Auth, Validation, Error Handling)
```

### Middleware Stack

1. **CORS** - Enable cross-origin requests
2. **Body Parser** - Parse JSON and URL-encoded data
3. **Morgan** - HTTP request logging
4. **Rate Limiter** - Prevent abuse
5. **Auth Middleware** - Verify JWT tokens
6. **Validation Middleware** - Validate request data
7. **Error Handler** - Catch and format errors

### Error Handling

- Centralized error handling middleware
- Consistent error response format
- Different error types (validation, authentication, not found)
- Stack traces in development only

## Deployment Considerations

### Backend

- Environment variables for configuration
- MongoDB connection string (local or Atlas)
- JWT secret (strong, random string)
- CORS origin (frontend URL)
- Rate limiting settings

### Frontend

- Build for production: `npm run build`
- Serve static files via Nginx or CDN
- Environment variable for API URL
- Enable HTTPS in production

### Database

- MongoDB Atlas for cloud hosting
- Regular backups
- Indexes on frequently queried fields
- Connection pooling

## Scalability

### Horizontal Scaling

- Stateless backend (JWT tokens)
- Multiple backend instances behind load balancer
- MongoDB replica sets for high availability

### Performance Optimization

- Database indexing on email, examId, studentId
- Pagination for large datasets
- Caching frequently accessed data
- Lazy loading on frontend

## Monitoring & Logging

### Backend Logging

- Morgan for HTTP request logs
- Console logs for errors
- Consider adding Winston for production

### Frontend Monitoring

- Browser console for development
- Error boundaries for React errors
- Consider adding Sentry for production

## Future Enhancements

- Real-time exam monitoring with WebSockets
- File upload for questions (images)
- Email notifications
- Advanced analytics and reporting
- Mobile app with React Native
- Automated exam scheduling
- Question randomization
- Time-based exam auto-submission
- Plagiarism detection
- Video proctoring integration
