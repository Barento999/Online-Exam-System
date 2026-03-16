# Drag & Drop Upload Component Guide

## Overview

The `DragDropUpload` component provides a comprehensive, reusable drag-and-drop file upload interface with extensive customization options, validation, and user feedback features.

## Components

### 1. DragDropUpload Component (`drag-drop-upload.jsx`)

A fully-featured drag-and-drop upload component with:

- Visual drag-and-drop zone
- File validation (type, size, count)
- Progress tracking
- File preview and management
- Error handling and display
- Customizable styling and content

### 2. useFileUpload Hook (`useFileUpload.js`)

A custom hook for managing file upload state and operations:

- File collection management
- Upload progress tracking
- Error handling
- Single and multiple file uploads
- Integration with fetch API

## Features

### ✅ Core Functionality

- **Drag & Drop**: Native HTML5 drag-and-drop support
- **Click to Browse**: Traditional file input fallback
- **File Validation**: Type, size, and count validation
- **Progress Tracking**: Real-time upload progress
- **File Preview**: Visual preview with file information
- **Error Handling**: Comprehensive error display and management

### ✅ User Experience

- **Visual Feedback**: Hover states and drag indicators
- **File Management**: Add, remove, and clear files
- **Responsive Design**: Works on all screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Custom Content**: Customizable drop zone content

### ✅ Technical Features

- **TypeScript Ready**: Full type support
- **Framework Agnostic**: Can be adapted to other frameworks
- **Customizable**: Extensive props for customization
- **Performance**: Optimized for large files and multiple uploads
- **Memory Management**: Proper cleanup of object URLs

## Usage Examples

### Basic Image Upload

```jsx
import { DragDropUpload } from "@/components/ui/drag-drop-upload";

const [files, setFiles] = useState([]);

<DragDropUpload
  onFileSelect={(file) => setFiles([file])}
  onFileRemove={() => setFiles([])}
  accept="image/*"
  maxSize={5 * 1024 * 1024} // 5MB
  maxFiles={1}
  files={files}
  helperText="Upload profile picture"
/>;
```

### Multiple Document Upload

```jsx
import { useFileUpload } from "@/hooks/useFileUpload";

const { files, addFiles, removeFile, uploadProgress, error, uploadFiles } =
  useFileUpload();

<DragDropUpload
  onFileSelect={addFiles}
  onFileRemove={removeFile}
  accept=".pdf,.doc,.docx"
  maxSize={10 * 1024 * 1024} // 10MB
  maxFiles={5}
  files={files}
  uploadProgress={uploadProgress}
  error={error}
  helperText="Upload documents for processing"
/>;
```

### CSV Import with Custom Content

```jsx
<DragDropUpload
  onFileSelect={handleCsvSelect}
  accept=".csv,.xlsx,.xls"
  maxSize={5 * 1024 * 1024}
  maxFiles={1}
  files={csvFiles}
  showPreview={false}>
  <FileSpreadsheet className="h-12 w-12 mb-4 text-muted-foreground" />
  <div className="space-y-2">
    <p className="text-sm font-medium">Drop your CSV file here</p>
    <p className="text-xs text-muted-foreground">CSV, XLSX, XLS (Max 5MB)</p>
  </div>
</DragDropUpload>
```

## Props Reference

### DragDropUpload Props

| Prop             | Type                              | Default | Description                                    |
| ---------------- | --------------------------------- | ------- | ---------------------------------------------- |
| `onFileSelect`   | `(files: File \| File[]) => void` | -       | Callback when files are selected               |
| `onFileRemove`   | `(index: number) => void`         | -       | Callback when a file is removed                |
| `accept`         | `string`                          | `"*/*"` | Accepted file types (MIME types or extensions) |
| `maxSize`        | `number`                          | `10MB`  | Maximum file size in bytes                     |
| `maxFiles`       | `number`                          | `1`     | Maximum number of files                        |
| `files`          | `File[]`                          | `[]`    | Current files array                            |
| `disabled`       | `boolean`                         | `false` | Disable the upload area                        |
| `className`      | `string`                          | `""`    | Additional CSS classes                         |
| `children`       | `ReactNode`                       | -       | Custom content for drop zone                   |
| `showPreview`    | `boolean`                         | `true`  | Show file preview section                      |
| `uploadProgress` | `number \| null`                  | `null`  | Upload progress (0-100)                        |
| `error`          | `string \| null`                  | `null`  | Error message to display                       |
| `helperText`     | `string`                          | -       | Helper text below drop zone                    |

### useFileUpload Hook

```typescript
const {
  files, // File[] - Current files
  uploadProgress, // number | null - Upload progress
  error, // string | null - Error message
  isUploading, // boolean - Upload status
  addFiles, // (files: File | File[]) => void
  removeFile, // (index: number) => void
  clearFiles, // () => void
  uploadFiles, // (url: string, options?: UploadOptions) => Promise<any>
  uploadSingleFile, // (file: File, url: string, options?: UploadOptions) => Promise<any>
  setError, // (error: string | null) => void
} = useFileUpload();
```

## Integration Examples

### 1. User Profile Avatar Upload

```jsx
// In MultiStepUserForm.jsx
const handleAvatarSelect = (file) => {
  updateData({ avatar: file });
  const reader = new FileReader();
  reader.onload = (e) => setAvatarPreview(e.target.result);
  reader.readAsDataURL(file);
};

<DragDropUpload
  onFileSelect={handleAvatarSelect}
  onFileRemove={handleAvatarRemove}
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  maxFiles={1}
  files={data.avatar ? [data.avatar] : []}
  showPreview={false}
  helperText="Upload a profile picture (JPG, PNG, GIF, WebP)">
  <Camera className="h-8 w-8 mb-3 text-muted-foreground" />
  <div className="space-y-2">
    <p className="text-sm font-medium">Drag & drop a profile picture here</p>
    <p className="text-xs text-muted-foreground">
      Recommended: Square image, max 5MB
    </p>
  </div>
</DragDropUpload>;
```

