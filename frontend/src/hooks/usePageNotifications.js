import { useEffect } from "react";
import { useLocation } from "react-router";
import { useNotificationContext } from "@/context/NotificationContext";

/**
 * Hook to automatically clear notifications when user visits a page
 * @param {string} path - The path to clear notifications for (optional, defaults to current path)
 */
export const usePageNotifications = (path) => {
  const location = useLocation();
  const { clearNotification } = useNotificationContext();

  useEffect(() => {
    const pathToClear = path || location.pathname;

    // Clear notification for the current page
    clearNotification(pathToClear);
  }, [location.pathname, path, clearNotification]);
};

/**
 * Hook to manually manage notifications for a page
 */
export const useNotificationManager = () => {
  const {
    setNotification,
    incrementNotification,
    decrementNotification,
    clearNotification,
    getNotification,
  } = useNotificationContext();

  return {
    setNotification,
    incrementNotification,
    decrementNotification,
    clearNotification,
    getNotification,

    // Helper methods for common notification scenarios
    addUserNotification: (count = 1) => incrementNotification("/users", count),
    addExamNotification: (count = 1) => incrementNotification("/exams", count),
    addQuestionNotification: (count = 1) =>
      incrementNotification("/questions", count),
    addResultNotification: (count = 1) =>
      incrementNotification("/results", count),
    addEnrollmentNotification: (count = 1) =>
      incrementNotification("/enrollments", count),

    clearUserNotifications: () => clearNotification("/users"),
    clearExamNotifications: () => clearNotification("/exams"),
    clearQuestionNotifications: () => clearNotification("/questions"),
    clearResultNotifications: () => clearNotification("/results"),
    clearEnrollmentNotifications: () => clearNotification("/enrollments"),
  };
};
