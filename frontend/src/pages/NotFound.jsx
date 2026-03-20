import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  Home,
  ArrowLeft,
  Search,
  FileQuestion,
  Compass,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const NotFound = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleGoHome = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const quickLinks = [
    { label: "Dashboard", path: "/dashboard", icon: Home },
    { label: "Exams", path: "/exams", icon: FileQuestion },
    { label: "Courses", path: "/courses", icon: Compass },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-purple-900/20 dark:to-blue-900/20 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-pink-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles
          className="absolute top-20 left-20 w-6 h-6 text-blue-400/40 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <FileQuestion
          className="absolute top-40 right-32 w-5 h-5 text-purple-400/40 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <Compass
          className="absolute bottom-32 left-40 w-5 h-5 text-pink-400/40 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <Search
          className="absolute bottom-20 right-20 w-6 h-6 text-blue-400/40 animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* 404 Number */}
        <div className="mb-8">
          <h1 className="text-[150px] md:text-[200px] font-bold leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-in zoom-in duration-500 delay-200">
            404
          </h1>
        </div>

        {/* Error Message */}
        <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-300">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Oops! Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            The page you're looking for seems to have wandered off. It might
            have been moved, deleted, or never existed in the first place.
          </p>
        </div>

        {/* Illustration */}
        <div className="mb-8 animate-in fade-in duration-500 delay-400">
          <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-border/50">
            <FileQuestion className="w-16 h-16 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-500">
          <Button
            onClick={handleGoHome}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
            <Home className="mr-2 h-5 w-5" />
            Go to Home
          </Button>
          <Button
            onClick={handleGoBack}
            size="lg"
            variant="outline"
            className="border-2 hover:bg-accent transition-all duration-200 transform hover:scale-105">
            <ArrowLeft className="mr-2 h-5 w-5" />
            Go Back
          </Button>
        </div>

        {/* Quick Links */}
        {user && (
          <div className="animate-in fade-in duration-500 delay-600">
            <div className="inline-block bg-card/80 backdrop-blur-sm border border-border/50 rounded-lg p-6 shadow-lg">
              <p className="text-sm font-medium text-muted-foreground mb-4">
                Quick Links
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {quickLinks.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Button
                      key={link.path}
                      onClick={() => navigate(link.path)}
                      variant="ghost"
                      size="sm"
                      className="hover:bg-accent hover:text-accent-foreground transition-all duration-200">
                      <Icon className="mr-2 h-4 w-4" />
                      {link.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 animate-in fade-in duration-500 delay-700">
          <p className="text-sm text-muted-foreground">
            Need help?{" "}
            <button
              onClick={handleGoHome}
              className="text-primary hover:underline font-medium">
              Contact support
            </button>{" "}
            or return to the{" "}
            <button
              onClick={handleGoHome}
              className="text-primary hover:underline font-medium">
              homepage
            </button>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground z-10">
        <p>© 2026 Online Exam System. All rights reserved.</p>
      </div>
    </div>
  );
};
