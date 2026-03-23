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

      // Users notifications - show actual new/pending users
      if (userRole === "admin") {
        try {
          const response = await usersApi.getAll();
          const users = response.data?.users || [];

          // Count users created in the last 7 days as "new"
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);

          const newUsers = users.filter((user) => {
            const createdDate = new Date(user.createdAt);
            return createdDate > weekAgo;
          }).length;

          if (newUsers > 0) {
            notifications["/users"] = { count: newUsers, type: "info" };
          }
        } catch (error) {
          console.warn("Failed to fetch user notifications:", error);
        }
      }

      // Exams notifications - show draft/unpublished exams
      if (userRole === "admin" || userRole === "teacher") {
        try {
          const response = await examsApi.getAll();
          const exams = response.data?.exams || [];

          // Count draft or unpublished exams
          const draftExams = exams.filter(
            (exam) => exam.status === "draft" || exam.status === "unpublished",
          ).length;

          if (draftExams > 0) {
            notifications["/exams"] = { count: draftExams, type: "warning" };
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

      // Questions notifications - show questions without exams or needing review
      if (userRole === "admin" || userRole === "teacher") {
        try {
          const response = await questionsApi.getAll();
          const questions = response.data?.questions || [];

          // Count questions that don't have an examId (orphaned questions)
          const orphanedQuestions = questions.filter(
            (question) => !question.examId,
          ).length;

          if (orphanedQuestions > 0) {
            notifications["/questions"] = {
              count: orphanedQuestions,
              type: "warning",
            };
          }
        } catch (error) {
          console.warn("Failed to fetch question notifications:", error);
        }
      }

      // Results notifications - show ungraded or recent results
      try {
        let response;
        if (userRole === "student") {
          // Students use their own endpoint
          response = await resultsApi.getByStudent(userId);
        } else {
          // Admin and teachers can access all results
          response = await resultsApi.getAll();
        }

        const results = response.data?.results || response.data || [];

        if (userRole === "student") {
          // For students, show results from the last 3 days
          const threeDaysAgo = new Date();
          threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

          const recentResults = results.filter((result) => {
            const submittedDate = new Date(result.submittedAt);
            return submittedDate > threeDaysAgo;
          }).length;

          if (recentResults > 0) {
            notifications["/results"] = {
              count: recentResults,
              type: "success",
            };
          }
        } else {
          // For admin/teacher, show results that need grading or attention
          const needsAttention = results.filter(
            (result) => result.status === "pending" || result.needsReview,
          ).length;

          if (needsAttention > 0) {
            notifications["/results"] = {
              count: needsAttention,
              type: "error",
            };
          }
        }
      } catch (error) {
        console.warn("Failed to fetch result notifications:", error);
      }

      // Enrollments notifications - show pending enrollments
      if (userRole === "admin" || userRole === "teacher") {
        try {
          const response = await enrollmentsApi.getAll();
          const enrollments = response.data?.enrollments || [];

          // Count pending enrollments
          const pendingEnrollments = enrollments.filter(
            (enrollment) => enrollment.status === "pending",
          ).length;

          if (pendingEnrollments > 0) {
            notifications["/enrollments"] = {
              count: pendingEnrollments,
              type: "info",
            };
          }
        } catch (error) {
          console.warn("Failed to fetch enrollment notifications:", error);
        }
      }

      // Analytics notifications - show if there are new analytics data
      if (userRole === "admin" || userRole === "teacher") {
        // Check if there's new data to analyze (simplified check)
        const hasNewData = Object.keys(notifications).length > 0;
        if (hasNewData) {
          notifications["/analytics"] = { count: 1, type: "info" };
        }
      }

      return notifications;
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
      return {};
    }
  },

  // Get specific notification counts with better logic
  async getUserNotifications() {
    try {
      const response = await usersApi.getAll();
      const users = response.data?.users || [];

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      return users.filter((user) => {
        const createdDate = new Date(user.createdAt);
        return createdDate > weekAgo;
      }).length;
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
        const exams = response.data?.exams || [];
        return exams.filter(
          (exam) => exam.status === "draft" || exam.status === "unpublished",
        ).length;
      }
    } catch (error) {
      console.warn("Failed to fetch exam notifications:", error);
      return 0;
    }
  },

  async getQuestionNotifications() {
    try {
      const response = await questionsApi.getAll();
      const questions = response.data?.questions || [];
      return questions.filter((question) => !question.examId).length;
    } catch (error) {
      console.warn("Failed to fetch question notifications:", error);
      return 0;
    }
  },

  async getResultNotifications(userRole, userId) {
    try {
      let response;
      if (userRole === "student") {
        response = await resultsApi.getByStudent(userId);
      } else {
        response = await resultsApi.getAll();
      }

      const results = response.data?.results || response.data || [];

      if (userRole === "student") {
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        return results.filter((result) => {
          const submittedDate = new Date(result.submittedAt);
          return submittedDate > threeDaysAgo;
        }).length;
      } else {
        return results.filter(
          (result) => result.status === "pending" || result.needsReview,
        ).length;
      }
    } catch (error) {
      console.warn("Failed to fetch result notifications:", error);
      return 0;
    }
  },

  async getEnrollmentNotifications() {
    try {
      const response = await enrollmentsApi.getAll();
      const enrollments = response.data?.enrollments || [];
      return enrollments.filter((enrollment) => enrollment.status === "pending")
        .length;
    } catch (error) {
      console.warn("Failed to fetch enrollment notifications:", error);
      return 0;
    }
  },
};
