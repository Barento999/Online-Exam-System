import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// LTR Text Editor - Forces left-to-right text input behavior
export const LTRTextEditor = ({
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
}) => {
  const [content, setContent] = useState(value);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef(null);

  // Initialize content
  useEffect(() => {
    if (editorRef.current && value !== content) {
      editorRef.current.innerHTML = value;
      setContent(value);
    }
  }, [value]);

  // Calculate word count
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, [content]);

  // Force LTR behavior aggressively
  const forceLTRBehavior = useCallback(() => {
    if (!editorRef.current) return;

    const element = editorRef.current;

    // Set all direction properties
    element.dir = "ltr";
    element.lang = "en";
    element.style.direction = "ltr";
    element.style.textAlign = "left";
    element.style.unicodeBidi = "bidi-override";
    element.style.writingMode = "horizontal-tb";
    element.setAttribute("dir", "ltr");
    element.setAttribute("lang", "en");

    // Force all child elements
    const allElements = element.querySelectorAll("*");
    allElements.forEach((el) => {
      el.dir = "ltr";
      el.lang = "en";
      el.style.direction = "ltr";
      el.style.textAlign = "left";
      el.style.unicodeBidi = "bidi-override";
      el.setAttribute("dir", "ltr");
      el.setAttribute("lang", "en");
    });
  }, []);

  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;

    let newContent = editorRef.current.innerHTML;

    // Clean up empty content
    if (
      newContent === "<br>" ||
      newContent === "<div><br></div>" ||
      newContent.trim() === ""
    ) {
      newContent = "";
      editorRef.current.innerHTML = "";
    }

    // Only update if content actually changed
    if (newContent !== content) {
      setContent(newContent);
      onChange?.(newContent);
    }
  }, [onChange, content]);

  // Setup editor with aggressive LTR enforcement
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = !disabled;

      // Set initial content
      if (value) {
        editorRef.current.innerHTML = value;
      }

      // Force LTR immediately and continuously
      forceLTRBehavior();

      // Add all event listeners
      const currentEditor = editorRef.current;

      // Set up aggressive event listeners
      const handleInput = () => {
        // Immediately force LTR after any input
        forceLTRBehavior();
        handleContentChange();
      };

      const handleKeyDown = (e) => {
        // Prevent RTL shortcuts and force LTR
        if (e.ctrlKey && e.shiftKey) {
          e.preventDefault();
        }

        // Force LTR direction
        setTimeout(() => {
          forceLTRBehavior();
        }, 0);
      };

      const handleKeyUp = () => {
        // Force LTR after every key release
        setTimeout(() => {
          forceLTRBehavior();
        }, 0);
      };

      const handleFocus = () => {
        forceLTRBehavior();
      };

      const handlePaste = (e) => {
        e.preventDefault();

        // Get plain text and insert it
        const text = e.clipboardData.getData("text/plain");
        const selection = window.getSelection();

        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();

          // Create text node with explicit LTR direction
          const textNode = document.createTextNode(text);
          range.insertNode(textNode);

          // Move cursor to end of inserted text
          range.setStartAfter(textNode);
          range.setEndAfter(textNode);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        setTimeout(() => {
          forceLTRBehavior();
          handleContentChange();
        }, 0);
      };

      currentEditor.addEventListener("input", handleInput);
      currentEditor.addEventListener("keydown", handleKeyDown);
      currentEditor.addEventListener("keyup", handleKeyUp);
      currentEditor.addEventListener("focus", handleFocus);
      currentEditor.addEventListener("paste", handlePaste);

      // Continuous LTR enforcement
      const intervalId = setInterval(() => {
        if (editorRef.current && document.activeElement === editorRef.current) {
          forceLTRBehavior();
        }
      }, 100);

      return () => {
        clearInterval(intervalId);
        if (currentEditor) {
          currentEditor.removeEventListener("input", handleInput);
          currentEditor.removeEventListener("keydown", handleKeyDown);
          currentEditor.removeEventListener("keyup", handleKeyUp);
          currentEditor.removeEventListener("focus", handleFocus);
          currentEditor.removeEventListener("paste", handlePaste);
        }
      };
    }
  }, [disabled, value, forceLTRBehavior, handleContentChange]);

  const executeCommand = useCallback(
    (command) => {
      if (disabled || !editorRef.current) return;

      editorRef.current.focus();

      try {
        document.execCommand(command, false, null);
      } catch (error) {
        console.warn("Command execution failed:", command, error);
      }

      // Force LTR after command
      setTimeout(() => {
        forceLTRBehavior();
        handleContentChange();
      }, 0);
    },
    [disabled, forceLTRBehavior, handleContentChange],
  );

  const renderToolbar = () => {
    const buttons = [
      { command: "bold", icon: Bold, title: "Bold" },
      { command: "italic", icon: Italic, title: "Italic" },
      { command: "underline", icon: Underline, title: "Underline" },
      { type: "separator" },
      { command: "insertUnorderedList", icon: List, title: "Bullet List" },
      {
        command: "insertOrderedList",
        icon: ListOrdered,
        title: "Numbered List",
      },
      { type: "separator" },
      { command: "justifyLeft", icon: AlignLeft, title: "Align Left" },
      { command: "justifyCenter", icon: AlignCenter, title: "Align Center" },
      { command: "justifyRight", icon: AlignRight, title: "Align Right" },
    ];

    return (
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        {buttons.map((button, index) => {
          if (button.type === "separator") {
            return <div key={index} className="w-px h-6 bg-border mx-1" />;
          }

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => executeCommand(button.command)}
              disabled={disabled}
              title={button.title}>
              <button.icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
    );
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label
          className={cn(required && "after:content-['*'] after:text-red-500")}>
          {label}
        </Label>
      )}

      <div
        className={cn(
          "border rounded-lg overflow-hidden ltr-text-editor",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
        )}>
        {renderToolbar()}

        <div className="relative">
          <div
            ref={editorRef}
            className={cn(
              "p-4 outline-none overflow-auto min-h-[inherit]",
              "focus:ring-0 focus:outline-none",
              "prose prose-sm max-w-none",
              disabled && "cursor-not-allowed",
            )}
            style={{
              minHeight: minHeight,
              maxHeight: maxHeight,
              direction: "ltr",
              textAlign: "left",
              unicodeBidi: "bidi-override",
              writingMode: "horizontal-tb",
            }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
            dir="ltr"
            lang="en"
          />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {showWordCount && (
              <span>
                {wordCount} word{wordCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <Badge variant="outline" className="text-xs">
            LTR Enforced
          </Badge>
        </div>
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
