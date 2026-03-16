# Badge Notifications Integration Guide

## Quick Start

### 1. Provider Setup (Already Done)

The NotificationProvider is already integrated in `App.jsx`:

```jsx
<NotificationProvider>
  <RouterProvider router={router} />
</NotificationProvider>
```

### 2. Basic Usage in Components

```jsx
import { useNotificationContext } from "@/context/NotificationContext";

function ExamManagement() {
  const { setNotification, incrementNotification } = useNotificationContext();

  // When new exam is submitted for review
  const handleExamSubmission = () => {
    incrementNotification("/exams", 1);
  };

  // When exam is approved
  const handleExamApproval = () => {
    decrementNotification("/exams", 1);
  };

  return (
    <div>
      <button onClick={handleExamSubmission}>Submit Exam</button>
      <button onClick={handleExamApproval}>Approve Exam</button>
    </div>
  );
}
```

## Real-World Integration Examples

### 1. User Management

```jsx
// In UserManagement component
useEffect(() => {
  const fetchPendingUsers = async () => {
    const response = await fetch("/api/users/pending");
    const pendingUsers = await response.json();
    setNotification("/users", pendingUsers.length, "info");
  };

  fetchPendingUsers();
}, []);
```

### 2. Exam System

```jsx
// In ExamController
const handleExamCreation = async (examData) => {
  await createExam(examData);
  incrementNotification("/exams", 1);
  toast.success("Exam created successfully");
};

const handleExamReview = async (examId) => {
  await reviewExam(examId);
  decrementNotification("/exams", 1);
  incrementNotification("/results", 1);
};
```

### 3. WebSocket Integration

```jsx
// In SocketContext or main component
useEffect(() => {
  socket.on("newUserRegistration", () => {
    incrementNotification("/users", 1);
  });

  socket.on("examSubmitted", () => {
    incrementNotification("/results", 1);
  });

  socket.on("systemAlert", (data) => {
    setNotification("/settings", 1, "error");
  });

  return () => {
    socket.off("newUserRegistration");
    socket.off("examSubmitted");
    socket.off("systemAlert");
  };
}, []);
```

## Menu Path Reference

Current menu paths that support badges:

### Admin Menu

- `/dashboard` - Dashboard overview
- `/users` - User management
- `/courses` - Course management
- `/enrollments` - Student enrollments
- `/exams` - Exam management
- `/questions` - Question bank
- `/results` - Exam results
- `/analytics` - Analytics dashboard
- `/settings` - System settings

### Teacher Menu

- `/dashboard` - Teacher dashboard
- `/courses` - My courses
- `/enrollments` - Student enrollments
- `/exams` - Exam management
- `/questions` - Question bank
- `/results` - Student results
- `/analytics` - Analytics
- `/profile` - Teacher profile

### Student Menu

- `/dashboard` - Student dashboard
- `/exams` - Available exams
- `/results` - My results
- `/profile` - Student profile

## Badge Types and When to Use

### Info (Blue)

- New registrations
- General updates
- Available items
- Information alerts

```jsx
setNotification("/users", 3, "info");
```

### Success (Green)

- Completed tasks
- Approved items
- Successful operations
- Positive updates

```jsx
setNotification("/results", 5, "success");
```

### Warning (Amber)

- Items requiring attention
- Pending reviews
- Upcoming deadlines
- Non-critical issues

```jsx
setNotification("/exams", 2, "warning");
```

### Error (Red)

- Critical issues
- Failed operations
- System errors
- Urgent attention required

```jsx
setNotification("/settings", 1, "error");
```

## Advanced Usage Patterns

### 1. Conditional Notifications

```jsx
const updateExamNotifications = (exams) => {
  const pendingReviews = exams.filter(
    (exam) => exam.status === "pending",
  ).length;
  const failedExams = exams.filter((exam) => exam.status === "failed").length;

  if (pendingReviews > 0) {
    setNotification("/exams", pendingReviews, "warning");
  } else {
    clearNotification("/exams");
  }

  if (failedExams > 0) {
    setNotification("/results", failedExams, "error");
  }
};
```

