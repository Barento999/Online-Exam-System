import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { Loader2 } from "lucide-react";

export const PageTransitionLoader = () => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Show loader on route change
    setLoading(true);

    // Hide loader after a short delay to allow page to render
    const timer = setTimeout(() => {
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
      <div className="h-full bg-primary animate-progress-bar" />
    </div>
  );
};

// Progress bar component for top of page
export const TopLoadingBar = ({ isLoading }) => {
  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-primary/20">
      <div className="h-full bg-primary animate-progress-bar" />
    </div>
  );
};

// Full page loader overlay
export const PageLoader = ({ message = "Loading..." }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </div>
  );
};

// Inline content loader
export const ContentLoader = ({ message = "Loading content..." }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
};
