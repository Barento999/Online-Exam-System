<div align="center">

# 🎓 Online Exam System

### A Modern, Full-Stack Examination Platform

[![React](https://img.shields.io/badge/React-18.3.1-61DAFB?style=flat&logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0+-47A248?style=flat&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-4.0+-010101?style=flat&logo=socket.io&logoColor=white)](https://socket.io/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

_A comprehensive online examination system with real-time monitoring, advanced analytics, and intelligent anti-cheating mechanisms._

[Features](#-features) • [Tech Stack](#-tech-stack) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The **Online Exam System** is a modern, enterprise-grade examination platform designed for educational institutions, training centers, and organizations conducting online assessments. Built with cutting-edge technologies, it provides a seamless experience for administrators, teachers, and students.

### Key Highlights

- 🔐 **Secure Authentication** - JWT-based authentication with role-based access control
- 📊 **Real-Time Monitoring** - Live exam tracking with WebSocket technology
- 🎯 **Advanced Analytics** - Comprehensive performance insights and reporting
- 🛡️ **Anti-Cheating System** - Multi-layered violation detection and tracking
- 📱 **Responsive Design** - Works flawlessly on desktop, tablet, and mobile
- ⚡ **High Performance** - Optimized for speed and scalability

---

## ✨ Features

### 👨‍💼 Admin Dashboard

- **User Management**
  - Create, update, and delete users
  - Bulk import/export users via CSV/Excel
  - Role assignment (Admin, Teacher, Student)
  - User status management (Active/Inactive)

- **Course Management**
  - Create and organize courses
  - Assign teachers to courses
  - Enroll students in courses
  - Course analytics and insights

- **System Analytics**
  - Score distribution charts
  - Pass/fail ratio visualization
  - Grade distribution analysis
  - Performance trends over time
  - Top performers leaderboard

- **Exam Oversight**
  - Monitor all exams across the system
  - View real-time exam statistics
  - Access comprehensive reports

### 👨‍🏫 Teacher Dashboard

- **Exam Creation & Management**
  - Create exams with customizable settings
  - Set duration, passing marks, and schedules
  - Enable/disable question randomization
  - Publish or unpublish exams

- **Question Bank**
  - Create multiple-choice questions
  - Add images to questions (JPG, PNG, GIF, WebP)
  - Bulk upload questions via CSV/Excel
  - Edit and delete questions
  - Organize questions by exam

- **Live Exam Monitoring**
  - Real-time student tracking during exams
  - View progress and completion status
  - Monitor connection status
  - Track violation attempts
  - Live activity feed with timestamps

- **Results & Grading**
  - Automatic grading system
  - View detailed student submissions
  - Export results to CSV
  - Performance analytics per exam

### 👨‍🎓 Student Dashboard

- **Exam Taking Experience**
  - Clean, distraction-free interface
  - Question navigation with status indicators
  - Auto-save functionality
  - Timer with visual warnings
  - Automatic submission on timeout

- **Anti-Cheating Features**
  - Tab switch detection
  - Copy/paste prevention
  - Right-click blocking
  - Keyboard shortcut restrictions
  - Fullscreen mode enforcement
  - Real-time violation tracking

- **Results & Progress**
  - View exam scores and feedback
  - Track performance over time
  - Access detailed answer reviews
  - Monitor course progress

### 🚀 Advanced Features

- **Real-Time Communication**
  - WebSocket-based live updates
  - Instant notification system
  - Connection status monitoring
  - Activity broadcasting

- **Question Randomization**
  - Shuffle questions per student
  - Prevent answer sharing
  - Configurable per exam

- **Auto-Submission System**
  - Time-based automatic submission
  - Warning notifications (5 min, 1 min, 30 sec)
  - Visual timer indicators
  - Graceful timeout handling

- **Bulk Operations**
  - CSV/Excel import for users
  - CSV/Excel import for questions
  - Bulk export functionality
  - Template downloads

- **Image Support**
  - Upload images for questions
  - Preview and remove images
  - Optimized image storage
  - Multiple format support

---

## 🛠️ Tech Stack

### Frontend

| Technology           | Version | Purpose                     |
| -------------------- | ------- | --------------------------- |
| **React**            | 18.3.1  | UI framework                |
| **Vite**             | 6.3.5   | Build tool & dev server     |
| **Tailwind CSS**     | 4.1.12  | Utility-first CSS framework |
| **shadcn/ui**        | Latest  | Component library           |
| **React Router**     | 7.13.0  | Client-side routing         |
| **Axios**            | Latest  | HTTP client                 |
| **Socket.IO Client** | 4.0+    | Real-time communication     |
| **Recharts**         | Latest  | Data visualization          |
| **React Hook Form**  | Latest  | Form management             |
| **React Hot Toast**  | Latest  | Notification system         |
| **Lucide React**     | Latest  | Icon library                |

### Backend

| Technology             | Version | Purpose                       |
| ---------------------- | ------- | ----------------------------- |
| **Node.js**            | 18+     | Runtime environment           |
| **Express**            | 4.x     | Web framework                 |
| **MongoDB**            | 6.0+    | Database                      |
| **Mongoose**           | Latest  | ODM for MongoDB               |
| **Socket.IO**          | 4.0+    | WebSocket server              |
| **JWT**                | Latest  | Authentication                |
| **Bcrypt**             | Latest  | Password hashing              |
| **Multer**             | Latest  | File upload handling          |
| **XLSX**               | Latest  | Excel file processing         |
| **Express Validator**  | Latest  | Input validation              |
| **Express Rate Limit** | Latest  | API rate limiting             |
| **Morgan**             | Latest  | HTTP request logging          |
| **CORS**               | Latest  | Cross-origin resource sharing |
| **Dotenv**             | Latest  | Environment configuration     |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Admin UI   │  │  Teacher UI  │  │  Student UI  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                            │                                 │
│                    React + Vite                              │
│                   Tailwind + shadcn                          │
└────────────────────────────┬────────────────────────────────┘
                             │
                    HTTP / WebSocket
                             │
┌────────────────────────────┴────────────────────────────────┐
│                      API Gateway Layer                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Express.js Server                       │   │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────┐    │   │
│  │  │    Auth    │  │   CORS     │  │Rate Limit  │    │   │
│  │  │ Middleware │  │ Middleware │  │ Middleware │    │   │
│  │  └────────────┘  └────────────┘  └────────────┘    │   │
│  └──────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                     Business Logic Layer                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   User   │  │  Course  │  │   Exam   │  │ Question │   │
│  │Controller│  │Controller│  │Controller│  │Controller│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Result  │  │  Socket  │  │  Upload  │                  │
│  │Controller│  │  Handler │  │  Handler │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                      Data Access Layer                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   User   │  │  Course  │  │   Exam   │  │ Question │   │
│  │  Model   │  │  Model   │  │  Model   │  │  Model   │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│  ┌──────────┐                                               │
│  │  Result  │                                               │
│  │  Model   │                                               │
│  └──────────┘                                               │
└────────────────────────────┬────────────────────────────────┘
                             │
┌────────────────────────────┴────────────────────────────────┐
│                      Database Layer                          │
│                      MongoDB Atlas                           │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  Collections: users, courses, exams, questions,      │   │
│  │               results, sessions                      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### Project Structure

```
online-exam-system/
├── frontend/                    # React frontend application
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/        # Common components
│   │   │   ├── layout/        # Layout components
│   │   │   └── ui/            # shadcn/ui components
│   │   ├── context/           # React context providers
│   │   ├── hooks/             # Custom React hooks
│   │   ├── pages/             # Page components
│   │   ├── services/          # API service layer
│   │   ├── utils/             # Utility functions
│   │   ├── App.jsx            # Root component
│   │   ├── routes.jsx         # Route definitions
│   │   └── main.jsx           # Entry point
│   ├── public/                # Static assets
│   ├── index.html             # HTML template
│   ├── vite.config.js         # Vite configuration
│   ├── tailwind.config.js     # Tailwind configuration
│   └── package.json           # Frontend dependencies
│
├── backend/                    # Node.js backend application
│   ├── src/
│   │   ├── config/            # Configuration files
│   │   │   ├── db.js         # Database connection
│   │   │   ├── socket.js     # WebSocket configuration
│   │   │   └── upload.js     # File upload configuration
│   │   ├── controllers/       # Request handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── courseController.js
│   │   │   ├── examController.js
│   │   │   ├── questionController.js
│   │   │   └── resultController.js
│   │   ├── middlewares/       # Express middlewares
│   │   │   ├── authMiddleware.js
│   │   │   ├── errorMiddleware.js
│   │   │   └── validateRequest.js
│   │   ├── models/            # Mongoose schemas
│   │   │   ├── User.js
│   │   │   ├── Course.js
│   │   │   ├── Exam.js
│   │   │   ├── Question.js
│   │   │   └── Result.js
│   │   ├── routes/            # API routes
│   │   │   ├── authRoutes.js
│   │   │   ├── userRoutes.js
│   │   │   ├── courseRoutes.js
│   │   │   ├── examRoutes.js
│   │   │   ├── questionRoutes.js
│   │   │   └── resultRoutes.js
│   │   ├── utils/             # Utility functions
│   │   ├── server.js          # Express server setup
│   │   └── seed.js            # Database seeding
│   ├── uploads/               # Uploaded files storage
│   ├── .env.example           # Environment template
│   └── package.json           # Backend dependencies
│
├── .gitignore                 # Git ignore rules
└── README.md                  # This file
```

---

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** (v6.0 or higher) - [Download](https://www.mongodb.com/try/download/community) or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- **npm** or **pnpm** - Comes with Node.js

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/online-exam-system.git
cd online-exam-system
```

2. **Install backend dependencies**

```bash
cd backend
npm install
```

3. **Install frontend dependencies**

```bash
cd ../frontend
npm install
```

4. **Configure environment variables**

Backend `.env`:

```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

Frontend `.env`:

```bash
cd frontend
cp .env.example .env
# Edit .env with your configuration
```

5. **Seed the database** (Optional but recommended)

```bash
cd backend
npm run seed
```

This creates default users:

- **Admin**: admin@exam.com / admin123
- **Teacher**: teacher@exam.com / teacher123
- **Student**: student@exam.com / student123

6. **Start the application**

```bash
# Terminal 1: Start backend (from backend directory)
npm run dev

# Terminal 2: Start frontend (from frontend directory)
npm run dev
```

7. **Access the application**

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- API Documentation: http://localhost:3000/api-docs (if configured)

---

## ⚙️ Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/online-exam-system
# Or use MongoDB Atlas:
# MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/online-exam-system

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# File Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# Environment
VITE_ENV=development

# WebSocket Configuration (optional, defaults to API URL)
VITE_SOCKET_URL=http://localhost:3000
```

---

## 📖 Usage

### For Administrators

1. **Login** with admin credentials
2. **Manage Users**: Navigate to Users section to create, edit, or delete users
3. **Bulk Import**: Use CSV/Excel import for adding multiple users
4. **View Analytics**: Access the Analytics dashboard for system-wide insights
5. **Monitor Exams**: Track all ongoing exams in real-time

### For Teachers

1. **Login** with teacher credentials
2. **Create Course**: Set up your course with details
3. **Create Exam**: Define exam parameters (duration, marks, schedule)
4. **Add Questions**:
   - Manually add questions one by one
   - Upload images for visual questions
   - Bulk import questions via CSV/Excel
5. **Enable Features**: Toggle question randomization, set time limits
6. **Monitor Live**: Watch students take exams in real-time
7. **Review Results**: Access detailed performance analytics

### For Students

1. **Login** with student credentials
2. **View Courses**: See enrolled courses and available exams
3. **Take Exam**:
   - Read instructions carefully
   - Enable fullscreen mode if required
   - Answer questions within time limit
   - Submit before timeout
4. **View Results**: Check scores and review answers

---

## 📚 API Documentation

### Authentication Endpoints

```
POST   /api/auth/register      - Register new user
POST   /api/auth/login         - Login user
GET    /api/auth/me            - Get current user
PUT    /api/auth/updateprofile - Update user profile
PUT    /api/auth/updatepassword- Change password
```

### User Management Endpoints

```
GET    /api/users              - Get all users (Admin)
GET    /api/users/:id          - Get user by ID
POST   /api/users              - Create user (Admin)
PUT    /api/users/:id          - Update user (Admin)
DELETE /api/users/:id          - Delete user (Admin)
GET    /api/users/export/csv   - Export users to CSV (Admin)
POST   /api/users/import/csv   - Import users from CSV (Admin)
```

### Course Endpoints

```
GET    /api/courses            - Get all courses
GET    /api/courses/:id        - Get course by ID
POST   /api/courses            - Create course (Admin/Teacher)
PUT    /api/courses/:id        - Update course (Admin/Teacher)
DELETE /api/courses/:id        - Delete course (Admin)
POST   /api/courses/:id/enroll - Enroll student
```

### Exam Endpoints

```
GET    /api/exams              - Get all exams
GET    /api/exams/:id          - Get exam by ID
POST   /api/exams              - Create exam (Admin/Teacher)
PUT    /api/exams/:id          - Update exam (Admin/Teacher)
DELETE /api/exams/:id          - Delete exam (Admin/Teacher)
GET    /api/exams/:id/start    - Start exam (Student)
POST   /api/exams/:id/submit   - Submit exam (Student)
```

### Question Endpoints

```
GET    /api/questions          - Get questions by exam
GET    /api/questions/:id      - Get question by ID
POST   /api/questions          - Create question (Admin/Teacher)
PUT    /api/questions/:id      - Update question (Admin/Teacher)
DELETE /api/questions/:id      - Delete question (Admin/Teacher)
POST   /api/questions/upload   - Bulk upload questions (Admin/Teacher)
```

### Result Endpoints

```
GET    /api/results            - Get all results
GET    /api/results/:id        - Get result by ID
GET    /api/results/exam/:examId - Get results by exam
GET    /api/results/student/:studentId - Get results by student
```

### WebSocket Events

```
connect                - Client connects to server
disconnect             - Client disconnects
join-exam              - Student joins exam room
leave-exam             - Student leaves exam room
exam-progress          - Student progress update
violation-detected     - Anti-cheating violation
monitor-exam           - Teacher monitors exam
```

---

## 🎨 Screenshots

### Admin Dashboard

_Comprehensive user management and system analytics_

### Teacher Dashboard

_Create exams, manage questions, and monitor students_

### Live Exam Monitoring

_Real-time tracking of student progress and violations_

### Student Exam Interface

_Clean, distraction-free exam taking experience_

### Analytics Dashboard

_Detailed performance insights and visualizations_

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors

- **Your Name** - _Initial work_ - [YourGitHub](https://github.com/yourusername)

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI framework
- [Node.js](https://nodejs.org/) - Runtime environment
- [MongoDB](https://www.mongodb.com/) - Database
- [Socket.IO](https://socket.io/) - Real-time communication
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Recharts](https://recharts.org/) - Charting library

---

## 📞 Support

For support, email support@example.com or open an issue in the repository.

---

<div align="center">

**Made with ❤️ by Your Team**

[⬆ Back to Top](#-online-exam-system)

</div>
