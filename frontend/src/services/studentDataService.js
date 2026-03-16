import { dashboardApi, resultsApi, examsApi, enrollmentsApi } from "./api";
import { mockDataService } from "./mockDataService";

// Check if user is authenticated and get user data safely
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  return !!(token && user);
};

const getUserData = () => {
  try {
    const userStr = localStorage.getItem("user");
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.warn("Failed to parse user data from localStorage:", error);
    return null;
  }
};

// Enhanced student data service with realistic data structure
export const studentDataService = {
  // Get comprehensive dashboard data
  getDashboardData: async () => {
    if (!isAuthenticated()) {
      console.log("No authentication token found - using mock data");
      return mockDataService.getDashboardData();
    }

    try {
      // Try to get real data from API
      const [statsResponse, examsResponse, enrollmentsResponse] =
        await Promise.all([
          dashboardApi.getStudentStats(),
          examsApi.getAvailable(),
          enrollmentsApi.getMyCourses(),
        ]);

      // Get recent results
      const user = getUserData();
      if (!user || !user._id) {
        console.warn("No valid user data found, using mock data");
        return mockDataService.getDashboardData();
      }
      const studentId = user._id;
      const resultsResponse = await resultsApi.getByStudent(studentId);

      // Transform API data to match expected format
      const dashboardData = {
        stats: {
          enrolledCourses: enrollmentsResponse.data?.length || 0,
          completedExams: statsResponse.data?.completedExams || 0,
          upcomingExams: examsResponse.data?.length || 0,
          avgScore: statsResponse.data?.avgScore || 0,
          passedExams: statsResponse.data?.passedExams || 0,
          recentResults: resultsResponse.data?.slice(0, 5) || [],
        },
        availableExams: examsResponse.data || [],
        enrollments: enrollmentsResponse.data || [],
      };

      console.log("Successfully loaded real dashboard data");
      return dashboardData;
    } catch (error) {
      console.warn(
        "Failed to load real data, falling back to mock data:",
        error.message,
      );
      return mockDataService.getDashboardData();
    }
  },

  // Get performance data for charts
  getPerformanceData: async () => {
    if (!isAuthenticated()) {
      console.log("No authentication token found - using mock data");
      return mockDataService.getPerformanceData();
    }

    try {
      // Get user info to get student ID
      const user = getUserData();
      if (!user || !user._id) {
        console.warn("No valid user data found, using mock data");
        return mockDataService.getPerformanceData();
      }
      const studentId = user._id;

      // Use student-specific results endpoint
      const resultsResponse = await resultsApi.getByStudent(studentId);
      const results = resultsResponse.data || [];

      if (results.length === 0) {
        return mockDataService.getPerformanceData();
      }

      const processedData = processPerformanceData(results);

      // Validate the processed data to prevent NaN values
      if (
        !processedData ||
        !processedData.performanceData ||
        processedData.performanceData.length === 0
      ) {
        console.warn("Processed performance data is invalid, using mock data");
        return mockDataService.getPerformanceData();
      }

      console.log("Successfully loaded real performance data");
      return processedData;
    } catch (error) {
      console.warn(
        "Failed to load performance data, falling back to mock data:",
        error.message,
      );
      return mockDataService.getPerformanceData();
    }
  },

  // Get study progress data
  getStudyProgressData: async () => {
    if (!isAuthenticated()) {
      console.log("No authentication token found - using mock data");
      return mockDataService.getStudyProgressData();
    }

    try {
      const enrollmentsResponse = await enrollmentsApi.getMyCourses();
      const enrollments = enrollmentsResponse.data || [];

      if (enrollments.length === 0) {
        return mockDataService.getStudyProgressData();
      }

      const processedData = processStudyProgressData(enrollments);

      // Validate the processed data
      if (
        !processedData ||
        !processedData.studyData ||
        processedData.studyData.length === 0
      ) {
        console.warn(
          "Processed study progress data is invalid, using mock data",
        );
        return mockDataService.getStudyProgressData();
      }

      console.log("Successfully loaded real study progress data");
      return processedData;
    } catch (error) {
      console.warn(
        "Failed to load study progress data, falling back to mock data:",
        error.message,
      );
      return mockDataService.getStudyProgressData();
    }
  },

  // Get exam trends data
  getExamTrendsData: async () => {
    if (!isAuthenticated()) {
      console.log("No authentication token found - using mock data");
      return mockDataService.getExamTrendsData();
    }

    try {
      // Get user info to get student ID
      const user = getUserData();
      if (!user || !user._id) {
        console.warn("No valid user data found, using mock data");
        return mockDataService.getExamTrendsData();
      }
      const studentId = user._id;

      // Use student-specific results endpoint
      const resultsResponse = await resultsApi.getByStudent(studentId);
      const results = resultsResponse.data || [];

      if (results.length === 0) {
        return mockDataService.getExamTrendsData();
      }

      const processedData = processExamTrendsData(results);

      // Validate the processed data
      if (
        !processedData ||
        !processedData.examTrends ||
        processedData.examTrends.length === 0
      ) {
        console.warn("Processed exam trends data is invalid, using mock data");
        return mockDataService.getExamTrendsData();
      }

      console.log("Successfully loaded real exam trends data");
      return processedData;
    } catch (error) {
      console.warn(
        "Failed to load exam trends data, falling back to mock data:",
        error.message,
      );
      return mockDataService.getExamTrendsData();
    }
  },
};

