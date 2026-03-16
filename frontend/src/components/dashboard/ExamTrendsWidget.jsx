import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, CircularProgress } from "@/components/charts";
import { TrendingUp, Calendar, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const ExamTrendsWidget = ({ data, loading, className }) => {
  const examTrends = data?.examTrends || [
    { label: "Jan", value: 75 },
    { label: "Feb", value: 82 },
    { label: "Mar", value: 78 },
    { label: "Apr", value: 85 },
    { label: "May", value: 88 },
    { label: "Jun", value: 92 },
  ];

  const upcomingExams = data?.upcomingExams || [
    { subject: "Mathematics", date: "Mar 25", progress: 85 },
    { subject: "Physics", date: "Mar 28", progress: 70 },
    { subject: "Chemistry", date: "Apr 2", progress: 60 },
  ];

  const averageImprovement = data?.averageImprovement || 12;
  const currentStreak = data?.currentStreak || 5;

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Exam Trends
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="h-4 bg-muted rounded w-28"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
          <div className="space-y-4">
            <div className="h-4 bg-muted rounded w-32"></div>
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 duration-600 delay-700",
        className,
      )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Exam Trends
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Trend Chart */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Score Progression</h3>
            <div className="flex items-center gap-2 text-sm text-green-600">
              <TrendingUp className="h-4 w-4" />+{averageImprovement}% avg
              improvement
            </div>
          </div>
          <LineChart
            data={examTrends}
            width={350}
            height={150}
            color="stroke-primary"
            animated
            showDots
            smooth
            className="animate-in fade-in slide-in-from-left-4 duration-800 delay-1000"
          />
        </div>

        {/* Upcoming Exams */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Upcoming Exams</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />3 scheduled
            </div>
          </div>

          <div className="space-y-3">
            {upcomingExams.map((exam, index) => (
              <div
                key={exam.subject}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg bg-accent/50",
                  "hover:bg-accent transition-colors duration-200",
                  "animate-in fade-in slide-in-from-right-2",
                )}
                style={{
                  animationDelay: `${1200 + index * 100}ms`,
                  animationDuration: "400ms",
                  animationFillMode: "both",
                }}>
                <div className="flex items-center gap-3">
                  <CircularProgress
                    value={exam.progress}
                    max={100}
                    size={40}
                    strokeWidth={4}
                    color={
                      exam.progress >= 80
                        ? "text-green-600"
                        : exam.progress >= 60
                          ? "text-blue-600"
                          : "text-orange-600"
                    }
                    showValue={false}
                  />
                  <div>
                    <div className="font-medium">{exam.subject}</div>
                    <div className="text-sm text-muted-foreground">
                      {exam.date}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{exam.progress}%</div>
                  <div className="text-xs text-muted-foreground">Ready</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center space-y-1">
            <div className="flex items-center justify-center gap-1">
              <Target className="h-4 w-4 text-blue-600" />
              <span className="text-lg font-bold text-blue-600">
                {currentStreak}
              </span>
            </div>
            <div className="text-xs text-muted-foreground">Passing Streak</div>
          </div>
          <div className="text-center space-y-1">
            <div className="text-lg font-bold text-green-600">92%</div>
            <div className="text-xs text-muted-foreground">Best Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
