/**
 * Utility functions for standardizing badge colors across the application
 *
 * Color Standards:
 * - Active/Live/Published: Green (default variant)
 * - Upcoming/Pending: Blue (outline variant with blue styling)
 * - Completed/Done: Gray (secondary variant)
 * - Draft/Unpublished: Gray (secondary variant)
 * - Error/Failed: Red (destructive variant)
 */

/**
 * Get badge variant for exam status
 * @param {string} status - The exam status
 * @param {boolean} isStudent - Whether the user is a student
 * @returns {string} Badge variant
 */
export const getExamStatusVariant = (status, isStudent = false) => {
  if (isStudent) {
    // Student-specific statuses
    switch (status?.toLowerCase()) {
      case "active":
      case "take now":
        return "default"; // Green
      case "upcoming":
        return "outline"; // Blue outline
      case "completed":
      case "expired":
        return "secondary"; // Gray
      default:
        return "secondary";
    }
  }

  // Admin/Teacher statuses
  switch (status?.toLowerCase()) {
    case "published":
    case "active":
      return "default"; // Green
    case "draft":
      return "secondary"; // Gray
    case "completed":
      return "secondary"; // Gray
    default:
      return "secondary";
  }
};

/**
 * Get badge variant for user status
 * @param {string} status - The user status
 * @returns {string} Badge variant
 */
export const getUserStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "default"; // Green
    case "pending":
      return "outline"; // Blue outline
    case "inactive":
    case "suspended":
      return "destructive"; // Red
    default:
      return "secondary"; // Gray
  }
};

/**
 * Get badge variant for enrollment status
 * @param {string} status - The enrollment status
 * @returns {string} Badge variant
 */
export const getEnrollmentStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "active":
      return "default"; // Green
    case "pending":
      return "outline"; // Blue outline
    case "completed":
      return "secondary"; // Gray
    case "dropped":
    case "cancelled":
      return "destructive"; // Red
    default:
      return "secondary";
  }
};

/**
 * Get badge variant for result/grade status
 * @param {string} status - The result status
 * @returns {string} Badge variant
 */
export const getResultStatusVariant = (status) => {
  switch (status?.toLowerCase()) {
    case "passed":
    case "pass":
      return "default"; // Green
    case "failed":
    case "fail":
      return "destructive"; // Red
    case "pending":
    case "grading":
      return "outline"; // Blue outline
    default:
      return "secondary"; // Gray
  }
};

/**
 * Get badge variant for published status
 * @param {boolean} published - Whether the item is published
 * @returns {string} Badge variant
 */
export const getPublishedStatusVariant = (published) => {
  return published ? "default" : "secondary"; // Green : Gray
};

/**
 * Get badge variant for generic status
 * @param {string} status - The status
 * @returns {string} Badge variant
 */
export const getGenericStatusVariant = (status) => {
  const statusLower = status?.toLowerCase();

  // Active/Live states
  if (
    ["active", "live", "published", "approved", "confirmed"].includes(
      statusLower,
    )
  ) {
    return "default"; // Green
  }

  // Pending/Upcoming states
  if (["pending", "upcoming", "scheduled", "waiting"].includes(statusLower)) {
    return "outline"; // Blue outline
  }

  // Completed/Done states
  if (["completed", "done", "finished", "closed"].includes(statusLower)) {
    return "secondary"; // Gray
  }

  // Draft/Unpublished states
  if (["draft", "unpublished", "inactive"].includes(statusLower)) {
    return "secondary"; // Gray
  }

  // Error/Failed states
  if (
    [
      "error",
      "failed",
      "rejected",
      "cancelled",
      "suspended",
      "dropped",
    ].includes(statusLower)
  ) {
    return "destructive"; // Red
  }

  return "secondary"; // Default to gray
};

/**
 * Get custom className for blue outline badges
 * @returns {string} Custom className
 */
export const getBlueOutlineClass = () => {
  return "border-blue-500 text-blue-700 dark:text-blue-400";
};
