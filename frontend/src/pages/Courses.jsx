import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnifiedTextEditor } from "@/components/ui/unified-text-editor";
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
import { CardListSkeleton } from "@/components/skeletons/TableSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { coursesApi, usersApi, enrollmentsApi } from "@/services/api";
import { Plus, Pencil, Trash2, BookOpen, Users } from "lucide-react";
import toast from "react-hot-toast";

export const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    courseId: null,
  });
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teacherId: "",
  });

  useEffect(() => {
    loadData();
  }, [user?.role]);

  const loadData = async () => {
    try {
      let coursesRes;

      // Students see only enrolled courses
      if (user?.role === "student") {
        coursesRes = await enrollmentsApi.getMyCourses();
        // Backend returns courses array directly for students
        setCourses(Array.isArray(coursesRes.data) ? coursesRes.data : []);
      } else {
        // Admins and teachers see all courses
        coursesRes = await coursesApi.getAll();
        setCourses(coursesRes.data.courses || coursesRes.data);
      }

      // Only load users if admin (teachers can't access this endpoint)
      if (user?.role === "admin") {
        const usersRes = await usersApi.getAll();
        const usersData = usersRes.data.users || usersRes.data;
        setTeachers(usersData.filter((u) => u.role === "teacher"));
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
      if (editingCourse) {
        await coursesApi.update(editingCourse._id, formData);
        toast.success("Course updated successfully");
      } else {
        await coursesApi.create(formData);
        toast.success("Course created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (course) => {
    setEditingCourse(course);
    setFormData({
      name: course.name,
      description: course.description,
      teacherId: course.teacherId.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await coursesApi.delete(deleteDialog.courseId);
      toast.success("Course deleted successfully");
      setDeleteDialog({ open: false, courseId: null });
      loadData();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      teacherId: "",
    });
    setEditingCourse(null);
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
            <h1 className="text-3xl font-semibold">Courses Management</h1>
            <p className="text-muted-foreground">Manage all courses</p>
          </div>
          <CardListSkeleton count={5} />
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
              {user?.role === "student" ? "My Courses" : "Courses Management"}
            </h1>
            <p className="text-muted-foreground">
              {user?.role === "student"
                ? "View your enrolled courses"
                : "Manage all courses in the system"}
            </p>
          </div>
          {user?.role !== "student" && (
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button className="w-full sm:w-auto">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Course
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>
                    {editingCourse ? "Edit Course" : "Add New Course"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Course Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <UnifiedTextEditor
                      value={formData.description}
                      onChange={(value) =>
                        setFormData({ ...formData, description: value })
                      }
                      placeholder="Enter course description... (Use markdown: **bold**, *italic*)"
                      minHeight="120px"
                      showWordCount={true}
                      showToolbar={true}
                      showPreview={true}
                      label="Description"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="teacher">Assigned Teacher</Label>
                    <Select
                      value={formData.teacherId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, teacherId: value })
                      }>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a teacher" />
                      </SelectTrigger>
                      <SelectContent>
                        {teachers.map((teacher) => (
                          <SelectItem
                            key={teacher._id}
                            value={teacher._id.toString()}>
                            {teacher.name}
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
                      {editingCourse ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.length === 0 ? (
            <Card className="col-span-full">
              <CardContent className="flex items-center justify-center h-96 p-0">
                <EmptyState
                  illustration="courses"
                  title={
                    user?.role === "student"
                      ? "No enrolled courses"
                      : "No courses yet"
                  }
                  description={
                    user?.role === "student"
                      ? "You are not enrolled in any courses yet. Contact your administrator to get enrolled."
                      : "Create your first course to organize your exams and track student progress. Courses help you structure your curriculum."
                  }
                  action={
                    user?.role !== "student"
                      ? () => setIsDialogOpen(true)
                      : undefined
                  }
                  actionLabel={
                    user?.role !== "student" ? "Create First Course" : undefined
                  }
                />
              </CardContent>
            </Card>
          ) : (
            courses.map((course) => (
              <Card key={course._id} className="flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex flex-col sm:flex-row items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">
                          {course.name}
                        </CardTitle>
                      </div>
                    </div>
                    {user?.role !== "student" && (
                      <div className="flex gap-1 self-end sm:self-start">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(course)}
                          className="h-8 w-8 p-0"
                          title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setDeleteDialog({
                              open: true,
                              courseId: course._id,
                            })
                          }
                          className="h-8 w-8 p-0"
                          title="Delete">
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {course.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="text-muted-foreground flex-shrink-0">
                        Teacher:
                      </span>
                      <span className="font-medium truncate text-right">
                        {course.teacherName}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Students:</span>
                      <Badge variant="secondary" className="whitespace-nowrap">
                        <Users className="h-3 w-3 mr-1" />
                        {course.studentsCount}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm gap-2">
                      <span className="text-muted-foreground flex-shrink-0">
                        Created:
                      </span>
                      <span className="truncate text-right">
                        {course.createdAt}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Delete Course"
          description="Are you sure you want to delete this course? This action cannot be undone."
          onConfirm={handleDelete}
        />
      </div>
    </Layout>
  );
};
