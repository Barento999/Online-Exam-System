import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, FileText, BarChart3, Settings, Award } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Take Exam",
      description: "Start an available exam",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      hoverColor: "hover:bg-blue-200 dark:hover:bg-blue-900/30",
      onClick: () => navigate("/exams"),
    },
    {
      title: "View Results",
      description: "Check your exam results",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      hoverColor: "hover:bg-green-200 dark:hover:bg-green-900/30",
      onClick: () => navigate("/results"),
    },
    {
      title: "Study Materials",
      description: "Access course materials",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      hoverColor: "hover:bg-purple-200 dark:hover:bg-purple-900/30",
      onClick: () => navigate("/materials"),
    },
    {
      title: "Analytics",
      description: "View performance analytics",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      hoverColor: "hover:bg-orange-200 dark:hover:bg-orange-900/30",
      onClick: () => navigate("/analytics"),
    },
  ];

  return (
    <Card className="animate-in fade-in slide-in-from-right-4 duration-600 delay-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="ghost"
                className={cn(
                  "h-auto p-4 flex flex-col items-center gap-2 group relative overflow-hidden",
                  "hover:scale-105 transition-all duration-300 ease-out",
                  "hover:shadow-lg border-2 border-transparent hover:border-primary/20",
                  "animate-in fade-in slide-in-from-bottom-2",
                )}
                style={{
                  animationDelay: `${600 + index * 100}ms`,
                  animationDuration: "400ms",
                  animationFillMode: "both",
                }}
                onClick={action.onClick}>
                {/* Shimmer effect */}
                <div
                  className={cn(
                    "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700",
                    "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                    "skew-x-12",
                  )}
                />

                <div
                  className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center relative",
                    "transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                    action.bgColor,
                    action.hoverColor,
                  )}>
                  <Icon
                    className={cn(
                      "h-5 w-5 transition-all duration-300 group-hover:scale-110",
                      action.color,
                    )}
                  />

                  {/* Pulsing ring */}
                  <div
                    className={cn(
                      "absolute inset-0 rounded-full opacity-0 group-hover:opacity-30",
                      "animate-ping transition-opacity duration-300",
                      action.bgColor,
                    )}
                  />
                </div>

                <div className="text-center relative z-10">
                  <p className="font-medium text-sm group-hover:text-primary transition-colors duration-200">
                    {action.title}
                  </p>
                  <p className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors duration-200">
                    {action.description}
                  </p>
                </div>
              </Button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
