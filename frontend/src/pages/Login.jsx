import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { useAuth } from "@/context/AuthContext";
import { authApi } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageTransitionLoader } from "@/components/common/PageTransitionLoader";
import { GraduationCap, Loader2, Eye, EyeOff, Sparkles } from "lucide-react";
import toast from "react-hot-toast";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.login(email, password);
      const userData = response.data;

      // Store token
      localStorage.setItem("token", userData.token);

      // Store user data (without token)
      const { token, ...userWithoutToken } = userData;
      login(userWithoutToken);

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (role) => {
    switch (role) {
      case "admin":
        setEmail("admin@exam.com");
        setPassword("admin123");
        break;
      case "teacher":
        setEmail("teacher@exam.com");
        setPassword("teacher123");
        break;
      case "student":
        setEmail("student@exam.com");
        setPassword("student123");
        break;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 p-4 relative overflow-hidden">
      <PageTransitionLoader />
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles
          className="absolute top-20 left-20 w-6 h-6 text-blue-400/40 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <Sparkles
          className="absolute top-40 right-32 w-4 h-4 text-purple-400/40 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <Sparkles
          className="absolute bottom-32 left-40 w-5 h-5 text-indigo-400/40 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <Sparkles
          className="absolute bottom-20 right-20 w-6 h-6 text-pink-400/40 animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4s" }}
        />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg animate-in zoom-in duration-500 delay-200">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-2 duration-500 delay-300">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-base animate-in fade-in duration-500 delay-400">
            Sign in to your account to continue
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-in fade-in duration-500 delay-500">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`transition-all duration-200 ${
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : "focus-visible:ring-2 focus-visible:ring-blue-500"
                }`}
              />
              {errors.email && (
                <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pr-10 transition-all duration-200 ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : "focus-visible:ring-2 focus-visible:ring-blue-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}>
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.password}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
              <p className="text-xs text-muted-foreground font-medium">
                QUICK ACCESS
              </p>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("admin")}
                className="hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 dark:hover:bg-blue-950 dark:hover:text-blue-300 transition-all duration-200 transform hover:scale-105">
                <span className="text-xs font-medium">Admin</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("teacher")}
                className="hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 dark:hover:bg-purple-950 dark:hover:text-purple-300 transition-all duration-200 transform hover:scale-105">
                <span className="text-xs font-medium">Teacher</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials("student")}
                className="hover:bg-green-50 hover:text-green-700 hover:border-green-300 dark:hover:bg-green-950 dark:hover:text-green-300 transition-all duration-200 transform hover:scale-105">
                <span className="text-xs font-medium">Student</span>
              </Button>
            </div>
            <p className="text-xs text-center text-muted-foreground mt-2">
              Click to auto-fill demo credentials
            </p>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link
              to="/register"
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline transition-colors">
              Register now
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="absolute bottom-4 left-0 right-0 text-center text-xs text-muted-foreground z-10">
        <p>© 2026 Online Exam System. All rights reserved.</p>
      </div>
    </div>
  );
};
