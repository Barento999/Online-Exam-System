import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus, X, FileText, Award, BookOpen, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router";

export const FloatingActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const actions = [
    {
      label: "Take Exam",
      icon: FileText,
      color: "bg-blue-500 hover:bg-blue-600",
      onClick: () => {
        navigate("/exams");
        setIsOpen(false);
      },
    },
    {
      label: "View Results",
      icon: Award,
      color: "bg-green-500 hover:bg-green-600",
      onClick: () => {
        navigate("/results");
        setIsOpen(false);
      },
    },
    {
      label: "Study Materials",
      icon: BookOpen,
      color: "bg-purple-500 hover:bg-purple-600",
      onClick: () => {
        navigate("/materials");
        setIsOpen(false);
      },
    },
    {
      label: "Analytics",
      icon: BarChart3,
      color: "bg-orange-500 hover:bg-orange-600",
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
                "flex items-center gap-3 transition-all duration-300",
                isOpen ? "translate-x-0" : "translate-x-16",
              )}
              style={{ transitionDelay: `${index * 50}ms` }}>
              <span className="bg-black/80 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
                {action.label}
              </span>
              <Button
                size="sm"
                className={cn(
                  "h-12 w-12 rounded-full shadow-lg transition-all duration-200",
                  "hover:scale-110 hover:shadow-xl",
                  action.color,
                )}
                onClick={action.onClick}>
                <Icon className="h-5 w-5" />
              </Button>
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
          "bg-primary hover:bg-primary/90",
          isOpen && "rotate-45",
        )}
        onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="h-6 w-6" /> : <Plus className="h-6 w-6" />}
      </Button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};
