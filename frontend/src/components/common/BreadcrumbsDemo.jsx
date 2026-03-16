import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Breadcrumbs } from "./Breadcrumbs";
import { useBreadcrumbs, breadcrumbGenerators } from "@/hooks/useBreadcrumbs";
import {
  Home,
  Users,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  ChevronRight,
  Navigation,
  Check,
  Code,
  Zap,
} from "lucide-react";
import { useState } from "react";

export const BreadcrumbsDemo = () => {
  const { setBreadcrumbs, clearBreadcrumbs } = useBreadcrumbs();
  const [currentDemo, setCurrentDemo] = useState("auto");

  const demoScenarios = {
    auto: {
      title: "Auto-generated Breadcrumbs",
      description:
        "Breadcrumbs automatically generated based on current URL path",
      breadcrumbs: null,
    },
    users: {
      title: "Users List Page",
      description: "Breadcrumbs for a users management page",
      breadcrumbs: breadcrumbGenerators.list("Users", "/users"),
    },
    userDetail: {
      title: "User Detail Page",
      description: "Breadcrumbs for viewing a specific user",
      breadcrumbs: breadcrumbGenerators.detail("Users", "John Doe", "/users"),
    },
    examCreate: {
      title: "Create Exam Page",
      description: "Breadcrumbs for creating a new exam",
      breadcrumbs: breadcrumbGenerators.create("Exams", "/exams"),
    },
    examTake: {
      title: "Taking Exam",
      description: "Breadcrumbs for a student taking an exam",
      breadcrumbs: breadcrumbGenerators.examTake("Mathematics Final"),
    },
    nested: {
      title: "Nested Navigation",
      description: "Deep nested breadcrumbs example",
      breadcrumbs: [
        { label: "Dashboard", href: "/dashboard", icon: Home },
        { label: "Courses", href: "/courses", icon: BookOpen },
        { label: "Mathematics", href: "/courses/math", icon: null },
        {
          label: "Assignments",
          href: "/courses/math/assignments",
          icon: FileText,
        },
        { label: "Assignment 1", href: null, icon: null },
      ],
    },
    settings: {
      title: "Settings Section",
      description: "Breadcrumbs for settings with subsection",
      breadcrumbs: breadcrumbGenerators.settings("User Preferences"),
    },
  };

  const handleDemoChange = (demoKey) => {
    setCurrentDemo(demoKey);
    const demo = demoScenarios[demoKey];
    if (demo.breadcrumbs) {
      setBreadcrumbs(demo.breadcrumbs);
    } else {
      clearBreadcrumbs();
    }
  };

  const breadcrumbFeatures = [
    {
      title: "Auto-generation",
      description: "Automatically generates breadcrumbs based on URL path",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      title: "Custom Breadcrumbs",
      description: "Set custom breadcrumbs for specific pages or sections",
      icon: Settings,
      color: "text-blue-500",
    },
    {
      title: "Context Management",
      description: "Global breadcrumb state management with React Context",
      icon: Navigation,
      color: "text-green-500",
    },
    {
      title: "Icon Support",
      description: "Support for icons in breadcrumb items",
      icon: Home,
      color: "text-purple-500",
    },
    {
      title: "Responsive Design",
      description: "Mobile-friendly breadcrumb navigation",
      icon: Code,
      color: "text-red-500",
    },
    {
      title: "Role-based Display",
      description: "Show different breadcrumbs based on user role",
      icon: Users,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Breadcrumbs Navigation</h1>
        <p className="text-muted-foreground">
          Comprehensive breadcrumb system for better navigation and user
          orientation
        </p>
      </div>

      <div className="grid gap-6">
        {/* Current Breadcrumb Display */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5" />
              Current Breadcrumbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-accent/50 rounded-lg">
              <Breadcrumbs />
              {!demoScenarios[currentDemo].breadcrumbs && (
                <p className="text-sm text-muted-foreground mt-2">
                  Auto-generated breadcrumbs based on current URL path
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Demo Scenarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Demo Scenarios
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(demoScenarios).map(([key, demo]) => (
                <Button
                  key={key}
                  variant={currentDemo === key ? "default" : "outline"}
                  className="h-auto p-3 text-left justify-start"
                  onClick={() => handleDemoChange(key)}>
                  <div>
                    <div className="font-medium text-sm">{demo.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {demo.description}
                    </div>
                  </div>
                </Button>
              ))}
            </div>

            <div className="mt-4 p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">
                Current Demo: {demoScenarios[currentDemo].title}
              </h4>
              <p className="text-sm text-muted-foreground mb-3">
                {demoScenarios[currentDemo].description}
              </p>

              {demoScenarios[currentDemo].breadcrumbs && (
                <div className="bg-accent/30 p-3 rounded-lg">
                  <p className="text-xs font-medium text-muted-foreground mb-2">
                    Breadcrumb Structure:
                  </p>
                  <div className="flex flex-wrap items-center gap-1 text-sm">
                    {demoScenarios[currentDemo].breadcrumbs.map(
                      (crumb, index) => (
                        <div key={index} className="flex items-center">
                          {index > 0 && (
                            <ChevronRight className="h-3 w-3 mx-1 text-muted-foreground" />
                          )}
                          <Badge variant="secondary" className="text-xs">
                            {crumb.icon && (
                              <crumb.icon className="h-3 w-3 mr-1" />
                            )}
                            {crumb.label}
                          </Badge>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="h-5 w-5" />
              Breadcrumb Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {breadcrumbFeatures.map((feature) => {
                const IconComponent = feature.icon;
                return (
                  <div key={feature.title} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-2">
                      <IconComponent className={`h-5 w-5 ${feature.color}`} />
                      <h4 className="font-semibold">{feature.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Usage Examples */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              Usage Examples
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Basic Usage</h4>
                <pre className="text-sm bg-accent/50 p-3 rounded overflow-x-auto">
                  {`import { useBreadcrumbs, breadcrumbGenerators } from "@/hooks/useBreadcrumbs";

// In your component
const MyPage = () => {
  useBreadcrumbs(breadcrumbGenerators.list("Users", "/users"));
  
  return <div>Page content</div>;
};`}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Custom Breadcrumbs</h4>
                <pre className="text-sm bg-accent/50 p-3 rounded overflow-x-auto">
                  {`const customBreadcrumbs = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Settings", href: "/settings" },
  { label: "User Preferences", href: null }
];

useBreadcrumbs(customBreadcrumbs);`}
                </pre>
              </div>

              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Dynamic Breadcrumbs</h4>
                <pre className="text-sm bg-accent/50 p-3 rounded overflow-x-auto">
                  {`const ExamDetailPage = ({ examId }) => {
  const [exam, setExam] = useState(null);
  
  useEffect(() => {
    // Fetch exam data
    fetchExam(examId).then(setExam);
  }, [examId]);
  
  useBreadcrumbs(
    exam ? breadcrumbGenerators.detail("Exams", exam.title, "/exams") : null
  );
};`}
                </pre>
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
                <h4 className="font-semibold mb-2">Components Created:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <code>Breadcrumbs.jsx</code> - Main breadcrumb component
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <code>BreadcrumbContext.jsx</code> - Context for state
                    management
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <code>useBreadcrumbs.js</code> - Hook for breadcrumb
                    management
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                    Integration Complete
                  </h4>
                </div>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>✅ Integrated into Layout component</li>
                  <li>✅ Context provider added to App.jsx</li>
                  <li>✅ Auto-generation based on URL paths</li>
                  <li>✅ Custom breadcrumb support</li>
                  <li>✅ Icon and styling support</li>
                  <li>✅ Mobile-responsive design</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
