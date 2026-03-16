import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { useFileUpload } from "@/hooks/useFileUpload";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Upload,
  Image,
  FileText,
  FileSpreadsheet,
  Camera,
  Users,
  HelpCircle,
} from "lucide-react";
import toast from "react-hot-toast";

export const DragDropDemo = () => {
  // Image upload demo
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreview, setImagePreview] = useState(null);

  // Document upload demo
  const {
    files: docFiles,
    addFiles: addDocFiles,
    removeFile: removeDocFile,
    clearFiles: clearDocFiles,
    uploadProgress: docUploadProgress,
    error: docError,
    uploadFiles: uploadDocFiles,
  } = useFileUpload();

  // CSV upload demo
  const {
    files: csvFiles,
    addFiles: addCsvFiles,
    removeFile: removeCsvFile,
    clearFiles: clearCsvFiles,
    uploadProgress: csvUploadProgress,
    error: csvError,
    uploadSingleFile: uploadCsvFile,
  } = useFileUpload();

  // Multiple files demo
  const {
    files: multiFiles,
    addFiles: addMultiFiles,
    removeFile: removeMultiFile,
    clearFiles: clearMultiFiles,
    uploadProgress: multiUploadProgress,
    error: multiError,
  } = useFileUpload();

  const handleImageSelect = (file) => {
    setImageFiles([file]);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setImageFiles([]);
    setImagePreview(null);
  };

  const handleDocumentUpload = async () => {
    if (docFiles.length === 0) {
      toast.error("Please select files to upload");
      return;
    }

    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Documents uploaded successfully!");
      clearDocFiles();
    } catch (error) {
      toast.error("Upload failed");
    }
  };

  const handleCsvUpload = async () => {
    if (csvFiles.length === 0) {
      toast.error("Please select a CSV file");
      return;
    }

    try {
      // Simulate CSV processing
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("CSV processed successfully!");
      clearCsvFiles();
    } catch (error) {
      toast.error("CSV processing failed");
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">Drag & Drop Upload Demo</h1>
          <p className="text-muted-foreground">
            Showcase of various drag-and-drop file upload scenarios
          </p>
        </div>

        <Tabs defaultValue="images" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="csv">CSV Import</TabsTrigger>
            <TabsTrigger value="multiple">Multiple Files</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          {/* Image Upload Demo */}
          <TabsContent value="images" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="h-5 w-5" />
                  Image Upload Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Upload Profile Picture</Label>
                    <DragDropUpload
                      onFileSelect={handleImageSelect}
                      onFileRemove={handleImageRemove}
                      accept="image/*"
                      maxSize={5 * 1024 * 1024}
                      maxFiles={1}
                      files={imageFiles}
                      showPreview={false}
                      helperText="Perfect for profile pictures and avatars">
                      <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Drop your image here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          JPG, PNG, GIF, WebP (Max 5MB)
                        </p>
                      </div>
                    </DragDropUpload>
                  </div>

                  <div className="space-y-4">
                    <Label>Preview</Label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 flex items-center justify-center min-h-[200px]">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full max-h-48 rounded-lg"
                        />
                      ) : (
                        <div className="text-center text-muted-foreground">
                          <Image className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">
                            Image preview will appear here
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Document Upload Demo */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Upload Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <DragDropUpload
                  onFileSelect={addDocFiles}
                  onFileRemove={removeDocFile}
                  accept=".pdf,.doc,.docx,.txt"
                  maxSize={10 * 1024 * 1024}
                  maxFiles={5}
                  files={docFiles}
                  uploadProgress={docUploadProgress}
                  error={docError}
                  helperText="Upload documents for processing">
                  <FileText className="h-12 w-12 mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Drop your documents here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, DOC, DOCX, TXT (Max 10MB each, up to 5 files)
                    </p>
                  </div>
                </DragDropUpload>

                {docFiles.length > 0 && (
                  <div className="flex gap-2">
                    <Button onClick={handleDocumentUpload}>
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Documents
                    </Button>
                    <Button variant="outline" onClick={clearDocFiles}>
                      Clear All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CSV Import Demo */}
          <TabsContent value="csv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileSpreadsheet className="h-5 w-5" />
                  CSV Import Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <DragDropUpload
                  onFileSelect={addCsvFiles}
                  onFileRemove={removeCsvFile}
                  accept=".csv,.xlsx,.xls"
                  maxSize={5 * 1024 * 1024}
                  maxFiles={1}
                  files={csvFiles}
                  uploadProgress={csvUploadProgress}
                  error={csvError}
                  helperText="Import data from spreadsheet files">
                  <FileSpreadsheet className="h-12 w-12 mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Drop your CSV file here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      CSV, XLSX, XLS (Max 5MB)
                    </p>
                  </div>
                </DragDropUpload>

                <div className="bg-muted p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Expected CSV Format:</h4>
                  <code className="text-xs block bg-background p-2 rounded">
                    name,email,role,status
                    <br />
                    John Doe,john@example.com,student,active
                    <br />
                    Jane Smith,jane@example.com,teacher,active
                  </code>
                </div>

                {csvFiles.length > 0 && (
                  <Button onClick={handleCsvUpload}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Process CSV
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multiple Files Demo */}
          <TabsContent value="multiple" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="h-5 w-5" />
                  Multiple Files Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <DragDropUpload
                  onFileSelect={addMultiFiles}
                  onFileRemove={removeMultiFile}
                  accept="*/*"
                  maxSize={20 * 1024 * 1024}
                  maxFiles={10}
                  files={multiFiles}
                  uploadProgress={multiUploadProgress}
                  error={multiError}
                  helperText="Upload any type of files">
                  <Upload className="h-12 w-12 mb-4 text-muted-foreground" />
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      Drop multiple files here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Any file type (Max 20MB each, up to 10 files)
                    </p>
                  </div>
                </DragDropUpload>

                {multiFiles.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        {multiFiles.length} file(s) selected
                      </Badge>
                      <Button variant="outline" onClick={clearMultiFiles}>
                        Clear All
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Examples */}
          <TabsContent value="integration" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Management Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The drag-and-drop component is integrated into the Users
                    page for:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        CSV Import
                      </Badge>
                      Bulk user import from spreadsheet files
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Avatar Upload
                      </Badge>
                      Profile picture upload in multi-step user form
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HelpCircle className="h-5 w-5" />
                    Question Bank Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    The drag-and-drop component is integrated into the Questions
                    page for:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Bulk Upload
                      </Badge>
                      Import questions from CSV/Excel files
                    </li>
                    <li className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Image Upload
                      </Badge>
                      Question images in multi-step question form
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">User Experience</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Drag and drop files directly</li>
                        <li>• Click to browse files</li>
                        <li>• Real-time file validation</li>
                        <li>• Upload progress tracking</li>
                        <li>• File preview and management</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Technical Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• File type validation</li>
                        <li>• Size limit enforcement</li>
                        <li>• Multiple file support</li>
                        <li>• Error handling</li>
                        <li>• Customizable styling</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};
