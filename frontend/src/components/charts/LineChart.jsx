import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const LineChart = ({
  data = [],
  width = 400,
  height = 200,
  color = "stroke-primary",
  animated = true,
  showDots = true,
  showGrid = true,
  smooth = true,
  className,
}) => {
  // Validate and sanitize data
  const validData = data.filter(
    (item) =>
      item &&
      typeof item.value === "number" &&
      !isNaN(item.value) &&
      isFinite(item.value) &&
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
        style={{ width, height }}>
        <svg
          className="w-24 h-24 mb-4 text-muted-foreground/20"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path
            d="M20 80 L35 60 L50 70 L65 40 L80 50"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            opacity="0.3"
          />
          <circle cx="20" cy="80" r="4" fill="currentColor" opacity="0.3" />
          <circle cx="35" cy="60" r="4" fill="currentColor" opacity="0.3" />
          <circle cx="50" cy="70" r="4" fill="currentColor" opacity="0.3" />
          <circle cx="65" cy="40" r="4" fill="currentColor" opacity="0.3" />
          <circle cx="80" cy="50" r="4" fill="currentColor" opacity="0.3" />
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

  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const values = validData.map((item) => item.value);
  const maxValue = Math.max(...values, 1);
  const minValue = Math.min(...values, 0);
  const valueRange = maxValue - minValue || 1;

  const points = animatedData.map((value, index) => {
    const x =
      padding +
      (validData.length > 1
        ? (index / (validData.length - 1)) * chartWidth
        : chartWidth / 2);
    const y =
      padding + chartHeight - ((value - minValue) / valueRange) * chartHeight;

    // Ensure coordinates are valid numbers
    return {
      x: isFinite(x) ? x : padding,
      y: isFinite(y) ? y : padding + chartHeight,
      value: validData[index].value,
      label: validData[index].label,
    };
  });

  const pathData = points.reduce((path, point, index) => {
    // Ensure point coordinates are valid
    if (!point || !isFinite(point.x) || !isFinite(point.y)) {
      return path;
    }

    if (index === 0) {
      return `M ${point.x} ${point.y}`;
    }

    if (smooth && index > 0) {
      const prevPoint = points[index - 1];
      if (!prevPoint || !isFinite(prevPoint.x) || !isFinite(prevPoint.y)) {
        return `${path} L ${point.x} ${point.y}`;
      }

      const cpx1 = prevPoint.x + (point.x - prevPoint.x) / 3;
      const cpy1 = prevPoint.y;
      const cpx2 = point.x - (point.x - prevPoint.x) / 3;
      const cpy2 = point.y;

      // Ensure control points are valid
      if (
        isFinite(cpx1) &&
        isFinite(cpy1) &&
        isFinite(cpx2) &&
        isFinite(cpy2)
      ) {
        return `${path} C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${point.x} ${point.y}`;
      }
    }

    return `${path} L ${point.x} ${point.y}`;
  }, "");

  const colorClasses = {
    "stroke-primary": "stroke-primary",
    "stroke-blue-600": "stroke-blue-600",
    "stroke-green-600": "stroke-green-600",
    "stroke-orange-600": "stroke-orange-600",
    "stroke-purple-600": "stroke-purple-600",
    "stroke-red-600": "stroke-red-600",
  };

  return (
    <div className={cn("relative", className)}>
      <svg width={width} height={height} className="overflow-visible">
        {/* Grid */}
        {showGrid && (
          <g className="opacity-20">
            {/* Horizontal grid lines */}
            {[...Array(5)].map((_, i) => {
              const y = padding + (i / 4) * chartHeight;
              return (
                <line
                  key={`h-${i}`}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}

            {/* Vertical grid lines */}
            {validData.map((_, i) => {
              const x =
                padding +
                (validData.length > 1
                  ? (i / (validData.length - 1)) * chartWidth
                  : chartWidth / 2);
              const safeX = isFinite(x) ? x : padding;
              return (
                <line
                  key={`v-${i}`}
                  x1={safeX}
                  y1={padding}
                  x2={safeX}
                  y2={height - padding}
                  stroke="currentColor"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Area fill */}
        <defs>
          <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.3" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
          </linearGradient>
        </defs>

        <path
          d={`${pathData} L ${points[points.length - 1]?.x && isFinite(points[points.length - 1]?.x) ? points[points.length - 1].x : padding} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="url(#areaGradient)"
          className={colorClasses[color] || "stroke-primary"}
        />

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={cn(
            colorClasses[color] || "stroke-primary",
            "transition-all duration-1000 ease-out",
          )}
          style={{
            strokeDasharray: animated ? "1000" : "none",
            strokeDashoffset: animated ? "0" : "none",
            animation: animated ? "drawLine 2s ease-out" : "none",
          }}
        />

        {/* Data points */}
        {showDots &&
          points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="6"
                fill="white"
                stroke="currentColor"
                strokeWidth="3"
                className={cn(
                  colorClasses[color] || "stroke-primary",
                  "hover:r-8 transition-all duration-200 cursor-pointer",
                )}
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              />

              {/* Tooltip on hover */}
              <g className="opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <rect
                  x={point.x - 25}
                  y={point.y - 35}
                  width="50"
                  height="20"
                  rx="4"
                  fill="black"
                  fillOpacity="0.8"
                />
                <text
                  x={point.x}
                  y={point.y - 22}
                  textAnchor="middle"
                  fill="white"
                  fontSize="12"
                  fontWeight="500">
                  {point.value}
                </text>
              </g>
            </g>
          ))}

        {/* Labels */}
        {validData.map((item, index) => {
          const point = points[index];
          const safeX = point?.x && isFinite(point.x) ? point.x : padding;
          return (
            <text
              key={index}
              x={safeX}
              y={height - 10}
              textAnchor="middle"
              fontSize="12"
              fill="currentColor"
              className="opacity-60">
              {item.label}
            </text>
          );
        })}
      </svg>

      <style>{`
        @keyframes drawLine {
          from {
            stroke-dashoffset: 1000;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
};
