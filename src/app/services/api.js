import axios from 'axios';

// Mock API base URL
const API_BASE_URL = 'https://api.example.com';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock data
const MOCK_USERS = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@exam.com',
    password: 'admin123',
    role: 'admin',
    status: 'active',
  },
  {
    id: 2,
    name: 'John Teacher',
    email: 'teacher@exam.com',
    password: 'teacher123',
    role: 'teacher',
    status: 'active',
  },
  {
    id: 3,
    name: 'Jane Student',
    email: 'student@exam.com',
    password: 'student123',
    role: 'student',
    status: 'active',
  },
  {
    id: 4,
    name: 'Sarah Smith',
    email: 'sarah@exam.com',
    password: 'student123',
    role: 'student',
    status: 'active',
  },
  {
    id: 5,
    name: 'Mike Johnson',
    email: 'mike@exam.com',
    password: 'teacher123',
    role: 'teacher',
    status: 'active',
  },
];

const MOCK_COURSES = [
  {
    id: 1,
    name: 'Mathematics 101',
    description: 'Introduction to Algebra and Calculus',
    teacherId: 2,
    teacherName: 'John Teacher',
    studentsCount: 45,
    createdAt: '2026-01-15',
  },
  {
    id: 2,
    name: 'Physics Advanced',
    description: 'Classical and Modern Physics',
    teacherId: 5,
    teacherName: 'Mike Johnson',
    studentsCount: 32,
    createdAt: '2026-02-01',
  },
  {
    id: 3,
    name: 'Computer Science',
    description: 'Data Structures and Algorithms',
    teacherId: 2,
    teacherName: 'John Teacher',
    studentsCount: 58,
    createdAt: '2026-01-20',
  },
];

const MOCK_EXAMS = [
  {
    id: 1,
    title: 'Mathematics Midterm',
    courseId: 1,
    courseName: 'Mathematics 101',
    duration: 90,
    totalMarks: 100,
    passingMarks: 40,
    startTime: '2026-03-15T09:00:00',
    endTime: '2026-03-15T10:30:00',
    status: 'published',
    questionsCount: 20,
  },
  {
    id: 2,
    title: 'Physics Quiz 1',
    courseId: 2,
    courseName: 'Physics Advanced',
    duration: 45,
    totalMarks: 50,
    passingMarks: 20,
    startTime: '2026-03-20T14:00:00',
    endTime: '2026-03-20T14:45:00',
    status: 'published',
    questionsCount: 10,
  },
  {
    id: 3,
    title: 'CS Final Exam',
    courseId: 3,
    courseName: 'Computer Science',
    duration: 120,
    totalMarks: 150,
    passingMarks: 60,
    startTime: '2026-04-01T10:00:00',
    endTime: '2026-04-01T12:00:00',
    status: 'draft',
    questionsCount: 30,
  },
];

const MOCK_QUESTIONS = [
  {
    id: 1,
    examId: 1,
    questionText: 'What is the derivative of x²?',
    optionA: '2x',
    optionB: 'x',
    optionC: '2',
    optionD: 'x²',
    correctAnswer: 'A',
    marks: 5,
  },
  {
    id: 2,
    examId: 1,
    questionText: 'What is the integral of 1/x?',
    optionA: 'x²',
    optionB: 'ln|x| + C',
    optionC: '1/x²',
    optionD: 'e^x',
    correctAnswer: 'B',
    marks: 5,
  },
  {
    id: 3,
    examId: 2,
    questionText: 'What is the speed of light in vacuum?',
    optionA: '3 × 10⁸ m/s',
    optionB: '2 × 10⁸ m/s',
    optionC: '4 × 10⁸ m/s',
    optionD: '1 × 10⁸ m/s',
    correctAnswer: 'A',
    marks: 5,
  },
];

