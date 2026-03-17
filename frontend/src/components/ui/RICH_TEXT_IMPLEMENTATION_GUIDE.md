# Rich Text Editor - Complete Implementation Guide

## 🎯 Overview

This guide covers the complete implementation of rich text editing features in the exam system, including the new **Modern Rich Text Editor** that uses modern APIs instead of deprecated `execCommand`.

## 📦 Available Editors

### 1. Modern Rich Text Editor (✨ RECOMMENDED)

**File:** `modern-rich-text-editor.jsx`

**Why Use This:**

- ✅ Uses modern Selection API (no deprecated methods)
- ✅ Built-in undo/redo with history management
- ✅ Advanced features: tables, links, images
- ✅ Better performance and maintainability
- ✅ Proper LTR direction handling
- ✅ Future-proof implementation

**Best For:**

- New implementations
- Production applications
- Complex formatting needs
- Long-term maintenance

```jsx
import {
  ModernRichTextEditor,
  useModernRichTextEditor,
} from "@/components/ui/modern-rich-text-editor";

const MyComponent = () => {
  const editor = useModernRichTextEditor();

  return (
    <ModernRichTextEditor
      value={editor.value}
      onChange={editor.setValue}
      toolbar="full"
      allowFullscreen={true}
      showWordCount={true}
    />
  );
};
```

### 2. Rich Text Editor (Legacy)

**File:** `rich-text-editor.jsx`

**Why Use This:**

- Uses deprecated `document.execCommand`
- Comprehensive cursor direction fixes
- Multiple toolbar options
- Fullscreen mode

**Best For:**

- Existing implementations (backward compatibility)
- Simple formatting needs
- Quick prototypes

### 3. Simple Rich Text Editor

**File:** `simple-rich-text-editor.jsx`

**Why Use This:**

- Lightweight implementation
- Minimal event listeners
- Better performance for simple use cases
- Exam toolbar preset

**Best For:**

- Question text editing
- Simple announcements
- Performance-critical scenarios

### 4. LTR Text Editor

**File:** `ltr-text-editor.jsx`

**Why Use This:**

- Aggressive LTR enforcement
- Fixes cursor direction issues in RTL systems
- Continuous monitoring

**Best For:**

- RTL system environments
- When cursor direction is critical
- Bilingual applications

### 5. Markdown Editor

**File:** `markdown-editor.jsx`

**Why Use This:**

- Markdown syntax support
- Live preview mode
- Built-in help guide
- Version control friendly

**Best For:**

- Technical documentation
- Developer-focused content
- Code-heavy content
- Academic writing

## 🚀 Quick Start

### Basic Implementation

```jsx
import { ModernRichTextEditor } from "@/components/ui/modern-rich-text-editor";

function QuestionForm() {
  const [questionText, setQuestionText] = useState("");

  return (
    <ModernRichTextEditor
      value={questionText}
      onChange={setQuestionText}
      label="Question Text"
      placeholder="Enter your question..."
      toolbar="exam"
      minHeight="200px"
      showWordCount={true}
    />
  );
}
```

### With Validation

```jsx
import {
  ModernRichTextEditor,
  useModernRichTextEditor,
} from "@/components/ui/modern-rich-text-editor";

function ValidatedForm() {
  const editor = useModernRichTextEditor();

  const handleSubmit = () => {
    const isValid = editor.validate(editor.value, {
      required: true,
      minLength: 50,
      maxLength: 1000,
    });

    if (isValid) {
      // Submit form
      console.log("Plain text:", editor.getPlainText());
      console.log("Word count:", editor.getWordCount());
    }
  };

  return (
    <div>
      <ModernRichTextEditor
        value={editor.value}
        onChange={editor.setValue}
        error={editor.error}
        label="Content"
        required
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </div>
  );
}
```

## 🎨 Toolbar Options

### Minimal Toolbar

Basic text formatting only.

```jsx
<ModernRichTextEditor
  toolbar="minimal"
  // Includes: Bold, Italic
/>
```

### Basic Toolbar

Essential formatting tools.

```jsx
<ModernRichTextEditor
  toolbar="basic"
  // Includes: Bold, Italic, Underline, Lists
/>
```

### Exam Toolbar (Recommended for Questions)

Optimized for educational content.

```jsx
<ModernRichTextEditor
  toolbar="exam"
  // Includes: Bold, Italic, Underline, Lists, Alignment
/>
```

### Full Toolbar

All available features.

