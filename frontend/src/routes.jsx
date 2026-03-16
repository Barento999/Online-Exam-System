import { createBrowserRouter, Navigate } from "react-router";
import { ProtectedRoute } from "@/routes/ProtectedRoute";

// Auth Pages
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { Unauthorized } from "@/pages/Unauthorized";

// Dashboard Pages
import { AdminDashboard } from "@/pages/AdminDashboard";
import { TeacherDashboard } from "@/pages/TeacherDashboard";
import { StudentDashboard } from "@/pages/StudentDashboard";

// Other Pages
import { Users } from "@/pages/Users";
import { Courses } from "@/pages/Courses";
import { Exams } from "@/pages/Exams";
import { Questions } from "@/pages/Questions";
import { TakeExam } from "@/pages/TakeExam";
import { ExamMonitoring } from "@/pages/ExamMonitoring";
import { Results } from "@/pages/Results";
import { Enrollments } from "@/pages/Enrollments";
import { Analytics } from "@/pages/Analytics";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { BreadcrumbsDemo } from "@/components/common/BreadcrumbsDemo";
import { DragDropDemo } from "@/pages/DragDropDemo";

// Dashboard Router Component
const DashboardRouter = () => {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case "admin":
      return <AdminDashboard />;
    case "teacher":
      return <TeacherDashboard />;
    case "student":
      return <StudentDashboard />;
    default:
      return <Navigate to="/login" replace />;
  }
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <DashboardRouter />
      </ProtectedRoute>
    ),
  },
  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Users />
      </ProtectedRoute>
    ),
  },
  {
    path: "/courses",
    element: (
      <ProtectedRoute allowedRoles={["admin", "teacher"]}>
        <Courses />
      </ProtectedRoute>
    ),
  },
  {
    path: "/enrollments",
    element: (
      <ProtectedRoute allowedRoles={["admin", "teacher"]}>
        <Enrollments />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams",
    element: (
      <ProtectedRoute>
        <Exams />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/create",
    element: (
      <ProtectedRoute allowedRoles={["admin", "teacher"]}>
        <Exams />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/:examId/take",
    element: (
      <ProtectedRoute allowedRoles={["student"]}>
        <TakeExam />
      </ProtectedRoute>
    ),
  },
  {
    path: "/exams/:examId/monitor",
    element: (
      <ProtectedRoute allowedRoles={["admin", "teacher"]}>
        <ExamMonitoring />
      </ProtectedRoute>
    ),
  },
  {
    path: "/questions",
    element: (
      <ProtectedRoute allowedRoles={["admin", "teacher"]}>
        <Questions />
      </ProtectedRoute>
    ),
  },
  {
    path: "/results",
    element: (
      <ProtectedRoute>
        <Results />
      </ProtectedRoute>
    ),
  },
  {
    path: "/analytics",
    element: (
      <ProtectedRoute allowedRoles={["admin", "teacher"]}>
        <Analytics />
      </ProtectedRoute>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/settings",
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Settings />
      </ProtectedRoute>
    ),
  },
  {
    path: "/breadcrumbs-demo",
    element: (
      <ProtectedRoute>
        <BreadcrumbsDemo />
      </ProtectedRoute>
    ),
  },
  {
    path: "/drag-drop-demo",
    element: (
      <ProtectedRoute>
        <DragDropDemo />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <Navigate to="/login" replace />,
  },
]);
