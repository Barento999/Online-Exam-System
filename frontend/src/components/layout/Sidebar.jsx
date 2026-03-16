import { Link, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart,
  Settings,
  GraduationCap,
  UserCircle,
  Menu,
  X,
  UserPlus,
  TrendingUp,
  ChevronDown,
  ChevronRight,
  Eye,
  Plus,
} from "lucide-react";

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpanded = (path) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
    { icon: UserPlus, label: "Enrollments", path: "/enrollments" },
    {
      icon: FileText,
      label: "Exams",
      path: "/exams",
      children: [
        { icon: Eye, label: "View All", path: "/exams" },
        { icon: Plus, label: "Create Exam", path: "/exams/create" },
      ],
    },
    { icon: ClipboardList, label: "Questions", path: "/questions" },
    { icon: BarChart, label: "Results", path: "/results" },
    { icon: TrendingUp, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const teacherMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "My Courses", path: "/courses" },
    { icon: UserPlus, label: "Enrollments", path: "/enrollments" },
    {
      icon: FileText,
      label: "Exams",
      path: "/exams",
      children: [
        { icon: Eye, label: "View All", path: "/exams" },
        { icon: Plus, label: "Create Exam", path: "/exams/create" },
      ],
    },
    { icon: ClipboardList, label: "Question Bank", path: "/questions" },
    { icon: BarChart, label: "Student Results", path: "/results" },
    { icon: TrendingUp, label: "Analytics", path: "/analytics" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  const studentMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Available Exams", path: "/exams" },
    { icon: BarChart, label: "My Results", path: "/results" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];

  const getMenuItems = () => {
    switch (user?.role) {
      case "admin":
        return adminMenuItems;
      case "teacher":
        return teacherMenuItems;
      case "student":
        return studentMenuItems;
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  // Check if a path or its children are active
  const isPathActive = (item) => {
    if (location.pathname === item.path) return true;
    if (item.children) {
      return item.children.some((child) => location.pathname === child.path);
    }
    // Check for nested routes (e.g., /exams/:id/take should highlight /exams)
    return location.pathname.startsWith(item.path + "/");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg",
          "bg-sidebar text-sidebar-foreground border border-sidebar-border",
          "hover:bg-sidebar-accent transition-all duration-200",
          "hover:scale-110 active:scale-95",
        )}>
        {isOpen ? (
          <X className="h-6 w-6 transition-transform duration-200 rotate-90" />
        ) : (
          <Menu className="h-6 w-6 transition-transform duration-200" />
        )}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col",
          "fixed left-0 top-0 border-r border-sidebar-border z-40",
          "transition-all duration-300 ease-in-out",
          isOpen
            ? "translate-x-0 shadow-2xl"
            : "-translate-x-full lg:translate-x-0",
        )}>
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <GraduationCap className="h-8 w-8 text-sidebar-primary transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-sidebar-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div>
              <h1 className="text-xl font-semibold transition-colors duration-200 group-hover:text-sidebar-primary">
                Exam System
              </h1>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {user?.role} Panel
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
          <ul className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = isPathActive(item);
              const isExpanded = expandedItems[item.path];
              const hasChildren = item.children && item.children.length > 0;

              return (
                <li
                  key={item.path}
                  className="animate-in slide-in-from-left-4 fade-in"
                  style={{
                    animationDelay: `${index * 50}ms`,
                    animationDuration: "300ms",
                    animationFillMode: "both",
                  }}>
                  {/* Parent Item */}
                  <div className="relative">
                    {hasChildren ? (
                      <button
                        onClick={() => toggleExpanded(item.path)}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg",
                          "transition-all duration-200 ease-out group relative overflow-hidden",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1",
                        )}>
                        {/* Active indicator bar */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary-foreground rounded-r-full animate-in slide-in-from-left-2 duration-300" />
                        )}

                        {/* Shimmer effect */}
                        <div
                          className={cn(
                            "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700",
                            "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                            "skew-x-12",
                          )}
                        />

                        <Icon
                          className={cn(
                            "h-5 w-5 transition-all duration-200",
                            isActive
                              ? "scale-110"
                              : "group-hover:scale-110 group-hover:rotate-12",
                          )}
                        />
                        <span className="flex-1 text-left font-medium">
                          {item.label}
                        </span>
                        {hasChildren &&
                          (isExpanded ? (
                            <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                          ) : (
                            <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                          ))}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-lg",
                          "transition-all duration-200 ease-out group relative overflow-hidden",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1",
                        )}>
                        {/* Active indicator bar */}
                        {isActive && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-sidebar-primary-foreground rounded-r-full animate-in slide-in-from-left-2 duration-300" />
                        )}

                        {/* Shimmer effect */}
                        <div
                          className={cn(
                            "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700",
                            "bg-gradient-to-r from-transparent via-white/10 to-transparent",
                            "skew-x-12",
                          )}
                        />

                        <Icon
                          className={cn(
                            "h-5 w-5 transition-all duration-200",
                            isActive
                              ? "scale-110"
                              : "group-hover:scale-110 group-hover:rotate-12",
                          )}
                        />
                        <span className="font-medium">{item.label}</span>
                      </Link>
                    )}
                  </div>

                  {/* Children Items */}
                  {hasChildren && (
                    <div
                      className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out",
                        isExpanded
                          ? "max-h-96 opacity-100 mt-1"
                          : "max-h-0 opacity-0",
                      )}>
                      <ul className="ml-4 pl-4 border-l-2 border-sidebar-border/50 space-y-1">
                        {item.children.map((child, childIndex) => {
                          const ChildIcon = child.icon;
                          const isChildActive =
                            location.pathname === child.path;

                          return (
                            <li
                              key={child.path}
                              className="animate-in slide-in-from-left-2 fade-in"
                              style={{
                                animationDelay: `${childIndex * 50}ms`,
                                animationDuration: "200ms",
                                animationFillMode: "both",
                              }}>
                              <Link
                                to={child.path}
                                onClick={() => setIsOpen(false)}
                                className={cn(
                                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm",
                                  "transition-all duration-200 ease-out group relative overflow-hidden",
                                  isChildActive
                                    ? "bg-sidebar-primary/80 text-sidebar-primary-foreground shadow-sm"
                                    : "text-sidebar-foreground/80 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 hover:translate-x-1",
                                )}>
                                {/* Active indicator dot */}
                                {isChildActive && (
                                  <div className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-sidebar-primary-foreground rounded-full animate-in zoom-in duration-200" />
                                )}

                                <ChildIcon
                                  className={cn(
                                    "h-4 w-4 transition-all duration-200",
                                    isChildActive
                                      ? "scale-110"
                                      : "group-hover:scale-110",
                                  )}
                                />
                                <span>{child.label}</span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-sidebar-accent transition-all duration-200 group cursor-pointer">
            <div className="relative">
              <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold transition-transform duration-200 group-hover:scale-110">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 rounded-full bg-sidebar-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover:text-sidebar-primary transition-colors duration-200">
                {user?.name}
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                {user?.email}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
