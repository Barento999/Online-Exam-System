import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";
import {
  ExamCardSkeleton,
  ResultCardSkeleton,
} from "@/components/skeletons/ExamCardSkeleton";
import { StatsGridSkeleton } from "@/components/skeletons/StatsCardSkeleton";
import { RefreshCw } from "lucide-react";

export const LoadingDemo = () => {
  const [showSkeleton, setShowSkeleton] = useState(false);

  const toggleSkeleton = () => {
    setShowSkeleton(true);
    setTimeout(() => setShowSkeleton(false), 2000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Skeleton Loading Demo</span>
          <Button
            size="sm"
            variant="outline"
            onClick={toggleSkeleton}
            disabled={showSkeleton}>
            <RefreshCw
              className={`h-4 w-4 mr-2 ${showSkeleton ? "animate-spin" : ""}`}
            />
            {showSkeleton ? "Loading..." : "Demo Loading"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {showSkeleton ? (
          <div className="space-y-6">
            <StatsGridSkeleton count={2} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <ExamCardSkeleton />
                <ExamCardSkeleton />
              </div>
              <div className="space-y-3">
                <ResultCardSkeleton />
                <ResultCardSkeleton />
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>Click the button above to see skeleton loading in action!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
