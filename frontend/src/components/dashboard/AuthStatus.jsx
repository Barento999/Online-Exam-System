import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { authApi } from "@/services/api";
import { cn } from "@/lib/utils";
import {
  User,
  CheckCircle,
  XCircle,
  RefreshCw,
  LogIn,
  Database,
  Wifi,
  WifiOff,
} from "lucide-react";
import { useNavigate } from "react-router";

export const AuthStatus = () => {
  const [authStatus, setAuthStatus] = useState({
    isAuthenticated: false,
    user: null,
    token: null,
    apiConnected: false,
    loading: true,
  });
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setAuthStatus((prev) => ({ ...prev, loading: true }));

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    let user = null;

    try {
      user = userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      console.warn("Invalid user data in localStorage");
    }

    const isAuthenticated = !!(token && user);
    let apiConnected = false;

    // Test API connection if authenticated
    if (isAuthenticated) {
      try {
        await authApi.getCurrentUser();
        apiConnected = true;
      } catch (error) {
        console.warn("API connection failed:", error.message);
        apiConnected = false;
      }
    }

    setAuthStatus({
      isAuthenticated,
      user,
      token: token ? `${token.substring(0, 10)}...` : null,
      apiConnected,
      loading: false,
    });
  };

  const handleLogin = () => {
    navigate("/login");
  };

  const handleRefresh = () => {
    checkAuthStatus();
  };

  if (authStatus.loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Checking Authentication...
          </CardTitle>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Authentication Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Authentication Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Authentication:</span>
              <Badge
                variant={authStatus.isAuthenticated ? "default" : "destructive"}
                className={cn(
                  "flex items-center gap-1",
                  authStatus.isAuthenticated
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
                )}>
                {authStatus.isAuthenticated ? (
                  <CheckCircle className="h-3 w-3" />
                ) : (
                  <XCircle className="h-3 w-3" />
                )}
                {authStatus.isAuthenticated
                  ? "Authenticated"
                  : "Not Authenticated"}
              </Badge>
            </div>

            {authStatus.user && (
              <div className="text-sm text-muted-foreground">
                <p>User: {authStatus.user.name || authStatus.user.email}</p>
                <p>Role: {authStatus.user.role || "Student"}</p>
              </div>
            )}

            {authStatus.token && (
              <div className="text-xs text-muted-foreground">
                Token: {authStatus.token}
              </div>
            )}
          </div>

          {/* API Connection Status */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">API Connection:</span>
              <Badge
                variant={authStatus.apiConnected ? "default" : "destructive"}
                className={cn(
                  "flex items-center gap-1",
                  authStatus.apiConnected
                    ? "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                    : "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400",
                )}>
                {authStatus.apiConnected ? (
                  <Wifi className="h-3 w-3" />
                ) : (
                  <WifiOff className="h-3 w-3" />
                )}
                {authStatus.apiConnected ? "Connected" : "Disconnected"}
              </Badge>
            </div>

            <div className="text-sm text-muted-foreground">
              {authStatus.apiConnected
                ? "API endpoints are accessible"
                : "Using fallback mock data"}
            </div>
          </div>
        </div>

        {/* Data Source Indicator */}
        <div className="pt-4 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Data Source:</span>
            <Badge
              variant="outline"
              className={cn(
                "flex items-center gap-1",
                authStatus.isAuthenticated && authStatus.apiConnected
                  ? "bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400"
                  : "bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-400",
              )}>
              <Database className="h-3 w-3" />
              {authStatus.isAuthenticated && authStatus.apiConnected
                ? "Real API Data"
                : "Mock Data"}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={handleRefresh}
            variant="outline"
            size="sm"
            className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Status
          </Button>

          {!authStatus.isAuthenticated && (
            <Button
              onClick={handleLogin}
              size="sm"
              className="flex items-center gap-2">
              <LogIn className="h-4 w-4" />
              Login
            </Button>
          )}
        </div>

        {/* Help Text */}
        {!authStatus.isAuthenticated && (
          <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
            <p className="font-medium mb-1">To see real student data:</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Login with your student credentials</li>
              <li>Ensure the backend API is running</li>
              <li>Refresh this page to load real data</li>
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
