import axios from "axios";

// API base URL - update this to your backend URL
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

// Auth API
export const authApi = {
  login: async (email, password) => {
    return api.post("/auth/login", { email, password });
  },

  register: async (userData) => {
    return api.post("/auth/register", userData);
  },

  logout: async () => {
    return api.post("/auth/logout");
  },

  getCurrentUser: async () => {
    return api.get("/auth/me");
  },
};

// Users API
export const usersApi = {
  getAll: async () => {
    return api.get("/users");
  },

  getById: async (id) => {
    return api.get(`/users/${id}`);
  },

  create: async (userData) => {
    return api.post("/users", userData);
  },

  update: async (id, userData) => {
    return api.put(`/users/${id}`, userData);
  },

  delete: async (id) => {
    return api.delete(`/users/${id}`);
  },
};

// Courses API
export const coursesApi = {
  getAll: async () => {
    return api.get("/courses");
  },

  getById: async (id) => {
    return api.get(`/courses/${id}`);
  },

  create: async (courseData) => {
    return api.post("/courses", courseData);
  },

  update: async (id, courseData) => {
    return api.put(`/courses/${id}`, courseData);
  },

  delete: async (id) => {
    return api.delete(`/courses/${id}`);
  },

  getStudents: async (id) => {
    return api.get(`/courses/${id}/students`);
  },

  enrollStudent: async (courseId, studentId) => {
    return api.post(`/courses/${courseId}/enroll`, { studentId });
  },
};

// Exams API
export const examsApi = {
  getAll: async () => {
    return api.get("/exams");
  },

  getById: async (id) => {
    return api.get(`/exams/${id}`);
  },

  create: async (examData) => {
    return api.post("/exams", examData);
  },

  update: async (id, examData) => {
    return api.put(`/exams/${id}`, examData);
  },

  delete: async (id) => {
    return api.delete(`/exams/${id}`);
  },

  submit: async (examId, answers) => {
    return api.post(`/exams/${examId}/submit`, { answers });
  },

  getAvailable: async () => {
    return api.get("/exams/available");
  },
};

// Questions API
export const questionsApi = {
  getAll: async (examId) => {
    const url = examId ? `/questions?examId=${examId}` : "/questions";
    return api.get(url);
  },

  getById: async (id) => {
    return api.get(`/questions/${id}`);
  },

  create: async (questionData) => {
    return api.post("/questions", questionData);
  },

  update: async (id, questionData) => {
    return api.put(`/questions/${id}`, questionData);
  },

  delete: async (id) => {
    return api.delete(`/questions/${id}`);
  },

  bulkCreate: async (examId, questions) => {
    return api.post(`/questions/bulk`, { examId, questions });
  },
};

// Results API
export const resultsApi = {
  getAll: async () => {
    return api.get("/results");
  },

  getByStudent: async (studentId) => {
    return api.get(`/results/student/${studentId}`);
  },

  getByExam: async (examId) => {
    return api.get(`/results/exam/${examId}`);
  },

  getById: async (id) => {
    return api.get(`/results/${id}`);
  },

  publishResult: async (id, published) => {
    return api.put(`/results/${id}/publish`, { published });
  },

  bulkPublishResults: async (examId, published) => {
    return api.put(`/results/exam/${examId}/publish`, { published });
  },
};

// Enrollments API
export const enrollmentsApi = {
  getAll: async (params) => {
    const queryString = new URLSearchParams(params).toString();
    return api.get(`/enrollments${queryString ? `?${queryString}` : ""}`);
  },

  getById: async (id) => {
    return api.get(`/enrollments/${id}`);
  },

  enroll: async (studentId, courseId) => {
    return api.post("/enrollments", { studentId, courseId });
  },

  update: async (id, data) => {
    return api.put(`/enrollments/${id}`, data);
  },

  delete: async (id) => {
    return api.delete(`/enrollments/${id}`);
  },

  getMyCourses: async () => {
    return api.get("/enrollments/my-courses");
  },
};

// Dashboard API
export const dashboardApi = {
  getAdminStats: async () => {
    return api.get("/dashboard/admin");
  },

  getTeacherStats: async () => {
    return api.get("/dashboard/teacher");
  },

  getStudentStats: async () => {
    return api.get("/dashboard/student");
  },
};

export default api;
