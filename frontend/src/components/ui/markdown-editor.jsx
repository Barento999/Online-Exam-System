import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bold,
  Italic,
  Link,
  List,
  ListOrdered,
  Quote,
  Code,
  Image,
  Eye,
  Edit,
  HelpCircle,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Simple markdown parser for preview
const parseMarkdown = (text) => {
  return (
    text
      // Headers
      .replace(/^### (.*$)/gim, "<h3>$1</h3>")
      .replace(/^## (.*$)/gim, "<h2>$1</h2>")
      .replace(/^# (.*$)/gim, "<h1>$1</h1>")
      // Bold
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      // Italic
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      // Links
      .replace(
        /\[([^\]]+)\]\(([^)]+)\)/g,
        '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
      )
      // Images
      .replace(
        /!\[([^\]]*)\]\(([^)]+)\)/g,
        '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />',
      )
      // Code blocks
      .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
      // Inline code
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      // Blockquotes
      .replace(/^> (.*$)/gim, "<blockquote>$1</blockquote>")
      // Unordered lists
      .replace(/^\* (.*$)/gim, "<li>$1</li>")
      .replace(/(<li>.*<\/li>)/s, "<ul>$1</ul>")
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, "<li>$1</li>")
      // Line breaks
      .replace(/\n/g, "<br>")
  );
};

export const MarkdownEditor = ({
  value = "",
  onChange,
  placeholder = "Start typing... (Markdown supported)",
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
  showPreview = true,
  showHelp = true,
}) => {
  const [activeTab, setActiveTab] = useState("edit");
  const textareaRef = useRef(null);

  const insertText = useCallback(
    (before, after = "", placeholder = "") => {
      if (!textareaRef.current || disabled) return;

      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = value.substring(start, end);
      const textToInsert = selectedText || placeholder;

      const newText =
        value.substring(0, start) +
        before +
        textToInsert +
        after +
        value.substring(end);

      onChange?.(newText);

      // Set cursor position
      setTimeout(() => {
        const newCursorPos = start + before.length + textToInsert.length;
        textarea.setSelectionRange(newCursorPos, newCursorPos);
        textarea.focus();
      }, 0);
    },
    [value, onChange, disabled],
  );

  const toolbarButtons = [
    {
      icon: Bold,
      title: "Bold",
      action: () => insertText("**", "**", "bold text"),
    },
    {
      icon: Italic,
      title: "Italic",
      action: () => insertText("*", "*", "italic text"),
    },
    {
      icon: Link,
      title: "Link",
      action: () => insertText("[", "](url)", "link text"),
    },
    {
      icon: Image,
      title: "Image",
      action: () => insertText("![", "](image-url)", "alt text"),
    },
    {
      icon: List,
      title: "Bullet List",
      action: () => insertText("* ", "", "list item"),
    },
    {
      icon: ListOrdered,
      title: "Numbered List",
      action: () => insertText("1. ", "", "list item"),
    },
    {
      icon: Quote,
      title: "Quote",
      action: () => insertText("> ", "", "quote"),
    },
    {
      icon: Code,
      title: "Code",
      action: () => insertText("`", "`", "code"),
    },
  ];

  const getStats = () => {
    const text = value.replace(/[#*`>\[\]()!-]/g, "").trim();
    const wordCount = text ? text.split(/\s+/).length : 0;
    const charCount = value.length;
    return { wordCount, charCount };
  };

  const { wordCount, charCount } = getStats();

  const renderToolbar = () => (
    <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
      {toolbarButtons.map((button, index) => (
        <Button
          key={index}
          variant="ghost"
          size="sm"
          onClick={button.action}
          disabled={disabled}
          title={button.title}>
          <button.icon className="h-4 w-4" />
        </Button>
      ))}

      {showHelp && (
        <div className="ml-auto">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setActiveTab(activeTab === "help" ? "edit" : "help")}
            title="Markdown Help">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );

  const renderHelp = () => (
    <div className="p-4 space-y-4 text-sm">
      <h3 className="font-semibold">Markdown Syntax Guide</h3>
      <div className="grid gap-3">
        <div>
          <strong>Headers:</strong>
          <code className="block bg-muted p-2 mt-1 rounded">
            # Header 1<br />
            ## Header 2<br />
            ### Header 3
          </code>
        </div>
        <div>
          <strong>Text Formatting:</strong>
          <code className="block bg-muted p-2 mt-1 rounded">
            **bold text**
            <br />
            *italic text*
            <br />
            `inline code`
          </code>
        </div>
        <div>
          <strong>Links & Images:</strong>
          <code className="block bg-muted p-2 mt-1 rounded">
            [link text](url)
            <br />
            ![alt text](image-url)
          </code>
        </div>
        <div>
          <strong>Lists:</strong>
          <code className="block bg-muted p-2 mt-1 rounded">
            * Bullet item
            <br />
            1. Numbered item
            <br />
            {"> Quote text"}
          </code>
        </div>
        <div>
          <strong>Code Blocks:</strong>
          <code className="block bg-muted p-2 mt-1 rounded">
            ```
            <br />
            code block
            <br />
            ```
          </code>
        </div>
      </div>
    </div>
  );

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
          "border rounded-lg overflow-hidden",
          error && "border-red-500",
          disabled && "opacity-50 cursor-not-allowed",
        )}>
        {showPreview || showHelp ? (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between border-b bg-muted/30">
              <TabsList className="h-auto p-1 bg-transparent">
                <TabsTrigger value="edit" className="flex items-center gap-2">
                  <Edit className="h-3 w-3" />
                  Edit
                </TabsTrigger>
                {showPreview && (
                  <TabsTrigger
                    value="preview"
                    className="flex items-center gap-2">
                    <Eye className="h-3 w-3" />
                    Preview
                  </TabsTrigger>
                )}
                {showHelp && (
                  <TabsTrigger value="help" className="flex items-center gap-2">
                    <HelpCircle className="h-3 w-3" />
                    Help
                  </TabsTrigger>
                )}
              </TabsList>
            </div>

            <TabsContent value="edit" className="m-0">
              {renderToolbar()}
              <Textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange?.(e.target.value)}
                placeholder={placeholder}
                disabled={disabled}
                className="border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  minHeight,
                  maxHeight,
                }}
              />
            </TabsContent>

            {showPreview && (
              <TabsContent value="preview" className="m-0">
                <div
                  className="p-4 prose prose-sm max-w-none overflow-auto"
                  style={{ minHeight, maxHeight }}
                  dangerouslySetInnerHTML={{
                    __html: value
                      ? parseMarkdown(value)
                      : '<p class="text-muted-foreground">Nothing to preview</p>',
                  }}
                />
              </TabsContent>
            )}

            {showHelp && (
              <TabsContent value="help" className="m-0">
                <div style={{ minHeight, maxHeight, overflow: "auto" }}>
                  {renderHelp()}
                </div>
              </TabsContent>
            )}
          </Tabs>
        ) : (
          <>
            {renderToolbar()}
            <Textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange?.(e.target.value)}
              placeholder={placeholder}
              disabled={disabled}
              className="border-0 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{
                minHeight,
                maxHeight,
              }}
            />
          </>
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
            Markdown Supported
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

// Hook for managing markdown editor state
export const useMarkdownEditor = (initialValue = "") => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(null);

  const validate = useCallback((content, rules = {}) => {
    const text = content.replace(/[#*`>\[\]()!-]/g, "").trim();

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
    return value.replace(/[#*`>\[\]()!-]/g, "").trim();
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
