import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
import { enrollmentsApi, coursesApi, usersApi } from "@/services/api";
import { Trash2, UserPlus } from "lucide-react";
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
  const [formData, setFormData] = useState({
    studentId: "",
    courseId: "",
  });

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
    try {
      await enrollmentsApi.enroll(formData.studentId, formData.courseId);
      toast.success("Student enrolled successfully");
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Enrollment failed");
    }
  };

  const handleDelete = async () => {
    try {
      await enrollmentsApi.delete(deleteDialog.enrollmentId);
      toast.success("Enrollment removed successfully");
      setDeleteDialog({ open: false, enrollmentId: null });
      loadData();
    } catch (error) {
      toast.error("Failed to remove enrollment");
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
            <h1 className="text-3xl font-semibold">Enrollments Management</h1>
            <p className="text-muted-foreground">
              Manage student course enrollments
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
            <h1 className="text-3xl font-semibold">Enrollments Management</h1>
            <p className="text-muted-foreground">
              Manage student course enrollments
            </p>
          </div>
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
                    className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button type="submit" className="w-full sm:w-auto">
                    Enroll
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Enrollments</CardTitle>
          </CardHeader>
          <CardContent>
            {enrollments.length === 0 ? (
              <div className="flex items-center justify-center h-96">
                <EmptyState
                  illustration="courses"
                  title="No enrollments yet"
                  description="Start enrolling students in courses to track their progress and manage their learning journey."
                  action={() => setIsDialogOpen(true)}
                  actionLabel="Create First Enrollment"
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[180px]">Student</TableHead>
                      <TableHead className="min-w-[150px]">Course</TableHead>
                      <TableHead className="min-w-[120px]">Teacher</TableHead>
                      <TableHead className="min-w-[120px]">
                        Enrolled Date
                      </TableHead>
                      <TableHead className="min-w-[100px]">Status</TableHead>
                      <TableHead className="text-right min-w-[80px]">
                        Actions
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enrollments.map((enrollment) => (
                      <TableRow key={enrollment._id}>
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
                            variant={
                              enrollment.status === "active"
                                ? "default"
                                : enrollment.status === "completed"
                                  ? "secondary"
                                  : "destructive"
                            }
                            className="whitespace-nowrap">
                            {enrollment.status}
                          </Badge>
                        </TableCell>
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
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Remove Enrollment"
          description="Are you sure you want to remove this enrollment? The student will lose access to this course."
          onConfirm={handleDelete}
        />
      </div>
    </Layout>
  );
};
