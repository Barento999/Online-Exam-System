import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { useFileUpload } from "@/hooks/useFileUpload";
import { useAdvancedFilter } from "@/hooks/useAdvancedFilter";
import { AdvancedTableFilter } from "@/components/ui/advanced-table-filter";
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
import { MultiStepUserForm } from "@/components/forms/MultiStepUserForm";
import { usersApi } from "@/services/api";
import { usePageNotifications } from "@/hooks/usePageNotifications";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Download,
  UserPlus,
  FileSpreadsheet,
} from "lucide-react";
import toast from "react-hot-toast";

export const Users = () => {
  // Clear notifications when user visits this page
  usePageNotifications("/users");

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMultiStepOpen, setIsMultiStepOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    userId: null,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
    status: "active",
  });
  const [importDialog, setImportDialog] = useState(false);
  const [importing, setImporting] = useState(false);
  const {
    files: importFiles,
    addFiles: addImportFiles,
    removeFile: removeImportFile,
    clearFiles: clearImportFiles,
    uploadProgress,
    error: uploadError,
    uploadSingleFile,
  } = useFileUpload();

  // Advanced filtering configuration
  const filterConfig = [
    {
      id: "search",
      type: "search",
      searchFields: ["name", "email"],
    },
    {
      id: "role",
      type: "select",
      label: "Role",
      field: "role",
      options: [
        { value: "student", label: "Student" },
        { value: "teacher", label: "Teacher" },
        { value: "admin", label: "Admin" },
      ],
    },
    {
      id: "status",
      type: "select",
      label: "Status",
      field: "status",
      options: [
        { value: "active", label: "Active" },
        { value: "inactive", label: "Inactive" },
      ],
    },
  ];

  const {
    filters,
    filteredData: filteredUsers,
    handleFilterChange,
    handleClearFilters,
    activeFiltersCount,
  } = useAdvancedFilter(users, filterConfig);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll();
      const usersData = response.data.users || response.data;
      setUsers(usersData);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleMultiStepSubmit = async (userData) => {
    try {
      if (editingUser) {
        await usersApi.update(editingUser._id, userData);
        toast.success("User updated successfully");
      } else {
        await usersApi.create(userData);
        toast.success("User created successfully");
      }
      setIsMultiStepOpen(false);
      setEditingUser(null);
      loadUsers();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleMultiStepCancel = () => {
    setIsMultiStepOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await usersApi.update(editingUser._id, formData);
        toast.success("User updated successfully");
      } else {
        await usersApi.create(formData);
        toast.success("User created successfully");
      }
      setIsDialogOpen(false);
      resetForm();
      loadUsers();
    } catch (error) {
      toast.error(error.message || "Operation failed");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role,
      status: user.status,
    });
    setIsDialogOpen(true);
  };

  const handleMultiStepEdit = (user) => {
    setEditingUser(user);
    setIsMultiStepOpen(true);
  };

  const handleDelete = async () => {
    try {
      await usersApi.delete(deleteDialog.userId);
      toast.success("User deleted successfully");
      setDeleteDialog({ open: false, userId: null });
      loadUsers();
    } catch (error) {
      toast.error("Failed to delete user");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "student",
      status: "active",
    });
    setEditingUser(null);
  };

  const handleDialogClose = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/users/export/csv`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (!response.ok) throw new Error("Export failed");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_export_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.success("Users exported successfully");
    } catch (error) {
      toast.error("Failed to export users");
    }
  };

  const handleImport = async () => {
    if (importFiles.length === 0) {
      toast.error("Please select a file");
      return;
    }

    setImporting(true);
    try {
      const file = importFiles[0];
      const result = await uploadSingleFile(
        file,
        `${import.meta.env.VITE_API_URL}/users/import/csv`,
        {
          fileFieldName: "file",
        },
      );

      toast.success(result.message || "Users imported successfully");
      setImportDialog(false);
      clearImportFiles();
      loadUsers();
    } catch (error) {
      toast.error(error.message || "Failed to import users");
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = `name,email,password,role,status
John Doe,john@example.com,password123,student,active
Jane Smith,jane@example.com,password123,teacher,active
Admin User,admin@example.com,password123,admin,active`;

    const blob = new Blob([template], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users_template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
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
            <h1 className="text-3xl font-semibold">Users Management</h1>
            <p className="text-muted-foreground">Manage all system users</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
            <Dialog open={importDialog} onOpenChange={setImportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import CSV
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Import Users from CSV</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <Label>Upload CSV File</Label>
                    <DragDropUpload
                      onFileSelect={addImportFiles}
                      onFileRemove={removeImportFile}
                      accept=".csv,.xlsx,.xls"
                      maxSize={5 * 1024 * 1024} // 5MB
                      maxFiles={1}
                      files={importFiles}
                      uploadProgress={uploadProgress}
                      error={uploadError}
                      helperText="Drag & drop your CSV file here or click to browse">
                      <FileSpreadsheet className="h-12 w-12 mb-4 text-muted-foreground" />
                      <div className="space-y-2">
                        <p className="text-sm font-medium">
                          Drop your CSV file here
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Supported formats: CSV, XLSX, XLS (Max 5MB)
                        </p>
                      </div>
                    </DragDropUpload>
                  </div>
                  <div className="bg-muted p-4 rounded">
                    <p className="text-sm font-medium mb-2">
                      Required Columns:
                    </p>
                    <code className="text-xs block bg-background p-2 rounded">
                      name, email, password, role, status
                    </code>
                    <p className="text-xs text-muted-foreground mt-2">
                      Role: admin, teacher, or student
                      <br />
                      Status: active or inactive (optional, defaults to active)
                    </p>
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
                      onClick={() => setImportDialog(false)}>
                      Cancel
                    </Button>
                    <Button
                      onClick={handleImport}
                      disabled={importing || importFiles.length === 0}>
                      {importing ? "Importing..." : "Import"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => setIsMultiStepOpen(true)}>
              <UserPlus className="mr-2 h-4 w-4" />
              Create User (Advanced)
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Quick Add User
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {editingUser ? "Edit User" : "Add New User"}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
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
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">
                      Password {editingUser && "(leave blank to keep current)"}
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      required={!editingUser}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select
                      value={formData.role}
                      onValueChange={(value) =>
                        setFormData({ ...formData, role: value })
                      }>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="student">Student</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
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
                    <Button type="submit">
                      {editingUser ? "Update" : "Create"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <AdvancedTableFilter
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              activeFiltersCount={activeFiltersCount}
              searchPlaceholder="Search users by name or email..."
            />
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active" ? "default" : "secondary"
                            }>
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              title="Quick Edit">
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMultiStepEdit(user)}
                              title="Advanced Edit">
                              <UserPlus className="h-4 w-4 text-primary" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                setDeleteDialog({
                                  open: true,
                                  userId: user._id,
                                })
                              }>
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Delete User"
          description="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleDelete}
        />

        {/* Multi-Step User Form */}
        {isMultiStepOpen && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-6xl min-h-screen flex items-center justify-center py-8">
              <div className="w-full">
                <MultiStepUserForm
                  onSubmit={handleMultiStepSubmit}
                  onCancel={handleMultiStepCancel}
                  initialData={
                    editingUser
                      ? {
                          firstName: editingUser.name?.split(" ")[0] || "",
                          lastName:
                            editingUser.name?.split(" ").slice(1).join(" ") ||
                            "",
                          email: editingUser.email,
                          role: editingUser.role,
                          status: editingUser.status,
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
