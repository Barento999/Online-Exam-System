import { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { SortableTableHead } from "@/components/ui/sortable-table-head";
import { TablePagination } from "@/components/ui/table-pagination";
import { useTableSort } from "@/hooks/useTableSort";
import { usePagination } from "@/hooks/usePagination";
import { enrollmentsApi, coursesApi, usersApi } from "@/services/api";
import { Trash2, UserPlus, Search, X, Loader2 } from "lucide-react";
import { getEnrollmentStatusVariant } from "@/utils/badgeUtils";
import toast from "react-hot-toast";

export const Enrollments = () => {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    enrollmentId: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
  });

  // Filters
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filterCourse !== "all") count++;
    if (filterStatus !== "all") count++;
    return count;
  }, [filterCourse, filterStatus]);

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterCourse("all");
    setFilterStatus("all");
  };

  // Filter data
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enrollment) => {
      const matchesSearch =
        !searchTerm ||
        enrollment.studentId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.studentId?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        enrollment.courseId?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesCourse =
        filterCourse === "all" || enrollment.courseId?._id === filterCourse;

      const matchesStatus =
        filterStatus === "all" || enrollment.status === filterStatus;

      return matchesSearch && matchesCourse && matchesStatus;
    });
  }, [enrollments, searchTerm, filterCourse, filterStatus]);

  // Sorting
  const { sortedData, sortField, sortDirection, handleSort } = useTableSort(
    filteredEnrollments,
    "enrolledAt",
    "desc",
  );

  // Pagination
  const {
    paginatedData,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    startIndex,
    endIndex,
    goToPage,
    changePageSize,
    hasNextPage,
    hasPreviousPage,
  } = usePagination(sortedData, 10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [enrollmentsRes, coursesRes, usersRes] = await Promise.all([
        enrollmentsApi.getAll(),
        coursesApi.getAll(),
        user?.role === "admin"
          ? usersApi.getAll()
          : Promise.resolve({ data: { users: [] } }),
      ]);

      setEnrollments(enrollmentsRes.data.enrollments || enrollmentsRes.data);
      setCourses(coursesRes.data.courses || coursesRes.data);

      if (user?.role === "admin") {
        const usersData = usersRes.data.users || usersRes.data;
        setStudents(usersData.filter((u) => u.role === "student"));
      }
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await enrollmentsApi.enroll(formData.studentId, formData.courseId);
      toast.success("Student enrolled successfully");
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await enrollmentsApi.delete(deleteDialog.enrollmentId);
      toast.success("Enrollment removed successfully");
      setDeleteDialog({ open: false, enrollmentId: null });
      loadData();
    } catch (error) {
      toast.error("Failed to remove enrollment");
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentId: "",
      courseId: "",
    });
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
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-semibold">
              {user?.role === "student"
                ? "My Enrollments"
                : "Enrollments Management"}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === "student"
                ? "View your course enrollments"
                : "Manage student course enrollments"}
            </p>
          </div>
          <TableSkeleton rows={5} columns={4} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">
              {user?.role === "student"
                ? "My Enrollments"
                : "Enrollments Management"}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === "student"
                ? "View your course enrollments"
                : "Manage student course enrollments"}
            </p>
          </div>
          {user?.role !== "student" && (
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <UserPlus className="mr-2 h-4 w-4" />
                  Enroll Student
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Enroll Student in Course</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="student">Student</Label>
                    <Select
                      value={formData.studentId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, studentId: value })
                      }
                      required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a student" />
                      </SelectTrigger>
                      <SelectContent>
                        {students.map((student) => (
                          <SelectItem
                            key={student._id}
                            value={student._id.toString()}>
                            {student.name} ({student.email})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="course">Course</Label>
                    <Select
                      value={formData.courseId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, courseId: value })
                      }
                      required>
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
                  <div className="flex flex-col-reverse sm:flex-row justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => handleDialogClose(false)}
                      disabled={submitting}
                      className="w-full sm:w-auto">
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="w-full sm:w-auto">
                      {submitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Enrolling...
                        </>
                      ) : (
                        "Enroll"
                      )}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by student name, email, or course..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterCourse} onValueChange={setFilterCourse}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="All Courses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    {courses.map((course) => (
                      <SelectItem key={course._id} value={course._id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="dropped">Dropped</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {activeFiltersCount > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {activeFiltersCount} filter
                    {activeFiltersCount > 1 ? "s" : ""} active
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClearFilters}
                    className="h-8">
                    <X className="h-4 w-4 mr-1" />
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {sortedData.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                {enrollments.length === 0 ? (
                  <EmptyState
                    illustration="courses"
                    title={
                      user?.role === "student"
                        ? "No enrollments yet"
                        : "No enrollments yet"
                    }
                    description={
                      user?.role === "student"
                        ? "You are not enrolled in any courses yet. Contact your administrator to get enrolled in courses."
                        : "Start enrolling students in courses to track their progress and manage their learning journey."
                    }
                    action={
                      user?.role !== "student"
                        ? () => setIsDialogOpen(true)
                        : undefined
                    }
                    actionLabel={
                      user?.role !== "student"
                        ? "Create First Enrollment"
                        : undefined
                    }
                  />
                ) : (
                  <EmptyState
                    illustration="courses"
                    title="No enrollments found"
                    description="No enrollments match your current filters. Try adjusting your search or filter criteria."
                  />
                )}
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      {user?.role !== "student" && (
                        <SortableTableHead
                          field="studentId.name"
                          label="Student"
                          sortField={sortField}
                          sortDirection={sortDirection}
                          onSort={handleSort}
                          className="min-w-[180px]"
                        />
                      )}
                      <SortableTableHead
                        field="courseId.name"
                        label="Course"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="min-w-[150px]"
                      />
                      <TableHead className="min-w-[120px]">Teacher</TableHead>
                      <SortableTableHead
                        field="enrolledAt"
                        label="Enrolled Date"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="min-w-[120px]"
                      />
                      <SortableTableHead
                        field="status"
                        label="Status"
                        sortField={sortField}
                        sortDirection={sortDirection}
                        onSort={handleSort}
                        className="min-w-[100px]"
                      />
                      {user?.role !== "student" && (
                        <TableHead className="text-right min-w-[80px]">
                          Actions
                        </TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedData.map((enrollment) => (
                      <TableRow key={enrollment._id}>
                        {user?.role !== "student" && (
                          <TableCell className="min-w-[180px]">
                            <div>
                              <div
                                className="font-medium truncate max-w-[160px]"
                                title={enrollment.studentId?.name}>
                                {enrollment.studentId?.name}
                              </div>
                              <div
                                className="text-sm text-muted-foreground truncate max-w-[160px]"
                                title={enrollment.studentId?.email}>
                                {enrollment.studentId?.email}
                              </div>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="min-w-[150px]">
                          <div
                            className="truncate max-w-[200px]"
                            title={enrollment.courseId?.name}>
                            {enrollment.courseId?.name}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div
                            className="truncate max-w-[150px]"
                            title={enrollment.courseId?.teacherName}>
                            {enrollment.courseId?.teacherName}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[120px] whitespace-nowrap">
                          {new Date(enrollment.enrolledAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <Badge
                            variant={getEnrollmentStatusVariant(
                              enrollment.status,
                            )}
                            className="whitespace-nowrap">
                            {enrollment.status}
                          </Badge>
                        </TableCell>
                        {user?.role !== "student" && (
                          <TableCell className="text-right min-w-[80px]">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0"
                              title="Remove enrollment"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  enrollmentId: enrollment._id,
                                })
                              }>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
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
              </>
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Remove Enrollment"
          description="Are you sure you want to remove this enrollment? The student will lose access to this course."
          onConfirm={handleDelete}
          loading={deleting}
        />
      </div>
    </Layout>
  );
};
