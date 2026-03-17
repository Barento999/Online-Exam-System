# Rich Text Editor - Quick Reference Card

## 🎯 Which Editor Should I Use?

```
┌─────────────────────────────────────────────────────────────┐
│                    DECISION TREE                             │
└─────────────────────────────────────────────────────────────┘

New Project? ──────────────────────────► ModernRichTextEditor
                                         (RECOMMENDED)

Need Tables/Links/Images? ─────────────► ModernRichTextEditor

Technical Documentation? ───────────────► MarkdownEditor

Simple Text Formatting? ────────────────► SimpleRichTextEditor

Cursor Direction Issues? ───────────────► LTRTextEditor
                                         or ModernRichTextEditor

Existing Project (Legacy)? ─────────────► RichTextEditor
                                         (Keep for compatibility)
```

## 📦 Quick Import Guide

```jsx
// ✨ RECOMMENDED - Modern Editor
import {
  ModernRichTextEditor,
  useModernRichTextEditor,
} from "@/components/ui/modern-rich-text-editor";

// 📝 Legacy Editor (Backward Compatibility)
import {
  RichTextEditor,
  useRichTextEditor,
} from "@/components/ui/rich-text-editor";

// ⚡ Simple Editor (Performance)
import { SimpleRichTextEditor } from "@/components/ui/simple-rich-text-editor";

// 🔄 LTR Editor (Cursor Direction Fix)
import { LTRTextEditor } from "@/components/ui/ltr-text-editor";

// 📄 Markdown Editor
import {
  MarkdownEditor,
  useMarkdownEditor,
} from "@/components/ui/markdown-editor";
```

## ⚡ Quick Start Examples

### 1. Basic Usage (Copy & Paste Ready)

```jsx
import { ModernRichTextEditor } from "@/components/ui/modern-rich-text-editor";
import { useState } from "react";

function MyComponent() {
  const [content, setContent] = useState("");

  return (
    <ModernRichTextEditor
      value={content}
      onChange={setContent}
      label="Content"
      placeholder="Start typing..."
      toolbar="exam"
      showWordCount={true}
    />
  );
}
```

### 2. With Validation (Copy & Paste Ready)

```jsx
import {
  ModernRichTextEditor,
  useModernRichTextEditor,
} from "@/components/ui/modern-rich-text-editor";
import { Button } from "@/components/ui/button";

function ValidatedForm() {
  const editor = useModernRichTextEditor();

  const handleSubmit = () => {
    if (editor.validate(editor.value, { required: true, minLength: 50 })) {
      console.log("Valid!", editor.getPlainText());
    }
  };

  return (
    <>
      <ModernRichTextEditor
        value={editor.value}
        onChange={editor.setValue}
        error={editor.error}
        label="Content"
        required
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </>
  );
}
```

### 3. Question Form (Copy & Paste Ready)

```jsx
import { ModernRichTextEditor } from "@/components/ui/modern-rich-text-editor";
import { useState } from "react";

function QuestionForm() {
  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");

  return (
    <div className="space-y-4">
      <ModernRichTextEditor
        value={question}
        onChange={setQuestion}
        label="Question Text"
        placeholder="Enter your question..."
        toolbar="exam"
        minHeight="150px"
        showWordCount={true}
        required
      />

      <ModernRichTextEditor
        value={explanation}
        onChange={setExplanation}
        label="Explanation"
        placeholder="Explain the answer..."
        toolbar="basic"
        minHeight="200px"
      />
    </div>
  );
}
```

## 🎨 Toolbar Options

```jsx
toolbar = "minimal"; // Bold, Italic only
toolbar = "basic"; // Bold, Italic, Underline, Lists
toolbar = "exam"; // Basic + Alignment (RECOMMENDED for questions)
toolbar = "full"; // Everything (Undo/Redo, Tables, Links, Images)
```

## 📏 Common Props

```jsx
<ModernRichTextEditor
  // Required
  value={string}              // Current content (HTML)
  onChange={function}         // Change handler

  // Common
  label={string}              // Field label
  placeholder={string}        // Placeholder text
  toolbar="exam"              // Toolbar preset
  required={boolean}          // Required field
  disabled={boolean}          // Disable editing
  error={string}              // Error message

  // Sizing
  minHeight="200px"           // Minimum height
  maxHeight="400px"           // Maximum height
  className={string}          // Additional classes

  // Features
  showWordCount={boolean}     // Show word count
  showCharCount={boolean}     // Show character count
  maxLength={number}          // Character limit
  allowFullscreen={boolean}   // Enable fullscreen mode
/>
```

