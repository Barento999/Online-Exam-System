import { Link, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useNotificationContext } from "@/context/NotificationContext";
import { useState, useEffect, useRef } from "react";
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
  PanelLeftClose,
  PanelLeft,
} from "lucide-react";

export const Sidebar = ({ isCollapsed, setIsCollapsed }) => {
  const { user } = useAuth();
  const { getNotification } = useNotificationContext();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const [dragCurrentX, setDragCurrentX] = useState(0);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  // Enhanced mobile drawer with swipe gestures
  useEffect(() => {
    const handleTouchStart = (e) => {
      if (window.innerWidth >= 1024) return; // Only on mobile

      const touch = e.touches[0];
      const startX = touch.clientX;

      // Allow opening from left edge (within 20px)
      if (!isOpen && startX <= 20) {
        setIsDragging(true);
        setDragStartX(startX);
        setDragCurrentX(startX);
      }
      // Allow closing when drawer is open
      else if (isOpen) {
        setIsDragging(true);
        setDragStartX(startX);
        setDragCurrentX(startX);
      }
    };

    const handleTouchMove = (e) => {
      if (!isDragging || window.innerWidth >= 1024) return;

      e.preventDefault();
      const touch = e.touches[0];
      setDragCurrentX(touch.clientX);
    };

    const handleTouchEnd = () => {
      if (!isDragging || window.innerWidth >= 1024) return;

      const dragDistance = dragCurrentX - dragStartX;
      const threshold = 50; // Minimum drag distance to trigger action

      if (!isOpen && dragDistance > threshold) {
        setIsOpen(true);
      } else if (isOpen && dragDistance < -threshold) {
        setIsOpen(false);
      }

      setIsDragging(false);
      setDragStartX(0);
      setDragCurrentX(0);
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });
    document.addEventListener("touchmove", handleTouchMove, { passive: false });
    document.addEventListener("touchend", handleTouchEnd);

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
      document.removeEventListener("touchmove", handleTouchMove);
      document.removeEventListener("touchend", handleTouchEnd);
    };
  }, [isOpen, isDragging, dragStartX, dragCurrentX]);

  // Close drawer on route change (mobile)
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Prevent body scroll when drawer is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleExpanded = (path) => {
    setExpandedItems((prev) => ({
      ...prev,
      [path]: !prev[path],
    }));
  };

  // Calculate transform for drag gesture
  const getDragTransform = () => {
    if (!isDragging) return "";

    const dragDistance = dragCurrentX - dragStartX;

    if (!isOpen) {
      // Opening gesture - translate from closed position
      const translateX = Math.max(-256, Math.min(0, -256 + dragDistance));
      return `translateX(${translateX}px)`;
    } else {
      // Closing gesture - translate from open position
      const translateX = Math.max(-256, Math.min(0, dragDistance));
      return `translateX(${translateX}px)`;
    }
  };

  const getOverlayOpacity = () => {
    if (!isDragging) return "";

    const dragDistance = dragCurrentX - dragStartX;

    if (!isOpen) {
      // Opening gesture
      const progress = Math.max(0, Math.min(1, dragDistance / 256));
      return { opacity: progress * 0.5 };
    } else {
      // Closing gesture
      const progress = Math.max(0, Math.min(1, 1 + dragDistance / 256));
      return { opacity: progress * 0.5 };
    }
  };

  // Badge component
  const NotificationBadge = ({ count, type, isCollapsed }) => {
    if (!count || count === 0) return null;

    const getBadgeStyles = () => {
      const baseStyles =
        "absolute flex items-center justify-center text-xs font-bold rounded-full transition-all duration-200 animate-in zoom-in notification-badge";

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

    const displayCount = count > 99 ? "99+" : count.toString();

    if (isCollapsed) {
      return (
        <div
          className={cn(
            getBadgeStyles(),
            "top-1 right-1 min-w-[18px] h-[18px] text-[10px]",
            count > 9 ? "px-1" : "",
          )}>
          {displayCount}
        </div>
      );
    }

    return (
      <div
        className={cn(
          getBadgeStyles(),
          "top-1/2 -translate-y-1/2 right-3 min-w-[20px] h-[20px] text-[11px]",
          count > 9 ? "px-1.5" : "",
        )}>
        {displayCount}
      </div>
    );
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
      {/* Enhanced Mobile Menu Button - Centered in Navbar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "lg:hidden fixed top-2 left-1 z-50 h-12 w-14 flex items-center justify-center mobile-menu-button rounded-lg",
          "bg-sidebar/95 backdrop-blur-sm text-sidebar-foreground",
          "border border-sidebar-border/50 shadow-lg",
          "hover:bg-sidebar-accent transition-all duration-300",
          "hover:scale-105 active:scale-95 haptic-feedback",
          "focus:outline-none focus:ring-2 focus:ring-sidebar-primary/50",
          isOpen && "bg-sidebar-accent",
        )}>
        <div className="relative">
          {isOpen ? (
            <X className="h-5 w-5 transition-all duration-300 rotate-180 scale-110" />
          ) : (
            <Menu className="h-5 w-5 transition-all duration-300" />
          )}
          {/* Ripple effect */}
          <div className="absolute inset-0 rounded-xl bg-sidebar-primary/20 scale-0 group-active:scale-150 transition-transform duration-200" />
        </div>
      </button>

      {/* Enhanced Overlay for mobile with drag support */}
      {(isOpen || isDragging) && (
        <div
          ref={overlayRef}
          className="lg:hidden fixed inset-0 z-30 transition-all duration-300"
          style={{
            backgroundColor: `rgba(0, 0, 0, ${isDragging ? getOverlayOpacity().opacity || 0.5 : 0.5})`,
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Swipe indicator for mobile */}
      {!isOpen && (
        <div className="lg:hidden fixed left-0 top-1/2 -translate-y-1/2 w-1 h-16 bg-sidebar-primary/30 rounded-r-full z-20 swipe-indicator" />
      )}

      {/* Enhanced Sidebar with drag support */}
      <div
        ref={sidebarRef}
        className={cn(
          "h-screen bg-sidebar/95 backdrop-blur-sm text-sidebar-foreground flex flex-col",
          "fixed left-0 top-0 border-r border-sidebar-border/50 z-40",
          "shadow-2xl lg:shadow-none mobile-drawer-scroll",
          "transition-all duration-300 ease-out",
          isCollapsed ? "w-20" : "w-64",
          // Enhanced mobile animations
          isOpen || isDragging
            ? "translate-x-0 lg:translate-x-0"
            : "-translate-x-full lg:translate-x-0",
          isDragging && "dragging",
        )}
        style={{
          transform: isDragging ? getDragTransform() : undefined,
          transition: isDragging ? "none" : undefined,
        }}>
        {/* Header */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 group">
            <div className="relative">
              <GraduationCap
                className={cn(
                  "text-sidebar-primary transition-all duration-300",
                  "group-hover:scale-110 group-hover:rotate-12",
                  isCollapsed ? "h-6 w-6" : "h-8 w-8",
                )}
              />
              <div className="absolute inset-0 bg-sidebar-primary/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {!isCollapsed && (
              <div className="animate-in fade-in slide-in-from-left-2 duration-200">
                <h1 className="text-xl font-semibold transition-colors duration-200 group-hover:text-sidebar-primary">
                  Exam System
                </h1>
                <p className="text-xs text-sidebar-foreground/60 capitalize">
                  {user?.role} Panel
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Desktop Collapse Toggle Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "hidden lg:flex items-center justify-center",
            "mx-2 mt-2 p-2 rounded-lg",
            "bg-sidebar-accent/50 hover:bg-sidebar-accent",
            "text-sidebar-foreground transition-all duration-200",
            "hover:scale-105 active:scale-95 group",
          )}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
          {isCollapsed ? (
            <PanelLeft className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
          ) : (
            <>
              <PanelLeftClose className="h-5 w-5 transition-transform duration-200 group-hover:scale-110" />
              <span className="ml-2 text-sm font-medium">Collapse</span>
            </>
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 mobile-drawer-scroll scrollbar-thin scrollbar-thumb-sidebar-border scrollbar-track-transparent">
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
                  <div className="relative group/item">
                    {hasChildren ? (
                      <button
                        onClick={() =>
                          !isCollapsed && toggleExpanded(item.path)
                        }
                        className={cn(
                          "w-full flex items-center rounded-lg mobile-nav-item",
                          "transition-all duration-200 ease-out group relative overflow-hidden",
                          isCollapsed
                            ? "justify-center p-3"
                            : "gap-3 px-4 py-3",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1",
                        )}
                        title={isCollapsed ? item.label : undefined}>
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
                            "h-5 w-5 transition-all duration-200 flex-shrink-0",
                            isActive
                              ? "scale-110"
                              : "group-hover:scale-110 group-hover:rotate-12",
                          )}
                        />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-left font-medium">
                              {item.label}
                            </span>
                            {hasChildren &&
                              (isExpanded ? (
                                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
                              ) : (
                                <ChevronRight className="h-4 w-4 transition-transform duration-200" />
                              ))}
                          </>
                        )}

                        {/* Notification Badge */}
                        {(() => {
                          const badge = getNotification(item.path);
                          return (
                            badge && (
                              <NotificationBadge
                                count={badge.count}
                                type={badge.type}
                                isCollapsed={isCollapsed}
                              />
                            )
                          );
                        })()}
                      </button>
                    ) : (
                      <Link
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                        className={cn(
                          "flex items-center rounded-lg mobile-nav-item",
                          "transition-all duration-200 ease-out group relative overflow-hidden",
                          isCollapsed
                            ? "justify-center p-3"
                            : "gap-3 px-4 py-3",
                          isActive
                            ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-md"
                            : "text-sidebar-foreground hover:bg-sidebar-accent hover:translate-x-1",
                        )}
                        title={isCollapsed ? item.label : undefined}>
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
                            "h-5 w-5 transition-all duration-200 flex-shrink-0",
                            isActive
                              ? "scale-110"
                              : "group-hover:scale-110 group-hover:rotate-12",
                          )}
                        />
                        {!isCollapsed && (
                          <span className="font-medium">{item.label}</span>
                        )}

                        {/* Notification Badge */}
                        {(() => {
                          const badge = getNotification(item.path);
                          return (
                            badge && (
                              <NotificationBadge
                                count={badge.count}
                                type={badge.type}
                                isCollapsed={isCollapsed}
                              />
                            )
                          );
                        })()}
                      </Link>
                    )}

                    {/* Tooltip for collapsed state */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-sidebar-primary text-sidebar-primary-foreground text-sm font-medium rounded-lg shadow-lg opacity-0 invisible group-hover/item:opacity-100 group-hover/item:visible transition-all duration-200 whitespace-nowrap z-50">
                        {item.label}
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-sidebar-primary" />
                      </div>
                    )}
                  </div>

                  {/* Children Items */}
                  {hasChildren && !isCollapsed && (
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
                                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm mobile-nav-item",
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
                                <span className="flex-1">{child.label}</span>

                                {/* Child Notification Badge */}
                                {(() => {
                                  const badge = getNotification(child.path);
                                  return (
                                    badge && (
                                      <div
                                        className={cn(
                                          "flex items-center justify-center text-xs font-bold rounded-full transition-all duration-200 animate-in zoom-in min-w-[16px] h-[16px] notification-badge",
                                          badge.type === "error"
                                            ? "bg-red-500 text-white"
                                            : badge.type === "warning"
                                              ? "bg-amber-500 text-white"
                                              : badge.type === "success"
                                                ? "bg-green-500 text-white"
                                                : "bg-blue-500 text-white",
                                        )}>
                                        {badge.count > 99 ? "99+" : badge.count}
                                      </div>
                                    )
                                  );
                                })()}
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
          <div
            className={cn(
              "flex items-center rounded-lg hover:bg-sidebar-accent transition-all duration-200 group cursor-pointer",
              isCollapsed ? "justify-center p-3" : "gap-3 px-4 py-3",
            )}
            title={isCollapsed ? user?.name : undefined}>
            <div className="relative">
              <div
                className={cn(
                  "rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold transition-transform duration-200 group-hover:scale-110",
                  isCollapsed ? "h-8 w-8 text-sm" : "h-10 w-10",
                )}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="absolute inset-0 rounded-full bg-sidebar-primary/30 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 animate-in fade-in slide-in-from-left-2 duration-200">
                <p className="text-sm font-medium truncate group-hover:text-sidebar-primary transition-colors duration-200">
                  {user?.name}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user?.email}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
