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

// Forced LTR editor with aggressive cursor control
export const ForcedLTREditor = ({
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
  const isComposingRef = useRef(false);

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

  // Aggressive LTR enforcement
  const forceLTR = useCallback(() => {
    if (!editorRef.current) return;

    // Set all possible direction properties
    const element = editorRef.current;
    element.dir = "ltr";
    element.style.direction = "ltr";
    element.style.textAlign = "left";
    element.style.unicodeBidi = "bidi-override";
    element.style.writingMode = "horizontal-tb";

    // Force all child elements
    const allElements = element.querySelectorAll("*");
    allElements.forEach((el) => {
      el.dir = "ltr";
      el.style.direction = "ltr";
      el.style.textAlign = "left";
      el.style.unicodeBidi = "bidi-override";
    });

    // Force cursor position to be correct
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      // Ensure the range is in LTR context
      if (range.collapsed) {
        const textNode = document.createTextNode("");
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);
        textNode.remove();
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }, []);

  // Setup editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = !disabled;

      // Set initial content
      if (value) {
        editorRef.current.innerHTML = value;
      }

      // Force LTR immediately
      forceLTR();

      // Set up event listeners
      const handleInput = (e) => {
        if (isComposingRef.current) return;

        // Force LTR after any input
        setTimeout(() => {
          forceLTR();
          handleContentChange();
        }, 0);
      };

      const handleCompositionStart = () => {
        isComposingRef.current = true;
      };

      const handleCompositionEnd = () => {
        isComposingRef.current = false;
        setTimeout(() => {
          forceLTR();
          handleContentChange();
        }, 0);
      };

      const handleFocus = () => {
        forceLTR();
      };

      const handleKeyDown = (e) => {
        // Prevent any RTL shortcuts
        if (e.ctrlKey && (e.key === "Shift" || e.shiftKey)) {
          e.preventDefault();
        }

        // Force LTR after key events
        setTimeout(() => {
          forceLTR();
        }, 0);
      };

      const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");

        // Insert as plain text only
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
        }

        setTimeout(() => {
          forceLTR();
          handleContentChange();
        }, 0);
      };

      editorRef.current.addEventListener("input", handleInput);
      editorRef.current.addEventListener(
        "compositionstart",
        handleCompositionStart,
      );
      editorRef.current.addEventListener(
        "compositionend",
        handleCompositionEnd,
      );
      editorRef.current.addEventListener("focus", handleFocus);
      editorRef.current.addEventListener("keydown", handleKeyDown);
      editorRef.current.addEventListener("paste", handlePaste);

      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener("input", handleInput);
          editorRef.current.removeEventListener(
            "compositionstart",
            handleCompositionStart,
          );
          editorRef.current.removeEventListener(
            "compositionend",
            handleCompositionEnd,
          );
          editorRef.current.removeEventListener("focus", handleFocus);
          editorRef.current.removeEventListener("keydown", handleKeyDown);
          editorRef.current.removeEventListener("paste", handlePaste);
        }
      };
    }
  }, [disabled, value, forceLTR]);

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

      // Force LTR after command
      setTimeout(() => {
        forceLTR();
        handleContentChange();
      }, 0);
    },
    [disabled, forceLTR, handleContentChange],
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
          "border rounded-lg overflow-hidden forced-ltr-editor",
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
            Forced LTR
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
