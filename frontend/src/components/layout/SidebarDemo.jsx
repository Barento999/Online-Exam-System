import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronRight,
  Sparkles,
  Zap,
  Eye,
  MousePointer,
} from "lucide-react";

export const SidebarDemo = () => {
  const [activeFeature, setActiveFeature] = useState(null);

  const features = [
    {
      id: "animations",
      title: "Smooth Animations",
      icon: Sparkles,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      description: "Staggered entry, slide-in, fade-in effects",
      details: [
        "50ms delay per menu item",
        "300ms smooth transitions",
        "Icon rotation & scale on hover",
        "Shimmer sweep effect",
      ],
    },
    {
      id: "indicators",
      title: "Active Indicators",
      icon: Eye,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
      description: "Smart path matching for nested routes",
      details: [
        "Vertical bar for active parent",
        "Dot indicator for active child",
        "Highlights nested routes automatically",
        "Different styling for parent/child",
      ],
    },
    {
      id: "collapse",
      title: "Collapse/Expand",
      icon: ChevronRight,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      description: "Expandable menu items with children",
      details: [
        "Smooth height transitions",
        "Rotating chevron icons",
        "Nested child items with indentation",
        "Multiple expandable sections",
      ],
    },
    {
      id: "hover",
      title: "Hover Effects",
      icon: MousePointer,
      color: "text-orange-600",
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      description: "Rich interactive hover states",
      details: [
        "Scale & translate animations",
        "Shimmer sweep effect",
        "Icon rotation (6° parent, 12° child)",
        "Glow effects on active items",
      ],
    },
    {
      id: "mobile",
      title: "Mobile Ready",
      icon: Zap,
      color: "text-pink-600",
      bgColor: "bg-pink-100 dark:bg-pink-900/20",
      description: "Responsive design with smooth transitions",
      details: [
        "Slide-in/out animation",
        "Backdrop overlay with fade",
        "Enhanced menu button",
        "Auto-close on navigation",
      ],
    },
  ];

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Sidebar Enhancement Demo</h2>
        <p className="text-muted-foreground">
          Explore the new sidebar features and improvements
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          const isActive = activeFeature === feature.id;

          return (
            <Card
              key={feature.id}
              className={`cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-in fade-in slide-in-from-bottom-4 ${
                isActive ? "ring-2 ring-primary" : ""
              }`}
              style={{
                animationDelay: `${index * 100}ms`,
                animationDuration: "400ms",
                animationFillMode: "both",
              }}
              onClick={() => setActiveFeature(isActive ? null : feature.id)}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div
                    className={`h-10 w-10 rounded-lg flex items-center justify-center ${feature.bgColor}`}>
                    <Icon className={`h-5 w-5 ${feature.color}`} />
                  </div>
                  <span className="text-lg">{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {feature.description}
                </p>

                {isActive && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {feature.details.map((detail, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-2 text-sm animate-in fade-in slide-in-from-left-2"
                        style={{
                          animationDelay: `${idx * 50}ms`,
                          animationDuration: "200ms",
                          animationFillMode: "both",
                        }}>
                        <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveFeature(isActive ? null : feature.id);
                  }}>
                  {isActive ? "Hide Details" : "Show Details"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Try It Out!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <p className="text-sm">
              Navigate through the sidebar to experience these enhancements:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                <span>
                  <strong>Hover</strong> over menu items to see animations
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                <span>
                  <strong>Click</strong> on "Exams" to expand/collapse children
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                <span>
                  <strong>Navigate</strong> to nested routes to see active
                  indicators
                </span>
              </li>
              <li className="flex items-start gap-2">
                <ChevronRight className="h-4 w-4 text-primary mt-0.5" />
                <span>
                  <strong>Resize</strong> your browser to test mobile menu
                </span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
