import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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
}) => {
  return (
    <Card
      className={cn(
        "hover:shadow-lg transition-all duration-200 cursor-pointer group",
        onClick && "hover:scale-105",
        className,
      )}
      onClick={onClick}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground mb-1">{title}</p>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-semibold">{value}</p>
              {trend && (
                <span
                  className={cn(
                    "text-xs px-2 py-1 rounded-full",
                    trend === "up"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                      : trend === "down"
                        ? "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400"
                        : "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
                  )}>
                  {trendValue}
                </span>
              )}
            </div>
          </div>
          <div
            className={cn(
              "h-12 w-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-110",
              bgColor,
            )}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
