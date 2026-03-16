// Fallback notification service for demo purposes when API data is not available
export const fallbackNotificationService = {
  getNotificationCounts(userRole) {
    const notifications = {};

    switch (userRole) {
      case "admin":
        notifications["/users"] = { count: 3, type: "info" }; // New user registrations
        notifications["/exams"] = { count: 2, type: "warning" }; // Draft exams needing review
        notifications["/questions"] = { count: 5, type: "warning" }; // Orphaned questions
        notifications["/results"] = { count: 4, type: "error" }; // Results needing attention
        notifications["/enrollments"] = { count: 6, type: "info" }; // Pending enrollments
        notifications["/analytics"] = { count: 1, type: "info" }; // New analytics data
        break;

      case "teacher":
        notifications["/exams"] = { count: 1, type: "warning" }; // Draft exams
        notifications["/questions"] = { count: 3, type: "warning" }; // Questions without exams
        notifications["/results"] = { count: 2, type: "error" }; // Results to grade
        notifications["/enrollments"] = { count: 4, type: "info" }; // Student enrollments
        notifications["/analytics"] = { count: 1, type: "info" }; // Analytics updates
        break;

      case "student":
        notifications["/exams"] = { count: 2, type: "success" }; // Available exams
        notifications["/results"] = { count: 1, type: "success" }; // New results
        break;

      default:
        break;
    }

    return notifications;
  },
};

// Enhanced notification service that tries real data first, then falls back to demo data
export const enhancedNotificationService = {
  async getNotificationCounts(userRole, realNotificationService) {
    try {
      // Try to get real data first
      const realNotifications =
        await realNotificationService.getNotificationCounts(userRole);

      // If we have real data, use it
      if (Object.keys(realNotifications).length > 0) {
        return realNotifications;
      }

      // Otherwise, use fallback demo data
      return fallbackNotificationService.getNotificationCounts(userRole);
    } catch (error) {
      console.warn(
        "Failed to fetch real notifications, using fallback data:",
        error,
      );
      return fallbackNotificationService.getNotificationCounts(userRole);
    }
  },
};
