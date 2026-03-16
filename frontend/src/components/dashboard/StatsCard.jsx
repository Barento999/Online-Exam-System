import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useState } from "react";

export const StatsCard = ({
  title,
  value,
  icon: Icon,
  color,
  bgColor,
  trend,
  trendValue,
  onClick,
  className,
  animationDelay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={cn(
        "relative overflow-hidden cursor-pointer group transition-all duration-300 ease-out",
        "hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-white/5",
        "hover:-translate-y-1 hover:scale-[1.02]",
        "border-2 border-transparent hover:border-primary/20",
        "animate-in fade-in slide-in-from-bottom-4",
        className,
      )}
      style={{
        animationDelay: `${animationDelay}ms`,
        animationDuration: "600ms",
        animationFillMode: "both",
      }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {/* Animated background gradient */}
      <div
        className={cn(
          "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
          "bg-gradient-to-br from-primary/5 via-transparent to-primary/10",
        )}
      />

      {/* Shimmer effect */}
      <div
        className={cn(
          "absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000",
          "bg-gradient-to-r from-transparent via-white/20 to-transparent",
          "skew-x-12",
        )}
      />

      <CardContent className="relative p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p
              className={cn(
                "text-sm text-muted-foreground mb-1 transition-colors duration-200",
                isHovered && "text-foreground/80",
              )}>
              {title}
            </p>
            <div className="flex items-baseline gap-2">
              <p
                className={cn(
                  "text-3xl font-bold transition-all duration-300",
                  isHovered && "text-4xl",
                )}>
                {value}
              </p>
              {trend && (
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full transition-all duration-300",
                    "group-hover:scale-110 group-hover:shadow-sm",
                    trend === "up"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400 group-hover:bg-green-200 dark:group-hover:bg-green-900/30"
                      : trend === "down"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400 group-hover:bg-red-200 dark:group-hover:bg-red-900/30"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-900/30",
                  )}>
                  {trendValue}
                </span>
              )}
            </div>
          </div>

          {/* Animated icon container */}
          <div className="relative">
            {/* Pulsing background ring */}
            <div
              className={cn(
                "absolute inset-0 rounded-full transition-all duration-300",
                "group-hover:scale-150 group-hover:opacity-20",
                bgColor.replace("bg-", "bg-").replace("/20", "/40"),
              )}
            />

            {/* Main icon container */}
            <div
              className={cn(
                "relative h-12 w-12 rounded-full flex items-center justify-center",
                "transition-all duration-300 ease-out",
                "group-hover:scale-110 group-hover:rotate-12",
                "group-hover:shadow-lg",
                bgColor,
              )}>
              <Icon
                className={cn(
                  "h-6 w-6 transition-all duration-300",
                  "group-hover:scale-110",
                  color,
                )}
              />
            </div>

            {/* Floating particles effect */}
            {isHovered && (
              <>
                <div
                  className={cn(
                    "absolute -top-1 -right-1 w-2 h-2 rounded-full animate-ping",
                    bgColor.replace("bg-", "bg-").replace("/20", ""),
                  )}
                />
                <div
                  className={cn(
                    "absolute -bottom-1 -left-1 w-1.5 h-1.5 rounded-full animate-ping",
                    bgColor.replace("bg-", "bg-").replace("/20", ""),
                    "animation-delay-300",
                  )}
                />
              </>
            )}
          </div>
        </div>

        {/* Progress bar animation */}
        <div className="mt-4 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out",
              bgColor.replace("bg-", "bg-").replace("/20", ""),
              isHovered ? "w-full" : "w-0",
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};
