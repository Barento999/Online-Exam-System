import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  ArrowLeft,
  Search,
  FileQuestion,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Zap,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export const NotFoundAlternative = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [countdown, setCountdown] = useState(10);
  const [autoRedirect, setAutoRedirect] = useState(true);

  // Auto redirect countdown
  useEffect(() => {
    if (!autoRedirect) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleGoHome();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [autoRedirect]);

  const handleGoHome = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const popularPages = [
    {
      title: "Dashboard",
      description: "View your overview",
      icon: Home,
      path: "/dashboard",
      color: "blue",
    },
    {
      title: "Exams",
      description: "Browse available exams",
      icon: FileQuestion,
      path: "/exams",
      color: "purple",
    },
    {
      title: "Courses",
      description: "Explore courses",
      icon: BookOpen,
      path: "/courses",
      color: "green",
    },
    {
      title: "Results",
      description: "Check your results",
      icon: TrendingUp,
      path: "/results",
      color: "orange",
    },
    {
      title: "Analytics",
      description: "View analytics",
      icon: BarChart3,
      path: "/analytics",
      color: "pink",
    },
    {
      title: "Settings",
      description: "Manage preferences",
      icon: Settings,
      path: "/settings",
      color: "indigo",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
      purple:
        "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
      green:
        "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
      orange:
        "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700",
      pink: "from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700",
      indigo:
        "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-lg">Exam System</span>
          </div>
          <Button
            onClick={handleGoHome}
            variant="ghost"
            size="sm"
            className="gap-2">
            <Home className="h-4 w-4" />
            Home
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* 404 Section */}
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50 animate-pulse"></div>
              <h1 className="relative text-[120px] md:text-[180px] font-black leading-none bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                404
              </h1>
            </div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Page Not Found
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track!
          </p>

          {/* Auto Redirect Notice */}
          {autoRedirect && countdown > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300 mb-6">
              <Zap className="h-4 w-4" />
              Redirecting to home in {countdown} seconds...
              <button
                onClick={() => setAutoRedirect(false)}
                className="ml-2 underline hover:no-underline">
                Cancel
              </button>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button
              onClick={handleGoHome}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
              <Home className="mr-2 h-5 w-5" />
              Go to Home
            </Button>
            <Button
              onClick={() => navigate(-1)}
              size="lg"
              variant="outline"
              className="border-2">
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </Button>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for pages, exams, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 h-12 text-base"
              />
            </div>
          </form>
        </div>

        {/* Popular Pages Grid */}
        {user && (
          <div className="animate-in fade-in duration-700 delay-200">
            <h3 className="text-xl font-semibold mb-6 text-center">
              Popular Pages
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularPages.map((page, index) => {
                const Icon = page.icon;
                return (
                  <button
                    key={page.path}
                    onClick={() => navigate(page.path)}
                    className="group relative p-6 bg-card border border-border rounded-xl hover:shadow-lg transition-all duration-200 text-left overflow-hidden"
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}>
                    {/* Gradient Background on Hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${getColorClasses(page.color)} opacity-0 group-hover:opacity-10 transition-opacity duration-200`}></div>

                    {/* Content */}
                    <div className="relative">
                      <div
                        className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br ${getColorClasses(page.color)} mb-4 shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                        {page.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {page.description}
                      </p>
                    </div>

                    {/* Arrow Icon */}
                    <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 transition-all duration-200">
                      <ArrowLeft className="h-5 w-5 text-muted-foreground rotate-180" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Help Section */}
        <div className="mt-12 text-center animate-in fade-in duration-700 delay-400">
          <div className="inline-block bg-card border border-border rounded-lg p-6 max-w-md">
            <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h4 className="font-semibold mb-2">Need Help?</h4>
            <p className="text-sm text-muted-foreground mb-4">
              If you believe this is an error, please contact our support team.
            </p>
            <Button variant="outline" size="sm" onClick={handleGoHome}>
              Contact Support
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border/50 bg-card/50 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>© 2026 Online Exam System. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};