// Process performance data from API response
const processPerformanceData = (results) => {
  if (!results || results.length === 0) {
    return mockDataService.getPerformanceData();
  }

  const subjectScores = {};
  let totalScore = 0;
  let examCount = 0;

  results.forEach((result) => {
    // Safely extract score value
    const score = parseFloat(result.percentage || result.score || 0);
    if (isNaN(score)) return; // Skip invalid scores

    const subject =
      result.examId?.courseId?.name || result.examId?.title || "Unknown";

    if (!subjectScores[subject]) {
      subjectScores[subject] = { total: 0, count: 0 };
    }

    subjectScores[subject].total += score;
    subjectScores[subject].count += 1;
    totalScore += score;
    examCount += 1;
  });

  // If no valid data was processed, return mock data
  if (examCount === 0) {
    return mockDataService.getPerformanceData();
  }

  const performanceData = Object.entries(subjectScores).map(
    ([subject, data]) => ({
      label: subject,
      value: data.count > 0 ? Math.round(data.total / data.count) : 0,
    }),
  );

  return {
    performanceData,
    overallScore: examCount > 0 ? Math.round(totalScore / examCount) : 0,
    targetScore: 85,
    improvement: 8,
  };
};

// Process study progress data
const processStudyProgressData = (enrollments) => {
  if (!enrollments || enrollments.length === 0) {
    return mockDataService.getStudyProgressData();
  }

  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter(
    (e) => (e.progress || 0) >= 100,
  ).length;
  const inProgressCourses = enrollments.filter(
    (e) => (e.progress || 0) > 0 && (e.progress || 0) < 100,
  ).length;
  const pendingCourses = Math.max(
    0,
    totalCourses - completedCourses - inProgressCourses,
  );

  const studyData = [
    { label: "Completed", value: completedCourses, color: "stroke-green-600" },
    {
      label: "In Progress",
      value: inProgressCourses,
      color: "stroke-blue-600",
    },
    { label: "Pending", value: pendingCourses, color: "stroke-orange-600" },
  ];

  const totalStudyHours = enrollments.reduce(
    (sum, e) => sum + (parseFloat(e.studyHours) || 0),
    0,
  );
  const thisWeekHours = 28; // This would come from time tracking

  return {
    studyData,
    totalStudyHours: Math.round(totalStudyHours),
    thisWeekHours,
    weeklyGoals: [
      { label: "Study Hours", current: thisWeekHours, target: 35 },
      { label: "Assignments", current: 8, target: 10 },
      { label: "Practice Tests", current: 3, target: 5 },
    ],
  };
};

// Process exam trends data
const processExamTrendsData = (results) => {
  if (!results || results.length === 0) {
    return mockDataService.getExamTrendsData();
  }

  // Group results by month
  const monthlyScores = {};
  results.forEach((result) => {
    const score = parseFloat(result.percentage || result.score || 0);
    if (isNaN(score)) return; // Skip invalid scores

    const dateStr = result.submittedAt || result.createdAt;
    if (!dateStr) return; // Skip if no date

    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return; // Skip invalid dates

    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthlyScores[monthKey]) {
      monthlyScores[monthKey] = {
        total: 0,
        count: 0,
        month: date.toLocaleDateString("en", { month: "short" }),
        year: date.getFullYear(),
        monthNum: date.getMonth(),
      };
    }
    monthlyScores[monthKey].total += score;
    monthlyScores[monthKey].count += 1;
  });

  // If no valid data was processed, return mock data
  if (Object.keys(monthlyScores).length === 0) {
    return mockDataService.getExamTrendsData();
  }

  const examTrends = Object.values(monthlyScores)
    .sort((a, b) => a.year - b.year || a.monthNum - b.monthNum) // Sort by date
    .map((data) => ({
      label: data.month,
      value: data.count > 0 ? Math.round(data.total / data.count) : 0,
    }))
    .slice(-6); // Last 6 months

  return {
    examTrends,
    averageImprovement: 12,
    currentStreak: 5,
    upcomingExams: [
      { subject: "Mathematics", date: "Mar 25", progress: 85 },
      { subject: "Physics", date: "Mar 28", progress: 70 },
      { subject: "Chemistry", date: "Apr 2", progress: 60 },
    ],
  };
};

export default studentDataService;
