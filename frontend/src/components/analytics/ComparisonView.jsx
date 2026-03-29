import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Comparison View Component
 * Compares metrics between two time periods
 */
export const ComparisonView = ({ currentData, previousData, title }) => {
  if (!currentData || !previousData) {
    return null;
  }

  const calculateChange = (current, previous) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  const metrics = [
    {
      label: "Total Results",
      current: currentData.totalResults,
      previous: previousData.totalResults,
    },
    {
      label: "Average Score",
      current: parseFloat(currentData.avgScore),
      previous: parseFloat(previousData.avgScore),
      suffix: "%",
    },
    {
      label: "Pass Rate",
      current: parseFloat(currentData.passRate),
      previous: parseFloat(previousData.passRate),
      suffix: "%",
    },
    {
      label: "Passed",
      current: currentData.passed,
      previous: previousData.passed,
    },
    {
      label: "Failed",
      current: currentData.failed,
      previous: previousData.failed,
      inverse: true, // Lower is better
    },
  ];

  const getTrendIcon = (change, inverse = false) => {
    const isPositive = inverse ? change < 0 : change > 0;
    const isNegative = inverse ? change > 0 : change < 0;

    if (Math.abs(change) < 0.1) {
      return <Minus className="h-4 w-4 text-gray-500" />;
    }
    if (isPositive) {
      return <TrendingUp className="h-4 w-4 text-green-600" />;
    }
    if (isNegative) {
      return <TrendingDown className="h-4 w-4 text-red-600" />;
    }
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (change, inverse = false) => {
    const isPositive = inverse ? change < 0 : change > 0;
    const isNegative = inverse ? change > 0 : change < 0;

    if (Math.abs(change) < 0.1) return "text-gray-500";
    if (isPositive) return "text-green-600";
    if (isNegative) return "text-red-600";
    return "text-gray-500";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Period Comparison"}</CardTitle>
        <p className="text-sm text-muted-foreground">
          Current period vs previous period
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {metrics.map((metric) => {
            const change = calculateChange(metric.current, metric.previous);
            const changeAbs = Math.abs(change);

            return (
              <div
                key={metric.label}
                className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow">
                <p className="text-sm text-muted-foreground mb-2">
                  {metric.label}
                </p>

                {/* Current Value */}
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold">
                    {metric.current}
                    {metric.suffix || ""}
                  </span>
                </div>

                {/* Comparison */}
                <div className="flex items-center gap-2">
                  {getTrendIcon(change, metric.inverse)}
                  <span
                    className={cn(
                      "text-sm font-medium",
                      getTrendColor(change, metric.inverse),
                    )}>
                    {changeAbs.toFixed(1)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    vs {metric.previous}
                    {metric.suffix || ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
