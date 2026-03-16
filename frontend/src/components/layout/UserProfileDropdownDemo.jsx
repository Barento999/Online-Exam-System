import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Zap,
  Activity,
  Plus,
  BookOpen,
  BarChart3,
  Users,
  FileText,
  HelpCircle,
  UserCircle,
  Settings,
  LogOut,
  Check,
  Star,
  TrendingUp,
} from "lucide-react";

export const UserProfileDropdownDemo = () => {
  const mockUser = {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "admin",
    avatar: null,
  };

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "U"
    );
  };

  const quickActionsByRole = {
    admin: [
      {
        id: "create-exam",
        label: "Create Exam",
        icon: Plus,
        description: "Create a new exam",
      },
      {
        id: "manage-users",
        label: "Manage Users",
        icon: Users,
        description: "View and manage users",
      },
      {
        id: "view-analytics",
        label: "View Analytics",
        icon: BarChart3,
        description: "Check system analytics",
      },
      {
        id: "help",
        label: "Help & Support",
        icon: HelpCircle,
        description: "Get help and documentation",
      },
    ],
    teacher: [
      {
        id: "create-exam",
        label: "Create Exam",
        icon: Plus,
        description: "Create a new exam",
      },
      {
        id: "create-question",
        label: "Add Question",
        icon: FileText,
        description: "Add new question",
      },
      {
        id: "view-results",
        label: "View Results",
        icon: BarChart3,
        description: "Check exam results",
      },
      {
        id: "help",
        label: "Help & Support",
        icon: HelpCircle,
        description: "Get help and documentation",
      },
    ],
    student: [
      {
        id: "take-exam",
        label: "Take Exam",
        icon: BookOpen,
        description: "View available exams",
      },
      {
        id: "view-results",
        label: "My Results",
        icon: BarChart3,
        description: "Check my exam results",
      },
      {
        id: "help",
        label: "Help & Support",
        icon: HelpCircle,
        description: "Get help and documentation",
      },
    ],
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Enhanced User Profile Dropdown</h1>
        <p className="text-muted-foreground">
          Comprehensive user profile dropdown with quick actions, stats, and
          improved UX
        </p>
      </div>

      <div className="grid gap-6">
        {/* Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Enhanced Features Overview
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">New Features Added:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Larger user info header with bigger avatar
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Real-time activity status indicator
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Quick stats dashboard (exams today, pending tasks)
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Role-based quick actions with descriptions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Enhanced account management section
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Improved logout section with description
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    Lightning bolt icons for quick actions
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mock Dropdown Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Dropdown Preview (Static Demo)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-80 mx-auto border rounded-lg shadow-lg bg-card">
              {/* User Info Header */}
              <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={mockUser.avatar} alt={mockUser.name} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                      {getInitials(mockUser.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {mockUser.name}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {mockUser.email}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs">
                        {mockUser.role}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Activity className="h-3 w-3" />
                        Active now
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="px-4 py-2 border-b">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-accent/50 rounded-lg p-2 text-center">
                    <div className="font-semibold text-primary">5</div>
                    <div className="text-muted-foreground">Active Exams</div>
                  </div>
                  <div className="bg-accent/50 rounded-lg p-2 text-center">
                    <div className="font-semibold text-primary">3</div>
                    <div className="text-muted-foreground">Pending Tasks</div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="px-2 py-2 border-b">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                  Quick Actions
                </div>
                {quickActionsByRole[mockUser.role].map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <div
                      key={action.id}
                      className="flex items-center space-x-3 w-full px-2 py-2 hover:bg-accent rounded-sm cursor-pointer">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium">
                          {action.label}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {action.description}
                        </div>
                      </div>
                      <Zap className="h-3 w-3 text-muted-foreground" />
                    </div>
                  );
                })}
              </div>

              {/* Account Management */}
              <div className="px-2 py-2 border-b">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 mb-1">
                  Account
                </div>
                <div className="flex items-center space-x-3 w-full px-2 py-2 hover:bg-accent rounded-sm cursor-pointer">
                  <UserCircle className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Profile</div>
                    <div className="text-xs text-muted-foreground">
                      Manage your account
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 w-full px-2 py-2 hover:bg-accent rounded-sm cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Settings</div>
                    <div className="text-xs text-muted-foreground">
                      Preferences & privacy
                    </div>
                  </div>
                </div>
              </div>

              {/* Logout */}
              <div className="px-2 py-2">
                <div className="flex items-center space-x-3 w-full px-2 py-2 hover:bg-red-50 dark:hover:bg-red-950 rounded-sm cursor-pointer text-red-600">
                  <LogOut className="h-4 w-4" />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Log out</div>
                    <div className="text-xs opacity-75">
                      Sign out of your account
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-based Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Role-based Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              {Object.entries(quickActionsByRole).map(([role, actions]) => (
                <div key={role} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="capitalize">
                      {role}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {actions.length} quick actions available
                    </span>
                  </div>
                  <div className="grid md:grid-cols-2 gap-2">
                    {actions.map((action) => {
                      const IconComponent = action.icon;
                      return (
                        <div
                          key={action.id}
                          className="flex items-center gap-3 p-2 bg-accent/30 rounded-lg">
                          <IconComponent className="h-4 w-4 text-primary" />
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium">
                              {action.label}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {action.description}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
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
                <h4 className="font-semibold mb-2">Key Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                    <strong>Dynamic Stats:</strong> Real-time user statistics
                    display
                  </li>
                  <li className="flex items-center gap-2">
                    <Zap className="h-4 w-4 text-yellow-500" />
                    <strong>Quick Actions:</strong> Role-based contextual
                    actions
                  </li>
                  <li className="flex items-center gap-2">
                    <Activity className="h-4 w-4 text-green-500" />
                    <strong>Activity Status:</strong> Real-time user activity
                    indicator
                  </li>
                  <li className="flex items-center gap-2">
                    <User className="h-4 w-4 text-purple-500" />
                    <strong>Enhanced Profile:</strong> Larger avatar and better
                    info layout
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Check className="h-5 w-5 text-green-600" />
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    User Experience Improvements
                  </h4>
                </div>
                <ul className="space-y-1 text-sm text-green-700 dark:text-green-300">
                  <li>✅ Wider dropdown (320px) for better content display</li>
                  <li>✅ Organized sections with clear visual hierarchy</li>
                  <li>✅ Contextual quick actions based on user role</li>
                  <li>✅ Visual feedback with hover states and icons</li>
                  <li>✅ Descriptive text for better understanding</li>
                  <li>✅ Consistent spacing and typography</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