const MOCK_RESULTS = [
  {
    id: 1,
    examId: 1,
    examName: 'Mathematics Midterm',
    studentId: 3,
    studentName: 'Jane Student',
    score: 85,
    totalMarks: 100,
    percentage: 85,
    status: 'passed',
    submittedAt: '2026-03-15T10:25:00',
  },
  {
    id: 2,
    examId: 2,
    examName: 'Physics Quiz 1',
    studentId: 3,
    studentName: 'Jane Student',
    score: 42,
    totalMarks: 50,
    percentage: 84,
    status: 'passed',
    submittedAt: '2026-03-20T14:40:00',
  },
  {
    id: 3,
    examId: 1,
    examName: 'Mathematics Midterm',
    studentId: 4,
    studentName: 'Sarah Smith',
    score: 35,
    totalMarks: 100,
    percentage: 35,
    status: 'failed',
    submittedAt: '2026-03-15T10:28:00',
  },
];

// Mock API functions
export const authApi = {
  login: async (email, password) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
    
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return { data: { user: userWithoutPassword, token: 'mock-jwt-token' } };
    } else {
      throw new Error('Invalid credentials');
    }
  },
  
  register: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    const newUser = {
      id: MOCK_USERS.length + 1,
      ...userData,
      status: 'active',
    };
    
    MOCK_USERS.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return { data: { user: userWithoutPassword, token: 'mock-jwt-token' } };
  },
};

export const usersApi = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: MOCK_USERS.map(({ password, ...user }) => user) };
  },
  
  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const user = MOCK_USERS.find((u) => u.id === id);
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return { data: userWithoutPassword };
    }
    throw new Error('User not found');
  },
  
  create: async (userData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newUser = {
      id: MOCK_USERS.length + 1,
      ...userData,
      status: 'active',
    };
    MOCK_USERS.push(newUser);
    const { password, ...userWithoutPassword } = newUser;
    return { data: userWithoutPassword };
  },
  
  update: async (id, userData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_USERS.findIndex((u) => u.id === id);
    if (index !== -1) {
      MOCK_USERS[index] = { ...MOCK_USERS[index], ...userData };
      const { password, ...userWithoutPassword } = MOCK_USERS[index];
      return { data: userWithoutPassword };
    }
    throw new Error('User not found');
  },
  
  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_USERS.findIndex((u) => u.id === id);
    if (index !== -1) {
      MOCK_USERS.splice(index, 1);
      return { data: { message: 'User deleted successfully' } };
    }
    throw new Error('User not found');
  },
};

export const coursesApi = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: MOCK_COURSES };
  },
  
  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const course = MOCK_COURSES.find((c) => c.id === id);
    if (course) return { data: course };
    throw new Error('Course not found');
  },
  
  create: async (courseData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const teacher = MOCK_USERS.find((u) => u.id === courseData.teacherId);
    const newCourse = {
      id: MOCK_COURSES.length + 1,
      ...courseData,
      teacherName: teacher?.name || 'Unknown',
      studentsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
    };
    MOCK_COURSES.push(newCourse);
    return { data: newCourse };
  },
  
  update: async (id, courseData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_COURSES.findIndex((c) => c.id === id);
    if (index !== -1) {
      MOCK_COURSES[index] = { ...MOCK_COURSES[index], ...courseData };
      return { data: MOCK_COURSES[index] };
    }
    throw new Error('Course not found');
  },
  
  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_COURSES.findIndex((c) => c.id === id);
    if (index !== -1) {
      MOCK_COURSES.splice(index, 1);
      return { data: { message: 'Course deleted successfully' } };
    }
    throw new Error('Course not found');
  },
};

