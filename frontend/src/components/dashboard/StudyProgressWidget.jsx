import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DonutChart, LinearProgress } from "@/components/charts";
import { BookOpen, Clock, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export const StudyProgressWidget = ({ data, loading, className }) => {
  const studyData = data?.studyData || [
    { label: "Completed", value: 2, color: "stroke-green-600" },
    { label: "In Progress", value: 3, color: "stroke-blue-600" },
    { label: "Pending", value: 1, color: "stroke-orange-600" },
  ];

  const weeklyGoals = data?.weeklyGoals || [
    { label: "Study Hours", current: 28, target: 35 },
    { label: "Assignments", current: 8, target: 10 },
    { label: "Practice Tests", current: 3, target: 5 },
  ];

  const totalStudyHours = data?.totalStudyHours || 142;
  const thisWeekHours = data?.thisWeekHours || 28;

  if (loading) {
    return (
      <Card className={cn("animate-pulse", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Progress
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-center">
            <div className="h-40 w-40 bg-muted rounded-full"></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 w-3 bg-muted rounded-full mx-auto"></div>
                <div className="h-3 bg-muted rounded w-16 mx-auto"></div>
                <div className="h-3 bg-muted rounded w-8 mx-auto"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 duration-600 delay-600",
        className,
      )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Study Progress
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Study Distribution */}
        <div className="flex items-center justify-center">
          <DonutChart
            data={studyData}
            size={160}
            strokeWidth={16}
            animated
            showLegend={false}
            centerContent={
              <div className="text-center">
                <div className="text-2xl font-bold">{totalStudyHours}</div>
                <div className="text-xs text-muted-foreground">Total Hours</div>
              </div>
            }
          />
        </div>

        {/* Legend */}
        <div className="grid grid-cols-3 gap-4 text-center">
          {studyData.map((item, index) => {
            const bgColor = item.color.replace("stroke-", "bg-");
            const total = studyData.reduce((sum, d) => sum + d.value, 0);
            const percentage =
              total > 0 ? ((item.value / total) * 100).toFixed(1) : "0.0";

            return (
              <div key={item.label} className="space-y-1">
                <div className={cn("w-3 h-3 rounded-full mx-auto", bgColor)} />
                <div className="text-xs font-medium">{item.label}</div>
                <div className="text-xs text-muted-foreground">
                  {percentage}%
                </div>
              </div>
            );
          })}
        </div>

        {/* Weekly Goals */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Weekly Goals</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {thisWeekHours}h this week
            </div>
          </div>

          <div className="space-y-3">
            {weeklyGoals.map((goal, index) => {
              const percentage = (goal.current / goal.target) * 100;
              const isCompleted = goal.current >= goal.target;

              return (
                <div key={goal.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium flex items-center gap-2">
                      {isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                      {goal.label}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {goal.current}/{goal.target}
                    </span>
                  </div>
                  <LinearProgress
                    value={goal.current}
                    max={goal.target}
                    height="h-2"
                    color={
                      isCompleted
                        ? "bg-green-600"
                        : percentage >= 75
                          ? "bg-blue-600"
                          : percentage >= 50
                            ? "bg-orange-600"
                            : "bg-red-600"
                    }
                    animated
                    className="animate-in fade-in slide-in-from-left-2"
                    style={{
                      animationDelay: `${1000 + index * 150}ms`,
                      animationDuration: "500ms",
                      animationFillMode: "both",
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <div className="text-lg font-bold text-green-600">85%</div>
            <div className="text-xs text-muted-foreground">Completion Rate</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600">4.2</div>
            <div className="text-xs text-muted-foreground">Avg Daily Hours</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
