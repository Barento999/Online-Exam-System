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
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const RichTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  disabled = false,
  className = "",
  minHeight = "200px",
  maxHeight = "400px",
  showWordCount = true,
  showCharCount = false,
  maxLength = null,
  label = null,
  error = null,
  required = false,
  toolbar = "full", // "full", "basic", "minimal"
  allowFullscreen = true,
}) => {
  const [content, setContent] = useState(value);
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== content) {
      editorRef.current.innerHTML = value;
      setContent(value);
    }
  }, [value]);

  // Setup editor on mount
  useEffect(() => {
    if (editorRef.current) {
      // Enable rich text editing
      editorRef.current.contentEditable = !disabled;

      // Track if we're currently setting direction properties to prevent infinite loops
      let isSettingDirection = false;

      // Force text direction to left-to-right with comprehensive settings
      const setDirectionProperties = () => {
        if (isSettingDirection || !editorRef.current) return;

        isSettingDirection = true;

        try {
          editorRef.current.dir = "ltr";
          editorRef.current.style.direction = "ltr";
          editorRef.current.style.textAlign = "left";
          editorRef.current.style.unicodeBidi = "embed";
          editorRef.current.style.writingMode = "horizontal-tb";
          editorRef.current.setAttribute("dir", "ltr");

          // Force all child elements to maintain LTR direction
          const allElements = editorRef.current.querySelectorAll("*");
          allElements.forEach((el) => {
            el.style.direction = "ltr";
            el.style.textAlign = "left";
            el.setAttribute("dir", "ltr");
          });
        } finally {
          isSettingDirection = false;
        }
      };

      // Set initial content
      if (value) {
        editorRef.current.innerHTML = value;
      }

      // Apply direction settings
      setDirectionProperties();

      // Throttled version of setDirectionProperties to prevent excessive calls
      let directionTimeout = null;
      const throttledSetDirection = () => {
        if (directionTimeout) return;
        directionTimeout = setTimeout(() => {
          setDirectionProperties();
          directionTimeout = null;
        }, 100); // Throttle to max once per 100ms
      };

      // Set up MutationObserver to watch for DOM changes (but throttled)
      const observer = new MutationObserver((mutations) => {
        // Only react to mutations that aren't caused by our direction setting
        if (isSettingDirection) return;

        // Check if any mutation actually needs direction fixing
        const needsDirectionFix = mutations.some((mutation) => {
          if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            return true; // New nodes might need direction
          }
          if (
            mutation.type === "attributes" &&
            mutation.attributeName === "dir" &&
            mutation.target.getAttribute("dir") !== "ltr"
          ) {
            return true; // Direction was changed to something other than ltr
          }
          return false;
        });

        if (needsDirectionFix) {
          throttledSetDirection();
        }
      });

      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["dir"],
      });

      // Add paste handler to clean up pasted content
      const handlePaste = (e) => {
        if (!editorRef.current) return;

        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
        setTimeout(() => {
          throttledSetDirection();
          handleContentChange();
        }, 0);
      };

      // Add focus handler to manage placeholder and cursor direction
      const handleFocus = () => {
        if (!editorRef.current) return;

        if (
          editorRef.current.innerHTML === "" ||
          editorRef.current.innerHTML === "<br>"
        ) {
          editorRef.current.innerHTML = "";
        }

        // Simple direction setting on focus (no cursor manipulation)
        setTimeout(() => {
          setDirectionProperties();
        }, 0);
      };

      // Add blur handler to manage empty state
      const handleBlur = () => {
        if (!editorRef.current) return;

        if (
          editorRef.current.innerHTML === "" ||
          editorRef.current.innerHTML === "<br>"
        ) {
          editorRef.current.innerHTML = "";
        }
        handleContentChange();
      };

      // Add input handler to maintain direction on content changes (throttled)
      const handleInput = () => {
        throttledSetDirection();
        handleContentChange();
      };

      // Simplified selection change handler (throttled)
      let selectionTimeout = null;
      const handleSelectionChange = () => {
        if (selectionTimeout) return;
        if (editorRef.current && document.activeElement === editorRef.current) {
          selectionTimeout = setTimeout(() => {
            if (editorRef.current) {
              setDirectionProperties();
            }
            selectionTimeout = null;
          }, 200); // Less frequent than other handlers
        }
      };

      editorRef.current.addEventListener("paste", handlePaste);
      editorRef.current.addEventListener("focus", handleFocus);
      editorRef.current.addEventListener("blur", handleBlur);
      editorRef.current.addEventListener("input", handleInput);
      document.addEventListener("selectionchange", handleSelectionChange);

      return () => {
        observer.disconnect();
        if (directionTimeout) clearTimeout(directionTimeout);
        if (selectionTimeout) clearTimeout(selectionTimeout);
        document.removeEventListener("selectionchange", handleSelectionChange);
        if (editorRef.current) {
          editorRef.current.removeEventListener("paste", handlePaste);
          editorRef.current.removeEventListener("focus", handleFocus);
          editorRef.current.removeEventListener("blur", handleBlur);
          editorRef.current.removeEventListener("input", handleInput);
        }
      };
    }
  }, [disabled, value]);

  // Calculate word and character counts
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
    setCharCount(text.length);
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
    (command, value = null) => {
      if (disabled || !editorRef.current) return;

      // Focus the editor first
      editorRef.current.focus();

      try {
        switch (command) {
          case "bold":
          case "italic":
          case "underline":
          case "justifyLeft":
          case "justifyCenter":
          case "justifyRight":
          case "insertUnorderedList":
          case "insertOrderedList":
            document.execCommand(command, false, null);
            break;
          case "formatBlock":
            document.execCommand("formatBlock", false, value);
            break;
          default:
            document.execCommand(command, false, value);
        }
      } catch (error) {
        console.warn("Command execution failed:", command, error);
      }

      // Simple direction maintenance after command (no excessive DOM manipulation)
      setTimeout(() => {
        if (editorRef.current) {
          editorRef.current.dir = "ltr";
          editorRef.current.style.direction = "ltr";
        }
        handleContentChange();
      }, 0);
    },
    [disabled, handleContentChange],
  );

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  const getToolbarButtons = () => {
    const basicButtons = [
      { command: "bold", icon: Bold, title: "Bold" },
      { command: "italic", icon: Italic, title: "Italic" },
      { command: "underline", icon: Underline, title: "Underline" },
    ];

    const examButtons = [
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

    switch (toolbar) {
      case "basic":
        return basicButtons;
      case "exam":
        return examButtons;
      case "minimal":
        return basicButtons.slice(0, 2);
      default:
        return examButtons; // Default to exam toolbar
    }
  };

  const renderToolbar = () => {
    const buttons = getToolbarButtons();

    return (
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        {/* Main Buttons */}
        {buttons.map((button, index) => {
          if (button.type === "separator") {
            return <div key={index} className="w-px h-6 bg-border mx-1" />;
          }

          if (button.type === "custom") {
            return (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={button.action}
                disabled={disabled}
                title={button.title}>
                <button.icon className="h-4 w-4" />
              </Button>
            );
          }

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => executeCommand(button.command, button.value)}
              disabled={disabled}
              title={button.title}>
              <button.icon className="h-4 w-4" />
            </Button>
          );
        })}

        {/* Right side controls */}
        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreview(!isPreview)}
            disabled={disabled}
            title={isPreview ? "Edit" : "Preview"}>
            {isPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </Button>

          {allowFullscreen && (
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}>
              {isFullscreen ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </div>
    );
  };

  const editorContent = (
    <div
      className={cn(
        "space-y-2",
        isFullscreen && "fixed inset-0 z-50 bg-background p-4",
        className,
      )}
      ref={containerRef}>
      {label && (
        <Label
          className={cn(required && "after:content-['*'] after:text-red-500")}>
          {label}
        </Label>
      )}

      <div
        className={cn(
          "border rounded-lg overflow-hidden rich-text-editor",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          isFullscreen && "h-full flex flex-col",
        )}>
        {renderToolbar()}

        <div
          className={cn("relative", isFullscreen ? "flex-1 flex flex-col" : "")}
          style={{
            minHeight: isFullscreen ? "auto" : minHeight,
            maxHeight: isFullscreen ? "auto" : maxHeight,
          }}>
          {isPreview ? (
            <div
              className={cn(
                "p-4 prose prose-sm max-w-none overflow-auto",
                isFullscreen && "flex-1",
              )}
              dangerouslySetInnerHTML={{ __html: content }}
            />
          ) : (
            <div
              ref={editorRef}
              contentEditable={!disabled}
              className={cn(
                "p-4 outline-none overflow-auto min-h-[inherit]",
                "focus:ring-0 focus:outline-none",
                "prose prose-sm max-w-none",
                isFullscreen && "flex-1",
                disabled && "cursor-not-allowed",
              )}
              style={{
                minHeight: isFullscreen ? "auto" : minHeight,
                maxHeight: isFullscreen ? "auto" : maxHeight,
                direction: "ltr", // Force left-to-right
                textAlign: "left", // Force left alignment
                unicodeBidi: "embed", // Ensure proper text direction
              }}
              onInput={handleContentChange}
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
              onKeyUp={(e) => {
                // Minimal cursor direction fix on key up (only for special keys)
                if (
                  e.key === "Enter" ||
                  e.key === "Backspace" ||
                  e.key === "Delete"
                ) {
                  setTimeout(() => {
                    if (editorRef.current) {
                      editorRef.current.dir = "ltr";
                      editorRef.current.style.direction = "ltr";
                    }
                  }, 0);
                }
              }}
              data-placeholder={placeholder}
              suppressContentEditableWarning={true}
            />
          )}

          {/* Placeholder is now handled by CSS */}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-t text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            {showWordCount && (
              <span>
                {wordCount} word{wordCount !== 1 ? "s" : ""}
              </span>
            )}
            {showCharCount && (
              <span>
                {charCount} character{charCount !== 1 ? "s" : ""}
              </span>
            )}
            {maxLength && (
              <span className={charCount > maxLength ? "text-red-500" : ""}>
                {charCount}/{maxLength}
              </span>
            )}
          </div>

          {isFullscreen && (
            <Badge variant="outline" className="text-xs">
              Fullscreen Mode
            </Badge>
          )}
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

  return editorContent;
};

// Hook for managing rich text editor state
export const useRichTextEditor = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const validate = useCallback((content, rules = {}) => {
    const text = content.replace(/<[^>]*>/g, "").trim();

    if (rules.required && !text) {
      setError("This field is required");
      return false;
    }

    if (rules.minLength && text.length < rules.minLength) {
      setError(`Minimum ${rules.minLength} characters required`);
      return false;
    }

    if (rules.maxLength && text.length > rules.maxLength) {
      setError(`Maximum ${rules.maxLength} characters allowed`);
      return false;
    }

    setError(null);
    return true;
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
    setError(null);
  }, [initialValue]);

  const getPlainText = useCallback(() => {
    return value.replace(/<[^>]*>/g, "").trim();
  }, [value]);

  const getWordCount = useCallback(() => {
    const text = getPlainText();
    return text ? text.split(/\s+/).length : 0;
  }, [getPlainText]);

  return {
    value,
    setValue,
    error,
    setError,
    validate,
    reset,
    getPlainText,
    getWordCount,
  };
};
