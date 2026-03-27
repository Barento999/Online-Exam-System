/**
 * Utility functions for consistent badge styling across the application
 */

/**
 * Get badge variant based on status
 * @param {string} status - The status value
 * @returns {string} - Badge variant (default, secondary, destructive, outline)
 */
export const getStatusBadgeVariant = (status) => {
  const statusLower = status?.toLowerCase() || "";

  // Active/Live: Green (default variant)
  if (
    statusLower === "active" ||
    statusLower === "live" ||
    statusLower === "published" ||
    statusLower === "passed"
  ) {
    return "default";
  }

  // Upcoming/Pending: Blue (outline variant with blue styling)
  if (statusLower === "upcoming" || statusLower === "pending") {
    return "outline";
  }

  // Completed/Done: Gray (secondary variant)
  if (statusLower === "completed" || statusLower === "done") {
    return "secondary";
  }

  // Draft: Secondary
  if (statusLower === "draft") {
    return "secondary";
  }

  // Error/Failed/Expired: Red (destructive variant)
  if (
    statusLower === "failed" ||
    statusLower === "error" ||
    statusLower === "expired" ||
    statusLower === "dropped" ||
    statusLower === "inactive"
  ) {
    return "destructive";
  }

  // Default fallback
  return "secondary";
};

/**
 * Get custom badge className for additional styling
 * @param {string} status - The status value
 * @returns {string} - Additional className
 */
export const getStatusBadgeClassName = (status) => {
  const statusLower = status?.toLowerCase() || "";

  // Upcoming/Pending: Blue styling
  if (statusLower === "upcoming" || statusLower === "pending") {
    return "border-blue-500 text-blue-700 dark:text-blue-400";
  }

  return "";
};

/**
 * Get complete badge props for a status
 * @param {string} status - The status value
 * @returns {object} - Object with variant and className
 */
export const getStatusBadgeProps = (status) => {
  return {
    variant: getStatusBadgeVariant(status),
    className: getStatusBadgeClassName(status),
  };
};
