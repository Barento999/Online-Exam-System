import { useState } from "react";
import { Smartphone, Swipe, Touch, Zap } from "lucide-react";

export const MobileDrawerDemo = () => {
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: Swipe,
      title: "Swipe Gestures",
      description:
        "Swipe from the left edge to open the drawer, or swipe left to close it. Natural mobile interactions.",
      demo: "Try swiping from the left edge of your screen!",
    },
    {
      icon: Touch,
      title: "Touch Optimized",
      description:
        "Larger touch targets, haptic feedback simulation, and smooth animations designed for mobile.",
      demo: "All navigation items have 48px minimum touch targets.",
    },
    {
      icon: Zap,
      title: "Performance",
      description:
        "Hardware-accelerated animations, backdrop blur effects, and optimized scrolling for smooth performance.",
      demo: "Smooth 60fps animations with GPU acceleration.",
    },
    {
      icon: Smartphone,
      title: "Mobile First",
      description:
        "Responsive design that works perfectly on all screen sizes with mobile-specific enhancements.",
      demo: "Automatically adapts to your device's screen size.",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Enhanced Mobile Drawer</h2>
        <p className="text-muted-foreground text-lg">
          Experience the improved mobile navigation with swipe gestures, better
          animations, and touch-optimized interactions.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                currentFeature === index
                  ? "border-primary bg-primary/5 shadow-lg scale-105"
                  : "border-border hover:border-primary/50 hover:shadow-md"
              }`}
              onClick={() => setCurrentFeature(index)}>
              <div className="flex items-center gap-4 mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    currentFeature === index
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold">{feature.title}</h3>
              </div>
              <p className="text-muted-foreground mb-3">
                {feature.description}
              </p>
              <div className="text-sm font-medium text-primary">
                {feature.demo}
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-muted/50 rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Mobile Drawer Features</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Swipe from left edge to open</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Swipe left to close</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Backdrop blur overlay</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Auto-close on navigation</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Prevent body scroll when open</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Touch-optimized targets (48px+)</span>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
        <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
          How to Test Mobile Features
        </h4>
        <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
          <li>• Open browser dev tools and switch to mobile view</li>
          <li>• Try swiping from the left edge of the screen</li>
          <li>• Notice the smooth animations and backdrop blur</li>
          <li>• Test the improved touch targets on navigation items</li>
        </ul>
      </div>
    </div>
  );
};
