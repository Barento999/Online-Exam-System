import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const BarChart = ({
  data = [],
  height = 200,
  color = "bg-primary",
  animated = true,
  showValues = false,
  showGrid = true,
  className,
}) => {
  const [animatedData, setAnimatedData] = useState(data.map(() => 0));

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedData(data.map((item) => item.value));
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setAnimatedData(data.map((item) => item.value));
    }
  }, [data, animated]);

  const maxValue = Math.max(...data.map((item) => item.value), 1);

  const colorClasses = {
    "bg-primary": "bg-primary hover:bg-primary/80",
    "bg-blue-600": "bg-blue-600 hover:bg-blue-700",
    "bg-green-600": "bg-green-600 hover:bg-green-700",
    "bg-orange-600": "bg-orange-600 hover:bg-orange-700",
    "bg-purple-600": "bg-purple-600 hover:bg-purple-700",
    "bg-red-600": "bg-red-600 hover:bg-red-700",
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        className="relative flex items-end justify-between gap-2 p-4"
        style={{ height: `${height}px` }}>
        {/* Grid lines */}
        {showGrid && (
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-full h-px bg-border opacity-30" />
            ))}
          </div>
        )}

        {/* Bars */}
        {data.map((item, index) => {
          const barHeight = (animatedData[index] / maxValue) * (height - 40);
          return (
            <div
              key={item.label || index}
              className="flex flex-col items-center flex-1 group">
              {/* Value label */}
              {showValues && (
                <div className="mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-xs font-medium bg-black/80 text-white px-2 py-1 rounded">
                    {animatedData[index]}
                  </span>
                </div>
              )}

              {/* Bar */}
              <div
                className={cn(
                  "w-full rounded-t-md transition-all duration-1000 ease-out cursor-pointer",
                  "hover:scale-105 hover:shadow-lg",
                  colorClasses[color] || "bg-primary hover:bg-primary/80",
                )}
                style={{
                  height: `${barHeight}px`,
                  minHeight: animatedData[index] > 0 ? "4px" : "0px",
                  transitionDelay: `${index * 100}ms`,
                }}
              />

              {/* Label */}
              <div className="mt-2 text-center">
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
