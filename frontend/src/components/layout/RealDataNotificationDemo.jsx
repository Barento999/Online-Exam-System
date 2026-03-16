import { useState, useEffect } from "react";
import { useNotificationContext } from "@/context/NotificationContext";
import { useAuth } from "@/context/AuthContext";
import { notificationService } from "@/services/notificationService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  RefreshCw,
  Bell,
  Users,
  FileText,
  ClipboardList,
  BarChart,
  TrendingUp,
  UserPlus,
} from "lucide-react";

export const RealDataNotificationDemo = () => {
  const { notifications, getTotalCount, clearAllNotifications } =
    useNotificationContext();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);

  const refreshNotifications = async () => {
    if (!user?.role) return;

    setLoading(true);
    try {
      const newNotifications = await notificationService.getNotificationCounts(
        user.role,
      );

      // Clear existing and set new notifications
      clearAllNotifications();

      Object.entries(newNotifications).forEach(
        ([path, notification], index) => {
          setTimeout(() => {
            const { setNotification } = useNotificationContext();
            setNotification(path, notification.count, notification.type);
          }, index * 100);
        },
      );

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to refresh notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const getIconForPath = (path) => {
    const iconMap = {
      "/users": Users,
      "/exams": FileText,
      "/questions": ClipboardList,
      "/results": BarChart,
      "/analytics": TrendingUp,
      "/enrollments": UserPlus,
    };
    return iconMap[path] || Bell;
  };

  const getBadgeColor = (type) => {
    const colorMap = {
      info: "bg-blue-500",
      success: "bg-green-500",
      warning: "bg-amber-500",
      error: "bg-red-500",
    };
    return colorMap[type] || "bg-gray-500";
  };

  const getPathLabel = (path) => {
    const labelMap = {
      "/users": "Users",
      "/exams": "Exams",
      "/questions": "Questions",
      "/results": "Results",
      "/analytics": "Analytics",
      "/enrollments": "Enrollments",
    };
    return labelMap[path] || path;
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-3">
          <Bell className="h-8 w-8" />
          Real Data Notifications
        </h2>
        <p className="text-muted-foreground text-lg">
          Live notification badges powered by actual backend data for{" "}
          {user?.role} role.
        </p>
      </div>

      {/* Control Panel */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Notification Control</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Total:</span>
              <Badge variant="secondary" className="text-lg px-3 py-1">
                {getTotalCount()}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={refreshNotifications}
              disabled={loading}
              className="flex items-center gap-2">
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh Notifications
            </Button>

            <Button
              onClick={clearAllNotifications}
              variant="outline"
              className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Clear All
            </Button>
          </div>

          {lastUpdated && (
            <p className="text-sm text-muted-foreground mt-3">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Current Notifications */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Active Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(notifications).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No active notifications</p>
              <p className="text-sm">
                Click "Refresh Notifications" to load data from backend
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(notifications).map(([path, notification]) => {
                const Icon = getIconForPath(path);
                return (
                  <div
                    key={path}
                    className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{getPathLabel(path)}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {notification.type}
                        </p>
                      </div>
                    </div>
                    <div
                      className={`
                      flex items-center justify-center text-xs font-bold rounded-full min-w-[24px] h-[24px] text-white
                      ${getBadgeColor(notification.type)}
                    `}>
                      {notification.count > 99 ? "99+" : notification.count}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Sources */}
      <Card>
        <CardHeader>
          <CardTitle>Data Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">For {user?.role} Role:</h4>
              <ul className="space-y-2 text-sm">
                {user?.role === "admin" && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Users: Total registered users (demo: max 5)
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Exams: Total exams (demo: max 3 as "pending")
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Questions: Total questions (demo: max 8 as "needs review")
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Results: Total results (demo: max 4 as "needs attention")
                    </li>
                  </>
                )}

                {user?.role === "teacher" && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                      Exams: Your exams (demo: max 3 as "pending")
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Questions: Your questions (demo: max 8 as "needs review")
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Results: Student results (demo: max 4 as "needs
                      attention")
                    </li>
                  </>
                )}

                {user?.role === "student" && (
                  <>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Exams: Available exams for you
                    </li>
                    <li className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Results: Your new results (demo: max 2)
                    </li>
                  </>
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">API Endpoints Used:</h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• GET /api/users - User data</li>
                <li>• GET /api/exams - Exam data</li>
                <li>• GET /api/exams/available - Available exams</li>
                <li>• GET /api/questions - Question data</li>
                <li>• GET /api/results - Result data</li>
                <li>• GET /api/enrollments - Enrollment data</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Real Data Integration
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Notifications are fetched from actual backend APIs</li>
          <li>• Data is filtered based on user role and permissions</li>
          <li>
            • Counts are limited for demo purposes (real app would show actual
            counts)
          </li>
          <li>• Auto-refresh every 5 minutes when app loads</li>
          <li>• Notifications clear when users visit relevant pages</li>
        </ul>
      </div>
    </div>
  );
};
