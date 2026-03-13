# Online Exam System

A full-stack online examination system with role-based access control for admins, teachers, and students.

## Project Structure

```
.
├── frontend/           # React + Vite frontend application
│   ├── src/           # Source code
│   ├── public/        # Static assets
│   └── ...            # Configuration files
├── backend/           # Node.js + Express backend API
│   ├── src/           # Source code
│   └── ...            # Configuration files
└── README.md          # This file
```

## Backend

The backend is built with:

- Node.js + Express
- MongoDB with Mongoose
- JWT authentication
- Role-based access control
- Express middleware (validation, error handling, rate limiting)

### Getting Started

```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI and JWT secret
npm run seed  # Seed initial data
npm run dev
```

### Documentation

- [Backend README](backend/README.md)
- Complete API documentation with all endpoints

## Frontend

The frontend is built with:

- React 18
- Vite
- Tailwind CSS
- shadcn/ui components
- React Router
- Axios for API calls

### Getting Started

```bash
cd frontend
npm install
npm run dev
```

### Configuration

Create a `.env` file in the `frontend` directory:

```env
VITE_API_URL=http://localhost:3000/api
```

### Documentation

- [Project Structure](frontend/PROJECT_STRUCTURE.md)
- [API Integration](frontend/API_INTEGRATION.md)

## Features

### Admin Dashboard

- User management (create, update, delete users)
- Course management
- Exam oversight
- System settings
- Analytics and reports

### Teacher Dashboard

- Create and manage courses
- Create and manage exams
- Question bank management
- View student results
- Grade submissions
- **Live exam monitoring** - Monitor students taking exams in real-time

### Student Dashboard

- View enrolled courses
- Take available exams
- View results and grades
- Track progress
- **Live connection status** - See real-time connection during exams

## Tech Stack

### Frontend

- React 18.3.1
- Vite 6.3.5
- Tailwind CSS 4.1.12
- React Router 7.13.0
- Axios for API calls
- shadcn/ui component library
- Lucide React icons

### Authentication

- JWT-based authentication
- Role-based access control (RBAC)
- Protected routes

### Real-Time Features

- WebSocket-based live exam monitoring
- Real-time student progress tracking
- Live activity feed for teachers/admins
- Connection status indicators
- See [WEBSOCKET_FEATURES.md](WEBSOCKET_FEATURES.md) for details

## Development

### Prerequisites

- Node.js 18+
- npm or pnpm
- MongoDB (local or Atlas)

### Installation

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Running the Application

```bash
# Terminal 1: Start backend server
cd backend
npm run dev
# Backend runs on http://localhost:3000

# Terminal 2: Start frontend development server
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### Seeding Database

```bash
cd backend
npm run seed
```

This creates test users:

- Admin: admin@exam.com / admin123
- Teacher: teacher@exam.com / teacher123
- Student: student@exam.com / student123

### Building for Production

```bash
# Build frontend
cd frontend
npm run build

# Run backend in production
cd backend
npm start
```

## Environment Variables

### Backend (.env)

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/online-exam-system
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000/api
VITE_ENV=development
```

## License

See [ATTRIBUTIONS.md](frontend/ATTRIBUTIONS.md) for third-party licenses.
