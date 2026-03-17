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

// Hybrid editor: invisible textarea for input + visible div for display
export const HybridLTREditor = ({
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
  const [plainText, setPlainText] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [cursorPosition, setCursorPosition] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const textareaRef = useRef(null);
  const displayRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize content
  useEffect(() => {
    if (value !== content) {
      setContent(value);
      setPlainText(value.replace(/<[^>]*>/g, ""));
    }
  }, [value]);

  // Calculate word count
  useEffect(() => {
    const text = plainText.trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, [plainText]);

  // Sync textarea with display
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.value = plainText;
    }
  }, [plainText]);

  const handleTextareaChange = useCallback(
    (e) => {
      const newText = e.target.value;
      setPlainText(newText);
      setCursorPosition(e.target.selectionStart);

      // Convert plain text to HTML (basic formatting)
      let htmlContent = newText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\n/g, "<br>");

      setContent(htmlContent);
      onChange?.(htmlContent);
    },
    [onChange],
  );

  const handleTextareaKeyDown = useCallback((e) => {
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
  }, []);

  const handleFocus = useCallback(() => {
    setIsActive(true);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleBlur = useCallback(() => {
    setIsActive(false);
  }, []);

  const executeCommand = useCallback(
    (command) => {
      if (disabled || !textareaRef.current) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = plainText.substring(start, end);

      let beforeText = plainText.substring(0, start);
      let afterText = plainText.substring(end);
      let newText = plainText;
      let newCursorPos = start;

      switch (command) {
        case "bold":
          if (selectedText) {
            newText = beforeText + `**${selectedText}**` + afterText;
            newCursorPos = start + selectedText.length + 4;
          } else {
            newText = beforeText + "****" + afterText;
            newCursorPos = start + 2;
          }
          break;
        case "italic":
          if (selectedText) {
            newText = beforeText + `*${selectedText}*` + afterText;
            newCursorPos = start + selectedText.length + 2;
          } else {
            newText = beforeText + "**" + afterText;
            newCursorPos = start + 1;
          }
          break;
        case "underline":
          if (selectedText) {
            newText = beforeText + `_${selectedText}_` + afterText;
            newCursorPos = start + selectedText.length + 2;
          } else {
            newText = beforeText + "__" + afterText;
            newCursorPos = start + 1;
          }
          break;
        case "insertUnorderedList":
          newText = beforeText + "\n• " + afterText;
          newCursorPos = start + 3;
          break;
        case "insertOrderedList":
          newText = beforeText + "\n1. " + afterText;
          newCursorPos = start + 4;
          break;
        default:
          return;
      }

      setPlainText(newText);

      // Convert to HTML
      let htmlContent = newText
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/_(.*?)_/g, "<u>$1</u>")
        .replace(/\n• /g, "<br>• ")
        .replace(/\n\d+\. /g, "<br>1. ")
        .replace(/\n/g, "<br>");

      setContent(htmlContent);
      onChange?.(htmlContent);

      // Set cursor position
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);
    },
    [disabled, plainText, onChange],
  );

  const renderToolbar = () => {
    const buttons = [
      { command: "bold", icon: Bold, title: "Bold (**text**)" },
      { command: "italic", icon: Italic, title: "Italic (*text*)" },
      { command: "underline", icon: Underline, title: "Underline (_text_)" },
      { type: "separator" },
      { command: "insertUnorderedList", icon: List, title: "Bullet List (• )" },
      {
        command: "insertOrderedList",
        icon: ListOrdered,
        title: "Numbered List (1. )",
      },
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

        <div className="ml-auto text-xs text-muted-foreground">
          Cursor: {cursorPosition}
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
          "border rounded-lg overflow-hidden hybrid-ltr-editor",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
          isActive && "ring-2 ring-primary ring-opacity-20",
        )}>
        {renderToolbar()}

        <div
          ref={containerRef}
          className="relative"
          onClick={handleFocus}
          style={{
            minHeight: minHeight,
            maxHeight: maxHeight,
          }}>
          {/* Invisible textarea for input capture */}
          <textarea
            ref={textareaRef}
            className="absolute inset-0 w-full h-full p-4 resize-none outline-none border-0 bg-transparent text-transparent caret-black z-10"
            style={{
              minHeight: minHeight,
              maxHeight: maxHeight,
              direction: "ltr",
              textAlign: "left",
              unicodeBidi: "normal",
              caretColor: "black",
            }}
            value={plainText}
            onChange={handleTextareaChange}
            onKeyDown={handleTextareaKeyDown}
            onFocus={handleFocus}
            onBlur={handleBlur}
            disabled={disabled}
            placeholder=""
          />

          {/* Visible display div */}
          <div
            ref={displayRef}
            className={cn(
              "absolute inset-0 p-4 overflow-auto pointer-events-none",
              "prose prose-sm max-w-none",
              !plainText && "text-muted-foreground",
            )}
            style={{
              minHeight: minHeight,
              maxHeight: maxHeight,
              direction: "ltr",
              textAlign: "left",
            }}
            dangerouslySetInnerHTML={{
              __html: plainText ? content : placeholder,
            }}
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
            <span>Length: {plainText.length}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            Hybrid LTR
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
