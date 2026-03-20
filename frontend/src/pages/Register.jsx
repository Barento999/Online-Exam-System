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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  GraduationCap,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
  UserPlus,
} from "lucide-react";
import toast from "react-hot-toast";

export const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.name) {
      newErrors.name = "Name is required";
    }
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.role) {
      newErrors.role = "Role is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      const response = await authApi.register(formData);
      const userData = response.data;

      // Store token
      localStorage.setItem("token", userData.token);

      // Store user data (without token)
      const { token, ...userWithoutToken } = userData;
      login(userWithoutToken);

      toast.success("Registration successful!");
      navigate("/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-green-900/20 dark:to-teal-900/20 p-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-emerald-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <Sparkles
          className="absolute top-20 left-20 w-6 h-6 text-green-400/40 animate-bounce"
          style={{ animationDelay: "0s", animationDuration: "3s" }}
        />
        <UserPlus
          className="absolute top-40 right-32 w-5 h-5 text-teal-400/40 animate-bounce"
          style={{ animationDelay: "1s", animationDuration: "4s" }}
        />
        <Sparkles
          className="absolute bottom-32 left-40 w-5 h-5 text-emerald-400/40 animate-bounce"
          style={{ animationDelay: "2s", animationDuration: "3.5s" }}
        />
        <UserPlus
          className="absolute bottom-20 right-20 w-6 h-6 text-green-400/40 animate-bounce"
          style={{ animationDelay: "0.5s", animationDuration: "4s" }}
        />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-0 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <CardHeader className="space-y-1 text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-lg animate-in zoom-in duration-500 delay-200">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent animate-in fade-in slide-in-from-top-2 duration-500 delay-300">
            Create Account
          </CardTitle>
          <CardDescription className="text-base animate-in fade-in duration-500 delay-400">
            Register to get started with the exam system
          </CardDescription>
        </CardHeader>
        <CardContent className="animate-in fade-in duration-500 delay-500">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
                className={`transition-all duration-200 ${
                  errors.name
                    ? "border-destructive focus-visible:ring-destructive"
                    : "focus-visible:ring-2 focus-visible:ring-green-500"
                }`}
              />
              {errors.name && (
                <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                className={`transition-all duration-200 ${
                  errors.email
                    ? "border-destructive focus-visible:ring-destructive"
                    : "focus-visible:ring-2 focus-visible:ring-green-500"
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pr-10 transition-all duration-200 ${
                    errors.password
                      ? "border-destructive focus-visible:ring-destructive"
                      : "focus-visible:ring-2 focus-visible:ring-green-500"
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
              <p className="text-xs text-muted-foreground">
                Must be at least 6 characters long
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                I am a
              </Label>
              <Select
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }>
                <SelectTrigger
                  className={`transition-all duration-200 ${
                    errors.role
                      ? "border-destructive focus-visible:ring-destructive"
                      : "focus-visible:ring-2 focus-visible:ring-green-500"
                  }`}>
                  <SelectValue placeholder="Select your role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">
                    <div className="flex items-center gap-2">
                      <span>🎓</span>
                      <span>Student</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="teacher">
                    <div className="flex items-center gap-2">
                      <span>👨‍🏫</span>
                      <span>Teacher</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-sm text-destructive animate-in slide-in-from-top-1 duration-200">
                  {errors.role}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
              disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Already have an account?{" "}
            </span>
            <Link
              to="/login"
              className="text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-medium hover:underline transition-colors">
              Sign in
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
