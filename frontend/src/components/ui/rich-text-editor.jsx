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

  // Update content when value prop changes
  useEffect(() => {
    if (value !== content) {
      setContent(value);
      if (editorRef.current) {
        editorRef.current.innerHTML = value;
      }
    }
  }, [value]);

  // Calculate word and character counts
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
    setCharCount(text.length);
  }, [content]);

  const handleContentChange = useCallback(() => {
    if (!editorRef.current) return;

    const newContent = editorRef.current.innerHTML;
    setContent(newContent);
    onChange?.(newContent);
  }, [onChange]);

  const executeCommand = useCallback(
    (command, value = null) => {
      if (disabled) return;

      document.execCommand(command, false, value);
      editorRef.current?.focus();
      handleContentChange();
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
          "border rounded-lg overflow-hidden",
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
                "p-4 outline-none overflow-auto prose prose-sm max-w-none",
                "focus:ring-0 focus:outline-none",
                isFullscreen && "flex-1",
                disabled && "cursor-not-allowed",
              )}
              style={{
                minHeight: isFullscreen ? "auto" : minHeight,
                maxHeight: isFullscreen ? "auto" : maxHeight,
              }}
              onInput={handleContentChange}
              onPaste={handleContentChange}
              onKeyUp={handleContentChange}
              data-placeholder={placeholder}
              suppressContentEditableWarning={true}
            />
          )}

          {/* Placeholder */}
          {!content && !disabled && (
            <div className="absolute top-4 left-4 text-muted-foreground pointer-events-none">
              {placeholder}
            </div>
          )}
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
