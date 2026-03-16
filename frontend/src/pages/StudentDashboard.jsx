import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import {
  ExamCardSkeleton,
  ResultCardSkeleton,
} from "@/components/skeletons/ExamCardSkeleton";
import { StatsGridSkeleton } from "@/components/skeletons/StatsCardSkeleton";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import { dashboardApi } from "@/services/api";
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

export const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(true);
  const [examsLoading, setExamsLoading] = useState(true);
  const [resultsLoading, setResultsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    // Load stats first
    loadStats();

    // Load exams and results in parallel
    Promise.all([loadAvailableExams(), loadRecentResults()]);
  };

  const loadStats = async () => {
    try {
      const response = await dashboardApi.getStudentStats();
      setStats(response.data);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAvailableExams = async () => {
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setExams([
        {
          id: 1,
          title: "Mathematics Midterm",
          course: "Mathematics 101",
          duration: 90,
          totalMarks: 100,
          status: "available",
          dueDate: "2026-03-25",
        },
        {
          id: 2,
          title: "Physics Quiz 1",
          course: "Physics Advanced",
          duration: 45,
          totalMarks: 50,
          status: "available",
          dueDate: "2026-03-22",
        },
      ]);
    } catch (error) {
      console.error("Error loading exams:", error);
    } finally {
      setExamsLoading(false);
    }
  };

  const loadRecentResults = async () => {
    try {
      // Simulate API call - replace with actual API
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setResults([
        {
          id: 1,
          title: "Mathematics Midterm",
          submittedDate: "Mar 15, 2026",
          score: 85,
          status: "passed",
        },
        {
          id: 2,
          title: "Physics Quiz 1",
          submittedDate: "Mar 20, 2026",
          score: 84,
          status: "passed",
        },
      ]);
    } catch (error) {
      console.error("Error loading results:", error);
    } finally {
      setResultsLoading(false);
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
      value: stats?.enrolledCourses || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      trend: "up",
      trendValue: "+2 this month",
    },
    {
      title: "Completed Exams",
      value: stats?.completedExams || 0,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      trend: "up",
      trendValue: "+3 this week",
    },
    {
      title: "Upcoming Exams",
      value: stats?.upcomingExams || 0,
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      trend: "neutral",
      trendValue: "2 this week",
    },
    {
      title: "Average Score",
      value: `${stats?.avgScore || 0}%`,
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      trend: "up",
      trendValue: "+5% improvement",
    },
  ];

  return (
    <Layout>
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
                {examsLoading ? (
                  <>
                    <ExamCardSkeleton />
                    <ExamCardSkeleton />
                  </>
                ) : exams && exams.length > 0 ? (
                  exams.map((exam, index) => (
                    <div
                      key={exam.id}
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
                            {exam.course}
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
                          <p className="text-xs mt-1">Due: {exam.dueDate}</p>
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
                  <div className="text-center py-8 text-muted-foreground">
                    <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No exams available at the moment</p>
                  </div>
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
                {resultsLoading ? (
                  <>
                    <ResultCardSkeleton />
                    <ResultCardSkeleton />
                  </>
                ) : results && results.length > 0 ? (
                  results.map((result, index) => (
                    <div
                      key={result.id}
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
                          {result.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Submitted: {result.submittedDate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p
                          className={cn(
                            "text-2xl font-semibold transition-all duration-300 group-hover:scale-110",
                            result.score >= 70
                              ? "text-green-600"
                              : result.score >= 50
                                ? "text-yellow-600"
                                : "text-red-600",
                          )}>
                          {result.score}%
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {result.status}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Award className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No results available yet</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* This space can be used for additional widgets in the future */}
          </div>
          <QuickActions />
        </div>
      </div>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </Layout>
  );
};
