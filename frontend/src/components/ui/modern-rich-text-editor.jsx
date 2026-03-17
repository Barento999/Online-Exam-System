import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
  Code,
  Link,
  Image,
  Table,
  Undo,
  Redo,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  AlertCircle,
  Type,
  Palette,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Modern Rich Text Editor using modern APIs instead of deprecated execCommand
export const ModernRichTextEditor = ({
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
  toolbar = "full", // "full", "basic", "minimal", "exam"
  allowFullscreen = true,
  theme = "default",
}) => {
  const [content, setContent] = useState(value);
  const [isPreview, setIsPreview] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [history, setHistory] = useState([value]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [currentFormat, setCurrentFormat] = useState({});

  const editorRef = useRef(null);
  const containerRef = useRef(null);

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && value !== content) {
      editorRef.current.innerHTML = value;
      setContent(value);
    }
  }, [value]);

  // Calculate word and character counts
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, "").trim();
    setWordCount(text ? text.split(/\s+/).length : 0);
    setCharCount(text.length);
  }, [content]);

  // Modern approach to rich text editing using Selection API and DOM manipulation
  const applyFormat = useCallback(
    (format, value = null) => {
      if (disabled || !editorRef.current) return;

      const selection = window.getSelection();
      if (!selection.rangeCount) return;

      const range = selection.getRangeAt(0);

      try {
        switch (format) {
          case "bold":
            toggleInlineStyle("font-weight", "bold", "strong");
            break;
          case "italic":
            toggleInlineStyle("font-style", "italic", "em");
            break;
          case "underline":
            toggleInlineStyle("text-decoration", "underline", "u");
            break;
          case "strikethrough":
            toggleInlineStyle("text-decoration", "line-through", "s");
            break;
          case "alignLeft":
            applyBlockStyle("text-align", "left");
            break;
          case "alignCenter":
            applyBlockStyle("text-align", "center");
            break;
          case "alignRight":
            applyBlockStyle("text-align", "right");
            break;
          case "alignJustify":
            applyBlockStyle("text-align", "justify");
            break;
          case "bulletList":
            toggleList("ul");
            break;
          case "numberedList":
            toggleList("ol");
            break;
          case "blockquote":
            toggleBlockElement("blockquote");
            break;
          case "code":
            if (selection.isCollapsed) {
              toggleBlockElement("pre");
            } else {
              toggleInlineStyle("font-family", "monospace", "code");
            }
            break;
          case "fontSize":
            applyInlineStyle("font-size", value);
            break;
          case "fontFamily":
            applyInlineStyle("font-family", value);
            break;
          case "color":
            applyInlineStyle("color", value);
            break;
          case "backgroundColor":
            applyInlineStyle("background-color", value);
            break;
          case "link":
            insertLink();
            break;
          case "image":
            insertImage();
            break;
          case "table":
            insertTable();
            break;
          default:
            break;
        }
      } catch (error) {
        console.warn("Format application failed:", format, error);
      }

      // Force LTR direction after formatting
      setTimeout(() => {
        maintainLTRDirection();
        handleContentChange();
      }, 0);
    },
    [disabled],
  );

  const toggleInlineStyle = (styleProperty, styleValue, tagName) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    if (range.collapsed) {
      // No selection, create a span with the style
      const span = document.createElement("span");
      span.style[styleProperty] = styleValue;
      span.textContent = "\u200B"; // Zero-width space
      range.insertNode(span);

      // Position cursor inside the span
      range.setStart(span, 0);
      range.setEnd(span, 1);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      // Has selection, wrap or unwrap
      const selectedContent = range.extractContents();
      const wrapper = document.createElement(tagName || "span");

      if (tagName) {
        wrapper.appendChild(selectedContent);
      } else {
        wrapper.style[styleProperty] = styleValue;
        wrapper.appendChild(selectedContent);
      }

      range.insertNode(wrapper);
    }
  };

  const applyBlockStyle = (styleProperty, styleValue) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let blockElement = range.commonAncestorContainer;

    // Find the block-level parent
    while (blockElement && blockElement.nodeType !== Node.ELEMENT_NODE) {
      blockElement = blockElement.parentNode;
    }

    while (blockElement && !isBlockElement(blockElement)) {
      blockElement = blockElement.parentNode;
    }

    if (blockElement && blockElement !== editorRef.current) {
      blockElement.style[styleProperty] = styleValue;
    }
  };

  const applyInlineStyle = (styleProperty, styleValue) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const span = document.createElement("span");
    span.style[styleProperty] = styleValue;

    if (range.collapsed) {
      span.textContent = "\u200B";
      range.insertNode(span);
      range.setStart(span, 0);
      range.setEnd(span, 1);
    } else {
      const selectedContent = range.extractContents();
      span.appendChild(selectedContent);
      range.insertNode(span);
    }

    selection.removeAllRanges();
    selection.addRange(range);
  };

  const toggleList = (listType) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let listElement = range.commonAncestorContainer;

    // Find existing list
    while (
      listElement &&
      listElement.tagName !== listType.toUpperCase() &&
      listElement !== editorRef.current
    ) {
      listElement = listElement.parentNode;
    }

    if (listElement && listElement.tagName === listType.toUpperCase()) {
      // Remove list
      const items = Array.from(listElement.children);
      items.forEach((item) => {
        const p = document.createElement("p");
        p.innerHTML = item.innerHTML;
        listElement.parentNode.insertBefore(p, listElement);
      });
      listElement.remove();
    } else {
      // Create list
      const list = document.createElement(listType);
      const li = document.createElement("li");

      if (range.collapsed) {
        li.textContent = "List item";
      } else {
        const selectedContent = range.extractContents();
        li.appendChild(selectedContent);
      }

      list.appendChild(li);
      range.insertNode(list);
    }
  };

  const toggleBlockElement = (tagName) => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let blockElement = range.commonAncestorContainer;

    // Find existing block element
    while (
      blockElement &&
      blockElement.tagName !== tagName.toUpperCase() &&
      blockElement !== editorRef.current
    ) {
      blockElement = blockElement.parentNode;
    }

    if (blockElement && blockElement.tagName === tagName.toUpperCase()) {
      // Remove block element
      const p = document.createElement("p");
      p.innerHTML = blockElement.innerHTML;
      blockElement.parentNode.replaceChild(p, blockElement);
    } else {
      // Create block element
      const element = document.createElement(tagName);

      if (range.collapsed) {
        element.textContent =
          tagName === "blockquote" ? "Quote text" : "Code block";
      } else {
        const selectedContent = range.extractContents();
        element.appendChild(selectedContent);
      }

      range.insertNode(element);
    }
  };

  const insertLink = () => {
    const url = prompt("Enter URL:");
    if (!url) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";

    if (range.collapsed) {
      link.textContent = url;
    } else {
      const selectedContent = range.extractContents();
      link.appendChild(selectedContent);
    }

    range.insertNode(link);
  };

  const insertImage = () => {
    const url = prompt("Enter image URL:");
    if (!url) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const img = document.createElement("img");
    img.src = url;
    img.alt = "Image";
    img.style.maxWidth = "100%";
    img.style.height = "auto";

    range.insertNode(img);
  };

  const insertTable = () => {
    const rows = parseInt(prompt("Number of rows:") || "2");
    const cols = parseInt(prompt("Number of columns:") || "2");

    if (!rows || !cols) return;

    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    const table = document.createElement("table");
    table.style.border = "1px solid #ccc";
    table.style.borderCollapse = "collapse";
    table.style.width = "100%";

    for (let i = 0; i < rows; i++) {
      const row = document.createElement("tr");
      for (let j = 0; j < cols; j++) {
        const cell = document.createElement(i === 0 ? "th" : "td");
        cell.style.border = "1px solid #ccc";
        cell.style.padding = "8px";
        cell.textContent = i === 0 ? `Header ${j + 1}` : `Cell ${i},${j + 1}`;
        row.appendChild(cell);
      }
      table.appendChild(row);
    }

    range.insertNode(table);
  };

  const isBlockElement = (element) => {
    const blockElements = [
      "DIV",
      "P",
      "H1",
      "H2",
      "H3",
      "H4",
      "H5",
      "H6",
      "BLOCKQUOTE",
      "PRE",
      "UL",
      "OL",
      "LI",
    ];
    return blockElements.includes(element.tagName);
  };

  const maintainLTRDirection = () => {
    if (!editorRef.current) return;

    // Set LTR direction on the editor
    editorRef.current.dir = "ltr";
    editorRef.current.style.direction = "ltr";
    editorRef.current.style.textAlign = "left";

    // Ensure all child elements maintain LTR direction
    const allElements = editorRef.current.querySelectorAll("*");
    allElements.forEach((el) => {
      if (!el.style.textAlign || el.style.textAlign === "start") {
        el.style.direction = "ltr";
      }
    });
  };

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

      // Add to history
      if (newContent !== history[historyIndex]) {
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newContent);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
      }
    }
  }, [onChange, content, history, historyIndex]);

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      const previousContent = history[newIndex];
      setContent(previousContent);
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = previousContent;
      }
      onChange?.(previousContent);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      const nextContent = history[newIndex];
      setContent(nextContent);
      setHistoryIndex(newIndex);
      if (editorRef.current) {
        editorRef.current.innerHTML = nextContent;
      }
      onChange?.(nextContent);
    }
  };

  // Setup editor
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.contentEditable = !disabled;

      if (value) {
        editorRef.current.innerHTML = value;
      }

      maintainLTRDirection();

      const handleInput = () => {
        maintainLTRDirection();
        handleContentChange();
      };

      const handlePaste = (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");

        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
          range.collapse(false);
        }

        setTimeout(() => {
          maintainLTRDirection();
          handleContentChange();
        }, 0);
      };

      const handleKeyDown = (e) => {
        // Handle keyboard shortcuts
        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case "b":
              e.preventDefault();
              applyFormat("bold");
              break;
            case "i":
              e.preventDefault();
              applyFormat("italic");
              break;
            case "u":
              e.preventDefault();
              applyFormat("underline");
              break;
            case "z":
              e.preventDefault();
              if (e.shiftKey) {
                redo();
              } else {
                undo();
              }
              break;
            case "y":
              e.preventDefault();
              redo();
              break;
          }
        }
      };

      const currentEditor = editorRef.current;
      currentEditor.addEventListener("input", handleInput);
      currentEditor.addEventListener("paste", handlePaste);
      currentEditor.addEventListener("keydown", handleKeyDown);

      return () => {
        if (currentEditor) {
          currentEditor.removeEventListener("input", handleInput);
          currentEditor.removeEventListener("paste", handlePaste);
          currentEditor.removeEventListener("keydown", handleKeyDown);
        }
      };
    }
  }, [disabled, value, applyFormat, handleContentChange]);

  const getToolbarConfig = () => {
    const configs = {
      minimal: [
        { type: "button", format: "bold", icon: Bold, title: "Bold" },
        { type: "button", format: "italic", icon: Italic, title: "Italic" },
      ],
      basic: [
        { type: "button", format: "bold", icon: Bold, title: "Bold" },
        { type: "button", format: "italic", icon: Italic, title: "Italic" },
        {
          type: "button",
          format: "underline",
          icon: Underline,
          title: "Underline",
        },
        { type: "separator" },
        {
          type: "button",
          format: "bulletList",
          icon: List,
          title: "Bullet List",
        },
        {
          type: "button",
          format: "numberedList",
          icon: ListOrdered,
          title: "Numbered List",
        },
      ],
      exam: [
        { type: "button", format: "bold", icon: Bold, title: "Bold" },
        { type: "button", format: "italic", icon: Italic, title: "Italic" },
        {
          type: "button",
          format: "underline",
          icon: Underline,
          title: "Underline",
        },
        { type: "separator" },
        {
          type: "button",
          format: "bulletList",
          icon: List,
          title: "Bullet List",
        },
        {
          type: "button",
          format: "numberedList",
          icon: ListOrdered,
          title: "Numbered List",
        },
        { type: "separator" },
        {
          type: "button",
          format: "alignLeft",
          icon: AlignLeft,
          title: "Align Left",
        },
        {
          type: "button",
          format: "alignCenter",
          icon: AlignCenter,
          title: "Align Center",
        },
        {
          type: "button",
          format: "alignRight",
          icon: AlignRight,
          title: "Align Right",
        },
      ],
      full: [
        {
          type: "button",
          format: "undo",
          icon: Undo,
          title: "Undo",
          action: undo,
        },
        {
          type: "button",
          format: "redo",
          icon: Redo,
          title: "Redo",
          action: redo,
        },
        { type: "separator" },
        { type: "button", format: "bold", icon: Bold, title: "Bold" },
        { type: "button", format: "italic", icon: Italic, title: "Italic" },
        {
          type: "button",
          format: "underline",
          icon: Underline,
          title: "Underline",
        },
        {
          type: "button",
          format: "strikethrough",
          icon: Strikethrough,
          title: "Strikethrough",
        },
        { type: "separator" },
        {
          type: "button",
          format: "alignLeft",
          icon: AlignLeft,
          title: "Align Left",
        },
        {
          type: "button",
          format: "alignCenter",
          icon: AlignCenter,
          title: "Align Center",
        },
        {
          type: "button",
          format: "alignRight",
          icon: AlignRight,
          title: "Align Right",
        },
        {
          type: "button",
          format: "alignJustify",
          icon: AlignJustify,
          title: "Justify",
        },
        { type: "separator" },
        {
          type: "button",
          format: "bulletList",
          icon: List,
          title: "Bullet List",
        },
        {
          type: "button",
          format: "numberedList",
          icon: ListOrdered,
          title: "Numbered List",
        },
        { type: "button", format: "blockquote", icon: Quote, title: "Quote" },
        { type: "button", format: "code", icon: Code, title: "Code" },
        { type: "separator" },
        { type: "button", format: "link", icon: Link, title: "Insert Link" },
        { type: "button", format: "image", icon: Image, title: "Insert Image" },
        { type: "button", format: "table", icon: Table, title: "Insert Table" },
      ],
    };

    return configs[toolbar] || configs.exam;
  };

  const renderToolbar = () => {
    const toolbarConfig = getToolbarConfig();

    return (
      <div className="flex items-center gap-1 p-2 border-b bg-muted/30 flex-wrap">
        {toolbarConfig.map((item, index) => {
          if (item.type === "separator") {
            return (
              <Separator
                key={index}
                orientation="vertical"
                className="h-6 mx-1"
              />
            );
          }

          return (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() =>
                item.action ? item.action() : applyFormat(item.format)
              }
              disabled={
                disabled ||
                (item.format === "undo" && historyIndex <= 0) ||
                (item.format === "redo" && historyIndex >= history.length - 1)
              }
              title={item.title}>
              <item.icon className="h-4 w-4" />
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
              onClick={() => setIsFullscreen(!isFullscreen)}
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
          "border rounded-lg overflow-hidden modern-rich-text-editor",
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
                direction: "ltr",
                textAlign: "left",
                unicodeBidi: "embed",
              }}
              data-placeholder={placeholder}
              suppressContentEditableWarning={true}
            />
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

          <div className="flex items-center gap-2">
            {isFullscreen && (
              <Badge variant="outline" className="text-xs">
                Fullscreen Mode
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              Modern Editor
            </Badge>
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

  return editorContent;
};

// Hook for managing modern rich text editor state
export const useModernRichTextEditor = (initialValue = "") => {
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
