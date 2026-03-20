import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { useFileUpload } from "@/hooks/useFileUpload";
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
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { Loader } from "@/components/common/Loader";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { MultiStepUserForm } from "@/components/forms/MultiStepUserForm";
import { usersApi } from "@/services/api";
import { usePageNotifications } from "@/hooks/usePageNotifications";
import {
  exportToPDF,
  exportToExcel,
  exportToCSV,
  formatDateForExport,
} from "@/utils/exportUtils";
import { ExportDropdown } from "@/components/ui/export-dropdown";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Upload,
  Download,
  UserPlus,
  FileSpreadsheet,
  UserX,
  UserCheck,
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
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);
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

  // Sorting
  const {
    sortedData: sortedAndFilteredUsers,
    sortField,
    sortDirection,
    handleSort,
  } = useTableSort(filteredUsers, "name", "asc");

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
  } = usePagination(sortedAndFilteredUsers, 5);

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

  useEffect(() => {
    loadUsers();
  }, []);

  // Bulk action handlers
  const handleBulkDelete = async () => {
    try {
      const selectedItems = getSelectedItems();
      await Promise.all(selectedItems.map((user) => usersApi.delete(user._id)));
      toast.success(`Deleted ${selectedCount} user(s) successfully`);
      setBulkDeleteDialog(false);
      clearSelection();
      loadUsers();
    } catch (error) {
      toast.error("Failed to delete some users");
    }
  };

  const handleBulkStatusChange = async (status) => {
    try {
      const selectedItems = getSelectedItems();
      await Promise.all(
        selectedItems.map((user) =>
          usersApi.update(user._id, { ...user, status }),
        ),
      );
      toast.success(`Updated ${selectedCount} user(s) to ${status}`);
      clearSelection();
      loadUsers();
    } catch (error) {
      toast.error("Failed to update some users");
    }
  };

  // Export handlers
  const getExportData = () => {
    return sortedAndFilteredUsers.map((user) => ({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
      createdAt: formatDateForExport(user.createdAt),
    }));
  };

  const exportColumns = [
    { header: "Name", dataKey: "name" },
    { header: "Email", dataKey: "email" },
    { header: "Role", dataKey: "role" },
    { header: "Status", dataKey: "status" },
    { header: "Created Date", dataKey: "createdAt" },
  ];

  const handleExportPDF = () => {
    try {
      const data = getExportData();
      exportToPDF(
        data,
        exportColumns,
        `users_export_${Date.now()}`,
        "Users Report",
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
      exportToExcel(data, exportColumns, `users_export_${Date.now()}`, "Users");
      toast.success("Exported to Excel successfully");
    } catch (error) {
      console.error("Excel export error:", error);
      toast.error("Failed to export Excel: " + error.message);
    }
  };

  const handleExportCSV = () => {
    try {
      const data = getExportData();
      exportToCSV(data, exportColumns, `users_export_${Date.now()}`);
      toast.success("Exported to CSV successfully");
    } catch (error) {
      console.error("CSV export error:", error);
      toast.error("Failed to export CSV: " + error.message);
    }
  };

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
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold">Users Management</h1>
              <p className="text-muted-foreground">Manage all system users</p>
            </div>
          </div>
          <TableSkeleton rows={5} columns={5} />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold">Users Management</h1>
            <p className="text-muted-foreground">Manage all system users</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <ExportDropdown
              onExportPDF={handleExportPDF}
              onExportExcel={handleExportExcel}
              onExportCSV={handleExportCSV}
              className="w-full sm:w-auto"
            />
            <Dialog open={importDialog} onOpenChange={setImportDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
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
            <Button
              onClick={() => setIsMultiStepOpen(true)}
              className="w-full sm:w-auto">
              <UserPlus className="mr-2 h-4 w-4" />
              Create User (Advanced)
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
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
                  label: "Set Active",
                  icon: <UserCheck className="h-4 w-4" />,
                  onClick: () => handleBulkStatusChange("active"),
                  variant: "outline",
                },
                {
                  label: "Set Inactive",
                  icon: <UserX className="h-4 w-4" />,
                  onClick: () => handleBulkStatusChange("inactive"),
                  variant: "outline",
                },
              ]}
            />
            <div className="rounded-md border overflow-x-auto">
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
                      field="name"
                      label="Name"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      field="email"
                      label="Email"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <SortableTableHead
                      field="role"
                      label="Role"
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
                        colSpan={6}
                        className="text-center text-muted-foreground">
                        No users found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell>
                          <Checkbox
                            checked={isSelected(user._id)}
                            onCheckedChange={() => toggleRow(user._id)}
                            aria-label={`Select ${user.name}`}
                          />
                        </TableCell>
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
          title="Delete User"
          description="Are you sure you want to delete this user? This action cannot be undone."
          onConfirm={handleDelete}
        />

        <ConfirmDialog
          open={bulkDeleteDialog}
          onOpenChange={setBulkDeleteDialog}
          title={`Delete ${selectedCount} User(s)`}
          description={`Are you sure you want to delete ${selectedCount} selected user(s)? This action cannot be undone.`}
          onConfirm={handleBulkDelete}
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
