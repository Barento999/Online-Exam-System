import { useEffect } from "react";
import { useNotificationContext } from "@/context/NotificationContext";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Users,
  FileText,
  ClipboardList,
  BarChart,
  TrendingUp,
  UserPlus,
} from "lucide-react";

export const NotificationExample = () => {
  const {
    setNotification,
    incrementNotification,
    clearNotification,
    clearAllNotifications,
    getTotalCount,
    notifications,
  } = useNotificationContext();

  // Set some initial notifications when component mounts
  useEffect(() => {
    // Simulate some initial notifications
    setNotification("/users", 3, "info");
    setNotification("/exams", 5, "warning");
    setNotification("/questions", 12, "success");
    setNotification("/results", 2, "error");
    setNotification("/analytics", 1, "info");
    setNotification("/enrollments", 7, "warning");
  }, [setNotification]);

  const exampleActions = [
    {
      label: "New User Registration",
      action: () => incrementNotification("/users", 1),
      icon: Users,
      description: "Increment users notification by 1",
    },
    {
      label: "Exam Needs Review",
      action: () => incrementNotification("/exams", 1),
      icon: FileText,
      description: "Add exam review notification",
    },
    {
      label: "New Question Added",
      action: () => incrementNotification("/questions", 1),
      icon: ClipboardList,
      description: "Increment questions notification",
    },
    {
      label: "Result Alert",
      action: () => setNotification("/results", 5, "error"),
      icon: BarChart,
      description: "Set results notification to 5 (error)",
    },
    {
      label: "Analytics Update",
      action: () => setNotification("/analytics", 3, "success"),
      icon: TrendingUp,
      description: "Set analytics notification to 3 (success)",
    },
    {
      label: "Enrollment Request",
      action: () => incrementNotification("/enrollments", 2),
      icon: UserPlus,
      description: "Add 2 enrollment notifications",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Bell className="h-8 w-8" />
          Notification System Demo
        </h2>
        <p className="text-muted-foreground text-lg">
          Test the badge notification system by triggering different
          notification types.
        </p>
      </div>

      {/* Current Status */}
      <div className="bg-muted/50 rounded-xl p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold">Current Notifications</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total:</span>
            <div className="bg-blue-500 text-white text-sm font-bold rounded-full min-w-[24px] h-[24px] flex items-center justify-center">
              {getTotalCount()}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(notifications).map(([path, notification]) => (
            <div
              key={path}
              className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div className="flex items-center gap-3">
                <span className="font-medium">
                  {path.replace("/", "").charAt(0).toUpperCase() +
                    path.replace("/", "").slice(1)}
                </span>
                <div
                  className={`
                  flex items-center justify-center text-xs font-bold rounded-full min-w-[20px] h-[20px]
                  ${
                    notification.type === "error"
                      ? "bg-red-500 text-white"
                      : notification.type === "warning"
                        ? "bg-amber-500 text-white"
                        : notification.type === "success"
                          ? "bg-green-500 text-white"
                          : "bg-blue-500 text-white"
                  }
                `}>
                  {notification.count}
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => clearNotification(path)}
                className="text-xs">
                Clear
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {exampleActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={index}
              className="p-4 border rounded-xl hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <Icon className="h-5 w-5 text-primary" />
                <h4 className="font-semibold">{action.label}</h4>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {action.description}
              </p>
              <Button onClick={action.action} className="w-full" size="sm">
                Trigger
              </Button>
            </div>
          );
        })}
      </div>

      {/* Control Panel */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Control Panel</h3>
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={clearAllNotifications}
            variant="destructive"
            className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Clear All Notifications
          </Button>

          <Button
            onClick={() => {
              setNotification(
                "/users",
                Math.floor(Math.random() * 10) + 1,
                "info",
              );
              setNotification(
                "/exams",
                Math.floor(Math.random() * 10) + 1,
                "warning",
              );
              setNotification(
                "/questions",
                Math.floor(Math.random() * 20) + 1,
                "success",
              );
              setNotification(
                "/results",
                Math.floor(Math.random() * 5) + 1,
                "error",
              );
            }}
            variant="outline"
            className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Random Notifications
          </Button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How to Use
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>
            • Click the action buttons above to trigger different notifications
          </li>
          <li>• Check the sidebar to see the badge notifications appear</li>
          <li>• Badges show different colors based on notification type</li>
          <li>• Use "Clear" buttons to remove individual notifications</li>
          <li>• Notifications persist in localStorage between sessions</li>
        </ul>
      </div>
    </div>
  );
};
