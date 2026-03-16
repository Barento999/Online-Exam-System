import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  User,
  Settings,
  Sun,
  Moon,
  Check,
  Star,
  AlertCircle,
  Info,
} from "lucide-react";

export const NavbarDemo = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Enhanced Navbar Features</h1>
        <p className="text-muted-foreground">
          Demonstration of the improved navbar with real notifications, theme
          toggle, and user profile
        </p>
      </div>

      <div className="grid gap-6">
        {/* Real Notification System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Real Notification System
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Features Implemented:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Dynamic notification count badge
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Real-time data from API endpoints
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Role-based notification content
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Mark as read/unread functionality
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Clear all notifications option
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Click to navigate to relevant pages
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Notification Types by Role:
                </h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Admin/Teacher
                    </Badge>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        New user registrations
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        Draft/unpublished exams
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                        Orphaned questions
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full" />
                        Results needing grading
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        Pending enrollments
                      </li>
                    </ul>
                  </div>
                  <div>
                    <Badge variant="secondary" className="mb-2">
                      Student
                    </Badge>
                    <ul className="space-y-1">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Available exams
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        New results (last 3 days)
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Theme Toggle */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="h-5 w-5" />
              Enhanced Theme Toggle
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Improvements Made:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    System theme preference detection
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Visual feedback with colored icons
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Smooth transitions and hover effects
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Toast notification on theme change
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Tooltip showing next theme mode
                  </li>
                </ul>
              </div>

              <div className="flex items-center gap-4 p-4 bg-accent/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Sun className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">Light Mode Icon</span>
                </div>
                <div className="flex items-center gap-2">
                  <Moon className="h-5 w-5 text-slate-600" />
                  <span className="text-sm">Dark Mode Icon</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Profile Dropdown */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              User Profile Dropdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">New Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    User avatar with fallback initials
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    User name and email display
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Role badge indicator
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Profile page navigation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Settings page navigation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Styled logout option
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-accent/50 rounded-lg">
                <h4 className="font-semibold mb-2">
                  Additional Pages Created:
                </h4>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/profile")}>
                    <User className="h-4 w-4 mr-2" />
                    Profile Page
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => (window.location.href = "/settings")}>
                    <Settings className="h-4 w-4 mr-2" />
                    Settings Page
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Integration Points:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    NotificationContext integration
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    NotificationService API calls
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    AuthContext user data
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    React Router navigation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Radix UI components
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Tailwind CSS styling
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    Issues Resolved
                  </h4>
                </div>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>
                    ✅ Empty notifications dropdown → Real notification system
                  </li>
                  <li>
                    ✅ Basic theme toggle → Enhanced with system preference
                  </li>
                  <li>
                    ✅ No user profile dropdown → Complete profile management
                  </li>
                  <li>
                    ✅ Missing profile/settings pages → Fully functional pages
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
