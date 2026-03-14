import { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";

export const useAntiCheat = (examId, onSuspiciousActivity) => {
  const [violations, setViolations] = useState([]);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track tab visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        const violation = {
          type: "TAB_SWITCH",
          timestamp: new Date().toISOString(),
          message: "Student switched to another tab/window",
        };

        setTabSwitchCount((prev) => prev + 1);
        setViolations((prev) => [...prev, violation]);

        toast.error("⚠️ Warning: Tab switching detected!", {
          duration: 5000,
        });

        if (onSuspiciousActivity) {
          onSuspiciousActivity(violation);
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [onSuspiciousActivity]);

  // Prevent copy/paste
  useEffect(() => {
    const preventCopy = (e) => {
      e.preventDefault();
      toast.error("Copying is disabled during exam");

      const violation = {
        type: "COPY_ATTEMPT",
        timestamp: new Date().toISOString(),
        message: "Student attempted to copy content",
      };

      setViolations((prev) => [...prev, violation]);
      if (onSuspiciousActivity) {
        onSuspiciousActivity(violation);
      }
    };

    const preventPaste = (e) => {
      e.preventDefault();
      toast.error("Pasting is disabled during exam");

      const violation = {
        type: "PASTE_ATTEMPT",
        timestamp: new Date().toISOString(),
        message: "Student attempted to paste content",
      };

      setViolations((prev) => [...prev, violation]);
      if (onSuspiciousActivity) {
        onSuspiciousActivity(violation);
      }
    };

    const preventCut = (e) => {
      e.preventDefault();
      toast.error("Cutting is disabled during exam");
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("paste", preventPaste);
    document.addEventListener("cut", preventCut);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("paste", preventPaste);
      document.removeEventListener("cut", preventCut);
    };
  }, [onSuspiciousActivity]);

  // Prevent right-click
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
      toast.error("Right-click is disabled during exam");

      const violation = {
        type: "RIGHT_CLICK",
        timestamp: new Date().toISOString(),
        message: "Student attempted to right-click",
      };

      setViolations((prev) => [...prev, violation]);
      if (onSuspiciousActivity) {
        onSuspiciousActivity(violation);
      }
    };

    document.addEventListener("contextmenu", preventContextMenu);
    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
    };
  }, [onSuspiciousActivity]);

  // Detect keyboard shortcuts (Ctrl+C, Ctrl+V, etc.)
  useEffect(() => {
    const preventShortcuts = (e) => {
      // Prevent common shortcuts
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "c" ||
          e.key === "v" ||
          e.key === "x" ||
          e.key === "a" ||
          e.key === "p" ||
          e.key === "s")
      ) {
        e.preventDefault();
        toast.error("Keyboard shortcuts are disabled during exam");

        const violation = {
          type: "KEYBOARD_SHORTCUT",
          timestamp: new Date().toISOString(),
          message: `Student attempted to use ${e.ctrlKey ? "Ctrl" : "Cmd"}+${e.key.toUpperCase()}`,
        };

        setViolations((prev) => [...prev, violation]);
        if (onSuspiciousActivity) {
          onSuspiciousActivity(violation);
        }
      }

      // Prevent F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        toast.error("Developer tools are disabled during exam");

        const violation = {
          type: "DEVTOOLS_ATTEMPT",
          timestamp: new Date().toISOString(),
          message: "Student attempted to open developer tools",
        };

        setViolations((prev) => [...prev, violation]);
        if (onSuspiciousActivity) {
          onSuspiciousActivity(violation);
        }
      }
    };

    document.addEventListener("keydown", preventShortcuts);
    return () => {
      document.removeEventListener("keydown", preventShortcuts);
    };
  }, [onSuspiciousActivity]);

  // Fullscreen monitoring
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      if (!isNowFullscreen) {
        const violation = {
          type: "FULLSCREEN_EXIT",
          timestamp: new Date().toISOString(),
          message: "Student exited fullscreen mode",
        };

        setViolations((prev) => [...prev, violation]);
        toast.warning("⚠️ Please return to fullscreen mode");

        if (onSuspiciousActivity) {
          onSuspiciousActivity(violation);
        }
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, [onSuspiciousActivity]);

  // Request fullscreen
  const requestFullscreen = useCallback(() => {
    const elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen().catch((err) => {
        console.error("Error attempting to enable fullscreen:", err);
        toast.error("Failed to enter fullscreen mode");
      });
    }
  }, []);

  // Exit fullscreen
  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }, []);

  // Get violation summary
  const getViolationSummary = useCallback(() => {
    const summary = {
      total: violations.length,
      tabSwitches: violations.filter((v) => v.type === "TAB_SWITCH").length,
      copyAttempts: violations.filter((v) => v.type === "COPY_ATTEMPT").length,
      pasteAttempts: violations.filter((v) => v.type === "PASTE_ATTEMPT")
        .length,
      rightClicks: violations.filter((v) => v.type === "RIGHT_CLICK").length,
      keyboardShortcuts: violations.filter(
        (v) => v.type === "KEYBOARD_SHORTCUT",
      ).length,
      devToolsAttempts: violations.filter((v) => v.type === "DEVTOOLS_ATTEMPT")
        .length,
      fullscreenExits: violations.filter((v) => v.type === "FULLSCREEN_EXIT")
        .length,
    };
    return summary;
  }, [violations]);

  return {
    violations,
    tabSwitchCount,
    isFullscreen,
    requestFullscreen,
    exitFullscreen,
    getViolationSummary,
  };
};
