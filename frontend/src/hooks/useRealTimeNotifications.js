import { useEffect } from "react";
import { useNotificationContext } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { useSocket } from "@/context/SocketContext";

/**
 * Hook for real-time notification updates via WebSocket
 * Integrates with the existing SocketContext to listen for notification events
 */
export const useRealTimeNotifications = () => {
  const { incrementNotification, setNotification } = useNotificationContext();
  const { user } = useAuth();
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket || !user) return;

    // Listen for various real-time events that should trigger notifications
    const handleNewUser = (data) => {
      if (user.role === "admin") {
        incrementNotification("/users", 1);
      }
    };

    const handleExamCreated = (data) => {
      if (user.role === "admin" || user.role === "teacher") {
        incrementNotification("/exams", 1);
      }
    };

    const handleExamSubmitted = (data) => {
      if (user.role === "admin" || user.role === "teacher") {
        incrementNotification("/results", 1);
      }
    };

    const handleQuestionAdded = (data) => {
      if (user.role === "admin" || user.role === "teacher") {
        incrementNotification("/questions", 1);
      }
    };

    const handleNewEnrollment = (data) => {
      if (user.role === "admin" || user.role === "teacher") {
        incrementNotification("/enrollments", 1);
      }
    };

    const handleResultPublished = (data) => {
      if (user.role === "student" && data.studentId === user._id) {
        incrementNotification("/results", 1);
      }
    };

    const handleSystemAlert = (data) => {
      // System alerts for admins
      if (user.role === "admin") {
        setNotification("/settings", 1, "error");
      }
    };

    const handleExamAvailable = (data) => {
      // New exam available for students
      if (user.role === "student") {
        incrementNotification("/exams", 1);
      }
    };

    // Register event listeners
    socket.on("user:registered", handleNewUser);
    socket.on("exam:created", handleExamCreated);
    socket.on("exam:submitted", handleExamSubmitted);
    socket.on("question:added", handleQuestionAdded);
    socket.on("enrollment:created", handleNewEnrollment);
    socket.on("result:published", handleResultPublished);
    socket.on("system:alert", handleSystemAlert);
    socket.on("exam:available", handleExamAvailable);

    // Cleanup listeners on unmount
    return () => {
      socket.off("user:registered", handleNewUser);
      socket.off("exam:created", handleExamCreated);
      socket.off("exam:submitted", handleExamSubmitted);
      socket.off("question:added", handleQuestionAdded);
      socket.off("enrollment:created", handleNewEnrollment);
      socket.off("result:published", handleResultPublished);
      socket.off("system:alert", handleSystemAlert);
      socket.off("exam:available", handleExamAvailable);
    };
  }, [socket, user, incrementNotification, setNotification]);
};

/**
 * Hook for triggering notifications based on user actions
 * Use this in components where users perform actions that should notify others
 */
export const useNotificationTriggers = () => {
  const { socket } = useSocket();
  const { user } = useAuth();

  const triggerUserRegistration = (userData) => {
    if (socket) {
      socket.emit("user:registered", { user: userData, triggeredBy: user._id });
    }
  };

  const triggerExamCreation = (examData) => {
    if (socket) {
      socket.emit("exam:created", { exam: examData, createdBy: user._id });
    }
  };

  const triggerExamSubmission = (examId, studentId) => {
    if (socket) {
      socket.emit("exam:submitted", {
        examId,
        studentId,
        submittedAt: new Date(),
      });
    }
  };

  const triggerQuestionAdded = (questionData) => {
    if (socket) {
      socket.emit("question:added", {
        question: questionData,
        addedBy: user._id,
      });
    }
  };

  const triggerEnrollment = (enrollmentData) => {
    if (socket) {
      socket.emit("enrollment:created", {
        enrollment: enrollmentData,
        createdBy: user._id,
      });
    }
  };

  const triggerResultPublished = (resultData) => {
    if (socket) {
      socket.emit("result:published", {
        result: resultData,
        publishedBy: user._id,
      });
    }
  };

  const triggerSystemAlert = (alertData) => {
    if (socket && user.role === "admin") {
      socket.emit("system:alert", { alert: alertData, triggeredBy: user._id });
    }
  };

  return {
    triggerUserRegistration,
    triggerExamCreation,
    triggerExamSubmission,
    triggerQuestionAdded,
    triggerEnrollment,
    triggerResultPublished,
    triggerSystemAlert,
  };
};