### 2. Question Image Upload

```jsx
// In MultiStepQuestionForm.jsx
const handleImageSelect = (file) => {
  updateData({ imageFile: file });
  const reader = new FileReader();
  reader.onload = (e) => setImagePreview(e.target.result);
  reader.readAsDataURL(file);
};

<DragDropUpload
  onFileSelect={handleImageSelect}
  onFileRemove={handleImageRemove}
  accept="image/*"
  maxSize={5 * 1024 * 1024}
  maxFiles={1}
  files={data.imageFile ? [data.imageFile] : []}
  showPreview={false}
  helperText="Upload an image to accompany your question">
  <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
  <div className="space-y-2">
    <p className="text-sm font-medium">Drag & drop an image here</p>
    <p className="text-xs text-muted-foreground">
      Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
    </p>
  </div>
</DragDropUpload>;
```

### 3. CSV Import for Users

```jsx
// In Users.jsx
const {
  files: importFiles,
  addFiles: addImportFiles,
  removeFile: removeImportFile,
  clearFiles: clearImportFiles,
  uploadProgress,
  error: uploadError,
  uploadSingleFile,
} = useFileUpload();

const handleImport = async () => {
  if (importFiles.length === 0) return;

  try {
    const file = importFiles[0];
    const result = await uploadSingleFile(
      file,
      `${import.meta.env.VITE_API_URL}/users/import/csv`,
      { fileFieldName: "file" },
    );
    toast.success(result.message);
    clearImportFiles();
    loadUsers();
  } catch (error) {
    toast.error(error.message);
  }
};

<DragDropUpload
  onFileSelect={addImportFiles}
  onFileRemove={removeImportFile}
  accept=".csv,.xlsx,.xls"
  maxSize={5 * 1024 * 1024}
  maxFiles={1}
  files={importFiles}
  uploadProgress={uploadProgress}
  error={uploadError}
  helperText="Drag & drop your CSV file here or click to browse">
  <FileSpreadsheet className="h-12 w-12 mb-4 text-muted-foreground" />
  <div className="space-y-2">
    <p className="text-sm font-medium">Drop your CSV file here</p>
    <p className="text-xs text-muted-foreground">
      Supported formats: CSV, XLSX, XLS (Max 5MB)
    </p>
  </div>
</DragDropUpload>;
```

## Styling and Customization

### CSS Classes

The component uses Tailwind CSS classes and can be customized through:

- `className` prop for additional styling
- CSS custom properties for theme colors
- Conditional classes based on state (drag over, error, disabled)

### Custom Content

Use the `children` prop to provide custom drop zone content:

```jsx
<DragDropUpload {...props}>
  <CustomIcon className="h-12 w-12 mb-4" />
  <div className="space-y-2">
    <h3 className="font-medium">Custom Title</h3>
    <p className="text-sm text-muted-foreground">Custom description</p>
  </div>
</DragDropUpload>
```

## File Validation

### Supported Validation

1. **File Type**: MIME types and file extensions
2. **File Size**: Maximum size per file
3. **File Count**: Maximum number of files
4. **Custom Validation**: Extend through validation callbacks

### Validation Examples

```jsx
// Image files only
accept = "image/*";

// Specific image types
accept = "image/jpeg,image/png,image/gif";

// Document files
accept = ".pdf,.doc,.docx,.txt";

// Spreadsheet files
accept = ".csv,.xlsx,.xls";

// Multiple types
accept = "image/*,.pdf,.doc,.docx";
```

## Error Handling

### Built-in Error Messages

- File size exceeded
- Invalid file type
- Too many files
- Upload failures

### Custom Error Handling

```jsx
const handleFileSelect = (files) => {
  try {
    // Custom validation
    if (customValidation(files)) {
      setFiles(files);
    } else {
      setError("Custom validation failed");
    }
  } catch (error) {
    setError(error.message);
  }
};
```

## Performance Considerations

### Memory Management

- Object URLs are automatically revoked
- File readers are properly cleaned up
- Large file handling is optimized

### Best Practices

1. **File Size Limits**: Set appropriate limits for your use case
2. **File Type Restrictions**: Limit to necessary file types
3. **Progress Feedback**: Always show progress for large uploads
4. **Error Handling**: Provide clear error messages
5. **Accessibility**: Include proper ARIA labels and keyboard support

## Browser Support

- **Modern Browsers**: Full support for drag-and-drop
- **Legacy Browsers**: Graceful fallback to file input
- **Mobile Devices**: Touch-friendly interface
- **Screen Readers**: Full accessibility support

## Demo and Testing

Visit the `/drag-drop-demo` page to see all features in action:

- Image upload with preview
- Document upload with progress
- CSV import simulation
- Multiple file handling
- Integration examples

## Troubleshooting

### Common Issues

1. **Files not uploading**: Check network requests and API endpoints
2. **Validation errors**: Verify file types and sizes
3. **Progress not showing**: Ensure uploadProgress prop is passed
4. **Styling issues**: Check Tailwind CSS classes and custom styles

### Debug Mode

Enable debug logging by setting:

```javascript
localStorage.setItem("debug-file-upload", "true");
```

This will log file operations and validation steps to the console.
