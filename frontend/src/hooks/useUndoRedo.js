import { useState, useCallback, useRef } from "react";
import toast from "react-hot-toast";

/**
 * Hook for undo/redo functionality
 * @param {number} maxHistorySize - Maximum number of actions to keep in history
 * @returns {Object} - Undo/redo state and functions
 */
export const useUndoRedo = (maxHistorySize = 50) => {
  const [history, setHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const isUndoingRef = useRef(false);

  /**
   * Add an action to history
   * @param {Object} action - Action object with undo/redo functions
   * @param {Function} action.undo - Function to undo the action
   * @param {Function} action.redo - Function to redo the action
   * @param {string} action.description - Description of the action
   */
  const addAction = useCallback(
    (action) => {
      if (isUndoingRef.current) return;

      setHistory((prev) => {
        // Remove any actions after current index (when adding new action after undo)
        const newHistory = prev.slice(0, currentIndex + 1);

        // Add new action
        newHistory.push({
          ...action,
          timestamp: Date.now(),
        });

        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
          setCurrentIndex((prev) => prev - 1);
        }

        return newHistory;
      });

      setCurrentIndex((prev) => Math.min(prev + 1, maxHistorySize - 1));
    },
    [currentIndex, maxHistorySize],
  );

  /**
   * Undo the last action
   */
  const undo = useCallback(async () => {
    if (currentIndex < 0) {
      toast.error("Nothing to undo");
      return;
    }

    const action = history[currentIndex];
    isUndoingRef.current = true;

    try {
      await action.undo();
      setCurrentIndex((prev) => prev - 1);
      toast.success(`Undone: ${action.description}`);
    } catch (error) {
      toast.error(`Failed to undo: ${error.message}`);
    } finally {
      isUndoingRef.current = false;
    }
  }, [currentIndex, history]);

  /**
   * Redo the last undone action
   */
  const redo = useCallback(async () => {
    if (currentIndex >= history.length - 1) {
      toast.error("Nothing to redo");
      return;
    }

    const action = history[currentIndex + 1];
    isUndoingRef.current = true;

    try {
      await action.redo();
      setCurrentIndex((prev) => prev + 1);
      toast.success(`Redone: ${action.description}`);
    } catch (error) {
      toast.error(`Failed to redo: ${error.message}`);
    } finally {
      isUndoingRef.current = false;
    }
  }, [currentIndex, history]);

  /**
   * Clear all history
   */
  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  /**
   * Get recent actions for display
   */
  const getRecentActions = useCallback(
    (count = 5) => {
      return history
        .slice(Math.max(0, currentIndex - count + 1), currentIndex + 1)
        .reverse();
    },
    [history, currentIndex],
  );

  const canUndo = currentIndex >= 0;
  const canRedo = currentIndex < history.length - 1;

  return {
    addAction,
    undo,
    redo,
    clearHistory,
    getRecentActions,
    canUndo,
    canRedo,
    historySize: history.length,
    currentIndex,
  };
};

/**
 * Hook for keyboard shortcuts for undo/redo
 * @param {Function} undo - Undo function
 * @param {Function} redo - Redo function
 * @param {boolean} enabled - Whether shortcuts are enabled
 */
export const useUndoRedoShortcuts = (undo, redo, enabled = true) => {
  React.useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Ctrl/Cmd + Z for undo
      if (modifier && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }

      // Ctrl/Cmd + Shift + Z or Ctrl/Cmd + Y for redo
      if (modifier && ((e.key === "z" && e.shiftKey) || e.key === "y")) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, enabled]);
};
