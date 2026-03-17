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

      // Force text direction to left-to-right with comprehensive settings
      const setDirectionProperties = () => {
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
      };

      // Set initial content
      if (value) {
        editorRef.current.innerHTML = value;
      }

      // Apply direction settings
      setDirectionProperties();

      // Set up MutationObserver to watch for DOM changes
      const observer = new MutationObserver(() => {
        setDirectionProperties();
      });

      observer.observe(editorRef.current, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["dir", "style"],
      });

      // Add paste handler to clean up pasted content
      const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
        setTimeout(() => {
          setDirectionProperties();
          handleContentChange();
        }, 0);
      };

      // Add focus handler to manage placeholder and cursor direction
      const handleFocus = () => {
        if (
          editorRef.current.innerHTML === "" ||
          editorRef.current.innerHTML === "<br>"
        ) {
          editorRef.current.innerHTML = "";
        }

        // Ensure cursor direction is correct on focus
        setTimeout(() => {
          setDirectionProperties();

          // Force cursor to start position
          const selection = window.getSelection();
          const range = document.createRange();

          if (editorRef.current.childNodes.length > 0) {
            range.setStart(editorRef.current.childNodes[0], 0);
          } else {
            range.setStart(editorRef.current, 0);
          }
          range.collapse(true);
          selection.removeAllRanges();
          selection.addRange(range);
        }, 0);
      };

      // Add blur handler to manage empty state
      const handleBlur = () => {
        if (
          editorRef.current.innerHTML === "" ||
          editorRef.current.innerHTML === "<br>"
        ) {
          editorRef.current.innerHTML = "";
        }
        handleContentChange();
      };

      // Add input handler to maintain direction on content changes
      const handleInput = () => {
        setTimeout(() => {
          setDirectionProperties();
        }, 0);
        handleContentChange();
      };

      // Add selection change handler to fix cursor direction
      const handleSelectionChange = () => {
        setTimeout(() => {
          if (
            editorRef.current &&
            document.activeElement === editorRef.current
          ) {
            setDirectionProperties();
          }
        }, 0);
      };

      editorRef.current.addEventListener("paste", handlePaste);
      editorRef.current.addEventListener("focus", handleFocus);
      editorRef.current.addEventListener("blur", handleBlur);
      editorRef.current.addEventListener("input", handleInput);
      document.addEventListener("selectionchange", handleSelectionChange);

      return () => {
        observer.disconnect();
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

      // Update content and maintain direction after command
      setTimeout(() => {
        // Ensure direction is maintained after formatting
        if (editorRef.current) {
          editorRef.current.dir = "ltr";
          editorRef.current.style.direction = "ltr";
          editorRef.current.style.textAlign = "left";
          editorRef.current.style.unicodeBidi = "embed";

          // Apply direction to all child elements
          const allElements = editorRef.current.querySelectorAll("*");
          allElements.forEach((el) => {
            el.style.direction = "ltr";
            el.setAttribute("dir", "ltr");
          });
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

                // Ensure direction is maintained on key input
                setTimeout(() => {
                  if (editorRef.current) {
                    editorRef.current.dir = "ltr";
                    editorRef.current.style.direction = "ltr";
                    editorRef.current.style.textAlign = "left";
                  }
                }, 0);
              }}
              onKeyUp={(e) => {
                // Additional cursor direction fix on key up
                setTimeout(() => {
                  if (editorRef.current) {
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      // Ensure the cursor is positioned correctly
                      if (range.collapsed) {
                        editorRef.current.dir = "ltr";
                        editorRef.current.style.direction = "ltr";
                      }
                    }
                  }
                }, 0);
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
