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

export const SimpleRichTextEditor = ({
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
  toolbar = "exam",
}) => {
  const [content, setContent] = useState(value);
  const [wordCount, setWordCount] = useState(0);
  const editorRef = useRef(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== content) {
      editorRef.current.innerHTML = value;
      setContent(value);
    }
  }, [value]);

  // Setup editor on mount - SIMPLIFIED VERSION
  useEffect(() => {
    if (editorRef.current) {
      // Enable rich text editing
      editorRef.current.contentEditable = !disabled;

      // Simple direction setting function
      const setDirection = () => {
        if (!editorRef.current) return;
        editorRef.current.dir = "ltr";
        editorRef.current.style.direction = "ltr";
        editorRef.current.style.textAlign = "left";
      };

      // Set initial content and direction
      if (value) {
        editorRef.current.innerHTML = value;
      }
      setDirection();

      // Simple focus handler
      const handleFocus = () => {
        setDirection();
      };

      // Simple input handler
      const handleInput = () => {
        handleContentChange();
      };

      // Simple paste handler
      const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
        setTimeout(() => {
          setDirection();
          handleContentChange();
        }, 10);
      };

      editorRef.current.addEventListener("focus", handleFocus);
      editorRef.current.addEventListener("input", handleInput);
      editorRef.current.addEventListener("paste", handlePaste);

      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener("focus", handleFocus);
          editorRef.current.removeEventListener("input", handleInput);
          editorRef.current.removeEventListener("paste", handlePaste);
        }
      };
    }
  }, [disabled, value]);

  // Calculate word count
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, [content]);

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

  const executeCommand = useCallback(
    (command) => {
      if (disabled || !editorRef.current) return;

      editorRef.current.focus();

      try {
        document.execCommand(command, false, null);
      } catch (error) {
        console.warn("Command execution failed:", command, error);
      }

      // Simple direction maintenance
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.dir = "ltr";
          editorRef.current.style.direction = "ltr";
        }
        handleContentChange();
      }, 10);
    },
    [disabled, handleContentChange],
  );

  const getToolbarButtons = () => {
    return [
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
  };

  const renderToolbar = () => {
    const buttons = getToolbarButtons();

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
          "border rounded-lg overflow-hidden simple-rich-text-editor",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
        )}>
        {renderToolbar()}

        <div
          className="relative"
          style={{
            minHeight: minHeight,
            maxHeight: maxHeight,
          }}>
          <div
            ref={editorRef}
            contentEditable={!disabled}
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
              unicodeBidi: "embed",
            }}
            onKeyDown={(e) => {
              // Handle keyboard shortcuts
              if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                  case "b":
                    e.preventDefault();
                    executeCommand("bold");
                    break;
                  case "i":
                    e.preventDefault();
                    executeCommand("italic");
                    break;
                  case "u":
                    e.preventDefault();
                    executeCommand("underline");
                    break;
                }
              }
            }}
            data-placeholder={placeholder}
            suppressContentEditableWarning={true}
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
