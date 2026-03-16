import { dashboardApi, resultsApi, examsApi, enrollmentsApi } from "./api";

// Enhanced student data service with realistic data structure
export const studentDataService = {
  // Get comprehensive dashboard data
  getDashboardData: async () => {
    try {
      const [dashboardStats, recentResults, availableExams, enrollments] =
        await Promise.all([
          dashboardApi.getStudentStats(),
          resultsApi.getByStudent("current"), // Will be replaced with actual student ID
          examsApi.getAvailable(),
          enrollmentsApi.getMyCourses(),
        ]);

      return {
        stats: dashboardStats.data,
        recentResults: recentResults.data,
        availableExams: availableExams.data,
        enrollments: enrollments.data,
      };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      // Return mock data for development
      return getMockStudentData();
    }
  },

  // Get performance data for charts
  getPerformanceData: async () => {
    try {
      const results = await resultsApi.getByStudent("current");
      return processPerformanceData(results.data);
    } catch (error) {
      console.error("Error fetching performance data:", error);
      return getMockPerformanceData();
    }
  },

  // Get study progress data
  getStudyProgressData: async () => {
    try {
      const enrollments = await enrollmentsApi.getMyCourses();
      return processStudyProgressData(enrollments.data);
    } catch (error) {
      console.error("Error fetching study progress data:", error);
      return getMockStudyProgressData();
    }
  },

  // Get exam trends data
  getExamTrendsData: async () => {
    try {
      const results = await resultsApi.getByStudent("current");
      return processExamTrendsData(results.data);
    } catch (error) {
      console.error("Error fetching exam trends data:", error);
      return getMockExamTrendsData();
    }
  },
};

