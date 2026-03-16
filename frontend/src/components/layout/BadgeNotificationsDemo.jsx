import { useState } from "react";
import {
  Bell,
  AlertCircle,
  CheckCircle,
  Info,
  AlertTriangle,
} from "lucide-react";

export const BadgeNotificationsDemo = () => {
  const [notifications, setNotifications] = useState({
    users: { count: 3, type: "info" },
    exams: { count: 5, type: "warning" },
    questions: { count: 12, type: "success" },
    results: { count: 2, type: "error" },
    analytics: { count: 1, type: "info" },
    enrollments: { count: 7, type: "warning" },
  });

  const badgeTypes = [
    { type: "info", color: "bg-blue-500", icon: Info, label: "Info" },
    {
      type: "success",
      color: "bg-green-500",
      icon: CheckCircle,
      label: "Success",
    },
    {
      type: "warning",
      color: "bg-amber-500",
      icon: AlertTriangle,
      label: "Warning",
    },
    { type: "error", color: "bg-red-500", icon: AlertCircle, label: "Error" },
  ];

  const updateNotification = (key, count, type) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: { count: parseInt(count) || 0, type },
    }));
  };

  const clearNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: { count: 0, type: prev[key].type },
    }));
  };

  const NotificationBadge = ({ count, type, size = "normal" }) => {
    if (!count || count === 0) return null;

    const getBadgeStyles = () => {
      const baseStyles =
        "flex items-center justify-center text-xs font-bold rounded-full transition-all duration-200";

      switch (type) {
        case "error":
          return `${baseStyles} bg-red-500 text-white`;
        case "warning":
          return `${baseStyles} bg-amber-500 text-white`;
        case "success":
          return `${baseStyles} bg-green-500 text-white`;
        case "info":
        default:
          return `${baseStyles} bg-blue-500 text-white`;
      }
    };

    const sizeStyles =
      size === "small"
        ? "min-w-[16px] h-[16px] text-[10px]"
        : "min-w-[20px] h-[20px] text-[11px]";
    const displayCount = count > 99 ? "99+" : count.toString();

    return (
      <div
        className={`${getBadgeStyles()} ${sizeStyles} ${count > 9 ? "px-1" : ""} notification-badge`}>
        {displayCount}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Badge Notifications System</h2>
        <p className="text-muted-foreground text-lg">
          Dynamic notification badges for menu items with different types and
          counts.
        </p>
      </div>

      {/* Badge Types */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {badgeTypes.map((badge) => {
          const Icon = badge.icon;
          return (
            <div key={badge.type} className="p-4 border rounded-lg text-center">
              <div className="flex items-center justify-center mb-2">
                <Icon className="h-6 w-6 mr-2" />
                <NotificationBadge count={5} type={badge.type} />
              </div>
              <h3 className="font-semibold">{badge.label}</h3>
              <p className="text-sm text-muted-foreground">{badge.type}</p>
            </div>
          );
        })}
      </div>

      {/* Current Notifications */}
      <div className="bg-muted/50 rounded-xl p-6 mb-8">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Current Menu Notifications
        </h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(notifications).map(([key, notification]) => (
            <div
              key={key}
              className="flex items-center justify-between p-3 bg-background rounded-lg border">
              <div className="flex items-center gap-3">
                <span className="font-medium capitalize">{key}</span>
                <NotificationBadge
                  count={notification.count}
                  type={notification.type}
                />
              </div>
              <button
                onClick={() => clearNotification(key)}
                className="text-xs px-2 py-1 bg-muted rounded hover:bg-muted/80 transition-colors">
                Clear
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-card border rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Notification Controls</h3>
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(notifications).map(([key, notification]) => (
            <div key={key} className="space-y-3">
              <label className="block text-sm font-medium capitalize">
                {key}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0"
                  max="999"
                  value={notification.count}
                  onChange={(e) =>
                    updateNotification(key, e.target.value, notification.type)
                  }
                  className="flex-1 px-3 py-2 border rounded-lg text-sm"
                  placeholder="Count"
                />
                <select
                  value={notification.type}
                  onChange={(e) =>
                    updateNotification(key, notification.count, e.target.value)
                  }
                  className="px-3 py-2 border rounded-lg text-sm">
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="mt-8 grid md:grid-cols-2 gap-6">
        <div className="p-6 border rounded-xl">
          <h4 className="font-semibold mb-3">Badge Features</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Dynamic count display (1-99+)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Multiple badge types (info, success, warning, error)
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Responsive sizing for collapsed/expanded states
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Smooth animations and transitions
            </li>
          </ul>
        </div>

        <div className="p-6 border rounded-xl">
          <h4 className="font-semibold mb-3">Use Cases</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              New user registrations
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
              Pending exam reviews
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Completed tasks
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              System alerts
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          Implementation Notes
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Badges automatically hide when count is 0</li>
          <li>• Different positioning for collapsed vs expanded sidebar</li>
          <li>• Color-coded by notification type for quick recognition</li>
          <li>• Smooth animations with CSS keyframes</li>
          <li>• Accessible with proper contrast ratios</li>
        </ul>
      </div>
    </div>
  );
};
