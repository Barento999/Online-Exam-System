import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for managing notification badges
 * @returns {Object} Notification management functions and state
 */
export const useNotifications = () => {
  const [notifications, setNotifications] = useState({});

  // Load notifications from localStorage on mount
  useEffect(() => {
    const savedNotifications = localStorage.getItem("sidebar-notifications");
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error("Failed to parse saved notifications:", error);
      }
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(
      "sidebar-notifications",
      JSON.stringify(notifications),
    );
  }, [notifications]);

  /**
   * Add or update a notification
   * @param {string} path - Menu item path
   * @param {number} count - Notification count
   * @param {string} type - Badge type (info, success, warning, error)
   */
  const setNotification = useCallback((path, count, type = "info") => {
    setNotifications((prev) => ({
      ...prev,
      [path]: { count: Math.max(0, count), type },
    }));
  }, []);

  /**
   * Increment notification count
   * @param {string} path - Menu item path
   * @param {number} increment - Amount to increment (default: 1)
   */
  const incrementNotification = useCallback((path, increment = 1) => {
    setNotifications((prev) => {
      const current = prev[path] || { count: 0, type: "info" };
      return {
        ...prev,
        [path]: {
          ...current,
          count: current.count + increment,
        },
      };
    });
  }, []);

  /**
   * Decrement notification count
   * @param {string} path - Menu item path
   * @param {number} decrement - Amount to decrement (default: 1)
   */
  const decrementNotification = useCallback((path, decrement = 1) => {
    setNotifications((prev) => {
      const current = prev[path] || { count: 0, type: "info" };
      return {
        ...prev,
        [path]: {
          ...current,
          count: Math.max(0, current.count - decrement),
        },
      };
    });
  }, []);

  /**
   * Clear notification for a specific path
   * @param {string} path - Menu item path
   */
  const clearNotification = useCallback((path) => {
    setNotifications((prev) => {
      const newNotifications = { ...prev };
      delete newNotifications[path];
      return newNotifications;
    });
  }, []);

  /**
   * Clear all notifications
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications({});
  }, []);

  /**
   * Get notification for a specific path
   * @param {string} path - Menu item path
   * @returns {Object|null} Notification object or null
   */
  const getNotification = useCallback(
    (path) => {
      const notification = notifications[path];
      return notification && notification.count > 0 ? notification : null;
    },
    [notifications],
  );

  /**
   * Get total notification count across all paths
   * @returns {number} Total count
   */
  const getTotalCount = useCallback(() => {
    return Object.values(notifications).reduce((total, notification) => {
      return total + (notification.count || 0);
    }, 0);
  }, [notifications]);

  /**
   * Check if there are any notifications
   * @returns {boolean} True if there are notifications
   */
  const hasNotifications = useCallback(() => {
    return getTotalCount() > 0;
  }, [getTotalCount]);

  /**
   * Get notifications by type
   * @param {string} type - Badge type
   * @returns {Object} Filtered notifications
   */
  const getNotificationsByType = useCallback(
    (type) => {
      return Object.entries(notifications).reduce(
        (filtered, [path, notification]) => {
          if (notification.type === type && notification.count > 0) {
            filtered[path] = notification;
          }
          return filtered;
        },
        {},
      );
    },
    [notifications],
  );

  return {
    notifications,
    setNotification,
    incrementNotification,
    decrementNotification,
    clearNotification,
    clearAllNotifications,
    getNotification,
    getTotalCount,
    hasNotifications,
    getNotificationsByType,
  };
};
