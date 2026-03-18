import { useState, useRef, useEffect, useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Bold,
  Italic,
  List,
  ListOrdered,
  Eye,
  EyeOff,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { parseMarkdown } from "@/utils/markdownParser";

/**
 * Unified Text Editor - Single component for all text editing needs
 * Uses native textarea with LTR enforcement and markdown support
 */
export const UnifiedTextEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing...",
  disabled = false,
  className = "",
  minHeight = "120px",
  maxHeight = "400px",
  showWordCount = true,
  showCharCount = false,
  showToolbar = true,
  showPreview = false,
  label = null,
  error = null,
  required = false,
  rows = 6,
  maxLength = null,
}) => {
  const [content, setContent] = useState(value);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [isPreview, setIsPreview] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const textareaRef = useRef(null);

  // Initialize content
  useEffect(() => {
    if (textareaRef.current && value !== content) {
      textareaRef.current.value = value;
      setContent(value);
    }
  }, [value, content]);

  // Calculate word and character counts
  useEffect(() => {
    const text = content.trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
    setCharCount(text.length);
  }, [content]);

  // Force LTR behavior
  const forceLTRBehavior = useCallback(() => {
    if (!textareaRef.current) return;

    const element = textareaRef.current;
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

  // Insert markdown syntax at cursor position
  const insertMarkdown = useCallback(
    (before, after = "", placeholder = "") => {
      if (!textareaRef.current || disabled) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = content.substring(start, end);
      const textToInsert = selectedText || placeholder;

      const newText =
        content.substring(0, start) +
        before +
        textToInsert +
        after +
        content.substring(end);

      setContent(newText);
      onChange?.(newText);

      // Set cursor position
      setTimeout(() => {
        const newCursorPos = start + before.length + textToInsert.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    },
    [content, onChange, disabled],
  );

  // Setup textarea with LTR enforcement
  useEffect(() => {
    if (textareaRef.current) {
      if (value) {
        textareaRef.current.value = value;
      }

      forceLTRBehavior();

      const currentTextarea = textareaRef.current;

      const handleInput = (e) => {
        forceLTRBehavior();
        handleContentChange(e);
      };

      const handleKeyDown = (e) => {
        // Prevent RTL shortcuts
        if (e.ctrlKey && e.shiftKey) {
          e.preventDefault();
        }

        // Handle markdown shortcuts
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case "b":
              e.preventDefault();
              insertMarkdown("**", "**", "bold text");
              return;
            case "i":
              e.preventDefault();
              insertMarkdown("*", "*", "italic text");
              return;
          }
        }

        setTimeout(() => forceLTRBehavior(), 0);
      };

      const handleKeyUp = () => {
        setTimeout(() => forceLTRBehavior(), 0);
      };

      const handleFocus = () => {
        forceLTRBehavior();
      };

      const handlePaste = () => {
        setTimeout(() => forceLTRBehavior(), 0);
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
  }, [disabled, value, forceLTRBehavior, handleContentChange, insertMarkdown]);

  const renderToolbar = () => {
    if (!showToolbar) return null;

    return (
      <div className="flex items-center justify-between gap-2 p-2 border-b bg-muted/30 flex-wrap">
        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("**", "**", "bold text")}
            disabled={disabled}
            title="Bold (Ctrl+B)">
            <Bold className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("*", "*", "italic text")}
            disabled={disabled}
            title="Italic (Ctrl+I)">
            <Italic className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("- ", "", "list item")}
            disabled={disabled}
            title="Bullet List">
            <List className="h-4 w-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => insertMarkdown("1. ", "", "list item")}
            disabled={disabled}
            title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-1">
          {showPreview && (
            <Button
              type="button"
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
          )}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => setShowHelp(!showHelp)}
            title="Markdown Help">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  const renderHelp = () => {
    if (!showHelp) return null;

    return (
      <div className="p-3 bg-blue-50 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800 text-xs space-y-2">
        <p className="font-medium text-blue-900 dark:text-blue-100">
          Markdown Quick Reference:
        </p>
        <div className="grid grid-cols-2 gap-2 text-blue-800 dark:text-blue-200">
          <div>
            <code>**bold**</code> → <strong>bold</strong>
          </div>
          <div>
            <code>*italic*</code> → <em>italic</em>
          </div>
          <div>
            <code>- item</code> → bullet list
          </div>
          <div>
            <code>1. item</code> → numbered list
          </div>
          <div>
            <code>`code`</code> → <code>inline code</code>
          </div>
          <div>
            <code>[link](url)</code> → link
          </div>
        </div>
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
          "border rounded-lg overflow-hidden unified-text-editor",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
        )}>
        {renderToolbar()}
        {renderHelp()}

        {isPreview && showPreview ? (
          <div
            className="p-4 prose prose-sm max-w-none overflow-auto"
            style={{ minHeight, maxHeight }}
            dangerouslySetInnerHTML={{
              __html: content
                ? parseMarkdown(content)
                : '<p class="text-muted-foreground">Nothing to preview</p>',
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            maxLength={maxLength}
            className={cn(
              "w-full px-4 py-3 border-0 resize-none",
              "focus:ring-0 focus:outline-none",
              "transition-colors",
              disabled && "cursor-not-allowed bg-muted",
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
        )}

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
          <Badge variant="outline" className="text-xs">
            LTR Fixed
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

// Hook for managing unified text editor state
export const useUnifiedTextEditor = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const validate = useCallback((content, rules = {}) => {
    const text = content.trim();

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

    if (rules.minWords) {
      const wordCount = text.split(/\s+/).length;
      if (wordCount < rules.minWords) {
        setError(`Minimum ${rules.minWords} words required`);
        return false;
      }
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

  const getHtml = useCallback(() => {
    return parseMarkdown(value);
  }, [value]);

  return {
    value,
    setValue,
    error,
    setError,
    validate,
    reset,
    getPlainText,
    getWordCount,
    getHtml,
  };
};
