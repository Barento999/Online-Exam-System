import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const DonutChart = ({
  data = [],
  size = 200,
  strokeWidth = 20,
  animated = true,
  showLegend = true,
  centerContent,
  className,
}) => {
  // Validate and sanitize data
  const validData = data.filter(
    (item) =>
      item &&
      typeof item.value === "number" &&
      !isNaN(item.value) &&
      isFinite(item.value) &&
      item.value > 0 && // Only positive values for donut chart
      item.label,
  );

  // If no valid data, show empty state
  if (validData.length === 0) {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center p-8",
          className,
        )}
        style={{ width: size, height: size }}>
        <svg
          className="w-24 h-24 mb-4 text-muted-foreground/20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="50"
            cy="50"
            r="35"
            stroke="currentColor"
            strokeWidth="8"
            fill="none"
            opacity="0.3"
          />
          <circle cx="50" cy="50" r="20" fill="currentColor" opacity="0.1" />
        </svg>
        <p className="text-sm text-muted-foreground">No data available</p>
      </div>
    );
  }

  const [animatedData, setAnimatedData] = useState(validData.map(() => 0));

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedData(validData.map((item) => item.value));
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(validData.map((item) => item.value));
    }
  }, [validData, animated]);

  const total = validData.reduce((sum, item) => sum + item.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;

  let cumulativePercentage = 0;

  const defaultColors = [
    "stroke-blue-600",
    "stroke-green-600",
    "stroke-orange-600",
    "stroke-purple-600",
    "stroke-red-600",
    "stroke-yellow-600",
    "stroke-pink-600",
    "stroke-indigo-600",
  ];

  return (
    <div className={cn("flex items-center gap-6", className)}>
      {/* Chart */}
      <div className="relative">
        <svg
          width={size}
          height={size}
          className="transform -rotate-90"
          viewBox={`0 0 ${size} ${size}`}>
          {validData.map((item, index) => {
            const percentage =
              total > 0 ? (animatedData[index] / total) * 100 : 0;
            const strokeDasharray = circumference;
            const strokeDashoffset =
              circumference - (percentage / 100) * circumference;
            const rotation = (cumulativePercentage / 100) * 360;

            // Ensure all values are finite numbers
            const safeStrokeDashoffset = isFinite(strokeDashoffset)
              ? strokeDashoffset
              : circumference;
            const safeRotation = isFinite(rotation) ? rotation : 0;

            cumulativePercentage += percentage;

            return (
              <circle
                key={item.label || index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={safeStrokeDashoffset}
                className={cn(
                  item.color || defaultColors[index % defaultColors.length],
                  "transition-all duration-1000 ease-out hover:stroke-[24px]",
                )}
                style={{
                  transform: `rotate(${safeRotation}deg)`,
                  transformOrigin: `${size / 2}px ${size / 2}px`,
                  transitionDelay: `${index * 200}ms`,
                  filter: "drop-shadow(0 0 4px currentColor)",
                }}
              />
            );
          })}
        </svg>

        {/* Center content */}
        {centerContent && (
          <div className="absolute inset-0 flex items-center justify-center">
            {centerContent}
          </div>
        )}
      </div>

      {/* Legend */}
      {showLegend && (
        <div className="space-y-2">
          {validData.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0;
            const colorClass =
              item.color || defaultColors[index % defaultColors.length];
            const bgColorClass = colorClass.replace("stroke-", "bg-");

            return (
              <div
                key={item.label || index}
                className="flex items-center gap-2">
                <div className={cn("w-3 h-3 rounded-full", bgColorClass)} />
                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.label}</span>
                    <span className="text-sm text-muted-foreground">
                      {item.value}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isFinite(percentage) ? percentage.toFixed(1) : "0.0"}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
