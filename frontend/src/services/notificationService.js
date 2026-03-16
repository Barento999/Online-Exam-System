import {
  usersApi,
  examsApi,
  questionsApi,
  resultsApi,
  enrollmentsApi,
} from "./api";

export const notificationService = {
  // Get notification counts for all menu items
  async getNotificationCounts(userRole) {
    try {
      const notifications = {};

      // Users notifications (for admin - get total users for demo, in real app this would be pending users)
      if (userRole === "admin") {
        try {
          const response = await usersApi.getAll();
          const totalUsers =
            response.data?.total || response.data?.users?.length || 0;
          if (totalUsers > 0) {
            // For demo purposes, show a portion as "new" users
            const newUsers = Math.min(totalUsers, 5);
            notifications["/users"] = { count: newUsers, type: "info" };
          }
        } catch (error) {
          console.warn("Failed to fetch user notifications:", error);
        }
      }

      // Exams notifications
      if (userRole === "admin" || userRole === "teacher") {
        try {
          const response = await examsApi.getAll();
          const totalExams =
            response.data?.total || response.data?.exams?.length || 0;
          if (totalExams > 0) {
            // For demo purposes, show some as "pending review"
            const pendingExams = Math.min(totalExams, 3);
            notifications["/exams"] = { count: pendingExams, type: "warning" };
          }
        } catch (error) {
          console.warn("Failed to fetch exam notifications:", error);
        }
      }

      // Available exams for students
      if (userRole === "student") {
        try {
          const response = await examsApi.getAvailable();
          const availableExams = response.data?.length || 0;
          if (availableExams > 0) {
            notifications["/exams"] = {
              count: availableExams,
              type: "success",
            };
          }
        } catch (error) {
          console.warn("Failed to fetch available exams:", error);
        }
      }

      // Questions notifications
      if (userRole === "admin" || userRole === "teacher") {
        try {
          const response = await questionsApi.getAll();
          const totalQuestions =
            response.data?.total || response.data?.questions?.length || 0;
          if (totalQuestions > 0) {
            // For demo purposes, show some as "needs review"
            const questionsNeedingReview = Math.min(totalQuestions, 8);
            notifications["/questions"] = {
              count: questionsNeedingReview,
              type: "success",
            };
          }
        } catch (error) {
          console.warn("Failed to fetch question notifications:", error);
        }
      }

      // Results notifications
      try {
        const response = await resultsApi.getAll();
        const totalResults =
          response.data?.total || response.data?.results?.length || 0;
        if (totalResults > 0) {
          if (userRole === "student") {
            // For students, show new results
            const newResults = Math.min(totalResults, 2);
            notifications["/results"] = { count: newResults, type: "success" };
          } else {
            // For admin/teacher, show results needing attention
            const resultsNeedingAttention = Math.min(totalResults, 4);
            notifications["/results"] = {
              count: resultsNeedingAttention,
              type: "error",
            };
          }
        }
      } catch (error) {
        console.warn("Failed to fetch result notifications:", error);
      }

      // Enrollments notifications (for admin/teacher)
      if (userRole === "admin" || userRole === "teacher") {
        try {
          const response = await enrollmentsApi.getAll();
          const totalEnrollments =
            response.data?.total || response.data?.enrollments?.length || 0;
          if (totalEnrollments > 0) {
            // For demo purposes, show some as "pending approval"
            const pendingEnrollments = Math.min(totalEnrollments, 6);
            notifications["/enrollments"] = {
              count: pendingEnrollments,
              type: "info",
            };
          }
        } catch (error) {
          console.warn("Failed to fetch enrollment notifications:", error);
        }
      }

      // Analytics notifications (for admin/teacher)
      if (userRole === "admin" || userRole === "teacher") {
        // For demo purposes, show analytics updates
        notifications["/analytics"] = { count: 1, type: "info" };
      }

      return notifications;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return {};
    }
  },

  // Get specific notification counts
  async getUserNotifications() {
    try {
      const response = await usersApi.getAll();
      const totalUsers =
        response.data?.total || response.data?.users?.length || 0;
      return Math.min(totalUsers, 5); // Show max 5 as "new" users
    } catch (error) {
      console.warn("Failed to fetch user notifications:", error);
      return 0;
    }
  },

  async getExamNotifications(userRole) {
    try {
      if (userRole === "student") {
        const response = await examsApi.getAvailable();
        return response.data?.length || 0;
      } else {
        const response = await examsApi.getAll();
        const totalExams =
          response.data?.total || response.data?.exams?.length || 0;
        return Math.min(totalExams, 3); // Show max 3 as "pending"
      }
    } catch (error) {
      console.warn("Failed to fetch exam notifications:", error);
      return 0;
    }
  },

  async getQuestionNotifications() {
    try {
      const response = await questionsApi.getAll();
      const totalQuestions =
        response.data?.total || response.data?.questions?.length || 0;
      return Math.min(totalQuestions, 8); // Show max 8 as "needs review"
    } catch (error) {
      console.warn("Failed to fetch question notifications:", error);
      return 0;
    }
  },

  async getResultNotifications(userRole) {
    try {
      const response = await resultsApi.getAll();
      const totalResults =
        response.data?.total || response.data?.results?.length || 0;

      if (userRole === "student") {
        return Math.min(totalResults, 2); // Show max 2 as "new results"
      } else {
        return Math.min(totalResults, 4); // Show max 4 as "needs attention"
      }
    } catch (error) {
      console.warn("Failed to fetch result notifications:", error);
      return 0;
    }
  },

  async getEnrollmentNotifications() {
    try {
      const response = await enrollmentsApi.getAll();
      const totalEnrollments =
        response.data?.total || response.data?.enrollments?.length || 0;
      return Math.min(totalEnrollments, 6); // Show max 6 as "pending"
    } catch (error) {
      console.warn("Failed to fetch enrollment notifications:", error);
      return 0;
    }
  },
};
