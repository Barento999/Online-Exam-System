import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CircularProgress,
  LinearProgress,
  BarChart,
} from "@/components/charts";
import { TrendingUp, Award, Target } from "lucide-react";
import { cn } from "@/lib/utils";

export const PerformanceWidget = ({ className }) => {
  const performanceData = [
    { label: "Math", value: 85 },
    { label: "Physics", value: 92 },
    { label: "Chemistry", value: 78 },
    { label: "Biology", value: 88 },
    { label: "English", value: 95 },
  ];

  const overallScore = 87;
  const targetScore = 90;
  const improvement = 12;

  return (
    <Card
      className={cn(
        "animate-in fade-in slide-in-from-bottom-4 duration-600 delay-500",
        className,
      )}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Performance Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Performance Circle */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold">Overall Performance</h3>
            <div className="flex items-center gap-4">
              <CircularProgress
                value={overallScore}
                max={100}
                size={80}
                color="text-green-600"
                label="Score"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Target: {targetScore}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    +{improvement}% this month
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Progress */}
        <div className="space-y-4">
          <h3 className="font-semibold">Subject Performance</h3>
          <div className="space-y-3">
            {performanceData.map((subject, index) => (
              <div key={subject.label} className="space-y-1">
                <LinearProgress
                  value={subject.value}
                  max={100}
                  label={subject.label}
                  showValue
                  color={
                    subject.value >= 90
                      ? "bg-green-600"
                      : subject.value >= 80
                        ? "bg-blue-600"
                        : subject.value >= 70
                          ? "bg-orange-600"
                          : "bg-red-600"
                  }
                  animated
                  className="animate-in fade-in slide-in-from-left-2"
                  style={{
                    animationDelay: `${800 + index * 100}ms`,
                    animationDuration: "400ms",
                    animationFillMode: "both",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="space-y-2">
          <h3 className="font-semibold">Score Comparison</h3>
          <BarChart
            data={performanceData}
            height={120}
            color="bg-primary"
            animated
            showValues
            className="animate-in fade-in slide-in-from-bottom-2 duration-600 delay-1000"
          />
        </div>
      </CardContent>
    </Card>
  );
};
