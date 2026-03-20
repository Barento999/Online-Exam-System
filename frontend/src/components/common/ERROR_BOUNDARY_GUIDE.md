# Error Boundary Implementation Guide

## Overview

The application now has comprehensive error handling with user-friendly error messages at multiple levels.

## Components

### 1. ErrorBoundary (App-level)

Located in `App.jsx`, catches all unhandled errors in the application.

**Features:**

- Full-page error display
- Friendly error message
- "Try Again" and "Go Home" buttons
- Development mode shows error details
- Automatic error logging

**Usage:**
Already integrated in `App.jsx` - wraps the entire application.

### 2. PageErrorBoundary (Page-level)

For wrapping individual pages that might have errors.

**Usage:**

```jsx
import { PageErrorBoundary } from "@/components/common/ErrorBoundary";

export const MyPage = () => {
  return (
    <PageErrorBoundary pageName="Users">
      <Layout>{/* Your page content */}</Layout>
    </PageErrorBoundary>
  );
};
```

### 3. SectionErrorBoundary (Component-level)

For wrapping specific sections or components.

**Usage:**

```jsx
import { SectionErrorBoundary } from "@/components/common/SectionErrorBoundary";

<SectionErrorBoundary
  section="User Table"
  title="Failed to load users"
  message="We couldn't load the user list. Please try again."
  onReset={() => loadUsers()}>
  <UserTable data={users} />
</SectionErrorBoundary>;
```

**Props:**

- `section` - Name of the section (for logging)
- `title` - Error title to display
- `message` - Error message to display
- `onReset` - Function to call when "Try Again" is clicked
- `showRetry` - Whether to show retry button (default: true)

### 4. InlineError (Display Component)

For displaying error states from try-catch blocks (not a boundary).

**Usage:**

```jsx
import { InlineError } from "@/components/common/SectionErrorBoundary";

{
  error && (
    <InlineError
      title="Failed to load data"
      message={error.message}
      onRetry={() => loadData()}
    />
  );
}
```

### 5. useErrorHandler Hook

For handling errors in functional components.

**Usage:**

```jsx
import { useErrorHandler } from "@/hooks/useErrorHandler";

const MyComponent = () => {
  const { error, isError, handleError, clearError } =
    useErrorHandler("loading users");

  const loadUsers = async () => {
    try {
      const response = await usersApi.getAll();
      setUsers(response.data);
      clearError(); // Clear any previous errors
    } catch (err) {
      handleError(err, "Failed to load users"); // Shows toast and sets error state
    }
  };

  if (isError) {
    return <InlineError message={error.message} onRetry={loadUsers} />;
  }

  // ... rest of component
};
```

**Hook API:**

- `error` - Current error object
- `isError` - Boolean indicating if there's an error
- `handleError(error, customMessage)` - Handle an error with optional custom message
- `clearError()` - Clear the error state
- `resetError()` - Alias for clearError

## Error Handling Best Practices

### 1. API Calls

Always wrap API calls in try-catch:

```jsx
const loadData = async () => {
  setLoading(true);
  try {
    const response = await api.getData();
    setData(response.data);
  } catch (error) {
    handleError(error, "Failed to load data");
  } finally {
    setLoading(false);
  }
};
```

### 2. User Actions

Provide feedback for failed actions:

```jsx
const handleDelete = async (id) => {
  try {
    await api.delete(id);
    toast.success("Deleted successfully");
    loadData();
  } catch (error) {
    toast.error("Failed to delete item");
    console.error(error);
  }
};
```

### 3. Form Submissions

Handle validation and submission errors:

```jsx
const handleSubmit = async (formData) => {
  try {
    await api.create(formData);
    toast.success("Created successfully");
    onClose();
  } catch (error) {
    if (error.response?.data?.errors) {
      setFormErrors(error.response.data.errors);
    } else {
      toast.error("Failed to create item");
    }
  }
};
```

### 4. Critical Sections

Wrap critical UI sections in error boundaries:

```jsx
<SectionErrorBoundary section="Dashboard Stats">
  <StatsCards data={stats} />
</SectionErrorBoundary>

<SectionErrorBoundary section="Recent Activity">
  <ActivityFeed activities={activities} />
</SectionErrorBoundary>
```

## Error Message Guidelines

### Good Error Messages

✅ "Failed to load users. Please try again."
✅ "Unable to save changes. Check your connection."
✅ "This exam is no longer available."

### Bad Error Messages

❌ "Error 500"
❌ "Something went wrong"
❌ "Network error"

### Message Structure

1. **What happened** - Brief description
2. **Why it matters** - Impact on user (optional)
3. **What to do** - Clear action steps

Example:

```
Title: "Failed to Submit Exam"
Message: "Your answers couldn't be saved due to a connection issue.
         Please check your internet connection and try again."
```

## Testing Error Boundaries

### Trigger Test Error (Development Only)

```jsx
// Add this button to test error boundary
<Button
  onClick={() => {
    throw new Error("Test error");
  }}>
  Test Error Boundary
</Button>
```

### Test Network Errors

```jsx
// Simulate network error
const testNetworkError = async () => {
  try {
    await fetch("https://invalid-url-that-will-fail.com");
  } catch (error) {
    handleError(error);
  }
};
```

## Current Implementation Status

✅ App-level error boundary in App.jsx
✅ ErrorBoundary component with friendly UI
✅ SectionErrorBoundary for component-level errors
✅ InlineError for displaying error states
✅ useErrorHandler hook for functional components
✅ Development mode shows error details
✅ Production mode shows user-friendly messages

## Next Steps (Optional Enhancements)

1. **Error Reporting Service**
   - Integrate Sentry or similar service
   - Automatic error reporting in production

2. **Offline Detection**
   - Show offline banner when network is unavailable
   - Queue actions for when connection returns

3. **Retry Logic**
   - Automatic retry for failed requests
   - Exponential backoff for API calls

4. **Error Analytics**
   - Track error frequency
   - Identify problematic areas