## 🔧 Hook Methods

```jsx
const editor = useModernRichTextEditor();

editor.value; // Current HTML content
editor.setValue(html); // Set content
editor.error; // Current error message
editor.setError(msg); // Set error message
editor.validate(content, rules); // Validate content
editor.reset(); // Reset to initial value
editor.getPlainText(); // Get plain text (no HTML)
editor.getWordCount(); // Get word count
```

## ✅ Validation Rules

```jsx
editor.validate(editor.value, {
  required: true, // Content is required
  minLength: 50, // Minimum 50 characters
  maxLength: 1000, // Maximum 1000 characters
});
```

## ⌨️ Keyboard Shortcuts

```
Ctrl+B (Cmd+B)           Bold
Ctrl+I (Cmd+I)           Italic
Ctrl+U (Cmd+U)           Underline
Ctrl+Z (Cmd+Z)           Undo
Ctrl+Shift+Z (Cmd+Shift+Z)  Redo
Ctrl+Y (Cmd+Y)           Redo
```

## 🎯 Use Case Cheat Sheet

| Use Case           | Editor   | Toolbar | Example                  |
| ------------------ | -------- | ------- | ------------------------ |
| Question Text      | Modern   | exam    | `toolbar="exam"`         |
| Exam Instructions  | Modern   | full    | `toolbar="full"`         |
| Student Feedback   | Modern   | basic   | `toolbar="basic"`        |
| Simple Comments    | Simple   | -       | Use SimpleRichTextEditor |
| Technical Docs     | Markdown | -       | Use MarkdownEditor       |
| Announcements      | Modern   | full    | `toolbar="full"`         |
| Course Description | Modern   | basic   | `toolbar="basic"`        |

## 🐛 Common Issues & Quick Fixes

### Cursor on Wrong Side

```jsx
// Use Modern Editor (has built-in fix)
import { ModernRichTextEditor } from "@/components/ui/modern-rich-text-editor";

// OR use LTR Editor (aggressive fix)
import { LTRTextEditor } from "@/components/ui/ltr-text-editor";
```

### Need Plain Text

```jsx
const editor = useModernRichTextEditor();
const plainText = editor.getPlainText();
```

### Validation Not Working

```jsx
// Make sure to use the hook
const editor = useModernRichTextEditor();

// Then validate
const isValid = editor.validate(editor.value, { required: true });
```

### Performance Issues

```jsx
// Use Simple Editor for better performance
import { SimpleRichTextEditor } from "@/components/ui/simple-rich-text-editor";
```

## 📊 Feature Matrix (Quick Glance)

```
Feature              Modern  Legacy  Simple  LTR  Markdown
─────────────────────────────────────────────────────────
Modern APIs            ✅      ❌      ❌     ❌     N/A
Undo/Redo              ✅      ✅      ❌     ❌     ❌
Tables                 ✅      ❌      ❌     ❌     ✅
Links/Images           ✅      ✅      ❌     ❌     ✅
LTR Fix                ✅      ✅      ✅     ✅✅    N/A
Performance            ⭐⭐⭐⭐  ⭐⭐⭐   ⭐⭐⭐⭐⭐ ⭐⭐⭐  ⭐⭐⭐⭐⭐
Future-Proof           ✅      ❌      ⚠️     ⚠️     ✅
Recommended            ✅      ❌      ⚠️     ⚠️     ✅
```

## 🚀 Pro Tips

1. **Always use Modern Editor for new projects**

   ```jsx
   import { ModernRichTextEditor } from "@/components/ui/modern-rich-text-editor";
   ```

2. **Use the hook for validation**

   ```jsx
   const editor = useModernRichTextEditor();
   ```

3. **Choose the right toolbar**
   - Questions: `toolbar="exam"`
   - Full features: `toolbar="full"`
   - Simple: `toolbar="basic"`

4. **Show word count for user guidance**

   ```jsx
   showWordCount={true}
   ```

5. **Add validation rules**
   ```jsx
   editor.validate(editor.value, { required: true, minLength: 50 });
   ```

## 📚 More Resources

- **Full Guide:** `RICH_TEXT_IMPLEMENTATION_GUIDE.md`
- **Demo Page:** `/rich-text-demo`
- **Test Page:** `/rich-text-cursor-test`
- **Completion Summary:** `RICH_TEXT_COMPLETION_SUMMARY.md`

---

**Quick Answer:** Use `ModernRichTextEditor` with `toolbar="exam"` for questions! 🎯
