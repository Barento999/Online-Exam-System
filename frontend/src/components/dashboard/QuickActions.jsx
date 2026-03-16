import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  Calendar,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router";

export const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Take Exam",
      description: "Start an available exam",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      onClick: () => navigate("/exams"),
    },
    {
      title: "View Results",
      description: "Check your exam results",
      icon: Award,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      onClick: () => navigate("/results"),
    },
    {
      title: "Study Materials",
      description: "Access course materials",
      icon: BookOpen,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      onClick: () => navigate("/materials"),
    },
    {
      title: "Analytics",
      description: "View performance analytics",
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      onClick: () => navigate("/analytics"),
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.title}
                variant="ghost"
                className="h-auto p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform"
                onClick={action.onClick}>
                <div
                  className={`h-10 w-10 rounded-full ${action.bgColor} flex items-center justify-center`}>
                  <Icon className={`h-5 w-5 ${action.color}`} />
                </div>
                <div className="text-center">
                  <p className="font-medium text-sm">{action.title}</p>
                  <p className="text-xs text-muted-foreground">
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
