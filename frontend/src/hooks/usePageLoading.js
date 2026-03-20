import { useState, useEffect } from "react";

/**
 * Hook to manage page loading states
 * @param {boolean} initialLoading - Initial loading state
 * @param {number} minLoadingTime - Minimum time to show loader (prevents flash)
 */
export const usePageLoading = (initialLoading = true, minLoadingTime = 300) => {
  const [loading, setLoading] = useState(initialLoading);
  const [startTime, setStartTime] = useState(Date.now());

  const startLoading = () => {
    setStartTime(Date.now());
    setLoading(true);
  };

  const stopLoading = () => {
    const elapsed = Date.now() - startTime;
    const remaining = Math.max(0, minLoadingTime - elapsed);

    if (remaining > 0) {
      setTimeout(() => setLoading(false), remaining);
    } else {
      setLoading(false);
    }
  };

  return {
    loading,
    startLoading,
    stopLoading,
    setLoading,
  };
};

/**
 * Hook for async operations with loading state
 */
export const useAsyncLoading = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (asyncFunction) => {
    try {
      setLoading(true);
      setError(null);
      const result = await asyncFunction();
      return result;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    execute,
  };
};
