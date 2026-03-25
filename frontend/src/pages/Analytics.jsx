import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader } from "@/components/common/Loader";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { resultsApi, examsApi, coursesApi } from "@/services/api";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Award,
  Target,
  Activity,
} from "lucide-react";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
];

export const Analytics = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [selectedExam, setSelectedExam] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (results.length > 0) {
      calculateAnalytics();
    }
  }, [results, selectedExam, selectedCourse]);

  const loadData = async () => {
    try {
      let resultsRes, examsRes, coursesRes;

      if (user?.role === "student") {
        // Students see only their own results
        resultsRes = await resultsApi.getByStudent(user._id);
        // Get exams from results
        const studentResults = resultsRes.data.results || resultsRes.data || [];
        setResults(studentResults);
        // Extract unique exams from results
        const uniqueExams = [
          ...new Map(
            studentResults
              .filter((r) => r.examId)
              .map((r) => [r.examId._id || r.examId, r.examId]),
          ).values(),
        ];
        setExams(uniqueExams);
        setCourses([]);
      } else {
        // Admins and teachers see all data
        [resultsRes, examsRes, coursesRes] = await Promise.all([
          resultsApi.getAll(),
          examsApi.getAll(),
          coursesApi.getAll(),
        ]);
        setResults(resultsRes.data.results || resultsRes.data || []);
        setExams(examsRes.data.exams || examsRes.data || []);
        setCourses(coursesRes.data.courses || coursesRes.data || []);
      }
    } catch (error) {
      console.error("Error loading analytics data:", error);
      setResults([]);
      setExams([]);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateAnalytics = () => {
    let filteredResults = results;

    if (selectedExam !== "all") {
      filteredResults = filteredResults.filter(
        (r) => r.examId?._id === selectedExam || r.examId === selectedExam,
      );
    }

    if (selectedCourse !== "all") {
      filteredResults = filteredResults.filter(
        (r) =>
          r.examId?.courseId?._id === selectedCourse ||
          r.examId?.courseId === selectedCourse,
      );
    }

    // Score distribution
    const scoreRanges = {
      "0-20": 0,
      "21-40": 0,
      "41-60": 0,
      "61-80": 0,
      "81-100": 0,
    };

    filteredResults.forEach((result) => {
      const percentage = result.percentage || 0;
      if (percentage <= 20) scoreRanges["0-20"]++;
      else if (percentage <= 40) scoreRanges["21-40"]++;
      else if (percentage <= 60) scoreRanges["41-60"]++;
      else if (percentage <= 80) scoreRanges["61-80"]++;
      else scoreRanges["81-100"]++;
    });

    const scoreDistribution = Object.entries(scoreRanges).map(
      ([range, count]) => ({
        range,
        count,
      }),
    );

    // Pass/Fail statistics
    const passed = filteredResults.filter((r) => r.passed).length;
    const failed = filteredResults.length - passed;
    const passRate =
      filteredResults.length > 0
        ? ((passed / filteredResults.length) * 100).toFixed(1)
        : 0;

    // Average scores by exam
    const examScores = {};
    filteredResults.forEach((result) => {
      const examId = result.examId?._id || result.examId;
      const examTitle =
        result.examId?.title || exams.find((e) => e._id === examId)?.title;
      if (!examScores[examId]) {
        examScores[examId] = { title: examTitle, scores: [], total: 0 };
      }
      examScores[examId].scores.push(result.percentage || 0);
      examScores[examId].total += result.percentage || 0;
    });

    const examPerformance = Object.values(examScores).map((exam) => ({
      name: exam.title || "Unknown",
      average: (exam.total / exam.scores.length).toFixed(1),
      students: exam.scores.length,
    }));

    // Grade distribution
    const grades = { A: 0, B: 0, C: 0, D: 0, F: 0 };
    filteredResults.forEach((result) => {
      const percentage = result.percentage || 0;
      if (percentage >= 90) grades.A++;
      else if (percentage >= 80) grades.B++;
      else if (percentage >= 70) grades.C++;
      else if (percentage >= 60) grades.D++;
      else grades.F++;
    });

    const gradeDistribution = Object.entries(grades).map(([grade, count]) => ({
      grade,
      count,
      percentage:
        filteredResults.length > 0
          ? ((count / filteredResults.length) * 100).toFixed(1)
          : 0,
    }));

    // Performance trends (last 10 exams)
    const recentExams = filteredResults
      .sort(
        (a, b) =>
          new Date(b.submittedAt || b.createdAt) -
          new Date(a.submittedAt || a.createdAt),
      )
      .slice(0, 10)
      .reverse();

    const performanceTrend = recentExams.map((result, index) => ({
      exam: `Exam ${index + 1}`,
      score: result.percentage || 0,
      passed: result.passed ? 1 : 0,
    }));

    // Top performers
    const topPerformers = [...filteredResults]
      .sort((a, b) => (b.percentage || 0) - (a.percentage || 0))
      .slice(0, 5)
      .map((result) => ({
        student: result.studentId?.name || result.studentId?.email || "Unknown",
        exam: result.examId?.title || "Unknown",
        score: result.percentage || 0,
        grade: getGrade(result.percentage || 0),
      }));

    // Statistics
    const avgScore =
      filteredResults.length > 0
        ? (
            filteredResults.reduce((sum, r) => sum + (r.percentage || 0), 0) /
            filteredResults.length
          ).toFixed(1)
        : 0;

    const highestScore = Math.max(
      ...filteredResults.map((r) => r.percentage || 0),
      0,
    );
    const lowestScore = filteredResults.length
      ? Math.min(...filteredResults.map((r) => r.percentage || 0))
      : 0;

    setAnalytics({
      scoreDistribution,
      passFailData: [
        { name: "Passed", value: passed, color: "#10B981" },
        { name: "Failed", value: failed, color: "#EF4444" },
      ],
      examPerformance,
      gradeDistribution,
      performanceTrend,
      topPerformers,
      stats: {
        totalResults: filteredResults.length,
        avgScore,
        passRate,
        highestScore,
        lowestScore,
        passed,
        failed,
      },
    });
  };

  const getGrade = (percentage) => {
    if (percentage >= 90) return "A";
    if (percentage >= 80) return "B";
    if (percentage >= 70) return "C";
    if (percentage >= 60) return "D";
    return "F";
  };

  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">
              {user?.role === "student"
                ? "My Performance Analytics"
                : "Advanced Analytics"}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === "student"
                ? "Track your exam performance"
                : "Comprehensive performance insights"}
            </p>
          </div>
          <DashboardSkeleton />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold">
              {user?.role === "student"
                ? "My Performance Analytics"
                : "Advanced Analytics"}
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              {user?.role === "student"
                ? "Track your exam performance and progress"
                : "Comprehensive performance insights and statistics"}
            </p>
          </div>
        </div>

        {/* Filters - Hide course filter for students */}
        <div className="flex flex-col sm:flex-row gap-4">
          {user?.role !== "student" && courses.length > 0 && (
            <Select value={selectedCourse} onValueChange={setSelectedCourse}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filter by course" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Courses</SelectItem>
                {courses.map((course) => (
                  <SelectItem key={course._id} value={course._id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {exams.length > 0 && (
            <Select value={selectedExam} onValueChange={setSelectedExam}>
              <SelectTrigger className="w-full sm:w-64">
                <SelectValue placeholder="Filter by exam" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Exams</SelectItem>
                {exams.map((exam) => (
                  <SelectItem
                    key={exam._id || exam.id}
                    value={exam._id || exam.id}>
                    {exam.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Key Statistics */}
        {analytics && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Total Results
                      </p>
                      <p className="text-2xl sm:text-3xl font-semibold mt-2">
                        {analytics.stats.totalResults}
                      </p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                      <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Average Score
                      </p>
                      <p className="text-2xl sm:text-3xl font-semibold mt-2">
                        {analytics.stats.avgScore}%
                      </p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
                      <Target className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Pass Rate
                      </p>
                      <p className="text-2xl sm:text-3xl font-semibold mt-2">
                        {analytics.stats.passRate}%
                      </p>
                      <div className="flex items-center gap-1 mt-1">
                        {analytics.stats.passRate >= 70 ? (
                          <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                        ) : (
                          <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                        )}
                        <span className="text-xs text-muted-foreground">
                          {analytics.stats.passed} passed,{" "}
                          {analytics.stats.failed} failed
                        </span>
                      </div>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
                      <Award className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Score Range
                      </p>
                      <p className="text-2xl sm:text-3xl font-semibold mt-2">
                        {analytics.stats.lowestScore}-
                        {analytics.stats.highestScore}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Lowest to Highest
                      </p>
                    </div>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-orange-100 dark:bg-orange-900/20 flex items-center justify-center">
                      <Activity className="h-5 w-5 sm:h-6 sm:w-6 text-orange-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Charts */}
            <Tabs defaultValue="distribution" className="space-y-6">
              <TabsList className="w-full sm:w-auto grid grid-cols-2 sm:flex">
                <TabsTrigger
                  value="distribution"
                  className="text-xs sm:text-sm">
                  Distribution
                </TabsTrigger>
                <TabsTrigger value="performance" className="text-xs sm:text-sm">
                  Performance
                </TabsTrigger>
                <TabsTrigger value="trends" className="text-xs sm:text-sm">
                  Trends
                </TabsTrigger>
                <TabsTrigger value="top" className="text-xs sm:text-sm">
                  Top Performers
                </TabsTrigger>
              </TabsList>

              <TabsContent value="distribution" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Score Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.scoreDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="range" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#3B82F6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Pass/Fail Ratio</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                          <Pie
                            data={analytics.passFailData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={({ name, value }) =>
                              `${name}: ${value} (${((value / analytics.stats.totalResults) * 100).toFixed(1)}%)`
                            }
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value">
                            {analytics.passFailData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2">
                    <CardHeader>
                      <CardTitle>Grade Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.gradeDistribution}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="grade" tick={{ fontSize: 12 }} />
                          <YAxis tick={{ fontSize: 12 }} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#10B981" name="Students" />
                        </BarChart>
                      </ResponsiveContainer>
                      <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
                        {analytics.gradeDistribution.map((grade) => (
                          <div
                            key={grade.grade}
                            className="text-center p-2 sm:p-3 rounded-lg bg-accent">
                            <p className="text-xl sm:text-2xl font-bold">
                              {grade.grade}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {grade.count} students
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {grade.percentage}%
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Average Performance by Exam</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <BarChart data={analytics.examPerformance}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar
                          dataKey="average"
                          fill="#8B5CF6"
                          name="Average Score (%)"
                        />
                        <Bar
                          dataKey="students"
                          fill="#EC4899"
                          name="Students"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="trends" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart data={analytics.performanceTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="exam" tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#3B82F6"
                          fill="#3B82F6"
                          fillOpacity={0.6}
                          name="Score (%)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="top" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {user?.role === "student"
                        ? "Your Best Performances"
                        : "Top 5 Performers"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 sm:space-y-4">
                      {analytics.topPerformers.map((performer, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 rounded-lg bg-accent gap-3 sm:gap-0">
                          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm sm:text-base">
                              #{index + 1}
                            </div>
                            <div className="min-w-0 flex-1">
                              {user?.role !== "student" && (
                                <p className="font-medium text-sm sm:text-base truncate">
                                  {performer.student}
                                </p>
                              )}
                              <p className="text-xs sm:text-sm text-muted-foreground truncate">
                                {performer.exam}
                              </p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right w-full sm:w-auto">
                            <p className="text-xl sm:text-2xl font-bold text-green-600">
                              {performer.score}%
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Grade: {performer.grade}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
};
