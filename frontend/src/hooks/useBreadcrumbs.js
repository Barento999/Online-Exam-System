import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useBreadcrumbContext } from "@/context/BreadcrumbContext";

/**
 * Hook for managing breadcrumbs
 * @param {Array} breadcrumbs - Array of breadcrumb objects
 * @param {Object} options - Configuration options
 */
export const useBreadcrumbs = (breadcrumbs = null, options = {}) => {
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbContext();
  const location = useLocation();
  const { clearOnUnmount = true } = options;

  useEffect(() => {
    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs);
    }

    return () => {
      if (clearOnUnmount) {
        clearBreadcrumbs();
      }
    };
  }, [
    breadcrumbs,
    setBreadcrumbs,
    clearBreadcrumbs,
    clearOnUnmount,
    location.pathname,
  ]);

  return {
    setBreadcrumbs,
    clearBreadcrumbs,
  };
};

/**
 * Generate breadcrumbs for common page patterns
 */
export const breadcrumbGenerators = {
  // Dashboard breadcrumb
  dashboard: () => [{ label: "Dashboard", href: "/dashboard" }],

  // List page breadcrumbs
  list: (entityName, path) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: entityName, href: null },
  ],

  // Detail page breadcrumbs
  detail: (entityName, itemName, listPath) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: entityName, href: listPath },
    { label: itemName, href: null },
  ],

  // Create page breadcrumbs
  create: (entityName, listPath) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: entityName, href: listPath },
    { label: "Create", href: null },
  ],

  // Edit page breadcrumbs
  edit: (entityName, itemName, listPath, detailPath = null) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: entityName, href: listPath },
    ...(detailPath ? [{ label: itemName, href: detailPath }] : []),
    { label: "Edit", href: null },
  ],

  // Nested page breadcrumbs
  nested: (parentName, parentPath, childName, childPath = null) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: parentName, href: parentPath },
    { label: childName, href: childPath },
  ],

  // Exam-specific breadcrumbs
  examTake: (examName) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Exams", href: "/exams" },
    { label: `Taking: ${examName}`, href: null },
  ],

  examMonitor: (examName) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Exams", href: "/exams" },
    { label: `Monitoring: ${examName}`, href: null },
  ],

  // User profile breadcrumbs
  profile: () => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Profile", href: null },
  ],

  // Settings breadcrumbs
  settings: (section = null) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Settings", href: section ? "/settings" : null },
    ...(section ? [{ label: section, href: null }] : []),
  ],

  // Analytics breadcrumbs
  analytics: (reportName = null) => [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Analytics", href: reportName ? "/analytics" : null },
    ...(reportName ? [{ label: reportName, href: null }] : []),
  ],
};

/**
 * Hook for automatic breadcrumb generation based on route patterns
 */
export const useAutoBreadcrumbs = () => {
  const location = useLocation();
  const { setBreadcrumbs } = useBreadcrumbContext();

  useEffect(() => {
    const path = location.pathname;
    let breadcrumbs = null;

    // Generate breadcrumbs based on path patterns
    if (path === "/dashboard") {
      breadcrumbs = breadcrumbGenerators.dashboard();
    } else if (path === "/users") {
      breadcrumbs = breadcrumbGenerators.list("Users", "/users");
    } else if (path === "/courses") {
      breadcrumbs = breadcrumbGenerators.list("Courses", "/courses");
    } else if (path === "/exams") {
      breadcrumbs = breadcrumbGenerators.list("Exams", "/exams");
    } else if (path === "/questions") {
      breadcrumbs = breadcrumbGenerators.list("Questions", "/questions");
    } else if (path === "/results") {
      breadcrumbs = breadcrumbGenerators.list("Results", "/results");
    } else if (path === "/analytics") {
      breadcrumbs = breadcrumbGenerators.analytics();
    } else if (path === "/enrollments") {
      breadcrumbs = breadcrumbGenerators.list("Enrollments", "/enrollments");
    } else if (path === "/profile") {
      breadcrumbs = breadcrumbGenerators.profile();
    } else if (path === "/settings") {
      breadcrumbs = breadcrumbGenerators.settings();
    } else if (path.startsWith("/exams/") && path.endsWith("/take")) {
      // Extract exam ID and generate breadcrumbs (would need API call for exam name)
      breadcrumbs = breadcrumbGenerators.examTake("Exam");
    } else if (path.startsWith("/exams/") && path.endsWith("/monitor")) {
      breadcrumbs = breadcrumbGenerators.examMonitor("Exam");
    }

    if (breadcrumbs) {
      setBreadcrumbs(breadcrumbs);
    }
  }, [location.pathname, setBreadcrumbs]);
};
