import { useEffect } from "react";
import { useNotificationContext } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notificationService";

/**
 * Hook for real-time notification updates
 * This hook can be used to update notifications when specific actions occur
 */
export const useRealTimeNotifications = () => {
  const { setNotification, incrementNotification, decrementNotification } =
    useNotificationContext();
  const { user } = useAuth();

  // Refresh all notifications
  const refreshNotifications = async () => {
    if (!user?.role) return;

    try {
      const notifications = await notificationService.getNotificationCounts(
        user.role,
      );

      Object.entries(notifications).forEach(([path, notification]) => {
        setNotification(path, notification.count, notification.type);
      });
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    }
  };

  // Specific notification updaters
  const updateUserNotifications = async () => {
    if (user?.role === "admin") {
      try {
        const count = await notificationService.getUserNotifications();
        setNotification("/users", count, "info");
      } catch (error) {
        console.error("Failed to update user notifications:", error);
      }
    }
  };

  const updateExamNotifications = async () => {
    try {
      const count = await notificationService.getExamNotifications(user?.role);
      const type = user?.role === "student" ? "success" : "warning";
      setNotification("/exams", count, type);
    } catch (error) {
      console.error("Failed to update exam notifications:", error);
    }
  };

  const updateQuestionNotifications = async () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      try {
        const count = await notificationService.getQuestionNotifications();
        setNotification("/questions", count, "warning");
      } catch (error) {
        console.error("Failed to update question notifications:", error);
      }
    }
  };

  const updateResultNotifications = async () => {
    try {
      const count = await notificationService.getResultNotifications(
        user?.role,
      );
      const type = user?.role === "student" ? "success" : "error";
      setNotification("/results", count, type);
    } catch (error) {
      console.error("Failed to update result notifications:", error);
    }
  };

  const updateEnrollmentNotifications = async () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      try {
        const count = await notificationService.getEnrollmentNotifications();
        setNotification("/enrollments", count, "info");
      } catch (error) {
        console.error("Failed to update enrollment notifications:", error);
      }
    }
  };

  // Event handlers for common actions
  const handleUserCreated = () => {
    if (user?.role === "admin") {
      incrementNotification("/users", 1);
    }
  };

  const handleExamCreated = () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      incrementNotification("/exams", 1);
    }
  };

  const handleExamPublished = () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      decrementNotification("/exams", 1);
    }
  };

  const handleQuestionCreated = () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      incrementNotification("/questions", 1);
    }
  };

  const handleQuestionAssigned = () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      decrementNotification("/questions", 1);
    }
  };

  const handleResultSubmitted = () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      incrementNotification("/results", 1);
    }
  };

  const handleResultGraded = () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      decrementNotification("/results", 1);
    } else if (user?.role === "student") {
      incrementNotification("/results", 1);
    }
  };

  const handleEnrollmentRequested = () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      incrementNotification("/enrollments", 1);
    }
  };

  const handleEnrollmentApproved = () => {
    if (user?.role === "admin" || user?.role === "teacher") {
      decrementNotification("/enrollments", 1);
    }
  };

  return {
    // Refresh functions
    refreshNotifications,
    updateUserNotifications,
    updateExamNotifications,
    updateQuestionNotifications,
    updateResultNotifications,
    updateEnrollmentNotifications,

    // Event handlers
    handleUserCreated,
    handleExamCreated,
    handleExamPublished,
    handleQuestionCreated,
    handleQuestionAssigned,
    handleResultSubmitted,
    handleResultGraded,
    handleEnrollmentRequested,
    handleEnrollmentApproved,
  };
};