export const examsApi = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: MOCK_EXAMS };
  },
  
  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const exam = MOCK_EXAMS.find((e) => e.id === id);
    if (exam) return { data: exam };
    throw new Error('Exam not found');
  },
  
  create: async (examData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const course = MOCK_COURSES.find((c) => c.id === examData.courseId);
    const newExam = {
      id: MOCK_EXAMS.length + 1,
      ...examData,
      courseName: course?.name || 'Unknown',
      questionsCount: 0,
    };
    MOCK_EXAMS.push(newExam);
    return { data: newExam };
  },
  
  update: async (id, examData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_EXAMS.findIndex((e) => e.id === id);
    if (index !== -1) {
      MOCK_EXAMS[index] = { ...MOCK_EXAMS[index], ...examData };
      return { data: MOCK_EXAMS[index] };
    }
    throw new Error('Exam not found');
  },
  
  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_EXAMS.findIndex((e) => e.id === id);
    if (index !== -1) {
      MOCK_EXAMS.splice(index, 1);
      return { data: { message: 'Exam deleted successfully' } };
    }
    throw new Error('Exam not found');
  },
  
  submit: async (examId, answers) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    // Calculate score based on answers
    const questions = MOCK_QUESTIONS.filter((q) => q.examId === examId);
    let score = 0;
    
    questions.forEach((question) => {
      if (answers[question.id] === question.correctAnswer) {
        score += question.marks;
      }
    });
    
    const exam = MOCK_EXAMS.find((e) => e.id === examId);
    const result = {
      id: MOCK_RESULTS.length + 1,
      examId,
      examName: exam?.title || 'Unknown',
      studentId: 3,
      studentName: 'Current Student',
      score,
      totalMarks: exam?.totalMarks || 100,
      percentage: Math.round((score / (exam?.totalMarks || 100)) * 100),
      status: score >= (exam?.passingMarks || 40) ? 'passed' : 'failed',
      submittedAt: new Date().toISOString(),
    };
    
    MOCK_RESULTS.push(result);
    return { data: result };
  },
};

export const questionsApi = {
  getAll: async (examId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    if (examId) {
      return { data: MOCK_QUESTIONS.filter((q) => q.examId === examId) };
    }
    return { data: MOCK_QUESTIONS };
  },
  
  getById: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const question = MOCK_QUESTIONS.find((q) => q.id === id);
    if (question) return { data: question };
    throw new Error('Question not found');
  },
  
  create: async (questionData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const newQuestion = {
      id: MOCK_QUESTIONS.length + 1,
      ...questionData,
    };
    MOCK_QUESTIONS.push(newQuestion);
    return { data: newQuestion };
  },
  
  update: async (id, questionData) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_QUESTIONS.findIndex((q) => q.id === id);
    if (index !== -1) {
      MOCK_QUESTIONS[index] = { ...MOCK_QUESTIONS[index], ...questionData };
      return { data: MOCK_QUESTIONS[index] };
    }
    throw new Error('Question not found');
  },
  
  delete: async (id) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    const index = MOCK_QUESTIONS.findIndex((q) => q.id === id);
    if (index !== -1) {
      MOCK_QUESTIONS.splice(index, 1);
      return { data: { message: 'Question deleted successfully' } };
    }
    throw new Error('Question not found');
  },
};

export const resultsApi = {
  getAll: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: MOCK_RESULTS };
  },
  
  getByStudent: async (studentId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: MOCK_RESULTS.filter((r) => r.studentId === studentId) };
  },
  
  getByExam: async (examId) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { data: MOCK_RESULTS.filter((r) => r.examId === examId) };
  },
};

export const dashboardApi = {
  getAdminStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: {
        totalStudents: MOCK_USERS.filter((u) => u.role === 'student').length,
        totalTeachers: MOCK_USERS.filter((u) => u.role === 'teacher').length,
        totalExams: MOCK_EXAMS.length,
        totalCourses: MOCK_COURSES.length,
        recentActivity: [
          { id: 1, action: 'New student registered', user: 'Sarah Smith', time: '2 hours ago' },
          { id: 2, action: 'Exam completed', user: 'Jane Student', time: '5 hours ago' },
          { id: 3, action: 'Course created', user: 'John Teacher', time: '1 day ago' },
        ],
        examPerformance: [
          { name: 'Math', passed: 75, failed: 25 },
          { name: 'Physics', passed: 80, failed: 20 },
          { name: 'CS', passed: 70, failed: 30 },
        ],
      },
    };
  },
  
  getTeacherStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: {
        totalCourses: 3,
        totalExams: 5,
        totalStudents: 120,
        avgScore: 78,
      },
    };
  },
  
  getStudentStats: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return {
      data: {
        enrolledCourses: 4,
        completedExams: 8,
        upcomingExams: 3,
        avgScore: 85,
      },
    };
  },
};

export default api;
