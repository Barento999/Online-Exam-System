import { Badge } from "@/components/ui/badge";
import { AlertTriangle, User, Database } from "lucide-react";

export const DevModeIndicator = ({ usingMockData = false }) => {
  if (!usingMockData) return null;

  const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    return !!(token && user);
  };

  const authStatus = isAuthenticated();

  return (
    <div className="fixed top-4 right-4 z-50 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="flex flex-col gap-2">
        <Badge
          variant="outline"
          className="bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400">
          <Database className="h-3 w-3 mr-1" />
          Using Mock Data
        </Badge>

        {!authStatus && (
          <Badge
            variant="outline"
            className="bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
            <User className="h-3 w-3 mr-1" />
            Not Authenticated
          </Badge>
        )}
      </div>
    </div>
  );
};
