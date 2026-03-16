import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Plus,
  X,
  FileText,
  Award,
  BookOpen,
  BarChart3,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useNavigate } from "react-router";

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "Take Exam",
      icon: FileText,
      color: "bg-blue-600 hover:bg-blue-700",
      onClick: () => {
        navigate("/exams");
        setIsOpen(false);
      },
    },
    {
      label: "View Results",
      icon: Award,
      color: "bg-green-600 hover:bg-green-700",
      onClick: () => {
        navigate("/results");
        setIsOpen(false);
      },
    },
    {
      label: "Study Materials",
      icon: BookOpen,
      color: "bg-purple-600 hover:bg-purple-700",
      onClick: () => {
        navigate("/materials");
        setIsOpen(false);
      },
    },
    {
      label: "Schedule",
      icon: Calendar,
      color: "bg-pink-600 hover:bg-pink-700",
      onClick: () => {
        navigate("/schedule");
        setIsOpen(false);
      },
    },
    {
      label: "Messages",
      icon: MessageSquare,
      color: "bg-cyan-600 hover:bg-cyan-700",
      onClick: () => {
        navigate("/messages");
        setIsOpen(false);
      },
      badge: 3,
    },
    {
      label: "Analytics",
      icon: BarChart3,
      color: "bg-orange-600 hover:bg-orange-700",
      onClick: () => {
        navigate("/analytics");
        setIsOpen(false);
      },
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action buttons */}
      <div
        className={cn(
          "flex flex-col-reverse gap-3 mb-3 transition-all duration-300",
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none",
        )}>
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <div
              key={action.label}
              className={cn(
                "flex items-center gap-3 transition-all duration-300 animate-in slide-in-from-right-4 fade-in",
              )}
              style={{
                transitionDelay: `${index * 50}ms`,
                animationDelay: `${index * 50}ms`,
                animationDuration: "200ms",
                animationFillMode: "both",
              }}>
              {/* Label tooltip */}
              <span className="bg-background border shadow-lg px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap">
                {action.label}
              </span>

              {/* Action button */}
              <div className="relative">
                <Button
                  size="icon"
                  className={cn(
                    "h-12 w-12 rounded-full shadow-lg transition-all duration-200",
                    "hover:scale-110 hover:shadow-xl",
                    action.color,
                  )}
                  onClick={action.onClick}>
                  <Icon className="h-5 w-5 text-white" />
                </Button>

                {/* Badge for notifications */}
                {action.badge && (
                  <div className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                    <span className="text-[10px] font-bold text-white">
                      {action.badge}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main FAB */}
      <Button
        size="lg"
        className={cn(
          "h-14 w-14 rounded-full shadow-lg transition-all duration-300",
          "hover:scale-110 hover:shadow-xl",
          isOpen
            ? "bg-red-600 hover:bg-red-700 rotate-45"
            : "bg-primary hover:bg-primary/90",
        )}
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
