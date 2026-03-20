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
import { Loader } from "@/components/common/Loader";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { enrollmentsApi, coursesApi, usersApi } from "@/services/api";
import { Plus, Trash2, UserPlus } from "lucide-react";
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

  const getStatusBadge = (status) => {
    const variants = {
      active: "default",
      completed: "secondary",
      dropped: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Enrollments Management</h1>
            <p className="text-muted-foreground">
              Manage student course enrollments
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="mr-2 h-4 w-4" />
                Enroll Student
              </Button>
            </DialogTrigger>
            <DialogContent>
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
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleDialogClose(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Enroll</Button>
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
              <div className="flex items-center justify-center h-40">
                <p className="text-muted-foreground">No enrollments found</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead>Enrolled Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {enrollments.map((enrollment) => (
                    <TableRow key={enrollment._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {enrollment.studentId?.name}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {enrollment.studentId?.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{enrollment.courseId?.name}</TableCell>
                      <TableCell>{enrollment.courseId?.teacherName}</TableCell>
                      <TableCell>
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(enrollment.status)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
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
