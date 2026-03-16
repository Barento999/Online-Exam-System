import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatsCard } from "./StatsCard";
import { QuickActions } from "./QuickActions";
import { LoadingDemo } from "./LoadingDemo";
import { cn } from "@/lib/utils";
import {
  Sparkles,
  BookOpen,
  CheckCircle,
  TrendingUp,
  Clock,
  RefreshCw,
} from "lucide-react";

export const AnimationShowcase = () => {
  const [isAnimating, setIsAnimating] = useState(false);

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 2000);
  };

  const demoStats = [
    {
      title: "Demo Stat 1",
      value: "42",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      trend: "up",
      trendValue: "+12%",
    },
    {
      title: "Demo Stat 2",
      value: "89%",
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      trend: "up",
      trendValue: "+5%",
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            Animation Showcase
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={triggerAnimation}
            disabled={isAnimating}>
            <RefreshCw
              className={cn("h-4 w-4 mr-2", isAnimating && "animate-spin")}
            />
            {isAnimating ? "Animating..." : "Trigger Animations"}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stats Cards Demo */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Animated Stats Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoStats.map((stat, index) => (
              <StatsCard
                key={`${stat.title}-${isAnimating}`}
                {...stat}
                animationDelay={index * 150}
                className={isAnimating ? "animate-pulse" : ""}
              />
            ))}
          </div>
        </div>

        {/* Loading Demo */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Skeleton Loading Demo</h3>
          <LoadingDemo />
        </div>

        {/* Animation Features List */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Animation Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Hover Effects:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Scale transformations</li>
                <li>• Shadow animations</li>
                <li>• Color transitions</li>
                <li>• Shimmer effects</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Entry Animations:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Staggered delays</li>
                <li>• Slide-in effects</li>
                <li>• Fade transitions</li>
                <li>• Bounce animations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">
                Interactive Elements:
              </h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Floating particles</li>
                <li>• Progress bars</li>
                <li>• Pulsing rings</li>
                <li>• Icon rotations</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium text-primary">Performance:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• CSS transforms</li>
                <li>• Hardware acceleration</li>
                <li>• Smooth 60fps</li>
                <li>• Minimal repaints</li>
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
