import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import {
  Moon,
  Sun,
  LogOut,
  Bell,
  User,
  Settings,
  UserCircle,
  BellRing,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useNotificationContext } from "@/context/NotificationContext";
import { notificationService } from "@/services/notificationService";
import toast from "react-hot-toast";

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { getTotalCount, clearAllNotifications: clearSidebarNotifications } =
    useNotificationContext();

  // Theme management
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (theme === "dark" || (!theme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Load notifications
  useEffect(() => {
    const loadNotifications = async () => {
      if (user?.role) {
        try {
          const notificationCounts =
            await notificationService.getNotificationCounts(user.role);

          // Convert notification counts to notification items
          const notificationItems = Object.entries(notificationCounts).map(
            ([path, data]) => ({
              id: path,
              title: getNotificationTitle(path),
              message: getNotificationMessage(path, data.count, user.role),
              type: data.type,
              count: data.count,
              timestamp: new Date(),
              read: false,
              path: path,
            }),
          );

          setNotifications(notificationItems);
          setUnreadCount(notificationItems.length);
        } catch (error) {
          console.error("Failed to load notifications:", error);
        }
      }
    };

    loadNotifications();

    // Refresh notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, [user?.role]);

  const getNotificationTitle = (path) => {
    const titles = {
      "/users": "New Users",
      "/exams": "Exams Update",
      "/questions": "Questions Alert",
      "/results": "Results Available",
      "/enrollments": "Pending Enrollments",
      "/analytics": "Analytics Update",
    };
    return titles[path] || "Notification";
  };

  const getNotificationMessage = (path, count, role) => {
    const messages = {
      "/users": `${count} new user${count > 1 ? "s" : ""} registered`,
      "/exams":
        role === "student"
          ? `${count} exam${count > 1 ? "s" : ""} available`
          : `${count} exam${count > 1 ? "s" : ""} need${count === 1 ? "s" : ""} attention`,
      "/questions": `${count} question${count > 1 ? "s" : ""} need review`,
      "/results":
        role === "student"
          ? `${count} new result${count > 1 ? "s" : ""} available`
          : `${count} result${count > 1 ? "s" : ""} need grading`,
      "/enrollments": `${count} pending enrollment${count > 1 ? "s" : ""}`,
      "/analytics": "New analytics data available",
    };
    return messages[path] || `${count} notification${count > 1 ? "s" : ""}`;
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setIsDark(!isDark);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    localStorage.setItem("theme", newTheme);
    toast.success(`Switched to ${newTheme} mode`);
  };

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleNotificationClick = (notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)),
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    // Navigate to the relevant page
    navigate(notification.path);
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    setUnreadCount(0);
    toast.success("All notifications marked as read");
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
    toast.success("All notifications cleared");
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="h-16 bg-card/95 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-4 md:px-6 fixed top-0 left-0 lg:left-64 right-0 z-10 shadow-sm">
      <div className="flex items-center gap-4 ml-16 lg:ml-0">
        <h2 className="text-lg md:text-xl font-semibold">
          Welcome back, {user?.name?.split(" ")[0]}!
        </h2>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-accent transition-colors"
          title={`Switch to ${isDark ? "light" : "dark"} mode`}>
          {isDark ? (
            <Sun className="h-5 w-5 text-yellow-500" />
          ) : (
            <Moon className="h-5 w-5 text-slate-600" />
          )}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative hover:bg-accent transition-colors">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BellRing className="h-4 w-4" />
                Notifications
              </span>
              {notifications.length > 0 && (
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="h-6 px-2 text-xs"
                    title="Mark all as read">
                    <Check className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllNotifications}
                    className="h-6 px-2 text-xs"
                    title="Clear all">
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="max-h-96 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new notifications</p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className={`p-3 cursor-pointer hover:bg-accent ${
                      !notification.read ? "bg-accent/50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}>
                    <div className="flex items-start gap-3 w-full">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          notification.type === "error"
                            ? "bg-red-500"
                            : notification.type === "warning"
                              ? "bg-yellow-500"
                              : notification.type === "success"
                                ? "bg-green-500"
                                : "bg-blue-500"
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {notification.title}
                          </p>
                          <span className="text-xs text-muted-foreground ml-2">
                            {formatTimeAgo(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <Badge variant="secondary" className="w-fit mt-1">
                  {user?.role}
                </Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/profile")}>
              <UserCircle className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/settings")}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
