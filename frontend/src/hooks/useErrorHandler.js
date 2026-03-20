import { useState, useCallback } from "react";
import toast from "react-hot-toast";

/**
 * Hook for handling errors with user-friendly messages
 * @param {string} context - Context where the error occurred (e.g., "loading users")
 */
export const useErrorHandler = (context = "operation") => {
  const [error, setError] = useState(null);
  const [isError, setIsError] = useState(false);

  const handleError = useCallback(
    (err, customMessage) => {
      console.error(`Error in ${context}:`, err);

      setError(err);
      setIsError(true);

      // Extract user-friendly message
      let message = customMessage;

      if (!message) {
        if (err.response?.data?.message) {
          message = err.response.data.message;
        } else if (err.message) {
          message = err.message;
        } else {
          message = `Failed to complete ${context}`;
        }
      }

      // Show toast notification
      toast.error(message);

      return message;
    },
    [context],
  );

  const clearError = useCallback(() => {
    setError(null);
    setIsError(false);
  }, []);

  const resetError = clearError; // Alias for clarity

  return {
    error,
    isError,
    handleError,
    clearError,
    resetError,
  };
};

/**
 * Async wrapper that handles errors automatically
 * @param {Function} asyncFn - Async function to execute
 * @param {Function} errorHandler - Error handler function
 * @param {string} errorMessage - Custom error message
 */
export const withErrorHandler = async (asyncFn, errorHandler, errorMessage) => {
  try {
    return await asyncFn();
  } catch (error) {
    if (errorHandler) {
      errorHandler(error, errorMessage);
    }
    throw error;
  }
};

/**
 * Get user-friendly error message from error object
 */
export const getErrorMessage = (error, fallback = "An error occurred") => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return fallback;
};
