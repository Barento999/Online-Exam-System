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

// Alternative approach using textarea with rich text simulation
export const TextareaRichEditor = ({
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
  const [selectedText, setSelectedText] = useState("");
  const [selectionStart, setSelectionStart] = useState(0);
  const [selectionEnd, setSelectionEnd] = useState(0);
  const textareaRef = useRef(null);

  // Initialize content
  useEffect(() => {
    if (value !== content) {
      setContent(value);
    }
  }, [value]);

  // Calculate word count
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
  }, [content]);

  const handleContentChange = useCallback(
    (e) => {
      const newContent = e.target.value;
      setContent(newContent);
      onChange?.(newContent);
    },
    [onChange],
  );

  const handleSelection = useCallback(() => {
    if (textareaRef.current) {
      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selected = content.substring(start, end);

      setSelectionStart(start);
      setSelectionEnd(end);
      setSelectedText(selected);
    }
  }, [content]);

  const insertFormatting = useCallback(
    (startTag, endTag) => {
      if (!textareaRef.current) return;

      const start = textareaRef.current.selectionStart;
      const end = textareaRef.current.selectionEnd;
      const selectedText = content.substring(start, end);

      let newContent;
      if (selectedText) {
        // Wrap selected text
        newContent =
          content.substring(0, start) +
          startTag +
          selectedText +
          endTag +
          content.substring(end);
      } else {
        // Insert tags at cursor position
        newContent =
          content.substring(0, start) +
          startTag +
          endTag +
          content.substring(start);
      }

      setContent(newContent);
      onChange?.(newContent);

      // Restore focus and cursor position
      setTimeout(() => {
        textareaRef.current.focus();
        const newCursorPos = selectedText
          ? start + startTag.length + selectedText.length + endTag.length
          : start + startTag.length;
        textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
      }, 0);
    },
    [content, onChange],
  );

  const executeCommand = useCallback(
    (command) => {
      switch (command) {
        case "bold":
          insertFormatting("<strong>", "</strong>");
          break;
        case "italic":
          insertFormatting("<em>", "</em>");
          break;
        case "underline":
          insertFormatting("<u>", "</u>");
          break;
        case "insertUnorderedList":
          insertFormatting("\n<ul>\n<li>", "</li>\n</ul>\n");
          break;
        case "insertOrderedList":
          insertFormatting("\n<ol>\n<li>", "</li>\n</ol>\n");
          break;
        default:
          break;
      }
    },
    [insertFormatting],
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
          {selectedText &&
            `Selected: "${selectedText.substring(0, 20)}${selectedText.length > 20 ? "..." : ""}"`}
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
          "border rounded-lg overflow-hidden textarea-rich-editor",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
        )}>
        {renderToolbar()}

        <div className="relative">
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleContentChange}
            onSelect={handleSelection}
            onKeyUp={handleSelection}
            onClick={handleSelection}
            placeholder={placeholder}
            disabled={disabled}
            className={cn(
              "w-full p-4 resize-none outline-none border-0",
              "focus:ring-0 focus:outline-none",
              "font-mono text-sm",
              disabled && "cursor-not-allowed",
            )}
            style={{
              minHeight: minHeight,
              maxHeight: maxHeight,
              direction: "ltr",
              textAlign: "left",
              unicodeBidi: "normal",
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
            <span>Cursor: {selectionStart}</span>
          </div>
          <Badge variant="outline" className="text-xs">
            HTML Mode
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
