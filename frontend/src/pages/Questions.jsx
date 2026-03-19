import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnifiedTextEditor } from "@/components/ui/unified-text-editor";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAdvancedFilter } from "@/hooks/useAdvancedFilter";
import { useTableSort } from "@/hooks/useTableSort";
import { usePagination } from "@/hooks/usePagination";
import { AdvancedTableFilter } from "@/components/ui/advanced-table-filter";
import { TablePagination } from "@/components/ui/table-pagination";
import { parseMarkdown } from "@/utils/markdownParser";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Loader } from "@/components/common/Loader";
import { MultiStepQuestionForm } from "@/components/forms/MultiStepQuestionForm";
import { questionsApi, examsApi } from "@/services/api";
import { usePageNotifications } from "@/hooks/usePageNotifications";
import {
  Plus,
  Pencil,
  Trash2,
  Filter,
  Upload,
  Download,
  HelpCircle,
  FileSpreadsheet,
} from "lucide-react";
import toast from "react-hot-toast";

export const Questions = () => {
  // Clear notifications when user visits this page
  usePageNotifications("/questions");

  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMultiStepOpen, setIsMultiStepOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    questionId: null,
  });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [formData, setFormData] = useState({
    examId: "",
    questionText: "",
    optionA: "",
    optionB: "",
    optionC: "",
    optionD: "",
    correctAnswer: "A",
    marks: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploadDialog, setUploadDialog] = useState(false);
  const [uploadExamId, setUploadExamId] = useState("");
  const {
    files: uploadFiles,
    addFiles: addUploadFiles,
    removeFile: removeUploadFile,
    clearFiles: clearUploadFiles,
    uploadProgress,
    error: uploadError,
    uploadSingleFile,
  } = useFileUpload();

  useEffect(() => {
    loadData();
  }, []);

  // Advanced filtering configuration
  const filterConfig = [
    {
      id: "search",
      type: "search",
      searchFields: ["questionText"],
    },
    {
      id: "exam",
      type: "select",
      label: "Exam",
      field: "examId._id",
      options: exams.map((exam) => ({
        value: exam._id.toString(),
        label: exam.title,
      })),
    },
    {
      id: "marks",
      type: "number-range",
      label: "Marks",
      field: "marks",
    },
  ];

  const {
    filters,
    filteredData: filteredQuestions,
    handleFilterChange,
    handleClearFilters,
    activeFiltersCount,
  } = useAdvancedFilter(questions, filterConfig);

  // Sorting
  const {
    sortedData: sortedAndFilteredQuestions,
    sortField,
    sortDirection,
    handleSort,
  } = useTableSort(filteredQuestions, "marks", "desc");

  // Pagination
  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startIndex,
    endIndex,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(sortedAndFilteredQuestions, 10);

  const loadData = async () => {
    try {
      const [questionsRes, examsRes] = await Promise.all([
        questionsApi.getAll(),
        examsApi.getAll(),
      ]);
      setQuestions(questionsRes.data.questions || questionsRes.data);
      setExams(examsRes.data.exams || examsRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleMultiStepSubmit = async (questionData) => {
    try {
      console.log("Question data received:", questionData);

      const formDataToSend = new FormData();

      // Only send fields that backend expects
      formDataToSend.append("examId", questionData.examId);
      formDataToSend.append("questionText", questionData.questionText || "");
      formDataToSend.append("marks", questionData.marks || 1);

      // Handle different question types
      if (questionData.type === "true-false") {
        // For true/false questions, create options A=True, B=False
        formDataToSend.append("optionA", "True");
        formDataToSend.append("optionB", "False");
        formDataToSend.append("optionC", "Not applicable");
        formDataToSend.append("optionD", "Not applicable");

        // Convert boolean to letter
        const letter = questionData.correctAnswer === true ? "A" : "B";
        formDataToSend.append("correctAnswer", letter);
        console.log(
          `True/False: correctAnswer=${questionData.correctAnswer} -> ${letter}`,
        );
      } else if (
        questionData.type === "multiple-choice" &&
        Array.isArray(questionData.options)
      ) {
        // Handle options array for multiple choice
        formDataToSend.append("optionA", questionData.options[0] || "");
        formDataToSend.append("optionB", questionData.options[1] || "");
        formDataToSend.append("optionC", questionData.options[2] || "");
        formDataToSend.append("optionD", questionData.options[3] || "");

        // Handle correctAnswer - convert index to letter
        if (typeof questionData.correctAnswer === "number") {
          const letter = String.fromCharCode(65 + questionData.correctAnswer);
          formDataToSend.append("correctAnswer", letter);
          console.log(
            `Multiple choice: correctAnswer index ${questionData.correctAnswer} -> ${letter}`,
          );
        } else if (questionData.correctAnswer) {
          formDataToSend.append("correctAnswer", questionData.correctAnswer);
        }
      } else {
        // For short-answer and essay, backend still requires 4 options
        formDataToSend.append("optionA", "Text answer required");
        formDataToSend.append("optionB", "Text answer required");
        formDataToSend.append("optionC", "Text answer required");
        formDataToSend.append("optionD", "Text answer required");
        formDataToSend.append("correctAnswer", "A");
      }

      // Handle image file
      if (questionData.imageFile) {
        formDataToSend.append("image", questionData.imageFile);
      }

      // Log what's being sent
      console.log("FormData contents:");
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      if (editingQuestion) {
        await questionsApi.update(editingQuestion._id, formDataToSend);
        toast.success("Question updated successfully");
      } else {
        await questionsApi.create(formDataToSend);
        toast.success("Question created successfully");
      }
      setIsMultiStepOpen(false);
      setEditingQuestion(null);
      loadData();
    } catch (error) {
      console.error("Question submission error:", error);
      console.error("Error response:", error.response?.data);
      toast.error(
        error.response?.data?.message || error.message || "Operation failed",
      );
    }
  };

  const handleMultiStepCancel = () => {
    setIsMultiStepOpen(false);
    setEditingQuestion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("examId", formData.examId);
      formDataToSend.append("questionText", formData.questionText);
      formDataToSend.append("optionA", formData.optionA);
      formDataToSend.append("optionB", formData.optionB);
      formDataToSend.append("optionC", formData.optionC);
      formDataToSend.append("optionD", formData.optionD);
      formDataToSend.append("correctAnswer", formData.correctAnswer);
      formDataToSend.append("marks", formData.marks);

      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      if (editingQuestion) {
        await questionsApi.update(editingQuestion._id, formDataToSend);
        toast.success("Question updated successfully");
      } else {
        await questionsApi.create(formDataToSend);
        toast.success("Question created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      examId: question.examId.toString(),
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      marks: question.marks.toString(),
    });
    if (question.imageUrl) {
      setImagePreview(
        `${import.meta.env.VITE_API_URL.replace("/api", "")}${question.imageUrl}`,
      );
    }
    setIsDialogOpen(true);
  };

  const handleMultiStepEdit = (question) => {
    setEditingQuestion(question);
    setIsMultiStepOpen(true);
  };

  const handleDelete = async () => {
    try {
      await questionsApi.delete(deleteDialog.questionId);
      toast.success("Question deleted successfully");
      setDeleteDialog({ open: false, questionId: null });
      loadData();
    } catch (error) {
      toast.error("Failed to delete question");
    }
  };

  const resetForm = () => {
    setFormData({
      examId: "",
      questionText: "",
      optionA: "",
      optionB: "",
      optionC: "",
      optionD: "",
      correctAnswer: "A",
      marks: "",
    });
    setEditingQuestion(null);
    setImageFile(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleBulkUpload = async () => {
    if (uploadFiles.length === 0 || !uploadExamId) {
      toast.error("Please select a file and exam");
      return;
    }

    try {
      const file = uploadFiles[0];
      const result = await uploadSingleFile(
        file,
        `${import.meta.env.VITE_API_URL}/questions/upload`,
        {
          fileFieldName: "file",
          additionalFields: {
            examId: uploadExamId,
          },
        },
      );

      toast.success(result.message || "Questions uploaded successfully");
      setUploadDialog(false);
      clearUploadFiles();
      setUploadExamId("");
      loadData();
    } catch (error) {
      toast.error(error.message || "Failed to upload file");
    }
  };

  const downloadTemplate = () => {
    // Create CSV template
    const template = `questionText,optionA,optionB,optionC,optionD,correctAnswer,marks
"What is 2+2?","3","4","5","6","B","1"
"What is the capital of France?","London","Berlin","Paris","Madrid","C","1"
"Which planet is closest to the sun?","Venus","Mercury","Earth","Mars","B","1"`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "questions_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  const handleDialogClose = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Question Bank</h1>
            <p className="text-muted-foreground">Manage exam questions</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={uploadDialog} onOpenChange={setUploadDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Bulk Upload
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Upload Questions from File</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Select Exam</Label>
                    <Select
                      value={uploadExamId}
                      onValueChange={setUploadExamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {exams.map((exam) => (
                          <SelectItem
                            key={exam._id}
                            value={exam._id.toString()}>
                            {exam.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label>Upload File (CSV or Excel)</Label>
                    <DragDropUpload
                      onFileSelect={addUploadFiles}
                      onFileRemove={removeUploadFile}
                      accept=".csv,.xlsx,.xls"
                      maxSize={10 * 1024 * 1024} // 10MB
                      maxFiles={1}
                      files={uploadFiles}
                      uploadProgress={uploadProgress}
                      error={uploadError}
                      helperText="Drag & drop your questions file here or click to browse">
                      <FileSpreadsheet className="h-12 w-12 mb-4 text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Drop your questions file here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: CSV, XLSX, XLS (Max 10MB)
                        </p>
                      </div>
                    </DragDropUpload>
                  </div>
                  <div className="bg-muted p-4 rounded">
                    <p className="text-sm font-medium mb-2">File Format:</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Your file should have these columns:
                    </p>
                    <code className="text-xs block bg-background p-2 rounded">
                      questionText, optionA, optionB, optionC, optionD,
                      correctAnswer, marks
                    </code>
                    <Button
                      type="button"
                      variant="link"
                      size="sm"
                      className="mt-2 p-0 h-auto"
                      onClick={downloadTemplate}>
                      <Download className="mr-1 h-3 w-3" />
                      Download Template
                    </Button>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setUploadDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleBulkUpload}
                      disabled={uploadFiles.length === 0 || !uploadExamId}>
                      Upload
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => setIsMultiStepOpen(true)}>
              <HelpCircle className="mr-2 h-4 w-4" />
              Create Question (Advanced)
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Quick Add Question
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingQuestion ? "Edit Question" : "Add New Question"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="exam">Exam</Label>
                    <Select
                      value={formData.examId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, examId: value })
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an exam" />
                      </SelectTrigger>
                      <SelectContent>
                        {exams.map((exam) => (
                          <SelectItem
                            key={exam._id}
                            value={exam._id.toString()}>
                            {exam.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <UnifiedTextEditor
                      value={formData.questionText}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          questionText: value,
                        })
                      }
                      placeholder="Enter your question... (Use markdown: **bold**, *italic*)"
                      minHeight="120px"
                      showWordCount={true}
                      showToolbar={true}
                      showPreview={true}
                      label="Question Text"
                    />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label htmlFor="image">Question Image (Optional)</Label>
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="cursor-pointer"
                    />
                    <p className="text-xs text-muted-foreground">
                      Max size: 5MB. Supported: JPG, PNG, GIF, WebP
                    </p>
                    {imagePreview && (
                      <div className="relative mt-2">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-w-full h-auto max-h-48 rounded border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={removeImage}>
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="optionA">Option A</Label>
                      <Input
                        id="optionA"
                        value={formData.optionA}
                        onChange={(e) =>
                          setFormData({ ...formData, optionA: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="optionB">Option B</Label>
                      <Input
                        id="optionB"
                        value={formData.optionB}
                        onChange={(e) =>
                          setFormData({ ...formData, optionB: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="optionC">Option C</Label>
                      <Input
                        id="optionC"
                        value={formData.optionC}
                        onChange={(e) =>
                          setFormData({ ...formData, optionC: e.target.value })
                        }
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="optionD">Option D</Label>
                      <Input
                        id="optionD"
                        value={formData.optionD}
                        onChange={(e) =>
                          setFormData({ ...formData, optionD: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="correctAnswer">Correct Answer</Label>
                      <Select
                        value={formData.correctAnswer}
                        onValueChange={(value) =>
                          setFormData({ ...formData, correctAnswer: value })
                        }>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">A</SelectItem>
                          <SelectItem value="B">B</SelectItem>
                          <SelectItem value="C">C</SelectItem>
                          <SelectItem value="D">D</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="marks">Marks</Label>
                      <Input
                        id="marks"
                        type="number"
                        value={formData.marks}
                        onChange={(e) =>
                          setFormData({ ...formData, marks: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDialogClose(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">
                      {editingQuestion ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <AdvancedTableFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                activeFiltersCount={activeFiltersCount}
                searchPlaceholder="Search questions..."
                className="flex-1"
              />
              <div className="flex items-center gap-2">
                <Label className="text-sm text-muted-foreground">
                  Sort by:
                </Label>
                <Select
                  value={sortField || "marks"}
                  onValueChange={(value) => handleSort(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="marks">Marks</SelectItem>
                    <SelectItem value="questionText">Question</SelectItem>
                    <SelectItem value="correctAnswer">Answer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {paginatedData.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No questions found
                </div>
              ) : (
                paginatedData.map((question, index) => {
                  // Handle both populated and non-populated examId
                  const examId =
                    typeof question.examId === "object"
                      ? question.examId?._id
                      : question.examId;
                  const examTitle =
                    typeof question.examId === "object"
                      ? question.examId?.title
                      : exams.find((e) => e._id === examId)?.title;

                  return (
                    <Card key={question._id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">
                                Q{startIndex + index}
                              </Badge>
                              <Badge>{examTitle || "Unknown Exam"}</Badge>
                              <Badge variant="secondary">
                                {question.marks} marks
                              </Badge>
                            </div>
                            <p className="font-medium mb-4">
                              <span
                                dangerouslySetInnerHTML={{
                                  __html: parseMarkdown(question.questionText),
                                }}
                              />
                            </p>
                            <div className="grid grid-cols-2 gap-3">
                              {["A", "B", "C", "D"].map((option) => (
                                <div
                                  key={option}
                                  className={`p-3 rounded-lg border ${
                                    question.correctAnswer === option
                                      ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                                      : "bg-muted"
                                  }`}>
                                  <span className="font-medium">
                                    {option}.{" "}
                                  </span>
                                  {question[`option${option}`]}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(question)}
                              title="Quick Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMultiStepEdit(question)}
                              title="Advanced Edit">
                              <HelpCircle className="h-4 w-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  questionId: question._id,
                                })
                              }>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
            <TablePagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={pageSize}
              startIndex={startIndex}
              endIndex={endIndex}
              onPageChange={goToPage}
              onPageSizeChange={changePageSize}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
            />
          </CardContent>
        </Card>

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Delete Question"
          description="Are you sure you want to delete this question? This action cannot be undone."
          onConfirm={handleDelete}
        />

        {/* Multi-Step Question Form */}
        {isMultiStepOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-6xl min-h-screen flex items-center justify-center py-8">
              <div className="w-full">
                <MultiStepQuestionForm
                  onSubmit={handleMultiStepSubmit}
                  onCancel={handleMultiStepCancel}
                  exams={exams}
                  initialData={
                    editingQuestion
                      ? {
                          examId: editingQuestion.examId?.toString(),
                          type: "multiple-choice",
                          questionText: editingQuestion.questionText,
                          options: [
                            editingQuestion.optionA,
                            editingQuestion.optionB,
                            editingQuestion.optionC,
                            editingQuestion.optionD,
                          ],
                          correctAnswer: ["A", "B", "C", "D"].indexOf(
                            editingQuestion.correctAnswer,
                          ),
                          marks: editingQuestion.marks,
                          imageUrl: editingQuestion.imageUrl,
                        }
                      : {}
                  }
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