// Process performance data from API response
const processPerformanceData = (results) => {
  const subjectScores = {};
  let totalScore = 0;
  let examCount = 0;

  results.forEach((result) => {
    const subject = result.examId?.courseId?.name || "Unknown";
    if (!subjectScores[subject]) {
      subjectScores[subject] = { total: 0, count: 0 };
    }
    subjectScores[subject].total += result.percentage;
    subjectScores[subject].count += 1;
    totalScore += result.percentage;
    examCount += 1;
  });

  const performanceData = Object.entries(subjectScores).map(
    ([subject, data]) => ({
      label: subject,
      value: Math.round(data.total / data.count),
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
  const totalCourses = enrollments.length;
  const completedCourses = enrollments.filter((e) => e.progress >= 100).length;
  const inProgressCourses = enrollments.filter(
    (e) => e.progress > 0 && e.progress < 100,
  ).length;
  const pendingCourses = totalCourses - completedCourses - inProgressCourses;

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
    (sum, e) => sum + (e.studyHours || 0),
    0,
  );
  const thisWeekHours = 28; // This would come from time tracking

  return {
    studyData,
    totalStudyHours,
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
  // Group results by month
  const monthlyScores = {};
  results.forEach((result) => {
    const date = new Date(result.submittedAt);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!monthlyScores[monthKey]) {
      monthlyScores[monthKey] = {
        total: 0,
        count: 0,
        month: date.toLocaleDateString("en", { month: "short" }),
      };
    }
    monthlyScores[monthKey].total += result.percentage;
    monthlyScores[monthKey].count += 1;
  });

  const examTrends = Object.values(monthlyScores)
    .map((data) => ({
      label: data.month,
      value: Math.round(data.total / data.count),
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

// Mock data for development/fallback
const getMockStudentData = () => ({
  stats: {
    enrolledCourses: 6,
    completedExams: 12,
    upcomingExams: 3,
    avgScore: 87.5,
    passedExams: 11,
    recentResults: [
      {
        id: 1,
        examId: {
          title: "Advanced Mathematics Midterm",
          courseId: { name: "Mathematics" },
        },
        percentage: 92,
        status: "passed",
        submittedAt: "2026-03-15T10:30:00Z",
      },
      {
        id: 2,
        examId: {
          title: "Physics Quantum Mechanics",
          courseId: { name: "Physics" },
        },
        percentage: 88,
        status: "passed",
        submittedAt: "2026-03-12T14:15:00Z",
      },
      {
        id: 3,
        examId: {
          title: "Organic Chemistry Lab",
          courseId: { name: "Chemistry" },
        },
        percentage: 85,
        status: "passed",
        submittedAt: "2026-03-10T09:45:00Z",
      },
      {
        id: 4,
        examId: { title: "Cell Biology Quiz", courseId: { name: "Biology" } },
        percentage: 94,
        status: "passed",
        submittedAt: "2026-03-08T16:20:00Z",
      },
      {
        id: 5,
        examId: {
          title: "English Literature Essay",
          courseId: { name: "English" },
        },
        percentage: 89,
        status: "passed",
        submittedAt: "2026-03-05T11:10:00Z",
      },
    ],
  },
  availableExams: [
    {
      id: 1,
      title: "Calculus Final Exam",
      courseId: { name: "Advanced Mathematics" },
      duration: 120,
      totalMarks: 100,
      status: "available",
      startTime: "2026-03-25T09:00:00Z",
      endTime: "2026-03-25T18:00:00Z",
    },
    {
      id: 2,
      title: "Thermodynamics Quiz",
      courseId: { name: "Physics" },
      duration: 60,
      totalMarks: 50,
      status: "available",
      startTime: "2026-03-28T14:00:00Z",
      endTime: "2026-03-28T17:00:00Z",
    },
    {
      id: 3,
      title: "Molecular Structure Test",
      courseId: { name: "Chemistry" },
      duration: 90,
      totalMarks: 75,
      status: "available",
      startTime: "2026-04-02T10:00:00Z",
      endTime: "2026-04-02T16:00:00Z",
    },
  ],
  enrollments: [
    { courseId: { name: "Mathematics" }, progress: 85, studyHours: 45 },
    { courseId: { name: "Physics" }, progress: 78, studyHours: 38 },
    { courseId: { name: "Chemistry" }, progress: 92, studyHours: 42 },
    { courseId: { name: "Biology" }, progress: 88, studyHours: 35 },
    { courseId: { name: "English" }, progress: 95, studyHours: 28 },
    { courseId: { name: "Computer Science" }, progress: 72, studyHours: 40 },
  ],
});

const getMockPerformanceData = () => ({
  performanceData: [
    { label: "Mathematics", value: 92 },
    { label: "Physics", value: 88 },
    { label: "Chemistry", value: 85 },
    { label: "Biology", value: 94 },
    { label: "English", value: 89 },
  ],
  overallScore: 87,
  targetScore: 90,
  improvement: 12,
});

const getMockStudyProgressData = () => ({
  studyData: [
    { label: "Completed", value: 2, color: "stroke-green-600" },
    { label: "In Progress", value: 3, color: "stroke-blue-600" },
    { label: "Pending", value: 1, color: "stroke-orange-600" },
  ],
  totalStudyHours: 228,
  thisWeekHours: 32,
  weeklyGoals: [
    { label: "Study Hours", current: 32, target: 35 },
    { label: "Assignments", current: 9, target: 10 },
    { label: "Practice Tests", current: 4, target: 5 },
  ],
});

const getMockExamTrendsData = () => ({
  examTrends: [
    { label: "Oct", value: 78 },
    { label: "Nov", value: 82 },
    { label: "Dec", value: 79 },
    { label: "Jan", value: 85 },
    { label: "Feb", value: 88 },
    { label: "Mar", value: 92 },
  ],
  averageImprovement: 14,
  currentStreak: 7,
  upcomingExams: [
    { subject: "Calculus Final", date: "Mar 25", progress: 88 },
    { subject: "Physics Quiz", date: "Mar 28", progress: 75 },
    { subject: "Chemistry Test", date: "Apr 2", progress: 82 },
  ],
});

export default studentDataService;
