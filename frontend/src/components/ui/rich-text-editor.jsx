import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link,
  Image,
  Code,
  Undo,
  Redo,
  Type,
  Palette,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

const FONT_SIZES = [
  { value: "12px", label: "12px" },
  { value: "14px", label: "14px" },
  { value: "16px", label: "16px" },
  { value: "18px", label: "18px" },
  { value: "20px", label: "20px" },
  { value: "24px", label: "24px" },
  { value: "32px", label: "32px" },
];

const FONT_FAMILIES = [
  { value: "Arial, sans-serif", label: "Arial" },
  { value: "Georgia, serif", label: "Georgia" },
  { value: "Times New Roman, serif", label: "Times New Roman" },
  { value: "Helvetica, sans-serif", label: "Helvetica" },
  { value: "Courier New, monospace", label: "Courier New" },
];

const COLORS = [
  "#000000",
  "#333333",
  "#666666",
  "#999999",
  "#CCCCCC",
  "#FFFFFF",
  "#FF0000",
  "#FF6600",
  "#FFCC00",
  "#00FF00",
  "#0066FF",
  "#6600FF",
  "#FF0066",
  "#FF3366",
  "#FF6699",
  "#66FF99",
  "#6699FF",
  "#9966FF",
];

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

      // Set initial content
      if (value) {
        editorRef.current.innerHTML = value;
      }

      // Add paste handler to clean up pasted content
      const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        document.execCommand("insertText", false, text);
        handleContentChange();
      };

      // Add focus handler to manage placeholder
      const handleFocus = () => {
        if (
          editorRef.current.innerHTML === "" ||
          editorRef.current.innerHTML === "<br>"
        ) {
          editorRef.current.innerHTML = "";
        }
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

      editorRef.current.addEventListener("paste", handlePaste);
      editorRef.current.addEventListener("focus", handleFocus);
      editorRef.current.addEventListener("blur", handleBlur);

      return () => {
        if (editorRef.current) {
          editorRef.current.removeEventListener("paste", handlePaste);
          editorRef.current.removeEventListener("focus", handleFocus);
          editorRef.current.removeEventListener("blur", handleBlur);
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
        // Use modern approach where possible, fallback to execCommand for compatibility
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        switch (command) {
          case "bold":
            document.execCommand("bold", false, null);
            break;
          case "italic":
            document.execCommand("italic", false, null);
            break;
          case "underline":
            document.execCommand("underline", false, null);
            break;
          case "strikeThrough":
            document.execCommand("strikeThrough", false, null);
            break;
          case "justifyLeft":
            document.execCommand("justifyLeft", false, null);
            break;
          case "justifyCenter":
            document.execCommand("justifyCenter", false, null);
            break;
          case "justifyRight":
            document.execCommand("justifyRight", false, null);
            break;
          case "justifyFull":
            document.execCommand("justifyFull", false, null);
            break;
          case "insertUnorderedList":
            document.execCommand("insertUnorderedList", false, null);
            break;
          case "insertOrderedList":
            document.execCommand("insertOrderedList", false, null);
            break;
          case "formatBlock":
            document.execCommand("formatBlock", false, value);
            break;
          case "createLink":
            document.execCommand("createLink", false, value);
            break;
          case "insertImage":
            document.execCommand("insertImage", false, value);
            break;
          case "undo":
            document.execCommand("undo", false, null);
            break;
          case "redo":
            document.execCommand("redo", false, null);
            break;
          case "fontName":
            document.execCommand("fontName", false, value);
            break;
          case "fontSize":
            // Convert px to size number for execCommand
            const sizeMap = {
              "12px": "1",
              "14px": "2",
              "16px": "3",
              "18px": "4",
              "20px": "5",
              "24px": "6",
              "32px": "7",
            };
            document.execCommand("fontSize", false, sizeMap[value] || "3");
            break;
          case "foreColor":
            document.execCommand("foreColor", false, value);
            break;
          default:
            document.execCommand(command, false, value);
        }
      } catch (error) {
        console.warn("Command execution failed:", command, error);
      }

      // Update content after command
      setTimeout(() => {
        handleContentChange();
      }, 0);
    },
    [disabled, handleContentChange],
  );

  const insertLink = useCallback(() => {
    const url = prompt("Enter URL:");
    if (url) {
      executeCommand("createLink", url);
    }
  }, [executeCommand]);

  const insertImage = useCallback(() => {
    const url = prompt("Enter image URL:");
    if (url) {
      executeCommand("insertImage", url);
    }
  }, [executeCommand]);

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
      { command: "strikeThrough", icon: Strikethrough, title: "Strikethrough" },
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
      { type: "separator" },
      { type: "custom", icon: Link, title: "Insert Link", action: insertLink },
      { command: "formatBlock", icon: Code, title: "Code Block", value: "pre" },
      { type: "separator" },
      { command: "undo", icon: Undo, title: "Undo" },
      { command: "redo", icon: Redo, title: "Redo" },
    ];

    const fullButtons = [
      ...basicButtons,
      { command: "strikeThrough", icon: Strikethrough, title: "Strikethrough" },
      { type: "separator" },
      { command: "justifyLeft", icon: AlignLeft, title: "Align Left" },
      { command: "justifyCenter", icon: AlignCenter, title: "Align Center" },
      { command: "justifyRight", icon: AlignRight, title: "Align Right" },
      { command: "justifyFull", icon: AlignJustify, title: "Justify" },
      { type: "separator" },
      { command: "insertUnorderedList", icon: List, title: "Bullet List" },
      {
        command: "insertOrderedList",
        icon: ListOrdered,
        title: "Numbered List",
      },
      {
        command: "formatBlock",
        icon: Quote,
        title: "Quote",
        value: "blockquote",
      },
      { type: "separator" },
      { type: "custom", icon: Link, title: "Insert Link", action: insertLink },
      {
        type: "custom",
        icon: Image,
        title: "Insert Image",
        action: insertImage,
      },
      { command: "formatBlock", icon: Code, title: "Code Block", value: "pre" },
      { type: "separator" },
      { command: "undo", icon: Undo, title: "Undo" },
      { command: "redo", icon: Redo, title: "Redo" },
    ];

    switch (toolbar) {
      case "basic":
        return basicButtons;
      case "exam":
        return examButtons;
      case "minimal":
        return basicButtons.slice(0, 2);
      default:
        return fullButtons;
    }
  };

  const renderToolbar = () => {
    const buttons = getToolbarButtons();

    return (
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        {/* Font Family */}
        {toolbar === "full" && (
          <Select
            onValueChange={(value) => executeCommand("fontName", value)}
            disabled={disabled}>
            <SelectTrigger className="w-32 h-8">
              <SelectValue placeholder="Font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_FAMILIES.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Font Size */}
        {toolbar === "full" && (
          <Select
            onValueChange={(value) => executeCommand("fontSize", value)}
            disabled={disabled}>
            <SelectTrigger className="w-20 h-8">
              <Type className="h-3 w-3" />
            </SelectTrigger>
            <SelectContent>
              {FONT_SIZES.map((size) => (
                <SelectItem key={size.value} value={size.value}>
                  {size.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Color Picker */}
        {toolbar === "full" && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" disabled={disabled}>
                <Palette className="h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48">
              <div className="grid grid-cols-6 gap-1">
                {COLORS.map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded border border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => executeCommand("foreColor", color)}
                    title={color}
                  />
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}

        {toolbar === "full" && <div className="w-px h-6 bg-border mx-1" />}

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
                    case "z":
                      if (e.shiftKey) {
                        e.preventDefault();
                        executeCommand("redo");
                      } else {
                        e.preventDefault();
                        executeCommand("undo");
                      }
                      break;
                  }
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
