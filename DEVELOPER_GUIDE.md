# Developer Quick Reference Guide

## 🚀 Quick Start

### Running the Application

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```

### Environment Variables

**Backend (.env):**

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/exam-system
JWT_SECRET=your-secret-key
NODE_ENV=development
```

**Frontend (.env):**

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 Common Patterns

### 1. Creating a New Page with Table

```javascript
import { useState, useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { EmptyState } from "@/components/common/EmptyState";
import { useTableSort } from "@/hooks/useTableSort";
import { usePagination } from "@/hooks/usePagination";
import { useAdvancedFilter } from "@/hooks/useAdvancedFilter";

export const MyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filtering
  const filterConfig = [
    { id: "search", type: "search", searchFields: ["name", "email"] },
    {
      id: "status",
      type: "select",
      label: "Status",
      field: "status",
      options: [{ value: "active", label: "Active" }],
    },
  ];

  const {
    filteredData,
    handleFilterChange,
    handleClearFilters,
    activeFiltersCount,
  } = useAdvancedFilter(data, filterConfig);

  // Sorting
  const { sortedData, sortField, sortDirection, handleSort } = useTableSort(
    filteredData,
    "name",
    "asc",
  );

  // Pagination
  const { paginatedData, currentPage, totalPages, goToPage, changePageSize } =
    usePagination(sortedData, 10);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await api.getAll();
      setData(response.data);
    } catch (error) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <TableSkeleton rows={5} columns={4} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Card>
        <CardHeader>
          <AdvancedTableFilter
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeFiltersCount={activeFiltersCount}
          />
        </CardHeader>
        <CardContent>
          {sortedData.length === 0 ? (
            <EmptyState
              title="No items yet"
              description="Get started by creating your first item"
              action={handleCreate}
              actionLabel="Create Item"
            />
          ) : (
            <>
              <Table>{/* Table content */}</Table>
              <TablePagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={goToPage}
                onPageSizeChange={changePageSize}
              />
            </>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};
```

### 2. Form with Validation

```javascript
import { useFormValidation, validationRules } from "@/hooks/useFormValidation";
import { FormField, FormSelect } from "@/components/ui/form-field";

const MyForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });

  const validationConfig = (values) => ({
    name: [
      validationRules.required("Name is required"),
      validationRules.minLength(2, "Name must be at least 2 characters"),
    ],
    email: [
      validationRules.required("Email is required"),
      validationRules.email("Invalid email address"),
    ],
  });

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    resetForm,
  } = useFormValidation(formData, validationConfig);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll()) {
      toast.error("Please fix validation errors");
      return;
    }
    // Submit form
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormField
        label="Name"
        name="name"
        value={values.name}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        touched={touched.name}
        required
        showValidIcon
      />
      <Button type="submit">Submit</Button>
    </form>
  );
};
```

### 3. Confirmation Dialog

```javascript
import { ConfirmDialog } from "@/components/common/ConfirmDialog";

const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null });
const [deleting, setDeleting] = useState(false);

const handleDelete = async () => {
  setDeleting(true);
  try {
    await api.delete(deleteDialog.itemId);
    toast.success("Deleted successfully");
    setDeleteDialog({ open: false, itemId: null });
    loadData();
  } catch (error) {
    toast.error("Failed to delete");
  } finally {
    setDeleting(false);
  }
};

<ConfirmDialog
  open={deleteDialog.open}
  onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
  title="Delete Item"
  description="Are you sure? This action cannot be undone."
  onConfirm={handleDelete}
  loading={deleting}
  variant="destructive"
/>;
```

### 4. Status Badges

```javascript
import { Badge } from '@/components/ui/badge';
import { getUserStatusVariant, getBlueOutlineClass } from '@/utils/badgeUtils';

// Simple badge
<Badge variant={getUserStatusVariant(user.status)}>
  {user.status}
</Badge>

// Blue outline badge (for pending/upcoming)
<Badge variant="outline" className={getBlueOutlineClass()}>
  Pending
</Badge>
```

### 5. Loading States

```javascript
const [submitting, setSubmitting] = useState(false);

<Button disabled={submitting}>
  {submitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Saving...
    </>
  ) : (
    "Save"
  )}
</Button>;
```

---

## 🎨 UI Components

### Available Components

**Layout:**

- `Layout` - Main layout with sidebar and navbar
- `Sidebar` - Navigation sidebar with role-based menu
- `Navbar` - Top navigation with search and user menu
- `Breadcrumbs` - Automatic breadcrumb navigation

**Forms:**

- `FormField` - Input with validation
- `FormSelect` - Select with validation
- `FormTextarea` - Textarea with validation
- `UnifiedTextEditor` - Rich text editor with markdown

**Tables:**

- `Table` - Base table component
- `SortableTableHead` - Sortable column headers
- `TablePagination` - Pagination controls
- `AdvancedTableFilter` - Multi-filter component
- `BulkActionsBar` - Bulk action toolbar

**Feedback:**

- `EmptyState` - Empty state with illustration
- `ConfirmDialog` - Confirmation modal
- `TableSkeleton` - Loading skeleton for tables
- `Loader` - Simple loading spinner
- `toast` - Toast notifications

**UI Elements:**

- `Button` - Button with variants
- `Badge` - Status badge
- `Card` - Content card
- `Dialog` - Modal dialog
- `Select` - Dropdown select
- `Input` - Text input
- `Checkbox` - Checkbox input

---

## 🔧 Utility Hooks

### Data Management

