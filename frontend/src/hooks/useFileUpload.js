import { useState, useCallback } from "react";

export const useFileUpload = () => {
  const [files, setFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [error, setError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const addFiles = useCallback((newFiles) => {
    setError(null);
    const fileArray = Array.isArray(newFiles) ? newFiles : [newFiles];
    setFiles((prev) => [...prev, ...fileArray]);
  }, []);

  const removeFile = useCallback((index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setError(null);
    setUploadProgress(null);
  }, []);

  const uploadFiles = useCallback(
    async (uploadUrl, options = {}) => {
      if (files.length === 0) {
        setError("No files selected");
        return null;
      }

      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const formData = new FormData();

        // Add files to FormData
        files.forEach((file, index) => {
          formData.append(options.fileFieldName || "files", file);
        });

        // Add additional fields if provided
        if (options.additionalFields) {
          Object.entries(options.additionalFields).forEach(([key, value]) => {
            formData.append(key, value);
          });
        }

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...options.headers,
          },
          // Track upload progress
          onUploadProgress: (progressEvent) => {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            setUploadProgress(progress);
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Upload failed: ${response.statusText}`,
          );
        }

        const result = await response.json();
        setUploadProgress(100);

        // Clear files after successful upload if specified
        if (options.clearAfterUpload !== false) {
          setTimeout(() => {
            clearFiles();
          }, 1000);
        }

        return result;
      } catch (err) {
        setError(err.message);
        setUploadProgress(null);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [files, clearFiles],
  );

  const uploadSingleFile = useCallback(
    async (file, uploadUrl, options = {}) => {
      setIsUploading(true);
      setUploadProgress(0);
      setError(null);

      try {
        const formData = new FormData();
        formData.append(options.fileFieldName || "file", file);

        // Add additional fields if provided
        if (options.additionalFields) {
          Object.entries(options.additionalFields).forEach(([key, value]) => {
            formData.append(key, value);
          });
        }

        const response = await fetch(uploadUrl, {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            ...options.headers,
          },
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.message || `Upload failed: ${response.statusText}`,
          );
        }

        const result = await response.json();
        setUploadProgress(100);

        setTimeout(() => {
          setUploadProgress(null);
        }, 1000);

        return result;
      } catch (err) {
        setError(err.message);
        setUploadProgress(null);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [],
  );

  return {
    files,
    uploadProgress,
    error,
    isUploading,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    uploadSingleFile,
    setError,
  };
};
