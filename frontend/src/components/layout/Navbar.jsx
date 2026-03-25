import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";
import {
  Moon,
  Sun,
  LogOut,
  Bell,
  Settings,
  UserCircle,
  BellRing,
  Check,
  X,
  Plus,
  BookOpen,
  BarChart3,
  Users,
  FileText,
  HelpCircle,
  Zap,
  Activity,
  Search,
  Command,
  ArrowRight,
  Hash,
  User,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { notificationService } from "@/services/notificationService";
import { searchService } from "@/services/searchService";
import toast from "react-hot-toast";

export const Navbar = ({ isCollapsed = false, isMobile = false }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [userStats, setUserStats] = useState({
    examsToday: 0,
    pendingTasks: 0,
    recentActivity: "Active 2h ago",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchInputRef = useRef(null);
  const searchResultsRef = useRef([]);

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

  // Load notifications and user stats
  useEffect(() => {
    const loadNotifications = async () => {
      if (user?.role) {
        try {
          const notificationCounts =
            await notificationService.getNotificationCounts(
              user.role,
              user._id,
            );

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

          // Load user stats (mock data - replace with real API calls)
          setUserStats({
            examsToday: user.role === "student" ? 2 : 5,
            pendingTasks: notificationItems.length,
            recentActivity: "Active now",
          });
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

  // Auto-scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && searchResultsRef.current[selectedIndex]) {
      searchResultsRef.current[selectedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [selectedIndex]);

  // Search functionality
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd/Ctrl + K to open search
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
        setSelectedIndex(-1);
        // Focus the input after a short delay to ensure it's rendered
        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 150);
      }
      // Escape to close search
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
        setSelectedIndex(-1);
        if (searchInputRef.current) {
          searchInputRef.current.blur();
        }
      }
      // Arrow key navigation
      if (isSearchOpen && searchResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) =>
            prev < searchResults.length - 1 ? prev + 1 : prev,
          );
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === "Enter" && selectedIndex >= 0) {
          e.preventDefault();
          handleSearchSelect(searchResults[selectedIndex]);
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen, searchResults, selectedIndex]);

  // Debounced search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      setIsSearching(false);
      setSelectedIndex(-1);
      return;
    }

    setIsSearching(true);
    setSelectedIndex(-1);
    const timeoutId = setTimeout(async () => {
      try {
        const results = await performSearch(searchQuery);
        setSearchResults(results);
      } catch (error) {
        console.error("Search failed:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const performSearch = async (query) => {
    try {
      // Save to recent searches
      searchService.saveRecentSearch(query);

      // Perform the actual search
      const results = await searchService.globalSearch(query, user?.role, 8);

      // Map results to include proper icons
      return results.map((result) => ({
        ...result,
        icon: getIconForType(result.type),
      }));
    } catch (error) {
      console.error("Search failed:", error);
      // Fallback to mock results if search service fails
      return getMockResults(query);
    }
  };

  const getIconForType = (type) => {
    const iconMap = {
      exam: BookOpen,
      question: Hash,
      user: User,
      course: GraduationCap,
      result: BarChart3,
    };
    return iconMap[type] || FileText;
  };

  const getMockResults = (query) => {
    const mockResults = [
      {
        id: 1,
        type: "exam",
        title: "Mathematics Final Exam",
        description: "Advanced calculus and algebra",
        path: "/exams", // Navigate to exams list page
        icon: BookOpen,
        category: "Exams",
      },
      {
        id: 2,
        type: "question",
        title: "Quadratic Equations",
        description:
          "Multiple choice question about solving quadratic equations",
        path: "/questions", // Navigate to questions list page
        icon: Hash,
        category: "Questions",
      },
      {
        id: 3,
        type: "user",
        title: "John Smith",
        description: "Student - Computer Science",
        path: "/users", // Navigate to users list page
        icon: User,
        category: "Users",
      },
      {
        id: 4,
        type: "course",
        title: "Introduction to Programming",
        description: "CS101 - Fall 2024",
        path: "/courses", // Navigate to courses list page
        icon: GraduationCap,
        category: "Courses",
      },
    ];

    return mockResults
      .filter((result) => {
        const matchesQuery =
          result.title.toLowerCase().includes(query.toLowerCase()) ||
          result.description.toLowerCase().includes(query.toLowerCase());

        // Role-based filtering
        if (user?.role === "student") {
          return matchesQuery && ["exam", "course"].includes(result.type);
        }

        return matchesQuery;
      })
      .slice(0, 8);
  };

  const handleSearchSelect = (result) => {
    // Store the selected item info for potential use on the target page
    if (result.metadata) {
      sessionStorage.setItem(
        "searchSelectedItem",
        JSON.stringify({
          type: result.type,
          id:
            result.metadata.examId ||
            result.metadata.questionId ||
            result.metadata.userId ||
            result.metadata.courseId,
          title: result.title,
          timestamp: Date.now(),
        }),
      );
    }

    navigate(result.path);
    setIsSearchOpen(false);
    setSearchQuery("");
    setSearchResults([]);
    toast.success(`Opening ${result.title}`);
  };

  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => searchInputRef.current?.focus(), 100);
  };

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
    const userName = user?.name || "User";
    logout();
    toast.success(`Goodbye, ${userName}! See you soon.`, {
      icon: "👋",
      duration: 3000,
    });
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

  const handleQuickAction = (action) => {
    switch (action) {
      case "create-exam":
        navigate("/exams?action=create");
        toast.success("Creating new exam...");
        break;
      case "create-question":
        navigate("/questions?action=create");
        toast.success("Adding new question...");
        break;
      case "view-results":
        navigate("/results");
        break;
      case "take-exam":
        navigate("/exams");
        break;
      case "view-analytics":
        navigate("/analytics");
        break;
      case "manage-users":
        navigate("/users");
        break;
      case "help":
        // In a real app, this might open a help modal or external documentation
        toast.info("Help documentation coming soon!");
        break;
      default:
        break;
    }
  };

  const getQuickActions = () => {
    const baseActions = [
      {
        id: "help",
        label: "Help & Support",
        icon: HelpCircle,
        description: "Get help and documentation",
      },
    ];

    switch (user?.role) {
      case "admin":
        return [
          {
            id: "create-exam",
            label: "Create Exam",
            icon: Plus,
            description: "Create a new exam",
          },
          {
            id: "manage-users",
            label: "Manage Users",
            icon: Users,
            description: "View and manage users",
          },
          {
            id: "view-analytics",
            label: "View Analytics",
            icon: BarChart3,
            description: "Check system analytics",
          },
          ...baseActions,
        ];
      case "teacher":
        return [
          {
            id: "create-exam",
            label: "Create Exam",
            icon: Plus,
            description: "Create a new exam",
          },
          {
            id: "create-question",
            label: "Add Question",
            icon: FileText,
            description: "Add new question",
          },
          {
            id: "view-results",
            label: "View Results",
            icon: BarChart3,
            description: "Check exam results",
          },
          ...baseActions,
        ];
      case "student":
        return [
          {
            id: "take-exam",
            label: "Take Exam",
            icon: BookOpen,
            description: "View available exams",
          },
          {
            id: "view-results",
            label: "My Results",
            icon: BarChart3,
            description: "Check my exam results",
          },
          ...baseActions,
        ];
      default:
        return baseActions;
    }
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
    <div
      className={cn(
        "h-16 bg-card/95 backdrop-blur-sm border-b border-border/50 flex items-center justify-between px-2 sm:px-4 md:px-6 fixed top-0 right-0 z-10 shadow-sm transition-all duration-300 ease-out gap-1 sm:gap-2",
        // Adjust left position based on sidebar state
        isMobile ? "left-0" : isCollapsed ? "left-20" : "left-64",
      )}>
      {/* Welcome Message - Visible on all screens */}
      <div className="flex items-center min-w-0 flex-shrink pl-14 lg:pl-0">
        <h2 className="text-md sm:text-base md:text-lg lg:text-xl font-semibold truncate text-black dark:text-white">
          <span className="hidden sm:inline">Welcome back, </span>
          <span className="sm:hidden">Hi, </span>
          {user?.name?.split(" ")[0]}!
        </h2>
      </div>

      {/* Search Bar - Hidden on mobile, shown on tablet+ */}
      <div className="flex-1 max-w-[240px] sm:max-w-xs mx-2 sm:mx-4 relative hidden md:block">
        <div className="relative">
          <div
            className="flex items-center w-full h-10 px-3 rounded-md border-2 border-border bg-background hover:bg-accent/50 transition-colors cursor-text focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20"
            onClick={() => searchInputRef.current?.focus()}>
            <Search className="mr-2 h-4 w-4 text-muted-foreground flex-shrink-0" />
            <Input
              ref={searchInputRef}
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
              onBlur={() => {
                // Delay closing to allow clicking on results
                setTimeout(() => setIsSearchOpen(false), 200);
              }}
              className="flex-1 border-0 bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground"
            />
            <div className="ml-auto flex items-center gap-1 flex-shrink-0">
              {searchQuery ? (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-5 w-5 p-0 hover:bg-transparent"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSearchQuery("");
                    setSearchResults([]);
                  }}>
                  <X className="h-3 w-3" />
                </Button>
              ) : (
                <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <Command className="h-3 w-3" />K
                </kbd>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Search Dropdown - Only for desktop search bar */}
      <div className="hidden md:block absolute top-full left-1/2 -translate-x-1/2 w-full max-w-md mt-2 z-50">
        {isSearchOpen && (
          <div
            className="bg-card border-2 border-border rounded-lg shadow-xl max-h-96 overflow-hidden"
            onMouseDown={(e) => e.preventDefault()}>
            <div className="max-h-80 overflow-y-auto">
              {isSearching ? (
                <div className="p-4 text-center text-muted-foreground">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="py-2">
                  {searchResults.map((result, index) => {
                    const IconComponent = result.icon;
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={result.id}
                        ref={(el) => (searchResultsRef.current[index] = el)}
                        className={cn(
                          "w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-3 group transition-colors",
                          isSelected && "bg-accent",
                        )}
                        onClick={() => handleSearchSelect(result)}
                        onMouseEnter={() => setSelectedIndex(index)}>
                        <div className="flex-shrink-0">
                          <IconComponent className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {result.title}
                            </p>
                            <Badge variant="secondary" className="text-xs ml-2">
                              {result.category}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground truncate mt-1">
                            {result.description}
                          </p>
                        </div>
                        <ArrowRight
                          className={cn(
                            "h-3 w-3 text-muted-foreground transition-opacity",
                            isSelected
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100",
                          )}
                        />
                      </button>
                    );
                  })}
                </div>
              ) : searchQuery.trim() ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">
                    No results found for "{searchQuery}"
                  </p>
                  <p className="text-xs mt-1">
                    Try different keywords or check spelling
                  </p>
                </div>
              ) : (
                <div className="p-4">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold text-foreground">
                      Quick Search
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-default">
                        <BookOpen className="h-4 w-4 text-primary" />
                        <span className="text-sm">Exams</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-default">
                        <Hash className="h-4 w-4 text-primary" />
                        <span className="text-sm">Questions</span>
                      </div>
                      {user?.role !== "student" && (
                        <>
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-default">
                            <User className="h-4 w-4 text-primary" />
                            <span className="text-sm">Users</span>
                          </div>
                          <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-default">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            <span className="text-sm">Courses</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Search Modal - Only for mobile search button */}
      <div className="md:hidden">
        {isSearchOpen && (
          <>
            <div className="fixed top-16 left-0 right-0 bg-card border-t shadow-lg z-50 max-h-[calc(100vh-4rem)] overflow-hidden">
              <div className="p-3 border-b sticky top-0 bg-card z-10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    ref={searchInputRef}
                    placeholder="Search exams, questions, users..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
                    onClick={() => setIsSearchOpen(false)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((result, index) => {
                      const IconComponent = result.icon;
                      const isSelected = index === selectedIndex;
                      return (
                        <button
                          key={result.id}
                          ref={(el) => (searchResultsRef.current[index] = el)}
                          className={cn(
                            "w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-3 group transition-colors",
                            isSelected && "bg-accent",
                          )}
                          onClick={() => handleSearchSelect(result)}
                          onTouchStart={() => setSelectedIndex(index)}>
                          <div className="flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {result.title}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs ml-2">
                                {result.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {result.description}
                            </p>
                          </div>
                          <ArrowRight
                            className={cn(
                              "h-3 w-3 text-muted-foreground transition-opacity",
                              isSelected
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100",
                            )}
                          />
                        </button>
                      );
                    })}
                  </div>
                ) : searchQuery.trim() ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">
                      No results found for "{searchQuery}"
                    </p>
                    <p className="text-xs mt-1">
                      Try different keywords or check spelling
                    </p>
                  </div>
                ) : (
                  <div className="p-4">
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground">
                        Quick Search
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-default">
                          <BookOpen className="h-4 w-4 text-primary" />
                          <span className="text-sm">Exams</span>
                        </div>
                        <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-default">
                          <Hash className="h-4 w-4 text-primary" />
                          <span className="text-sm">Questions</span>
                        </div>
                        {user?.role !== "student" && (
                          <>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-default">
                              <User className="h-4 w-4 text-primary" />
                              <span className="text-sm">Users</span>
                            </div>
                            <div className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors cursor-default">
                              <GraduationCap className="h-4 w-4 text-primary" />
                              <span className="text-sm">Courses</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/20 z-40"
              onClick={() => setIsSearchOpen(false)}
            />
          </>
        )}
      </div>

      {/* Action Buttons - Compact on mobile */}
      <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
        {/* Mobile Search Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={openSearch}
          className="rounded-full hover:bg-accent transition-colors md:hidden"
          title="Search">
          <Search className="h-5 w-5" />
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="rounded-full hover:bg-accent transition-colors"
          title={`Switch to ${isDark ? "light" : "dark"} mode`}>
          {isDark ? (
            <Sun className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
          ) : (
            <Moon className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600" />
          )}
        </Button>

        {/* Notifications Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full relative hover:bg-accent transition-colors">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              {unreadCount > 0 && (
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center p-0 text-[10px] sm:text-xs">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80">
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

        {/* Enhanced User Profile Dropdown with Quick Actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-full">
              <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                <AvatarImage src={user?.avatar} alt={user?.name} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs sm:text-sm">
                  {getInitials(user?.name)}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-72 sm:w-80" align="end" forceMount>
            {/* User Info Header */}
            <DropdownMenuLabel className="font-normal p-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.avatar} alt={user?.name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                    {getInitials(user?.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {user?.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {user?.role}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Activity className="h-3 w-3" />
                      {userStats.recentActivity}
                    </div>
                  </div>
                </div>
              </div>
            </DropdownMenuLabel>

            {/* Quick Stats */}
            <div className="px-4 pb-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-accent/50 rounded-lg p-2 text-center">
                  <div className="font-semibold text-primary">
                    {userStats.examsToday}
                  </div>
                  <div className="text-muted-foreground">
                    {user?.role === "student" ? "Exams Today" : "Active Exams"}
                  </div>
                </div>
                <div className="bg-accent/50 rounded-lg p-2 text-center">
                  <div className="font-semibold text-primary">
                    {userStats.pendingTasks}
                  </div>
                  <div className="text-muted-foreground">Pending Tasks</div>
                </div>
              </div>
            </div>

            <DropdownMenuSeparator />

            {/* Quick Actions */}
            <div className="px-2 py-1">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                Quick Actions
              </div>
              {getQuickActions().map((action) => {
                const IconComponent = action.icon;
                return (
                  <DropdownMenuItem
                    key={action.id}
                    onClick={() => handleQuickAction(action.id)}
                    className="cursor-pointer px-2 py-2">
                    <div className="flex items-center space-x-3 w-full">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {action.label}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {action.description}
                        </div>
                      </div>
                      <Zap className="h-3 w-3 text-muted-foreground" />
                    </div>
                  </DropdownMenuItem>
                );
              })}
            </div>

            <DropdownMenuSeparator />

            {/* Account Management */}
            <div className="px-2 py-1">
              <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                Account
              </div>
              <DropdownMenuItem
                onClick={() => navigate("/profile")}
                className="px-2 py-2">
                <UserCircle className="mr-3 h-4 w-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Profile</div>
                  <div className="text-xs text-muted-foreground">
                    Manage your account
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/settings")}
                className="px-2 py-2">
                <Settings className="mr-3 h-4 w-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Settings</div>
                  <div className="text-xs text-muted-foreground">
                    Preferences & privacy
                  </div>
                </div>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator />

            {/* Logout */}
            <div className="px-2 py-1">
              <DropdownMenuItem
                onClick={handleLogout}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950 px-2 py-2">
                <LogOut className="mr-3 h-4 w-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">Log out</div>
                  <div className="text-xs opacity-75">
                    Sign out of your account
                  </div>
                </div>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
