import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import { useRealTimeNotifications } from "@/hooks/useRealTimeNotifications";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  FileText,
  ClipboardList,
  BarChart,
  UserPlus,
  TrendingUp,
  RefreshCw,
  Bell,
} from "lucide-react";

export const RealDataNotificationDemo = () => {
  const { user } = useAuth();
  const { notifications, getTotalCount } = useNotificationContext();
  const {
    refreshNotifications,
    handleUserCreated,
    handleExamCreated,
    handleExamPublished,
    handleQuestionCreated,
    handleQuestionAssigned,
    handleResultSubmitted,
    handleResultGraded,
    handleEnrollmentRequested,
    handleEnrollmentApproved,
  } = useRealTimeNotifications();

  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshNotifications();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const getActionsByRole = () => {
    const commonActions = [
      {
        label: "Refresh All Notifications",
        action: handleRefresh,
        icon: RefreshCw,
        variant: "outline",
        description: "Fetch latest notification counts from API",
      },
    ];

    switch (user?.role) {
      case "admin":
        return [
          ...commonActions,
          {
            label: "New User Registered",
            action: handleUserCreated,
            icon: Users,
            variant: "default",
            description: "Simulate a new user registration",
          },
          {
            label: "Exam Created",
            action: handleExamCreated,
            icon: FileText,
            variant: "default",
            description: "Simulate exam creation (draft status)",
          },
          {
            label: "Exam Published",
            action: handleExamPublished,
            icon: FileText,
            variant: "secondary",
            description: "Simulate exam publication (removes from draft)",
          },
          {
            label: "Question Added",
            action: handleQuestionCreated,
            icon: ClipboardList,
            variant: "default",
            description: "Simulate question creation (orphaned)",
          },
          {
            label: "Question Assigned",
            action: handleQuestionAssigned,
            icon: ClipboardList,
            variant: "secondary",
            description: "Simulate question assignment to exam",
          },
          {
            label: "Result Submitted",
            action: handleResultSubmitted,
            icon: BarChart,
            variant: "default",
            description: "Simulate student result submission",
          },
          {
            label: "Result Graded",
            action: handleResultGraded,
            icon: BarChart,
            variant: "secondary",
            description: "Simulate result grading",
          },
          {
            label: "Enrollment Request",
            action: handleEnrollmentRequested,
            icon: UserPlus,
            variant: "default",
            description: "Simulate enrollment request",
          },
          {
            label: "Enrollment Approved",
            action: handleEnrollmentApproved,
            icon: UserPlus,
            variant: "secondary",
            description: "Simulate enrollment approval",
          },
        ];

      case "teacher":
        return [
          ...commonActions,
          {
            label: "Exam Created",
            action: handleExamCreated,
            icon: FileText,
            variant: "default",
            description: "Create a new draft exam",
          },
          {
            label: "Exam Published",
            action: handleExamPublished,
            icon: FileText,
            variant: "secondary",
            description: "Publish a draft exam",
          },
          {
            label: "Question Added",
            action: handleQuestionCreated,
            icon: ClipboardList,
            variant: "default",
            description: "Add a new question",
          },
          {
            label: "Question Assigned",
            action: handleQuestionAssigned,
            icon: ClipboardList,
            variant: "secondary",
            description: "Assign question to exam",
          },
          {
            label: "Result Submitted",
            action: handleResultSubmitted,
            icon: BarChart,
            variant: "default",
            description: "Student submitted result",
          },
          {
            label: "Result Graded",
            action: handleResultGraded,
            icon: BarChart,
            variant: "secondary",
            description: "Grade a student result",
          },
        ];

      case "student":
        return [
          ...commonActions,
          {
            label: "Result Available",
            action: handleResultGraded,
            icon: BarChart,
            variant: "default",
            description: "New graded result available",
          },
        ];

      default:
        return commonActions;
    }
  };

  const actions = getActionsByRole();

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Bell className="h-8 w-8" />
          Real-Time Notifications Demo
        </h2>
        <p className="text-muted-foreground text-lg">
          Test real-time notification updates based on user actions and API
          data.
        </p>
      </div>

      {/* Current Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Current Notification Status</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {getTotalCount()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(notifications).map(([path, notification]) => (
              <div
                key={path}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="font-medium capitalize">
                    {path.replace("/", "")}
                  </span>
                  <Badge
                    variant={
                      notification.type === "error"
                        ? "destructive"
                        : notification.type === "warning"
                          ? "secondary"
                          : notification.type === "success"
                            ? "default"
                            : "outline"
                    }>
                    {notification.count}
                  </Badge>
                </div>
                <div
                  className={`w-3 h-3 rounded-full ${
                    notification.type === "error"
                      ? "bg-red-500"
                      : notification.type === "warning"
                        ? "bg-amber-500"
                        : notification.type === "success"
                          ? "bg-green-500"
                          : "bg-blue-500"
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Simulate User Actions</CardTitle>
          <p className="text-sm text-muted-foreground">
            Click the buttons below to simulate various user actions and see how
            notifications update in real-time.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {actions.map((action, index) => {
              const Icon = action.icon;
              return (
                <div
                  key={index}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <Icon className="h-5 w-5 text-primary" />
                    <h4 className="font-semibold text-sm">{action.label}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                    {action.description}
                  </p>
                  <Button
                    onClick={action.action}
                    variant={action.variant}
                    size="sm"
                    className="w-full"
                    disabled={action.label.includes("Refresh") && isRefreshing}>
                    {action.label.includes("Refresh") && isRefreshing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <Icon className="h-4 w-4 mr-2" />
                        {action.label}
                      </>
                    )}
                  </Button>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How It Works
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>
            • <strong>Real Data:</strong> Notifications are fetched from actual
            API endpoints
          </li>
          <li>
            • <strong>Fallback:</strong> Demo data is shown when API data is not
            available
          </li>
          <li>
            • <strong>Real-time:</strong> Actions immediately update
            notification counts
          </li>
          <li>
            • <strong>Role-based:</strong> Different actions available based on
            user role
          </li>
          <li>
            • <strong>Auto-refresh:</strong> Notifications refresh every 5
            minutes automatically
          </li>
        </ul>
      </div>
    </div>
  );
};
