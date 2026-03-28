import { useEffect, useCallback, useState } from "react";
import { useBlocker } from "react-router";

/**
 * Hook to warn users about unsaved changes before leaving a page
 * @param {boolean} isDirty - Whether the form has unsaved changes
 * @param {string} message - Custom warning message
 * @returns {Object} - Dialog state and handlers
 */
export const useUnsavedChanges = (
  isDirty,
  message = "You have unsaved changes. Are you sure you want to leave?",
) => {
  const [showDialog, setShowDialog] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(null);

  // Block navigation when form is dirty
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowDialog(true);
      setPendingNavigation(blocker);
    }
  }, [blocker]);

  // Warn before closing/refreshing browser tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, message]);

  const confirmNavigation = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.proceed();
      setPendingNavigation(null);
    }
    setShowDialog(false);
  }, [pendingNavigation]);

  const cancelNavigation = useCallback(() => {
    if (pendingNavigation) {
      pendingNavigation.reset();
      setPendingNavigation(null);
    }
    setShowDialog(false);
  }, [pendingNavigation]);

  return {
    showDialog,
    confirmNavigation,
    cancelNavigation,
    message,
  };
};

/**
 * Simple hook to track form dirty state
 * @param {Object} initialValues - Initial form values
 * @param {Object} currentValues - Current form values
 * @returns {boolean} - Whether form has unsaved changes
 */
export const useFormDirty = (initialValues, currentValues) => {
  return JSON.stringify(initialValues) !== JSON.stringify(currentValues);
};
