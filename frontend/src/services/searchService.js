import {
  usersApi,
  examsApi,
  questionsApi,
  coursesApi,
  resultsApi,
} from "./api";

export const searchService = {
  // Global search across all content types
  async globalSearch(query, userRole, limit = 10) {
    try {
      const results = [];
      const searchPromises = [];

      // Search exams
      searchPromises.push(this.searchExams(query, userRole));

      // Search questions (admin/teacher only)
      if (userRole === "admin" || userRole === "teacher") {
        searchPromises.push(this.searchQuestions(query));
        searchPromises.push(this.searchUsers(query));
        searchPromises.push(this.searchCourses(query));
      }

      // Search courses for students
      if (userRole === "student") {
        searchPromises.push(this.searchCourses(query));
      }

      const searchResults = await Promise.allSettled(searchPromises);

      // Combine and flatten results
      searchResults.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          results.push(...result.value);
        }
      });

      // Sort by relevance and limit results
      return this.sortAndLimitResults(results, query, limit);
    } catch (error) {
      console.error("Global search failed:", error);
      return [];
    }
  },

  // Search exams
  async searchExams(query, userRole) {
    try {
      const response =
        userRole === "student"
          ? await examsApi.getAvailable()
          : await examsApi.getAll();

      const exams = response.data?.exams || response.data || [];

      return exams
        .filter(
          (exam) =>
            exam.title?.toLowerCase().includes(query.toLowerCase()) ||
            exam.description?.toLowerCase().includes(query.toLowerCase()) ||
            exam.subject?.toLowerCase().includes(query.toLowerCase()),
        )
        .map((exam) => ({
          id: exam._id || exam.id,
          type: "exam",
          title: exam.title,
          description:
            exam.description || `${exam.subject} - ${exam.duration} minutes`,
          path: `/exams`, // Navigate to exams list page (items are managed there)
          category: "Exams",
          relevance: this.calculateRelevance(
            query,
            exam.title,
            exam.description,
          ),
          metadata: {
            subject: exam.subject,
            duration: exam.duration,
            status: exam.status,
            questions: exam.questionCount || 0,
            examId: exam._id || exam.id,
          },
        }));
    } catch (error) {
      console.warn("Exam search failed:", error);
      return [];
    }
  },

  // Search questions
  async searchQuestions(query) {
    try {
      const response = await questionsApi.getAll();
      const questions = response.data?.questions || [];

      return questions
        .filter(
          (question) =>
            question.question?.toLowerCase().includes(query.toLowerCase()) ||
            question.subject?.toLowerCase().includes(query.toLowerCase()) ||
            question.topic?.toLowerCase().includes(query.toLowerCase()),
        )
        .map((question) => ({
          id: question._id || question.id,
          type: "question",
          title: question.question?.substring(0, 60) + "...",
          description: `${question.type} - ${question.subject || "General"}`,
          path: `/questions`, // Navigate to questions list page
          category: "Questions",
          relevance: this.calculateRelevance(
            query,
            question.question,
            question.subject,
          ),
          metadata: {
            type: question.type,
            subject: question.subject,
            difficulty: question.difficulty,
            points: question.points,
            questionId: question._id || question.id, // Store ID for future use
          },
        }));
    } catch (error) {
      console.warn("Question search failed:", error);
      return [];
    }
  },

  // Search users
  async searchUsers(query) {
    try {
      const response = await usersApi.getAll();
      const users = response.data?.users || [];

      return users
        .filter(
          (user) =>
            user.name?.toLowerCase().includes(query.toLowerCase()) ||
            user.email?.toLowerCase().includes(query.toLowerCase()) ||
            user.role?.toLowerCase().includes(query.toLowerCase()),
        )
        .map((user) => ({
          id: user._id || user.id,
          type: "user",
          title: user.name,
          description: `${user.role} - ${user.email}`,
          path: `/users`, // Navigate to users list page
          category: "Users",
          relevance: this.calculateRelevance(query, user.name, user.email),
          metadata: {
            role: user.role,
            email: user.email,
            status: user.status,
            joinDate: user.createdAt,
            userId: user._id || user.id, // Store ID for future use
          },
        }));
    } catch (error) {
      console.warn("User search failed:", error);
      return [];
    }
  },

  // Search courses
  async searchCourses(query) {
    try {
      const response = await coursesApi.getAll();
      const courses = response.data?.courses || [];

      return courses
        .filter(
          (course) =>
            course.name?.toLowerCase().includes(query.toLowerCase()) ||
            course.description?.toLowerCase().includes(query.toLowerCase()) ||
            course.code?.toLowerCase().includes(query.toLowerCase()),
        )
        .map((course) => ({
          id: course._id || course.id,
          type: "course",
          title: course.name,
          description: `${course.code} - ${course.description?.substring(0, 50)}...`,
          path: `/courses`, // Navigate to courses list page
          category: "Courses",
          relevance: this.calculateRelevance(
            query,
            course.name,
            course.description,
          ),
          metadata: {
            code: course.code,
            instructor: course.instructor,
            students: course.studentCount || 0,
            status: course.status,
            courseId: course._id || course.id, // Store ID for future use
          },
        }));
    } catch (error) {
      console.warn("Course search failed:", error);
      return [];
    }
  },

  // Calculate relevance score for sorting
  calculateRelevance(query, title = "", description = "") {
    const queryLower = query.toLowerCase();
    const titleLower = title.toLowerCase();
    const descLower = description.toLowerCase();

    let score = 0;

    // Exact title match gets highest score
    if (titleLower === queryLower) score += 100;

    // Title starts with query
    if (titleLower.startsWith(queryLower)) score += 50;

    // Title contains query
    if (titleLower.includes(queryLower)) score += 25;

    // Description contains query
    if (descLower.includes(queryLower)) score += 10;

    // Bonus for shorter titles (more specific)
    if (title.length < 50) score += 5;

    return score;
  },

  // Sort results by relevance and limit
  sortAndLimitResults(results, query, limit) {
    return results.sort((a, b) => b.relevance - a.relevance).slice(0, limit);
  },

  // Get search suggestions based on recent searches or popular content
  async getSearchSuggestions(userRole) {
    try {
      const suggestions = [];

      // Add role-based suggestions
      switch (userRole) {
        case "admin":
          suggestions.push(
            { text: "pending users", type: "filter" },
            { text: "draft exams", type: "filter" },
            { text: "system analytics", type: "page" },
          );
          break;
        case "teacher":
          suggestions.push(
            { text: "my exams", type: "filter" },
            { text: "ungraded results", type: "filter" },
            { text: "question bank", type: "page" },
          );
          break;
        case "student":
          suggestions.push(
            { text: "available exams", type: "filter" },
            { text: "my results", type: "filter" },
            { text: "upcoming exams", type: "filter" },
          );
          break;
      }

      return suggestions;
    } catch (error) {
      console.warn("Failed to get search suggestions:", error);
      return [];
    }
  },

  // Search with filters
  async searchWithFilters(query, filters = {}) {
    try {
      const { type, subject, status, dateRange } = filters;
      let results = await this.globalSearch(query, filters.userRole);

      // Apply filters
      if (type) {
        results = results.filter((result) => result.type === type);
      }

      if (subject) {
        results = results.filter((result) =>
          result.metadata?.subject
            ?.toLowerCase()
            .includes(subject.toLowerCase()),
        );
      }

      if (status) {
        results = results.filter(
          (result) => result.metadata?.status === status,
        );
      }

      // Date range filtering would go here
      if (dateRange) {
        // Implementation depends on your date structure
      }

      return results;
    } catch (error) {
      console.error("Filtered search failed:", error);
      return [];
    }
  },

  // Get recent searches from localStorage
  getRecentSearches() {
    try {
      const recent = localStorage.getItem("recent-searches");
      return recent ? JSON.parse(recent) : [];
    } catch (error) {
      return [];
    }
  },

  // Save search to recent searches
  saveRecentSearch(query) {
    try {
      const recent = this.getRecentSearches();
      const updated = [query, ...recent.filter((q) => q !== query)].slice(
        0,
        10,
      );
      localStorage.setItem("recent-searches", JSON.stringify(updated));
    } catch (error) {
      console.warn("Failed to save recent search:", error);
    }
  },

  // Clear recent searches
  clearRecentSearches() {
    try {
      localStorage.removeItem("recent-searches");
    } catch (error) {
      console.warn("Failed to clear recent searches:", error);
    }
  },
};
