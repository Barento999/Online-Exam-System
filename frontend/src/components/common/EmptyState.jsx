import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
  actionLabel,
  illustration = "default",
  className,
}) => {
  const illustrations = {
    default: (
      <svg
        className="w-48 h-48 mx-auto mb-6 text-muted-foreground/20"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <circle cx="100" cy="100" r="80" fill="currentColor" opacity="0.1" />
        <path
          d="M100 60v80M60 100h80"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
          opacity="0.3"
        />
      </svg>
    ),

    exams: (
      <svg
        className="w-48 h-48 mx-auto mb-6"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {/* Document */}
        <rect
          x="50"
          y="30"
          width="100"
          height="140"
          rx="8"
          fill="currentColor"
          className="text-blue-100 dark:text-blue-900/20"
        />
        <rect
          x="50"
          y="30"
          width="100"
          height="140"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
          className="text-blue-300 dark:text-blue-700"
        />
        {/* Lines */}
        <line
          x1="70"
          y1="60"
          x2="130"
          y2="60"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-blue-400 dark:text-blue-600"
        />
        <line
          x1="70"
          y1="80"
          x2="130"
          y2="80"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-blue-400 dark:text-blue-600"
        />
        <line
          x1="70"
          y1="100"
          x2="110"
          y2="100"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-blue-400 dark:text-blue-600"
        />
        {/* Checkmark */}
        <circle
          cx="100"
          cy="140"
          r="25"
          fill="currentColor"
          className="text-green-100 dark:text-green-900/20"
        />
        <path
          d="M90 140l7 7 13-13"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-green-600"
        />
      </svg>
    ),

    results: (
      <svg
        className="w-48 h-48 mx-auto mb-6"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {/* Trophy */}
        <path
          d="M70 50h60v30c0 16.569-13.431 30-30 30s-30-13.431-30-30V50z"
          fill="currentColor"
          className="text-yellow-100 dark:text-yellow-900/20"
        />
        <path
          d="M70 50h60v30c0 16.569-13.431 30-30 30s-30-13.431-30-30V50z"
          stroke="currentColor"
          strokeWidth="2"
          className="text-yellow-400 dark:text-yellow-600"
        />
        {/* Base */}
        <rect
          x="85"
          y="110"
          width="30"
          height="20"
          rx="4"
          fill="currentColor"
          className="text-yellow-200 dark:text-yellow-800/30"
        />
        <rect
          x="75"
          y="130"
          width="50"
          height="15"
          rx="4"
          fill="currentColor"
          className="text-yellow-300 dark:text-yellow-700/40"
        />
        {/* Handles */}
        <path
          d="M70 55h-15c-5.523 0-10 4.477-10 10v10c0 5.523 4.477 10 10 10h15"
          stroke="currentColor"
          strokeWidth="2"
          className="text-yellow-400 dark:text-yellow-600"
        />
        <path
          d="M130 55h15c5.523 0 10 4.477 10 10v10c0 5.523-4.477 10-10 10h-15"
          stroke="currentColor"
          strokeWidth="2"
          className="text-yellow-400 dark:text-yellow-600"
        />
        {/* Star */}
        <path
          d="M100 65l3 6 6 1-4 4 1 6-6-3-6 3 1-6-4-4 6-1z"
          fill="currentColor"
          className="text-yellow-500"
        />
      </svg>
    ),

    courses: (
      <svg
        className="w-48 h-48 mx-auto mb-6"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {/* Book */}
        <rect
          x="60"
          y="50"
          width="80"
          height="100"
          rx="4"
          fill="currentColor"
          className="text-purple-100 dark:text-purple-900/20"
        />
        <rect
          x="60"
          y="50"
          width="80"
          height="100"
          rx="4"
          stroke="currentColor"
          strokeWidth="2"
          className="text-purple-400 dark:text-purple-600"
        />
        {/* Pages */}
        <line
          x1="100"
          y1="50"
          x2="100"
          y2="150"
          stroke="currentColor"
          strokeWidth="2"
          className="text-purple-300 dark:text-purple-700"
        />
        {/* Bookmark */}
        <path
          d="M110 50v40l10-8 10 8V50"
          fill="currentColor"
          className="text-red-400 dark:text-red-600"
        />
        {/* Sparkles */}
        <circle
          cx="45"
          cy="70"
          r="3"
          fill="currentColor"
          className="text-purple-400 animate-pulse"
        />
        <circle
          cx="155"
          cy="90"
          r="3"
          fill="currentColor"
          className="text-purple-400 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        />
        <circle
          cx="50"
          cy="130"
          r="2"
          fill="currentColor"
          className="text-purple-300 animate-pulse"
          style={{ animationDelay: "1s" }}
        />
      </svg>
    ),

    data: (
      <svg
        className="w-48 h-48 mx-auto mb-6"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        {/* Chart bars */}
        <rect
          x="40"
          y="120"
          width="25"
          height="50"
          rx="4"
          fill="currentColor"
          className="text-blue-200 dark:text-blue-800/30"
        />
        <rect
          x="75"
          y="90"
          width="25"
          height="80"
          rx="4"
          fill="currentColor"
          className="text-green-200 dark:text-green-800/30"
        />
        <rect
          x="110"
          y="70"
          width="25"
          height="100"
          rx="4"
          fill="currentColor"
          className="text-purple-200 dark:text-purple-800/30"
        />
        <rect
          x="145"
          y="100"
          width="25"
          height="70"
          rx="4"
          fill="currentColor"
          className="text-orange-200 dark:text-orange-800/30"
        />
        {/* Magnifying glass */}
        <circle
          cx="150"
          cy="50"
          r="20"
          stroke="currentColor"
          strokeWidth="3"
          className="text-gray-400 dark:text-gray-600"
        />
        <line
          x1="165"
          y1="65"
          x2="180"
          y2="80"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          className="text-gray-400 dark:text-gray-600"
        />
      </svg>
    ),
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        "animate-in fade-in slide-in-from-bottom-4 duration-500",
        className,
      )}>
      {/* Illustration */}
      {illustrations[illustration] || illustrations.default}

      {/* Icon */}
      {Icon && (
        <div className="mb-4">
          <Icon className="h-12 w-12 text-muted-foreground/40" />
        </div>
      )}

      {/* Title */}
      <h3 className="text-lg font-semibold mb-2 text-foreground">{title}</h3>

      {/* Description */}
      {description && (
        <p className="text-sm text-muted-foreground max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action Button */}
      {action && actionLabel && (
        <Button onClick={action} className="mt-2">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
