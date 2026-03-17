import { useState, useRef, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

// Simple Textarea Editor - Just fixes cursor direction without rich text features
export const SimpleTextareaEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  disabled = false,
  className = "",
  minHeight = "200px",
  maxHeight = "400px",
  showWordCount = true,
  label = null,
  error = null,
  required = false,
  rows = 6,
}) => {
  const [content, setContent] = useState(value);
  const [wordCount, setWordCount] = useState(0);
  const textareaRef = useRef(null);

  // Initialize content
  useEffect(() => {
    if (textareaRef.current && value !== content) {
      textareaRef.current.value = value;
      setContent(value);
    }
  }, [value, content]);

  // Calculate word count
  useEffect(() => {
    const text = content.trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, [content]);

  // Force LTR behavior aggressively
  const forceLTRBehavior = useCallback(() => {
    if (!textareaRef.current) return;

    const element = textareaRef.current;

    // Set all direction properties
    element.dir = "ltr";
    element.lang = "en";
    element.style.direction = "ltr";
    element.style.textAlign = "left";
    element.style.unicodeBidi = "normal";
    element.style.writingMode = "horizontal-tb";
    element.setAttribute("dir", "ltr");
    element.setAttribute("lang", "en");
  }, []);

  const handleContentChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      setContent(newContent);
      onChange?.(newContent);
    },
    [onChange],
  );

  // Setup textarea with LTR enforcement
  useEffect(() => {
    if (textareaRef.current) {
      // Set initial content
      if (value) {
        textareaRef.current.value = value;
      }

      // Force LTR immediately and continuously
      forceLTRBehavior();

      const currentTextarea = textareaRef.current;

      // Set up event listeners
      const handleInput = (e) => {
        forceLTRBehavior();
        handleContentChange(e);
      };

      const handleKeyDown = (e) => {
        // Prevent RTL shortcuts
        if (e.ctrlKey && e.shiftKey) {
          e.preventDefault();
        }

        // Force LTR direction
        setTimeout(() => {
          forceLTRBehavior();
        }, 0);
      };

      const handleKeyUp = () => {
        setTimeout(() => {
          forceLTRBehavior();
        }, 0);
      };

      const handleFocus = () => {
        forceLTRBehavior();
      };

      const handlePaste = () => {
        setTimeout(() => {
          forceLTRBehavior();
        }, 0);
      };

      currentTextarea.addEventListener("input", handleInput);
      currentTextarea.addEventListener("keydown", handleKeyDown);
      currentTextarea.addEventListener("keyup", handleKeyUp);
      currentTextarea.addEventListener("focus", handleFocus);
      currentTextarea.addEventListener("paste", handlePaste);

      // Continuous LTR enforcement
      const intervalId = setInterval(() => {
        if (
          textareaRef.current &&
          document.activeElement === textareaRef.current
        ) {
          forceLTRBehavior();
        }
      }, 100);

      return () => {
        clearInterval(intervalId);
        if (currentTextarea) {
          currentTextarea.removeEventListener("input", handleInput);
          currentTextarea.removeEventListener("keydown", handleKeyDown);
          currentTextarea.removeEventListener("keyup", handleKeyUp);
          currentTextarea.removeEventListener("focus", handleFocus);
          currentTextarea.removeEventListener("paste", handlePaste);
        }
      };
    }
  }, [disabled, value, forceLTRBehavior, handleContentChange]);

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          className={cn(required && "after:content-['*'] after:text-red-500")}>
          {label}
        </Label>
      )}

      <div className="relative">
        <textarea
          ref={textareaRef}
          placeholder={placeholder}
          disabled={disabled}
          rows={rows}
          className={cn(
            "w-full px-4 py-3 border rounded-lg resize-none",
            "focus:ring-2 focus:ring-primary focus:border-primary",
            "outline-none transition-colors",
            error && "border-red-500 focus:ring-red-500 focus:border-red-500",
            disabled && "opacity-50 cursor-not-allowed bg-muted",
            "simple-textarea-editor",
          )}
          style={{
            minHeight: minHeight,
            maxHeight: maxHeight,
            direction: "ltr",
            textAlign: "left",
            unicodeBidi: "normal",
            writingMode: "horizontal-tb",
          }}
          dir="ltr"
          lang="en"
        />
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          {showWordCount && (
            <span>
              {wordCount} word{wordCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          LTR Fixed
        </Badge>
      </div>

      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
    </div>
  );
};
