import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdvancedFilter } from "@/hooks/useAdvancedFilter";
import { useTableSort } from "@/hooks/useTableSort";
import { usePagination } from "@/hooks/usePagination";
import { useRowSelection } from "@/hooks/useRowSelection";
import { AdvancedTableFilter } from "@/components/ui/advanced-table-filter";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import { TablePagination } from "@/components/ui/table-pagination";
import { BulkActionsBar } from "@/components/ui/bulk-actions-bar";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { usePageNotifications } from "@/hooks/usePageNotifications";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Loader } from "@/components/common/Loader";
import { MultiStepExamForm } from "@/components/forms/MultiStepExamForm";
import { examsApi, coursesApi } from "@/services/api";
import { useAuth } from "@/context/AuthContext";
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
  formatDateTimeForExport,
} from "@/utils/exportUtils";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import { Plus, Pencil, Trash2, Play, Eye, BookOpen, FileX } from "lucide-react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

export const Exams = () => {
  // Clear notifications when user visits this page
  usePageNotifications("/exams");

  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMultiStepOpen, setIsMultiStepOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    examId: null,
  });
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    courseId: "",
    duration: "",
    totalMarks: "",
    passingMarks: "",
    startTime: "",
    endTime: "",
    status: "draft",
    randomizeQuestions: false,
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  // Advanced filtering configuration
  const filterConfig = [
    {
      id: "search",
      type: "search",
      searchFields: ["title", "courseName"],
    },
    {
      id: "course",
      type: "select",
      label: "Course",
      field: "courseId._id",
      options: courses.map((course) => ({
        value: course._id.toString(),
        label: course.name,
      })),
    },
    {
      id: "status",
      type: "select",
      label: "Status",
      field: "status",
      options: [
        { value: "draft", label: "Draft" },
        { value: "published", label: "Published" },
        { value: "completed", label: "Completed" },
      ],
    },
    {
      id: "dateRange",
      type: "date-range",
      label: "Start Date",
      field: "startTime",
    },
    {
      id: "marksRange",
      type: "number-range",
      label: "Total Marks",
      field: "totalMarks",
    },
  ];

  const {
    filters,
    filteredData: filteredExams,
    handleFilterChange,
    handleClearFilters,
    activeFiltersCount,
  } = useAdvancedFilter(exams, filterConfig);

  // Sorting
  const {
    sortedData: sortedAndFilteredExams,
    sortField,
    sortDirection,
    handleSort,
  } = useTableSort(filteredExams, "startTime", "desc");

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
  } = usePagination(sortedAndFilteredExams, 5);

  // Row selection
  const {
    selectedRows,
    selectedCount,
    toggleRow,
    toggleAll,
    clearSelection,
    isSelected,
    isAllSelected,
    isSomeSelected,
    getSelectedItems,
  } = useRowSelection(paginatedData, "_id");

  // Bulk action handlers
  const handleBulkDelete = async () => {
    try {
      const selectedItems = getSelectedItems();
      await Promise.all(selectedItems.map((exam) => examsApi.delete(exam._id)));
      toast.success(`Deleted ${selectedCount} exam(s) successfully`);
      setBulkDeleteDialog(false);
      clearSelection();
      loadData();
    } catch (error) {
      toast.error("Failed to delete some exams");
    }
  };

  const handleBulkStatusChange = async (status) => {
    try {
      const selectedItems = getSelectedItems();
      await Promise.all(
        selectedItems.map((exam) =>
          examsApi.update(exam._id, { ...exam, status }),
        ),
      );
      toast.success(`Updated ${selectedCount} exam(s) to ${status}`);
      clearSelection();
      loadData();
    } catch (error) {
      toast.error("Failed to update some exams");
    }
  };

  // Export handlers
  const getExportData = () => {
    return sortedAndFilteredExams.map((exam) => ({
      title: exam.title,
      course: exam.courseName || "N/A",
      duration: `${exam.duration} min`,
      totalMarks: exam.totalMarks,
      passingMarks: exam.passingMarks,
      startTime: formatDateTimeForExport(exam.startTime),
      endTime: formatDateTimeForExport(exam.endTime),
      status: exam.status,
    }));
  };

  const exportColumns = [
    { header: "Exam Title", dataKey: "title" },
    { header: "Course", dataKey: "course" },
    { header: "Duration", dataKey: "duration" },
    { header: "Total Marks", dataKey: "totalMarks" },
    { header: "Passing Marks", dataKey: "passingMarks" },
    { header: "Start Time", dataKey: "startTime" },
    { header: "End Time", dataKey: "endTime" },
    { header: "Status", dataKey: "status" },
  ];

  const handleExportPDF = () => {
    try {
      const data = getExportData();
      exportToPDF(
        data,
        exportColumns,
        `exams_export_${Date.now()}`,
        "Exams Report",
      );
      toast.success("Exported to PDF successfully");
    } catch (error) {
      console.error("PDF export error:", error);
      toast.error("Failed to export PDF: " + error.message);
    }
  };

  const handleExportExcel = () => {
    try {
      const data = getExportData();
      exportToExcel(data, exportColumns, `exams_export_${Date.now()}`, "Exams");
      toast.success("Exported to Excel successfully");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel: " + error.message);
    }
  };

  const handleExportCSV = () => {
    try {
      const data = getExportData();
      exportToCSV(data, exportColumns, `exams_export_${Date.now()}`);
      toast.success("Exported to CSV successfully");
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("Failed to export CSV: " + error.message);
    }
  };

  const loadData = async () => {
    try {
      const [examsRes, coursesRes] = await Promise.all([
        examsApi.getAll(),
        coursesApi.getAll(),
      ]);
      setExams(examsRes.data.exams || examsRes.data);
      setCourses(coursesRes.data.courses || coursesRes.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleMultiStepSubmit = async (examData) => {
    try {
      if (editingExam) {
        await examsApi.update(editingExam._id, examData);
        toast.success("Exam updated successfully");
      } else {
        await examsApi.create(examData);
        toast.success("Exam created successfully");
      }
      setIsMultiStepOpen(false);
      setEditingExam(null);
      loadData();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleMultiStepCancel = () => {
    setIsMultiStepOpen(false);
    setEditingExam(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const examData = {
        ...formData,
        duration: parseInt(formData.duration),
        totalMarks: parseInt(formData.totalMarks),
        passingMarks: parseInt(formData.passingMarks),
      };

      if (editingExam) {
        await examsApi.update(editingExam._id, examData);
        toast.success("Exam updated successfully");
      } else {
        await examsApi.create(examData);
        toast.success("Exam created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    // Handle courseId whether it's an object or string
    const courseId =
      typeof exam.courseId === "object" ? exam.courseId._id : exam.courseId;

    setFormData({
      title: exam.title,
      courseId: courseId.toString(),
      duration: exam.duration.toString(),
      totalMarks: exam.totalMarks.toString(),
      passingMarks: exam.passingMarks.toString(),
      startTime: exam.startTime.slice(0, 16),
      endTime: exam.endTime.slice(0, 16),
      status: exam.status,
      randomizeQuestions: exam.randomizeQuestions || false,
    });
    setIsDialogOpen(true);
  };

  const handleMultiStepEdit = (exam) => {
    setEditingExam(exam);
    setIsMultiStepOpen(true);
  };

  const handleDelete = async () => {
    try {
      await examsApi.delete(deleteDialog.examId);
      toast.success("Exam deleted successfully");
      setDeleteDialog({ open: false, examId: null });
      loadData();
    } catch (error) {
      toast.error("Failed to delete exam");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      courseId: "",
      duration: "",
      totalMarks: "",
      passingMarks: "",
      startTime: "",
      endTime: "",
      status: "draft",
      randomizeQuestions: false,
    });
    setEditingExam(null);
  };

  const handleDialogClose = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      draft: "secondary",
      published: "default",
      completed: "outline",
    };
    return <Badge variant={variants[status] || "secondary"}>{status}</Badge>;
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

  const canCreateEdit = user?.role === "admin" || user?.role === "teacher";

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Exams Management</h1>
            <p className="text-muted-foreground">
              {user?.role === "student"
                ? "View and take available exams"
                : "Manage all exams"}
            </p>
          </div>
          {canCreateEdit && (
            <div className="flex gap-2">
              <ExportDropdown
                onExportPDF={handleExportPDF}
                onExportExcel={handleExportExcel}
                onExportCSV={handleExportCSV}
              />
              <Button onClick={() => setIsMultiStepOpen(true)}>
                <BookOpen className="mr-2 h-4 w-4" />
                Create Exam (Advanced)
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Quick Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editingExam ? "Edit Exam" : "Create New Exam"}
                    </DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="title">Exam Title</Label>
                        <Input
                          id="title"
                          value={formData.title}
                          onChange={(e) =>
                            setFormData({ ...formData, title: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label htmlFor="course">Course</Label>
                        <Select
                          value={formData.courseId}
                          onValueChange={(value) =>
                            setFormData({ ...formData, courseId: value })
                          }>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a course" />
                          </SelectTrigger>
                          <SelectContent>
                            {courses.map((course) => (
                              <SelectItem
                                key={course._id}
                                value={course._id.toString()}>
                                {course.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                          id="duration"
                          type="number"
                          value={formData.duration}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="totalMarks">Total Marks</Label>
                        <Input
                          id="totalMarks"
                          type="number"
                          value={formData.totalMarks}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              totalMarks: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="passingMarks">Passing Marks</Label>
                        <Input
                          id="passingMarks"
                          type="number"
                          value={formData.passingMarks}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              passingMarks: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="status">Status</Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) =>
                            setFormData({ ...formData, status: value })
                          }>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">Published</SelectItem>
                            <SelectItem value="completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="startTime">Start Time</Label>
                        <Input
                          id="startTime"
                          type="datetime-local"
                          value={formData.startTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              startTime: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="endTime">End Time</Label>
                        <Input
                          id="endTime"
                          type="datetime-local"
                          value={formData.endTime}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              endTime: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="randomize">
                              Randomize Questions
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Shuffle questions for each student to prevent
                              cheating
                            </p>
                          </div>
                          <Switch
                            id="randomize"
                            checked={formData.randomizeQuestions}
                            onCheckedChange={(checked) =>
                              setFormData({
                                ...formData,
                                randomizeQuestions: checked,
                              })
                            }
                          />
                        </div>
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
                        {editingExam ? "Update" : "Create"}
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>

        <Card>
          <CardHeader>
            <AdvancedTableFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
              searchPlaceholder="Search exams by title or course..."
            />
          </CardHeader>
          <CardContent className="p-0">
            <BulkActionsBar
              selectedCount={selectedCount}
              onClearSelection={clearSelection}
              actions={[
                {
                  label: "Delete Selected",
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: () => setBulkDeleteDialog(true),
                  variant: "destructive",
                },
                {
                  label: "Set Draft",
                  onClick: () => handleBulkStatusChange("draft"),
                  variant: "outline",
                },
                {
                  label: "Set Published",
                  onClick: () => handleBulkStatusChange("published"),
                  variant: "outline",
                },
                {
                  label: "Set Completed",
                  onClick: () => handleBulkStatusChange("completed"),
                  variant: "outline",
                },
              ]}
            />
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox
                        checked={isAllSelected}
                        onCheckedChange={toggleAll}
                        aria-label="Select all"
                        className={isSomeSelected ? "opacity-50" : ""}
                      />
                    </TableHead>
                    <SortableTableHead
                      field="title"
                      label="Exam Name"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      field="courseName"
                      label="Course"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      field="duration"
                      label="Duration"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      field="totalMarks"
                      label="Total Marks"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      field="startTime"
                      label="Start Date"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      field="status"
                      label="Status"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={8}
                        className="text-center text-muted-foreground">
                        No exams found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((exam) => (
                      <TableRow key={exam._id}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected(exam._id)}
                            onCheckedChange={() => toggleRow(exam._id)}
                            aria-label={`Select ${exam.title}`}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {exam.title}
                        </TableCell>
                        <TableCell>{exam.courseName}</TableCell>
                        <TableCell>{exam.duration} min</TableCell>
                        <TableCell>{exam.totalMarks}</TableCell>
                        <TableCell>
                          {new Date(exam.startTime).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(exam.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            {user?.role === "student" &&
                              exam.status === "published" && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/exams/${exam._id}/take`)
                                  }>
                                  <Play className="h-4 w-4 mr-1" />
                                  Take Exam
                                </Button>
                              )}
                            {canCreateEdit && (
                              <>
                                {exam.status === "published" && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() =>
                                      navigate(`/exams/${exam._id}/monitor`)
                                    }
                                    title="Monitor Live">
                                    <Eye className="h-4 w-4 text-primary" />
                                  </Button>
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleEdit(exam)}
                                  title="Quick Edit">
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleMultiStepEdit(exam)}
                                  title="Advanced Edit">
                                  <BookOpen className="h-4 w-4 text-primary" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setDeleteDialog({
                                      open: true,
                                      examId: exam._id,
                                    })
                                  }>
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
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
          title="Delete Exam"
          description="Are you sure you want to delete this exam? This action cannot be undone."
          onConfirm={handleDelete}
        />

        <ConfirmDialog
          open={bulkDeleteDialog}
          onOpenChange={setBulkDeleteDialog}
          title={`Delete ${selectedCount} Exam(s)`}
          description={`Are you sure you want to delete ${selectedCount} selected exam(s)? This action cannot be undone.`}
          onConfirm={handleBulkDelete}
        />

        {/* Multi-Step Exam Form */}
        {isMultiStepOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-6xl min-h-screen flex items-center justify-center py-8">
              <div className="w-full">
                <MultiStepExamForm
                  onSubmit={handleMultiStepSubmit}
                  onCancel={handleMultiStepCancel}
                  courses={courses}
                  initialData={
                    editingExam
                      ? {
                          title: editingExam.title,
                          description: editingExam.description,
                          courseId:
                            typeof editingExam.courseId === "object"
                              ? editingExam.courseId._id
                              : editingExam.courseId,
                          courseName:
                            typeof editingExam.courseId === "object"
                              ? editingExam.courseId.name
                              : editingExam.courseName,
                          difficulty: editingExam.difficulty,
                          duration: editingExam.duration,
                          totalMarks: editingExam.totalMarks,
                          passingMarks: editingExam.passingMarks,
                          startTime: editingExam.startTime?.slice(0, 16),
                          endTime: editingExam.endTime?.slice(0, 16),
                          randomizeQuestions: editingExam.randomizeQuestions,
                          status: editingExam.status,
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
