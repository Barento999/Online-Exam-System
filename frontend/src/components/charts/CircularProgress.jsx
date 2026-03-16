import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const CircularProgress = ({
  value = 0,
  max = 100,
  size = 120,
  strokeWidth = 8,
  color = "text-primary",
  backgroundColor = "text-muted",
  showValue = true,
  label,
  animated = true,
  className,
}) => {
  // Validate and sanitize input values
  const safeValue = typeof value === "number" && isFinite(value) ? value : 0;
  const safeMax =
    typeof max === "number" && isFinite(max) && max > 0 ? max : 100;
  const safeSize =
    typeof size === "number" && isFinite(size) && size > 0 ? size : 120;
  const safeStrokeWidth =
    typeof strokeWidth === "number" && isFinite(strokeWidth) && strokeWidth > 0
      ? strokeWidth
      : 8;

  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(safeValue);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(safeValue);
    }
  }, [safeValue, animated]);

  const percentage = Math.min(
    Math.max((animatedValue / safeMax) * 100, 0),
    100,
  );
  const radius = (safeSize - safeStrokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const colorClasses = {
    "text-primary": "stroke-primary",
    "text-blue-600": "stroke-blue-600",
    "text-green-600": "stroke-green-600",
    "text-orange-600": "stroke-orange-600",
    "text-purple-600": "stroke-purple-600",
    "text-red-600": "stroke-red-600",
  };

  const bgColorClasses = {
    "text-muted": "stroke-muted-foreground/20",
    "text-gray-300": "stroke-gray-300 dark:stroke-gray-600",
  };

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center",
        className,
      )}>
      <svg
        width={safeSize}
        height={safeSize}
        className="transform -rotate-90"
        viewBox={`0 0 ${safeSize} ${safeSize}`}>
        {/* Background circle */}
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          fill="none"
          strokeWidth={safeStrokeWidth}
          className={
            bgColorClasses[backgroundColor] || "stroke-muted-foreground/20"
          }
        />

        {/* Progress circle */}
        <circle
          cx={safeSize / 2}
          cy={safeSize / 2}
          r={radius}
          fill="none"
          strokeWidth={safeStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={cn(
            colorClasses[color] || "stroke-primary",
            "transition-all duration-1000 ease-out",
          )}
          style={{
            filter: "drop-shadow(0 0 6px currentColor)",
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {showValue && (
          <span className="text-2xl font-bold">
            {Math.round(animatedValue)}
            <span className="text-sm text-muted-foreground">/{safeMax}</span>
          </span>
        )}
        {label && (
          <span className="text-xs text-muted-foreground mt-1 text-center">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
