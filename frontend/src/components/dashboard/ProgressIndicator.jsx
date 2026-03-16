import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp } from "lucide-react";

export const ProgressIndicator = ({
  title,
  current,
  total,
  percentage,
  color = "blue",
}) => {
  const colorClasses = {
    blue: "text-blue-600",
    green: "text-green-600",
    orange: "text-orange-600",
    purple: "text-purple-600",
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>{title}</span>
          <TrendingUp className={`h-4 w-4 ${colorClasses[color]}`} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">
              {current}/{total}
            </span>
          </div>
          <Progress value={percentage} className="h-2" />
          <div className="text-right">
            <span className={`text-sm font-semibold ${colorClasses[color]}`}>
              {percentage}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
