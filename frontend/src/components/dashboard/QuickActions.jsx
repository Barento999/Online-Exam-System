import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Award,
  Calendar,
  MessageSquare,
  Download,
  Bell,
  Target,
} from "lucide-react";
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
      gradient: "from-blue-500 to-blue-600",
      onClick: () => navigate("/exams"),
    },
    {
      title: "View Results",
      description: "Check your exam results",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      hoverColor: "hover:bg-green-200 dark:hover:bg-green-900/30",
      gradient: "from-green-500 to-green-600",
      onClick: () => navigate("/results"),
    },
    {
      title: "Study Materials",
      description: "Access course materials",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      hoverColor: "hover:bg-purple-200 dark:hover:bg-purple-900/30",
      gradient: "from-purple-500 to-purple-600",
      onClick: () => navigate("/materials"),
    },
    {
      title: "Analytics",
      description: "View performance analytics",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      hoverColor: "hover:bg-orange-200 dark:hover:bg-orange-900/30",
      gradient: "from-orange-500 to-orange-600",
      onClick: () => navigate("/analytics"),
    },
    {
      title: "Schedule",
      description: "View your schedule",
      icon: Calendar,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      hoverColor: "hover:bg-pink-200 dark:hover:bg-pink-900/30",
      gradient: "from-pink-500 to-pink-600",
      onClick: () => navigate("/schedule"),
    },
    {
      title: "Messages",
      description: "Check your messages",
      icon: MessageSquare,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
      hoverColor: "hover:bg-cyan-200 dark:hover:bg-cyan-900/30",
      gradient: "from-cyan-500 to-cyan-600",
      onClick: () => navigate("/messages"),
      badge: 3, // Unread count
    },
  ];

  return (
    <Card className="animate-in fade-in slide-in-from-right-4 duration-600 delay-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
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
                  "hover:shadow-lg hover:shadow-primary/10 border-2 border-transparent hover:border-primary/20",
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
                    "bg-gradient-to-r from-transparent via-white/20 dark:via-white/10 to-transparent",
                    "skew-x-12",
                  )}
                />

                {/* Icon container */}
                <div className="relative">
                  <div
                    className={cn(
                      "h-12 w-12 rounded-full flex items-center justify-center relative",
                      "transition-all duration-300 group-hover:scale-110 group-hover:rotate-6",
                      action.bgColor,
                      action.hoverColor,
                    )}>
                    <Icon
                      className={cn(
                        "h-6 w-6 transition-all duration-300 group-hover:scale-110",
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

                    {/* Gradient overlay on hover */}
                    <div
                      className={cn(
                        "absolute inset-0 rounded-full opacity-0 group-hover:opacity-20",
                        "bg-gradient-to-br transition-opacity duration-300",
                        action.gradient,
                      )}
                    />
                  </div>

                  {/* Badge for notifications */}
                  {action.badge && (
                    <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                      <span className="text-[10px] font-bold text-white">
                        {action.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Text */}
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

        {/* Additional Quick Links */}
        <div className="mt-4 pt-4 border-t space-y-2">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            More Actions
          </h4>
          <div className="grid grid-cols-1 gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="justify-start group hover:bg-accent"
              onClick={() => navigate("/settings")}>
              <Settings className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm">Settings</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start group hover:bg-accent"
              onClick={() => navigate("/notifications")}>
              <Bell className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm">Notifications</span>
              <span className="ml-auto text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                5
              </span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="justify-start group hover:bg-accent"
              onClick={() => navigate("/downloads")}>
              <Download className="h-4 w-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-sm">Downloads</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
