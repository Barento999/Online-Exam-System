import { useEffect } from "react";
import { useNotificationContext } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notificationService";

export const NotificationLoader = () => {
  const { setNotification, clearAllNotifications } = useNotificationContext();
  const { user } = useAuth();

  useEffect(() => {
    const loadNotifications = async () => {
      if (!user?.role) return;

      try {
        // Clear existing notifications first
        clearAllNotifications();

        // Fetch real notification data
        const notifications = await notificationService.getNotificationCounts(
          user.role,
        );

        // Set notifications with a slight delay to show the animation
        Object.entries(notifications).forEach(([path, notification], index) => {
          setTimeout(() => {
            setNotification(path, notification.count, notification.type);
          }, index * 100);
        });
      } catch (error) {
        console.error("Failed to load notifications:", error);
      }
    };

    loadNotifications();

    // Refresh notifications every 5 minutes
    const interval = setInterval(loadNotifications, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [user?.role, setNotification, clearAllNotifications]);

  return null; // This component doesn't render anything
};
