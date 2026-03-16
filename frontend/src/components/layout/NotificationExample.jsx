import { useEffect } from "react";
import { useNotificationContext } from "@/context/NotificationContext";

export const NotificationExample = () => {
  const { setNotification } = useNotificationContext();

  useEffect(() => {
    // Add sample notifications for demonstration
    const sampleNotifications = [
      { path: "/users", count: 3, type: "info" },
      { path: "/exams", count: 5, type: "warning" },
      { path: "/questions", count: 12, type: "success" },
      { path: "/results", count: 2, type: "error" },
      { path: "/analytics", count: 1, type: "info" },
      { path: "/enrollments", count: 7, type: "warning" },
    ];

    // Set notifications with a slight delay to show the animation
    sampleNotifications.forEach((notification, index) => {
      setTimeout(() => {
        setNotification(
          notification.path,
          notification.count,
          notification.type,
        );
      }, index * 200);
    });
  }, [setNotification]);

  return null; // This component doesn't render anything
};
