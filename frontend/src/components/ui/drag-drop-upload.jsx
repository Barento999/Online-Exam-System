import { useState, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Upload,
  X,
  File,
  Image,
  FileText,
  FileSpreadsheet,
  AlertCircle,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const getFileIcon = (fileType) => {
  if (fileType.startsWith("image/")) return Image;
  if (
    fileType.includes("csv") ||
    fileType.includes("excel") ||
    fileType.includes("spreadsheet")
  )
    return FileSpreadsheet;
  if (fileType.includes("text")) return FileText;
  return File;
};

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const DragDropUpload = ({
  onFileSelect,
  onFileRemove,
  accept = "*/*",
  maxSize = 10 * 1024 * 1024, // 10MB default
  maxFiles = 1,
  files = [],
  disabled = false,
  className = "",
  children,
  showPreview = true,
  uploadProgress = null,
  error = null,
  helperText = null,
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const validateFile = useCallback(
    (file) => {
      // Check file size
      if (file.size > maxSize) {
        return `File size must be less than ${formatFileSize(maxSize)}`;
      }

      // Check file type if accept is specified and not wildcard
      if (accept !== "*/*") {
        const acceptedTypes = accept.split(",").map((type) => type.trim());
        const fileExtension = "." + file.name.split(".").pop().toLowerCase();
        const mimeType = file.type;

        const isAccepted = acceptedTypes.some((acceptedType) => {
          if (acceptedType.startsWith(".")) {
            return fileExtension === acceptedType.toLowerCase();
          }
          if (acceptedType.includes("*")) {
            const baseType = acceptedType.split("/")[0];
            return mimeType.startsWith(baseType);
          }
          return mimeType === acceptedType;
        });

        if (!isAccepted) {
          return `File type not supported. Accepted types: ${accept}`;
        }
      }

      return null;
    },
    [accept, maxSize],
  );

  const handleFiles = useCallback(
    (newFiles) => {
      if (disabled) return;

      const fileArray = Array.from(newFiles);
      const validFiles = [];
      const errors = [];

      // Check max files limit
      if (files.length + fileArray.length > maxFiles) {
        errors.push(`Maximum ${maxFiles} file(s) allowed`);
        return;
      }

      fileArray.forEach((file) => {
        const error = validateFile(file);
        if (error) {
          errors.push(`${file.name}: ${error}`);
        } else {
          validFiles.push(file);
        }
      });

      if (errors.length > 0) {
        // You might want to show these errors via a toast or callback
        console.error("File validation errors:", errors);
        return;
      }

      if (validFiles.length > 0) {
        onFileSelect(maxFiles === 1 ? validFiles[0] : validFiles);
      }
    },
    [disabled, files.length, maxFiles, validateFile, onFileSelect],
  );

  const handleDragOver = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragOver(true);
      }
    },
    [disabled],
  );

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);

      if (disabled) return;

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        handleFiles(droppedFiles);
      }
    },
    [disabled, handleFiles],
  );

  const handleFileInputChange = useCallback(
    (e) => {
      const selectedFiles = e.target.files;
      if (selectedFiles && selectedFiles.length > 0) {
        handleFiles(selectedFiles);
      }
      // Reset input value to allow selecting the same file again
      e.target.value = "";
    },
    [handleFiles],
  );

  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);

  const handleRemoveFile = useCallback(
    (index) => {
      if (onFileRemove) {
        onFileRemove(index);
      }
    },
    [onFileRemove],
  );

  const fileList = Array.isArray(files) ? files : files ? [files] : [];

  return (
    <div className={cn("space-y-4", className)}>
      {/* Drop Zone */}
      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-6 transition-colors cursor-pointer",
          isDragOver && !disabled
            ? "border-primary bg-primary/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50",
          disabled && "opacity-50 cursor-not-allowed",
          error && "border-red-500 bg-red-50 dark:bg-red-900/10",
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}>
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={maxFiles > 1}
          onChange={handleFileInputChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="flex flex-col items-center justify-center text-center">
          {children || (
            <>
              <Upload
                className={cn(
                  "h-10 w-10 mb-4",
                  isDragOver ? "text-primary" : "text-muted-foreground",
                )}
              />
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  {isDragOver
                    ? "Drop files here"
                    : "Drag & drop files here, or click to select"}
                </p>
                {helperText && (
                  <p className="text-xs text-muted-foreground">{helperText}</p>
                )}
                <div className="flex flex-wrap justify-center gap-2 text-xs text-muted-foreground">
                  {accept !== "*/*" && <span>Accepted: {accept}</span>}
                  <span>Max size: {formatFileSize(maxSize)}</span>
                  {maxFiles > 1 && <span>Max files: {maxFiles}</span>}
                </div>
              </div>
            </>
          )}
        </div>

        {uploadProgress !== null && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
            <div className="w-full max-w-xs space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* File Preview */}
      {showPreview && fileList.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Selected Files:</h4>
          <div className="space-y-2">
            {fileList.map((file, index) => {
              const FileIcon = getFileIcon(file.type);
              const isImage = file.type.startsWith("image/");

              return (
                <div
                  key={`${file.name}-${index}`}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="flex-shrink-0">
                    {isImage && file instanceof File ? (
                      <div className="w-10 h-10 rounded overflow-hidden bg-muted-foreground/10">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          className="w-full h-full object-cover"
                          onLoad={(e) => URL.revokeObjectURL(e.target.src)}
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <FileIcon className="h-5 w-5 text-primary" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">
                        {formatFileSize(file.size)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {file.type || "Unknown"}
                      </Badge>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFile(index);
                    }}
                    disabled={disabled}
                    className="flex-shrink-0">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      {!disabled && (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClick}
            className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Browse Files
          </Button>
          {fileList.length > 0 && onFileRemove && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                // Clear all files
                for (let i = fileList.length - 1; i >= 0; i--) {
                  handleRemoveFile(i);
                }
              }}
              className="flex items-center gap-2 text-red-600 hover:text-red-700">
              <X className="h-4 w-4" />
              Clear All
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
