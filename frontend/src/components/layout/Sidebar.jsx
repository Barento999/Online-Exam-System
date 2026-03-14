import { Link, useLocation } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  BookOpen,
  FileText,
  ClipboardList,
  BarChart,
  Settings,
  GraduationCap,
  PlusCircle,
  UserCircle,
  Menu,
  X,
  UserPlus,
  TrendingUp,
} from "lucide-react";

export const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const adminMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Users, label: "Users", path: "/users" },
    { icon: BookOpen, label: "Courses", path: "/courses" },
    { icon: UserPlus, label: "Enrollments", path: "/enrollments" },
    { icon: FileText, label: "Exams", path: "/exams" },
    { icon: ClipboardList, label: "Questions", path: "/questions" },
    { icon: BarChart, label: "Results", path: "/results" },
    { icon: TrendingUp, label: "Analytics", path: "/analytics" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const teacherMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "My Courses", path: "/courses" },
    { icon: UserPlus, label: "Enrollments", path: "/enrollments" },
    { icon: PlusCircle, label: "Create Exam", path: "/exams/create" },
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

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground border border-sidebar-border">
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsOpen(false)}></div>
      )}

      {/* Sidebar */}
      <div
        className={`h-screen w-64 bg-sidebar text-sidebar-foreground flex flex-col fixed left-0 top-0 border-r border-sidebar-border z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}>
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-sidebar-primary" />
            <div>
              <h1 className="text-xl font-semibold">Exam System</h1>
              <p className="text-xs text-sidebar-foreground/60 capitalize">
                {user?.role} Panel
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent"
                    }`}>
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="h-10 w-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
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