### 2. Batch Updates

```jsx
const updateAllNotifications = async () => {
  const [users, exams, results] = await Promise.all([
    fetchPendingUsers(),
    fetchPendingExams(),
    fetchNewResults(),
  ]);

  setNotification("/users", users.length, "info");
  setNotification("/exams", exams.length, "warning");
  setNotification("/results", results.length, "success");
};
```

### 3. Route-based Clearing

```jsx
// In Layout component or route handler
useEffect(() => {
  // Clear notification when user visits the page
  const currentPath = location.pathname;
  clearNotification(currentPath);
}, [location.pathname]);
```

## Testing Notifications

### Manual Testing

```jsx
// Add to any component for testing
const TestNotifications = () => {
  const { setNotification, clearAllNotifications } = useNotificationContext();

  const addTestNotifications = () => {
    setNotification("/users", 3, "info");
    setNotification("/exams", 5, "warning");
    setNotification("/results", 2, "error");
    setNotification("/analytics", 1, "success");
  };

  return (
    <div className="p-4 space-x-2">
      <button
        onClick={addTestNotifications}
        className="px-4 py-2 bg-blue-500 text-white rounded">
        Add Test Notifications
      </button>
      <button
        onClick={clearAllNotifications}
        className="px-4 py-2 bg-red-500 text-white rounded">
        Clear All
      </button>
    </div>
  );
};
```

### Automated Testing

```jsx
// Jest test example
import { renderHook, act } from "@testing-library/react";
import { useNotifications } from "@/hooks/useNotifications";

test("should increment notification count", () => {
  const { result } = renderHook(() => useNotifications());

  act(() => {
    result.current.setNotification("/users", 5, "info");
  });

  expect(result.current.getNotification("/users")).toEqual({
    count: 5,
    type: "info",
  });

  act(() => {
    result.current.incrementNotification("/users", 2);
  });

  expect(result.current.getNotification("/users").count).toBe(7);
});
```

## Performance Considerations

### 1. Debounced Updates

```jsx
import { debounce } from "lodash";

const debouncedUpdateNotification = debounce((path, count, type) => {
  setNotification(path, count, type);
}, 300);
```

### 2. Memoized Calculations

```jsx
const notificationCount = useMemo(() => {
  return getTotalCount();
}, [notifications]);
```

### 3. Selective Updates

```jsx
// Only update if count actually changed
const updateNotificationIfChanged = (path, newCount, type) => {
  const current = getNotification(path);
  if (!current || current.count !== newCount) {
    setNotification(path, newCount, type);
  }
};
```

## Troubleshooting

### Common Issues and Solutions

1. **Notifications not persisting**
   - Check localStorage permissions
   - Verify JSON serialization

2. **Performance issues with many notifications**
   - Use debounced updates
   - Implement notification limits
   - Clear old notifications periodically

3. **Styling conflicts**
   - Check CSS specificity
   - Ensure proper z-index values
   - Verify mobile-drawer.css is loaded

### Debug Utilities

```jsx
// Add to development environment
const NotificationDebugger = () => {
  const { notifications, getTotalCount } = useNotificationContext();

  if (process.env.NODE_ENV !== "development") return null;

  return (
    <div className="fixed bottom-4 right-4 bg-black text-white p-4 rounded text-xs max-w-xs">
      <h4>Notifications Debug</h4>
      <p>Total: {getTotalCount()}</p>
      <pre>{JSON.stringify(notifications, null, 2)}</pre>
    </div>
  );
};
```

## Migration Guide

If you have existing notification systems, here's how to migrate:

### From Simple State

```jsx
// Before
const [userCount, setUserCount] = useState(0);

// After
const { setNotification } = useNotificationContext();
setNotification("/users", userCount, "info");
```

### From Redux

```jsx
// Before
dispatch(setNotificationCount("/users", 5));

// After
setNotification("/users", 5, "info");
```

This integration guide should help you implement the badge notification system effectively throughout your application.
