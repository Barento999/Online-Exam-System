import { useLocation, Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useBreadcrumbContext } from "@/context/BreadcrumbContext";

export const Breadcrumbs = ({ customBreadcrumbs = null }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { customBreadcrumbs: contextBreadcrumbs } = useBreadcrumbContext();

  // Priority: prop > context > auto-generated
  const breadcrumbsToUse = customBreadcrumbs || contextBreadcrumbs;

  // If custom breadcrumbs are provided, use them
  if (breadcrumbsToUse) {
    return (
      <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
        {breadcrumbsToUse.map((crumb, index) => (
          <div key={index} className="flex items-center">
            {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
            {crumb.href ? (
              <Link
                to={crumb.href}
                className="hover:text-foreground transition-colors flex items-center gap-1">
                {crumb.icon && <crumb.icon className="h-3 w-3" />}
                {crumb.label}
              </Link>
            ) : (
              <span className="text-foreground font-medium flex items-center gap-1">
                {crumb.icon && <crumb.icon className="h-3 w-3" />}
                {crumb.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    );
  }

  // Auto-generate breadcrumbs based on current path
  const pathSegments = location.pathname.split("/").filter(Boolean);

  // Don't show breadcrumbs on login/register pages
  if (["login", "register"].includes(pathSegments[0])) {
    return null;
  }

  const breadcrumbs = generateBreadcrumbs(pathSegments, user?.role);

  // Don't show breadcrumbs if there's only one item (current page)
  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-4">
      {breadcrumbs.map((crumb, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && <ChevronRight className="h-4 w-4 mx-1" />}
          {crumb.href && index < breadcrumbs.length - 1 ? (
            <Link
              to={crumb.href}
              className="hover:text-foreground transition-colors flex items-center gap-1">
              {crumb.icon && <crumb.icon className="h-3 w-3" />}
              {crumb.label}
            </Link>
          ) : (
            <span className="text-foreground font-medium flex items-center gap-1">
              {crumb.icon && <crumb.icon className="h-3 w-3" />}
              {crumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
};

// Generate breadcrumbs based on path segments
const generateBreadcrumbs = (pathSegments, userRole) => {
  const breadcrumbs = [];

  // Always start with Dashboard
  breadcrumbs.push({
    label: "Dashboard",
    href: "/dashboard",
    icon: Home,
  });

  // Map path segments to breadcrumb items
  const pathMap = {
    users: { label: "Users", icon: null },
    courses: { label: "Courses", icon: null },
    exams: { label: "Exams", icon: null },
    questions: { label: "Questions", icon: null },
    results: { label: "Results", icon: null },
    analytics: { label: "Analytics", icon: null },
    enrollments: { label: "Enrollments", icon: null },
    profile: { label: "Profile", icon: null },
    settings: { label: "Settings", icon: null },
    create: { label: "Create", icon: null },
    edit: { label: "Edit", icon: null },
    take: { label: "Take Exam", icon: null },
    monitor: { label: "Monitor", icon: null },
  };

  // Build breadcrumbs from path segments
  let currentPath = "";
  pathSegments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Skip dynamic segments (IDs) but handle special cases
    if (isNumeric(segment) || isObjectId(segment)) {
      // For dynamic segments, we might want to fetch the actual name
      // For now, we'll skip them or use generic labels
      return;
    }

    const pathInfo = pathMap[segment];
    if (pathInfo) {
      breadcrumbs.push({
        label: pathInfo.label,
        href: index < pathSegments.length - 1 ? currentPath : null, // No link for current page
        icon: pathInfo.icon,
      });
    } else {
      // Handle special cases or unknown segments
      breadcrumbs.push({
        label: capitalizeFirst(segment),
        href: index < pathSegments.length - 1 ? currentPath : null,
        icon: null,
      });
    }
  });

  return breadcrumbs;
};

// Helper functions
const isNumeric = (str) => /^\d+$/.test(str);
const isObjectId = (str) => /^[0-9a-fA-F]{24}$/.test(str);
const capitalizeFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
