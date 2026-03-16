import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const LinearProgress = ({
  value = 0,
  max = 100,
  height = "h-2",
  color = "bg-primary",
  backgroundColor = "bg-muted",
  showValue = false,
  label,
  animated = true,
  striped = false,
  className,
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setAnimatedValue(value);
    }
  }, [value, animated]);

  const percentage = Math.min(Math.max((animatedValue / max) * 100, 0), 100);

  const colorClasses = {
    "bg-primary": "bg-primary",
    "bg-blue-600": "bg-blue-600",
    "bg-green-600": "bg-green-600",
    "bg-orange-600": "bg-orange-600",
    "bg-purple-600": "bg-purple-600",
    "bg-red-600": "bg-red-600",
  };

  return (
    <div className={cn("w-full", className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-foreground">{label}</span>
          )}
          {showValue && (
            <span className="text-sm text-muted-foreground">
              {Math.round(animatedValue)}/{max}
            </span>
          )}
        </div>
      )}

      <div
        className={cn(
          "w-full rounded-full overflow-hidden",
          height,
          backgroundColor,
        )}>
        <div
          className={cn(
            "h-full rounded-full transition-all duration-1000 ease-out",
            colorClasses[color] || "bg-primary",
            striped &&
              "bg-gradient-to-r from-current via-transparent to-current bg-[length:20px_20px] animate-pulse",
          )}
          style={{
            width: `${percentage}%`,
            boxShadow: percentage > 0 ? "0 0 10px currentColor" : "none",
          }}
        />
      </div>

      {showValue && (
        <div className="mt-1 text-center">
          <span className="text-xs text-muted-foreground">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
    </div>
  );
};
