import { Badge } from "@/components/ui/badge";
import { AlertTriangle } from "lucide-react";

export const DevModeIndicator = ({ usingMockData = false }) => {
  if (!usingMockData) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-500">
      <Badge
        variant="outline"
        className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
        <AlertTriangle className="h-3 w-3 mr-1" />
        Using Mock Data
      </Badge>
    </div>
  );
};
