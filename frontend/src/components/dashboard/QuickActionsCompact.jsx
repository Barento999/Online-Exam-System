import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  FileText,
  BarChart3,
  Award,
  Calendar,
  MessageSquare,
  Download,
  Target,
  Settings,
} from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";

export const QuickActionsCompact = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Exams",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      onClick: () => navigate("/exams"),
    },
    {
      title: "Results",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      onClick: () => navigate("/results"),
    },
    {
      title: "Materials",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      onClick: () => navigate("/materials"),
    },
    {
      title: "Analytics",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      onClick: () => navigate("/analytics"),
    },
    {
      title: "Schedule",
      icon: Calendar,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      onClick: () => navigate("/schedule"),
    },
    {
      title: "Messages",
      icon: MessageSquare,
      color: "text-cyan-600",
      bgColor: "bg-cyan-100 dark:bg-cyan-900/20",
      onClick: () => navigate("/messages"),
      badge: 3,
    },
    {
      title: "Downloads",
      icon: Download,
      color: "text-indigo-600",
      bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
      onClick: () => navigate("/downloads"),
    },
    {
      title: "Settings",
      icon: Settings,
      color: "text-gray-600",
      bgColor: "bg-gray-100 dark:bg-gray-900/20",
      onClick: () => navigate("/settings"),
    },
  ];

  return (
    <Card className="animate-in fade-in slide-in-from-right-4 duration-600 delay-300">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Quick Access
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={action.title}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-lg group relative overflow-hidden",
                  "hover:scale-110 transition-all duration-300 ease-out",
                  "hover:shadow-md border border-transparent hover:border-primary/20",
                  "animate-in fade-in zoom-in-50",
                )}
                style={{
                  animationDelay: `${600 + index * 50}ms`,
                  animationDuration: "300ms",
                  animationFillMode: "both",
                }}
                onClick={action.onClick}>
                {/* Background glow */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl",
                    action.bgColor,
                  )}
                />

                {/* Icon */}
                <div className="relative">
                  <div
                    className={cn(
                      "h-10 w-10 rounded-lg flex items-center justify-center relative",
                      "transition-all duration-300 group-hover:rotate-12",
                      action.bgColor,
                    )}>
                    <Icon
                      className={cn(
                        "h-5 w-5 transition-all duration-300",
                        action.color,
                      )}
                    />
                  </div>

                  {/* Badge */}
                  {action.badge && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-[9px] font-bold text-white">
                        {action.badge}
                      </span>
                    </div>
                  )}
                </div>

                {/* Label */}
                <span className="text-[10px] font-medium text-center group-hover:text-primary transition-colors">
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