```jsx
<ModernRichTextEditor
  toolbar="full"
  // Includes: Everything + Undo/Redo, Tables, Links, Images, Code, Quotes
/>
```

## 📋 Common Use Cases

### 1. Question Creation

```jsx
function QuestionEditor() {
  const [questionData, setQuestionData] = useState({
    text: "",
    explanation: "",
  });

  return (
    <div className="space-y-4">
      <ModernRichTextEditor
        value={questionData.text}
        onChange={(value) =>
          setQuestionData((prev) => ({ ...prev, text: value }))
        }
        label="Question Text"
        placeholder="Enter the question..."
        toolbar="exam"
        minHeight="150px"
        showWordCount={true}
        required
      />

      <ModernRichTextEditor
        value={questionData.explanation}
        onChange={(value) =>
          setQuestionData((prev) => ({ ...prev, explanation: value }))
        }
        label="Explanation"
        placeholder="Explain the correct answer..."
        toolbar="basic"
        minHeight="200px"
      />
    </div>
  );
}
```

### 2. Exam Instructions

```jsx
function ExamInstructionsEditor() {
  const editor = useModernRichTextEditor();

  return (
    <ModernRichTextEditor
      value={editor.value}
      onChange={editor.setValue}
      label="Exam Instructions"
      placeholder="Enter detailed exam instructions..."
      toolbar="full"
      allowFullscreen={true}
      minHeight="300px"
      showWordCount={true}
      showCharCount={true}
    />
  );
}
```

### 3. Student Feedback

```jsx
function FeedbackEditor() {
  const [feedback, setFeedback] = useState("");

  return (
    <ModernRichTextEditor
      value={feedback}
      onChange={setFeedback}
      label="Feedback for Student"
      placeholder="Provide constructive feedback..."
      toolbar="basic"
      minHeight="150px"
      maxLength={500}
      showCharCount={true}
    />
  );
}
```

### 4. Course Announcements

```jsx
function AnnouncementEditor() {
  const [announcement, setAnnouncement] = useState("");

  return (
    <ModernRichTextEditor
      value={announcement}
      onChange={setAnnouncement}
      label="Announcement"
      placeholder="Write your announcement..."
      toolbar="full"
      allowFullscreen={true}
      minHeight="200px"
    />
  );
}
```

### 5. Technical Documentation (Markdown)

```jsx
function DocumentationEditor() {
  const markdown = useMarkdownEditor();

  return (
    <MarkdownEditor
      value={markdown.value}
      onChange={markdown.setValue}
      label="Technical Documentation"
      placeholder="Write documentation in Markdown..."
      showPreview={true}
      showHelp={true}
      minHeight="400px"
    />
  );
}
```

## 🔧 Advanced Features

### Undo/Redo

The Modern Rich Text Editor includes built-in undo/redo functionality:

```jsx
// Keyboard shortcuts work automatically:
// Ctrl+Z (Cmd+Z on Mac) - Undo
// Ctrl+Shift+Z or Ctrl+Y (Cmd+Shift+Z or Cmd+Y on Mac) - Redo

<ModernRichTextEditor
  toolbar="full" // Includes undo/redo buttons
  value={content}
  onChange={setContent}
/>
```

### Fullscreen Mode

```jsx
<ModernRichTextEditor
  allowFullscreen={true}
  value={content}
  onChange={setContent}
/>
```

### Preview Mode

```jsx
<ModernRichTextEditor
  toolbar="full" // Includes preview toggle button
  value={content}
  onChange={setContent}
/>
```

### Character/Word Limits

```jsx
<ModernRichTextEditor
  value={content}
  onChange={setContent}
  maxLength={1000}
  showCharCount={true}
  showWordCount={true}
/>
```

### Custom Validation

```jsx
const editor = useModernRichTextEditor();

const customValidation = () => {
  const plainText = editor.getPlainText();

  if (plainText.length < 10) {
    editor.setError("Content must be at least 10 characters");
    return false;
  }

  if (!plainText.includes("important")) {
    editor.setError("Content must include the word 'important'");
    return false;
  }

  editor.setError(null);
  return true;
};
```

## 🎯 Integration with Forms

### React Hook Form

```jsx
import { Controller } from "react-hook-form";

function FormWithRichText() {
  const { control, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="content"
        control={control}
        rules={{ required: "Content is required" }}
        render={({ field, fieldState }) => (
          <ModernRichTextEditor
            value={field.value}
            onChange={field.onChange}
            error={fieldState.error?.message}
            label="Content"
            toolbar="exam"
          />
        )}
      />
    </form>
  );
}
```

