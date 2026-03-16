import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import {
  ExamCardSkeleton,
  ResultCardSkeleton,
} from "@/components/skeletons/ExamCardSkeleton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import { PerformanceWidget } from "@/components/dashboard/PerformanceWidget";
import { StudyProgressWidget } from "@/components/dashboard/StudyProgressWidget";
import { ExamTrendsWidget } from "@/components/dashboard/ExamTrendsWidget";
import { DevModeIndicator } from "@/components/dashboard/DevModeIndicator";
import { studentDataService } from "@/services/studentDataService";
import { cn } from "@/lib/utils";
import {
  BookOpen,
  CheckCircle,
  TrendingUp,
  Clock,
  Calendar,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router";
import { EmptyState } from "@/components/common/EmptyState";

export const StudentDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [performanceData, setPerformanceData] = useState(null);
  const [studyProgressData, setStudyProgressData] = useState(null);
  const [examTrendsData, setExamTrendsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState(false);
  const [dataLoading, setDataLoading] = useState({
    performance: true,
    studyProgress: true,
    examTrends: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load main dashboard data first
      const data = await studentDataService.getDashboardData();
      setDashboardData(data);
      setLoading(false);

      // Check if we're using mock data by looking for specific mock data patterns
      const isMockData =
        data.stats?.enrolledCourses === 6 &&
        data.stats?.avgScore === 87.5 &&
        data.stats?.recentResults?.[0]?.examId?.title ===
          "Advanced Mathematics Midterm";

      setUsingMockData(isMockData);

      // Load additional data in parallel
      loadAdditionalData();
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      setLoading(false);
      setUsingMockData(true);
    }
  };

  const loadAdditionalData = async () => {
    try {
      const [performance, studyProgress, examTrends] = await Promise.all([
        studentDataService.getPerformanceData(),
        studentDataService.getStudyProgressData(),
        studentDataService.getExamTrendsData(),
      ]);

      setPerformanceData(performance);
      setDataLoading((prev) => ({ ...prev, performance: false }));

      setTimeout(() => {
        setStudyProgressData(studyProgress);
        setDataLoading((prev) => ({ ...prev, studyProgress: false }));
      }, 300);

      setTimeout(() => {
        setExamTrendsData(examTrends);
        setDataLoading((prev) => ({ ...prev, examTrends: false }));
      }, 600);
    } catch (error) {
      console.error("Error loading additional data:", error);
      setDataLoading({
        performance: false,
        studyProgress: false,
        examTrends: false,
      });
    }
  };

  // Show full skeleton loader initially
  if (loading) {
    return (
      <Layout>
        <DashboardSkeleton />
      </Layout>
    );
  }

  const statCards = [
    {
      title: "Enrolled Courses",
      value: dashboardData?.stats?.enrolledCourses || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      trend: "up",
      trendValue: "+1 this semester",
    },
    {
      title: "Completed Exams",
      value: dashboardData?.stats?.completedExams || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      trend: "up",
      trendValue: `${dashboardData?.stats?.passedExams || 0} passed`,
    },
    {
      title: "Upcoming Exams",
      value: dashboardData?.stats?.upcomingExams || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      trend: "neutral",
      trendValue: "This month",
    },
    {
      title: "Average Score",
      value: `${dashboardData?.stats?.avgScore || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      trend: "up",
      trendValue: "+3.2% improvement",
    },
  ];

  return (
    <Layout>
      <DevModeIndicator usingMockData={usingMockData} />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold mb-2">Student Dashboard</h1>
          <p className="text-muted-foreground">
            Track your progress and upcoming exams
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bgColor}
              trend={stat.trend}
              trendValue={stat.trendValue}
              animationDelay={index * 100}
              onClick={() => {
                // Add navigation logic based on stat type
                if (stat.title === "Upcoming Exams") {
                  navigate("/exams");
                } else if (stat.title === "Completed Exams") {
                  navigate("/results");
                }
              }}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Available Exams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {!dashboardData ? (
                  <>
                    <ExamCardSkeleton key="exam-skeleton-1" />
                    <ExamCardSkeleton key="exam-skeleton-2" />
                  </>
                ) : dashboardData.availableExams &&
                  dashboardData.availableExams.length > 0 ? (
                  dashboardData.availableExams.map((exam, index) => (
                    <div
                      key={exam.id || `exam-${index}`}
                      className={cn(
                        "p-4 rounded-lg border border-border group relative overflow-hidden",
                        "hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-white/5",
                        "hover:-translate-y-1 transition-all duration-300 ease-out",
                        "hover:border-primary/30 cursor-pointer",
                        "animate-in fade-in slide-in-from-left-4",
                      )}
                      style={{
                        animationDelay: `${800 + index * 100}ms`,
                        animationDuration: "500ms",
                        animationFillMode: "both",
                      }}>
                      {/* Shimmer effect */}
                      <div
                        className={cn(
                          "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
                          "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                          "skew-x-12",
                        )}
                      />

                      <div className="flex items-start justify-between mb-2 relative z-10">
                        <div>
                          <h3 className="font-medium group-hover:text-primary transition-colors duration-200">
                            {exam.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {exam.courseId?.name ||
                              exam.course ||
                              "Unknown Course"}
                          </p>
                        </div>
                        <span
                          className={cn(
                            "px-2 py-1 text-xs rounded transition-all duration-200",
                            "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
                            "group-hover:bg-green-200 dark:group-hover:bg-green-900/30 group-hover:scale-105",
                          )}>
                          {exam.status === "available"
                            ? "Available"
                            : exam.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between relative z-10">
                        <div className="text-sm text-muted-foreground">
                          <p>Duration: {exam.duration} minutes</p>
                          <p>Total Marks: {exam.totalMarks}</p>
                          <p className="text-xs mt-1">
                            Due:{" "}
                            {exam.endTime
                              ? new Date(exam.endTime).toLocaleDateString()
                              : exam.dueDate || "TBD"}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => navigate(`/exams/${exam.id}/take`)}
                          className={cn(
                            "hover:scale-110 transition-all duration-200",
                            "hover:shadow-md group-hover:bg-primary group-hover:text-primary-foreground",
                          )}>
                          Start Exam
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    illustration="exams"
                    title="No Exams Available"
                    description="There are no exams scheduled at the moment. Check back later or contact your instructor."
                    action={() => navigate("/exams")}
                    actionLabel="View All Exams"
                  />
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Results
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {!dashboardData ? (
                  <>
                    <ResultCardSkeleton key="result-skeleton-1" />
                    <ResultCardSkeleton key="result-skeleton-2" />
                  </>
                ) : dashboardData.stats?.recentResults &&
                  dashboardData.stats.recentResults.length > 0 ? (
                  dashboardData.stats.recentResults.map((result, index) => (
                    <div
                      key={result.id || `result-${index}`}
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg bg-accent group",
                        "hover:bg-accent/80 transition-all duration-300 ease-out",
                        "hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
                        "animate-in fade-in slide-in-from-right-4",
                      )}
                      style={{
                        animationDelay: `${800 + index * 100}ms`,
                        animationDuration: "500ms",
                        animationFillMode: "both",
                      }}>
                      <div>
                        <h3 className="font-medium group-hover:text-primary transition-colors duration-200">
                          {result.examId?.title ||
                            result.title ||
                            "Unknown Exam"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted:{" "}
                          {result.submittedAt
                            ? new Date(result.submittedAt).toLocaleDateString()
                            : result.submittedDate || "Unknown"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-2xl font-semibold transition-all duration-300 group-hover:scale-110",
                            (result.percentage || result.score || 0) >= 70
                              ? "text-green-600"
                              : (result.percentage || result.score || 0) >= 50
                                ? "text-yellow-600"
                                : "text-red-600",
                          )}>
                          {result.percentage || result.score || 0}%
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {result.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState
                    illustration="results"
                    title="No Results Yet"
                    description="You haven't completed any exams yet. Start taking exams to see your results here."
                    action={() => navigate("/exams")}
                    actionLabel="Take an Exam"
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Chart Widgets Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <PerformanceWidget
                data={performanceData}
                loading={dataLoading.performance}
              />
              <StudyProgressWidget
                data={studyProgressData}
                loading={dataLoading.studyProgress}
              />
            </div>
            <div className="mt-6">
              <ExamTrendsWidget
                data={examTrendsData}
                loading={dataLoading.examTrends}
              />
            </div>
          </div>
          <QuickActions />
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </Layout>
  );
};
