# Quick Start Guide

## Prerequisites

- Node.js 18 or higher
- MongoDB (local installation or MongoDB Atlas account)
- npm or pnpm

## Setup Instructions

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env` file:**

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/online-exam-system
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
```

**Seed initial data:**

```bash
npm run seed
```

This creates:

- Admin user: admin@exam.com / admin123
- Teacher user: teacher@exam.com / teacher123
- Student user: student@exam.com / student123
- Sample courses, exams, and questions

**Start backend server:**

```bash
npm run dev
```

Backend runs on `http://localhost:3000`

### 2. Frontend Setup

```bash
# Navigate to frontend directory (open new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Edit `.env` file:**

```env
VITE_API_URL=http://localhost:3000/api
```

**Start frontend server:**

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

### 3. Access the Application

Open your browser and go to `http://localhost:5173`

**Login with test credentials:**

- **Admin:** admin@exam.com / admin123
- **Teacher:** teacher@exam.com / teacher123
- **Student:** student@exam.com / student123

## Project Structure

```
.
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Request handlers
│   │   ├── middlewares/       # Auth, validation, error handling
│   │   ├── models/            # Mongoose models
│   │   ├── routes/            # API routes
│   │   ├── utils/             # Utilities (seed script)
│   │   └── server.js          # Entry point
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # shadcn/ui components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── common/       # Common components
│   │   │   └── figma/        # Figma components
│   │   ├── pages/            # Page components
│   │   ├── context/          # React contexts
│   │   ├── routes/           # Route configuration
│   │   ├── services/         # API services
│   │   ├── lib/              # Utilities
│   │   └── styles/           # Global styles
│   ├── .env.example
│   ├── package.json
│   └── README.md
│
└── README.md                   # Main documentation
```

## Available Scripts

### Backend

```bash
npm run dev      # Start development server with nodemon
npm start        # Start production server
npm run seed     # Seed database with initial data
```

### Frontend

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Key Features

### Backend

✅ RESTful API with Express
✅ MongoDB with Mongoose ODM
✅ JWT authentication
✅ Role-based access control
✅ Request validation
✅ Error handling middleware
✅ Rate limiting
✅ CORS enabled
✅ Password hashing with bcrypt
✅ Logging with Morgan

### Frontend

✅ React 18 with Vite
✅ Tailwind CSS + shadcn/ui
✅ React Router for navigation
✅ JWT token management
✅ Role-based routing
✅ Responsive design
✅ Dark mode support
✅ Toast notifications
✅ Form validation

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout user

### Users (Admin only)

- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Courses

- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (Admin/Teacher)
- `PUT /api/courses/:id` - Update course (Admin/Teacher)
- `DELETE /api/courses/:id` - Delete course (Admin)

### Exams

- `GET /api/exams` - Get all exams
- `GET /api/exams/available` - Get available exams (Student)
- `POST /api/exams` - Create exam (Admin/Teacher)
- `POST /api/exams/:id/submit` - Submit exam (Student)

### Questions

- `GET /api/questions` - Get questions (Admin/Teacher)
- `POST /api/questions` - Create question (Admin/Teacher)
- `POST /api/questions/bulk` - Bulk create questions

### Results

- `GET /api/results` - Get all results (Admin/Teacher)
- `GET /api/results/student/:id` - Get student results
- `GET /api/results/exam/:id` - Get exam results

### Dashboard

- `GET /api/dashboard/admin` - Admin statistics
- `GET /api/dashboard/teacher` - Teacher statistics
- `GET /api/dashboard/student` - Student statistics

## Troubleshooting

### Backend Issues

**MongoDB connection error:**

- Ensure MongoDB is running
- Check MONGO_URI in .env file
- For MongoDB Atlas, whitelist your IP address

**Port already in use:**

- Change PORT in .env file
- Kill process using port 3000: `npx kill-port 3000`

### Frontend Issues

**API calls failing:**

- Verify backend is running on port 3000
- Check VITE_API_URL in .env file
- Check browser console for errors

**Authentication issues:**

- Clear browser localStorage
- Re-login with correct credentials
- Check JWT_SECRET matches between requests

### General Issues

**Dependencies not installing:**

- Delete node_modules and package-lock.json
- Run `npm install` again
- Check Node.js version (18+)

**Seed script fails:**

- Ensure MongoDB is running
- Drop existing database if needed
- Check MongoDB connection string

## Next Steps

1. ✅ Start both backend and frontend servers
2. ✅ Login with test credentials
3. ✅ Explore different user roles
4. ✅ Create courses, exams, and questions
5. ✅ Take exams as a student
6. ✅ View results and analytics

## Documentation

- [Main README](README.md) - Project overview
- [Backend README](backend/README.md) - Complete API documentation
- [Frontend Structure](frontend/PROJECT_STRUCTURE.md) - Frontend architecture
- [API Integration](frontend/API_INTEGRATION.md) - API usage guide

## Support

For issues or questions:

1. Check the documentation files
2. Review error messages in console
3. Verify environment variables
4. Check MongoDB connection

Happy coding! 🚀
