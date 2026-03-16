// Mock data service for development and fallback scenarios
export const mockDataService = {
  // Get mock dashboard data
  getDashboardData: () => ({
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
          examId: {
            title: "Cell Biology Quiz",
            courseId: { name: "Biology" },
          },
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
  }),

  // Get mock performance data
  getPerformanceData: () => ({
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
  }),

  // Get mock study progress data
  getStudyProgressData: () => ({
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
  }),

  // Get mock exam trends data
  getExamTrendsData: () => ({
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
  }),
};

export default mockDataService;