### Multi-Step Forms

```jsx
function MultiStepFormWithEditor() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
  });

  return (
    <div>
      {step === 1 && (
        <ModernRichTextEditor
          value={formData.description}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, description: value }))
          }
          label="Description"
          toolbar="basic"
        />
      )}

      {step === 2 && (
        <ModernRichTextEditor
          value={formData.instructions}
          onChange={(value) =>
            setFormData((prev) => ({ ...prev, instructions: value }))
          }
          label="Instructions"
          toolbar="full"
        />
      )}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Issue: Cursor appears on the right side

**Solution:** Use the LTR Text Editor or Modern Rich Text Editor (both have built-in LTR enforcement).

```jsx
import { LTRTextEditor } from "@/components/ui/ltr-text-editor";
// or
import { ModernRichTextEditor } from "@/components/ui/modern-rich-text-editor";
```

### Issue: Formatting not working

**Solution:** Ensure you're using the Modern Rich Text Editor for best results. The legacy editor uses deprecated APIs that may not work in all browsers.

### Issue: Performance problems with large content

**Solution:** Use the Simple Rich Text Editor for better performance:

```jsx
import { SimpleRichTextEditor } from "@/components/ui/simple-rich-text-editor";
```

### Issue: Need plain text output

**Solution:** Use the editor hook's `getPlainText()` method:

```jsx
const editor = useModernRichTextEditor();
const plainText = editor.getPlainText();
```

## 📊 Feature Comparison

| Feature         | Modern   | Legacy | Simple     | LTR    | Markdown   |
| --------------- | -------- | ------ | ---------- | ------ | ---------- |
| Modern APIs     | ✅       | ❌     | ❌         | ❌     | N/A        |
| Undo/Redo       | ✅       | ✅     | ❌         | ❌     | ❌         |
| Tables          | ✅       | ❌     | ❌         | ❌     | ✅         |
| Links/Images    | ✅       | ✅     | ❌         | ❌     | ✅         |
| LTR Enforcement | ✅       | ✅     | ✅         | ✅✅   | N/A        |
| Performance     | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Complexity      | Medium   | High   | Low        | Medium | Low        |
| Future-proof    | ✅       | ❌     | ⚠️         | ⚠️     | ✅         |

## 🎓 Best Practices

### 1. Choose the Right Editor

- **New projects:** Use Modern Rich Text Editor
- **Simple needs:** Use Simple Rich Text Editor
- **Technical content:** Use Markdown Editor
- **RTL systems:** Use LTR Text Editor or Modern Rich Text Editor

### 2. Set Appropriate Toolbar

- **Questions:** Use "exam" toolbar
- **Announcements:** Use "basic" or "full" toolbar
- **Comments:** Use "minimal" or "basic" toolbar
- **Documentation:** Use "full" toolbar or Markdown

### 3. Add Validation

Always validate content before submission:

```jsx
const isValid = editor.validate(editor.value, {
  required: true,
  minLength: 50,
  maxLength: 1000,
});
```

### 4. Provide Clear Labels

```jsx
<ModernRichTextEditor
  label="Question Text"
  placeholder="Enter your question here..."
  required
/>
```

### 5. Show Word/Character Counts

Help users understand content length:

```jsx
<ModernRichTextEditor
  showWordCount={true}
  showCharCount={true}
  maxLength={500}
/>
```

## 🔄 Migration Guide

### From Legacy to Modern Editor

```jsx
// Before (Legacy)
import { RichTextEditor } from "@/components/ui/rich-text-editor";

<RichTextEditor value={content} onChange={setContent} toolbar="full" />;

// After (Modern)
import { ModernRichTextEditor } from "@/components/ui/modern-rich-text-editor";

<ModernRichTextEditor value={content} onChange={setContent} toolbar="full" />;
```

The API is identical, making migration seamless!

## 📚 Additional Resources

- **Demo Page:** `/rich-text-demo` - Interactive examples
- **Test Page:** `/rich-text-cursor-test` - Cursor direction testing
- **Source Files:** `frontend/src/components/ui/`

## 🎉 Summary

The rich text editor implementation is now complete with:

✅ Modern, future-proof editor using Selection API
✅ Multiple editor options for different use cases
✅ Comprehensive LTR direction handling
✅ Built-in validation and error handling
✅ Undo/redo functionality
✅ Advanced features (tables, links, images)
✅ Markdown support for technical content
✅ Full documentation and examples

**Recommended for production:** Use `ModernRichTextEditor` for all new implementations.
