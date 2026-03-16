import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Command,
  BookOpen,
  Hash,
  User,
  GraduationCap,
  ArrowRight,
  Zap,
  Clock,
  TrendingUp,
  Filter,
  Check,
  Keyboard,
} from "lucide-react";
import { useState } from "react";

export const SearchDemo = () => {
  const [demoQuery, setDemoQuery] = useState("");

  const searchFeatures = [
    {
      title: "Global Search",
      description: "Search across exams, questions, users, and courses",
      icon: Search,
      color: "text-blue-500",
    },
    {
      title: "Keyboard Shortcuts",
      description: "Cmd/Ctrl + K to open search, Escape to close",
      icon: Keyboard,
      color: "text-purple-500",
    },
    {
      title: "Real-time Results",
      description: "Instant search results with 300ms debouncing",
      icon: Zap,
      color: "text-yellow-500",
    },
    {
      title: "Role-based Filtering",
      description: "Results filtered based on user permissions",
      icon: Filter,
      color: "text-green-500",
    },
    {
      title: "Recent Searches",
      description: "Remember and suggest recent search queries",
      icon: Clock,
      color: "text-orange-500",
    },
    {
      title: "Relevance Scoring",
      description: "Smart ranking based on title and content matches",
      icon: TrendingUp,
      color: "text-red-500",
    },
  ];

  const mockSearchResults = [
    {
      id: 1,
      type: "exam",
      title: "Advanced Mathematics Final",
      description: "Calculus, Linear Algebra, and Statistics",
      category: "Exams",
      icon: BookOpen,
      path: "/exams/1",
      metadata: { duration: "120 min", questions: 25, status: "active" },
    },
    {
      id: 2,
      type: "question",
      title: "Integration by Parts",
      description: "Multiple choice - Calculus",
      category: "Questions",
      icon: Hash,
      path: "/questions/2",
      metadata: { type: "multiple-choice", difficulty: "medium", points: 5 },
    },
    {
      id: 3,
      type: "user",
      title: "Sarah Johnson",
      description: "Student - Mathematics Department",
      category: "Users",
      icon: User,
      path: "/users/3",
      metadata: { role: "student", status: "active", joinDate: "2024-01-15" },
    },
    {
      id: 4,
      type: "course",
      title: "Calculus I",
      description: "MATH101 - Introduction to Differential Calculus",
      category: "Courses",
      icon: GraduationCap,
      path: "/courses/4",
      metadata: { code: "MATH101", students: 45, instructor: "Dr. Smith" },
    },
  ];

  const roleBasedResults = {
    admin: {
      label: "Admin",
      description: "Can search all content types",
      results: ["Exams", "Questions", "Users", "Courses", "Analytics"],
    },
    teacher: {
      label: "Teacher",
      description: "Can search teaching-related content",
      results: ["Exams", "Questions", "Users", "Courses", "Results"],
    },
    student: {
      label: "Student",
      description: "Can search available content",
      results: ["Available Exams", "Courses", "My Results"],
    },
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Search Functionality</h1>
        <p className="text-muted-foreground">
          Comprehensive global search with keyboard shortcuts, real-time
          results, and role-based filtering
        </p>
      </div>

      <div className="grid gap-6">
        {/* Search Features Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchFeatures.map((feature) => {
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

        {/* Interactive Search Demo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Command className="h-5 w-5" />
              Interactive Search Demo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Try searching for 'math' or 'exam'..."
                value={demoQuery}
                onChange={(e) => setDemoQuery(e.target.value)}
                className="pl-10 pr-4"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <Command className="h-3 w-3" />K
                </kbd>
              </div>
            </div>

            {/* Mock Results */}
            {demoQuery && (
              <div className="border rounded-lg max-w-2xl">
                <div className="p-3 border-b bg-accent/50">
                  <p className="text-sm font-medium">
                    Search results for "{demoQuery}"
                  </p>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {mockSearchResults
                    .filter(
                      (result) =>
                        result.title
                          .toLowerCase()
                          .includes(demoQuery.toLowerCase()) ||
                        result.description
                          .toLowerCase()
                          .includes(demoQuery.toLowerCase()),
                    )
                    .map((result) => {
                      const IconComponent = result.icon;
                      return (
                        <div
                          key={result.id}
                          className="p-3 hover:bg-accent flex items-center gap-3 group cursor-pointer border-b last:border-b-0">
                          <div className="flex-shrink-0">
                            <IconComponent className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {result.title}
                              </p>
                              <Badge
                                variant="secondary"
                                className="text-xs ml-2">
                                {result.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground truncate mt-1">
                              {result.description}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              {Object.entries(result.metadata)
                                .slice(0, 2)
                                .map(([key, value]) => (
                                  <span
                                    key={key}
                                    className="text-xs text-muted-foreground bg-accent/50 px-1 rounded">
                                    {key}: {value}
                                  </span>
                                ))}
                            </div>
                          </div>
                          <ArrowRight className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Role-based Search Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Role-based Search Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(roleBasedResults).map(([role, data]) => (
                <div key={role} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="secondary" className="capitalize">
                      {data.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    {data.description}
                  </p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">
                      Available Search Types:
                    </p>
                    {data.results.map((resultType) => (
                      <div key={resultType} className="flex items-center gap-2">
                        <Check className="h-3 w-3 text-green-500" />
                        <span className="text-xs">{resultType}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Keyboard Shortcuts */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Keyboard className="h-5 w-5" />
              Keyboard Shortcuts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <span className="text-sm">Open Search</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                      Cmd
                    </kbd>
                    <span className="text-xs">+</span>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                      K
                    </kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <span className="text-sm">Close Search</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                    Escape
                  </kbd>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <span className="text-sm">Navigate Results</span>
                  <div className="flex items-center gap-1">
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                      ↑
                    </kbd>
                    <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                      ↓
                    </kbd>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-accent/50 rounded-lg">
                  <span className="text-sm">Select Result</span>
                  <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
                    Enter
                  </kbd>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Technical Implementation */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              Technical Implementation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">Search Service Features:</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <strong>Global Search:</strong> Search across all content
                    types
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <strong>Relevance Scoring:</strong> Smart ranking algorithm
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <strong>Role-based Filtering:</strong> Results based on
                    permissions
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <strong>Recent Searches:</strong> localStorage persistence
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <strong>Debounced Search:</strong> 300ms delay for
                    performance
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <strong>Error Handling:</strong> Fallback to mock results
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Search className="h-5 w-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                    Search Integration
                  </h4>
                </div>
                <ul className="space-y-1 text-sm text-blue-700 dark:text-blue-300">
                  <li>✅ Integrated with existing API endpoints</li>
                  <li>✅ Real-time search with debouncing</li>
                  <li>✅ Keyboard shortcuts (Cmd/Ctrl + K)</li>
                  <li>✅ Mobile-responsive design</li>
                  <li>
                    ✅ Accessibility features (ARIA labels, focus management)
                  </li>
                  <li>✅ Loading states and error handling</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