- `useTableSort(data, defaultField, defaultDirection)` - Table sorting
- `usePagination(data, pageSize)` - Pagination logic
- `useAdvancedFilter(data, filterConfig)` - Multi-field filtering
- `useRowSelection(data, idField)` - Row selection for bulk actions

### Forms

- `useFormValidation(initialValues, validationRules)` - Form validation
- `useUnsavedChanges(isDirty, message)` - Unsaved changes warning

### Accessibility

- `useFocusManagement(shouldFocus)` - Focus management
- `useFocusTrap(isActive)` - Focus trap for modals
- `useScreenReaderAnnounce()` - Screen reader announcements
- `useKeyboardShortcuts(shortcuts, isActive)` - Keyboard shortcuts

### Other

- `useFileUpload()` - File upload with progress
- `useAuth()` - Authentication context
- `useNotificationContext()` - Notifications

---

## 🎯 Role-Based Access

### Checking User Role

```javascript
import { useAuth } from "@/context/AuthContext";

const { user } = useAuth();

// Check role
if (user?.role === "admin") {
  // Admin only code
}

// Conditional rendering
{
  user?.role !== "student" && <Button>Admin Action</Button>;
}
```

### Protected Routes

```javascript
// In routes.jsx
<ProtectedRoute allowedRoles={["admin", "teacher"]}>
  <MyPage />
</ProtectedRoute>
```

### Sidebar Menu Items

```javascript
// In Sidebar.jsx - menu items automatically filtered by role
const menuItems = [
  {
    label: "Users",
    path: "/users",
    icon: Users,
    roles: ["admin"], // Only visible to admins
  },
  // ...
];
```

---

## 📱 Responsive Design

### Breakpoints

```javascript
// Tailwind breakpoints
sm: '640px'   // Small devices
md: '768px'   // Medium devices
lg: '1024px'  // Large devices
xl: '1280px'  // Extra large devices
2xl: '1536px' // 2X large devices
```

### Common Patterns

```javascript
// Flex direction
className = "flex flex-col sm:flex-row";

// Grid columns
className = "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

// Width
className = "w-full sm:w-auto";

// Padding
className = "p-4 md:p-6";

// Text size
className = "text-sm sm:text-base";
```

---

## 🎨 Styling

### Using cn() Utility

```javascript
import { cn } from "@/lib/utils";

<div
  className={cn(
    "base-classes",
    isActive && "active-classes",
    isDisabled && "disabled-classes",
    className, // Allow prop override
  )}
/>;
```

### Theme Colors

```javascript
// Use CSS variables
bg - background;
text - foreground;
bg - primary;
text - primary - foreground;
bg - secondary;
text - secondary - foreground;
bg - destructive;
text - destructive - foreground;
bg - muted;
text - muted - foreground;
border - border;
```

---

## 🔍 API Calls

### Standard Pattern

```javascript
import { usersApi } from "@/services/api";

// GET all
const response = await usersApi.getAll();
const users = response.data.users || response.data;

// GET by ID
const response = await usersApi.getById(id);
const user = response.data;

// CREATE
const response = await usersApi.create(userData);

// UPDATE
const response = await usersApi.update(id, userData);

// DELETE
await usersApi.delete(id);
```

### Error Handling

```javascript
try {
  const response = await api.getAll();
  setData(response.data);
} catch (error) {
  toast.error(error.response?.data?.message || "Operation failed");
} finally {
  setLoading(false);
}
```

---

## 🧪 Testing Checklist

### Before Committing

- [ ] Test on mobile (responsive design)
- [ ] Test keyboard navigation (Tab, Enter, Escape)
- [ ] Test with screen reader (basic announcements)
- [ ] Test all user roles (admin, teacher, student)
- [ ] Test error states (network errors, validation)
- [ ] Test loading states (skeleton loaders)
- [ ] Test empty states (no data)
- [ ] Check console for errors/warnings
- [ ] Verify accessibility (focus indicators, ARIA labels)
- [ ] Test form validation (all fields)

---

## 📝 Code Style

### Naming Conventions

```javascript
// Components: PascalCase
const MyComponent = () => {};

// Hooks: camelCase with 'use' prefix
const useMyHook = () => {};

// Constants: UPPER_SNAKE_CASE
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// Functions: camelCase
const handleSubmit = () => {};

// Boolean variables: is/has/should prefix
const isLoading = true;
const hasError = false;
const shouldShow = true;
```

### File Organization

```
src/
├── components/
│   ├── common/       # Shared components
│   ├── layout/       # Layout components
│   ├── ui/           # UI primitives
│   └── forms/        # Form components
├── pages/            # Page components
├── hooks/            # Custom hooks
├── context/          # React contexts
├── services/         # API services
├── utils/            # Utility functions
└── styles/           # Global styles
```

---

## 🚨 Common Issues

### Issue: Form not validating

**Solution:** Ensure `validateAll()` is called before submit

### Issue: Table not sorting

**Solution:** Check that `handleSort` is passed to `SortableTableHead`

### Issue: Pagination not working

**Solution:** Use `paginatedData` not `sortedData` for rendering

### Issue: Mobile drawer not closing

**Solution:** Ensure `setIsOpen(false)` is called on route change

### Issue: Focus not trapped in modal

**Solution:** Use `useFocusTrap` hook on modal container

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com)
- [React Router](https://reactrouter.com)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

## 🎉 Happy Coding!

For questions or issues, refer to:

- `IMPLEMENTATION_SUMMARY.md` - Complete feature list
- `PERFORMANCE_OPTIMIZATION.md` - Performance guide
- Component source code - Well-documented with examples
