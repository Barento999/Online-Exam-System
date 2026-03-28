import { useEffect, useRef } from "react";

/**
 * Hook to manage focus for accessibility
 * @param {boolean} shouldFocus - Whether to focus the element
 * @returns {Object} - Ref to attach to the element
 */
export const useFocusManagement = (shouldFocus = false) => {
  const ref = useRef(null);

  useEffect(() => {
    if (shouldFocus && ref.current) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        ref.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [shouldFocus]);

  return ref;
};

/**
 * Hook to trap focus within a container (for modals, dialogs)
 * @param {boolean} isActive - Whether focus trap is active
 * @returns {Object} - Ref to attach to the container
 */
export const useFocusTrap = (isActive = false) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!isActive || !containerRef.current) return;

    const container = containerRef.current;
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement?.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement?.focus();
        }
      }
    };

    const handleEscapeKey = (e) => {
      if (e.key === "Escape") {
        // Trigger close if there's a close button
        const closeButton = container.querySelector('[aria-label*="Close"]');
        closeButton?.click();
      }
    };

    container.addEventListener("keydown", handleTabKey);
    container.addEventListener("keydown", handleEscapeKey);

    // Focus first element when trap activates
    firstElement?.focus();

    return () => {
      container.removeEventListener("keydown", handleTabKey);
      container.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isActive]);

  return containerRef;
};

/**
 * Hook to announce messages to screen readers
 * @returns {Function} - Function to announce a message
 */
export const useScreenReaderAnnounce = () => {
  const announceRef = useRef(null);

  useEffect(() => {
    // Create live region if it doesn't exist
    if (!announceRef.current) {
      const liveRegion = document.createElement("div");
      liveRegion.setAttribute("role", "status");
      liveRegion.setAttribute("aria-live", "polite");
      liveRegion.setAttribute("aria-atomic", "true");
      liveRegion.className = "sr-only";
      document.body.appendChild(liveRegion);
      announceRef.current = liveRegion;
    }

    return () => {
      if (announceRef.current) {
        document.body.removeChild(announceRef.current);
        announceRef.current = null;
      }
    };
  }, []);

  const announce = (message, priority = "polite") => {
    if (announceRef.current) {
      announceRef.current.setAttribute("aria-live", priority);
      announceRef.current.textContent = message;

      // Clear after announcement
      setTimeout(() => {
        if (announceRef.current) {
          announceRef.current.textContent = "";
        }
      }, 1000);
    }
  };

  return announce;
};

/**
 * Hook to manage keyboard shortcuts
 * @param {Object} shortcuts - Object mapping keys to handlers
 * @param {boolean} isActive - Whether shortcuts are active
 */
export const useKeyboardShortcuts = (shortcuts, isActive = true) => {
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const shift = e.shiftKey;
      const alt = e.altKey;

      // Build key combination string
      let combination = "";
      if (ctrl) combination += "ctrl+";
      if (shift) combination += "shift+";
      if (alt) combination += "alt+";
      combination += key;

      const handler = shortcuts[combination];
      if (handler) {
        e.preventDefault();
        handler(e);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [shortcuts, isActive]);
};

/**
 * Hook to ensure proper ARIA attributes
 * @param {string} role - ARIA role
 * @param {Object} attributes - Additional ARIA attributes
 * @returns {Object} - Props to spread on element
 */
export const useAriaAttributes = (role, attributes = {}) => {
  return {
    role,
    ...attributes,
  };
};
