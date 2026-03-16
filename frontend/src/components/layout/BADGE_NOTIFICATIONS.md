# Badge Notifications System

## Overview

A comprehensive notification badge system for sidebar menu items with dynamic counts, multiple types, and smooth animations.

## Features

### 🎯 Dynamic Badge Types

- **Info** (Blue): General information notifications
- **Success** (Green): Completed tasks or positive updates
- **Warning** (Amber): Items requiring attention
- **Error** (Red): Critical issues or failures

### 📱 Responsive Design

- **Collapsed Sidebar**: Small badges positioned at top-right of icons
- **Expanded Sidebar**: Larger badges positioned at the right side of menu items
- **Mobile Optimized**: Touch-friendly sizing and positioning

### ⚡ Smart Features

- **Auto-hide**: Badges disappear when count reaches 0
- **Count Display**: Shows 1-99, displays "99+" for higher counts
- **Persistent Storage**: Notifications saved to localStorage
- **Smooth Animations**: CSS keyframe animations for appearance and interactions

## Usage

### Basic Implementation

```jsx
import { useNotificationContext } from "@/context/NotificationContext";

function MyComponent() {
  const { setNotification, incrementNotification, clearNotification } =
    useNotificationContext();

  // Set a notification
  const addNotification = () => {
    setNotification("/users", 5, "warning");
  };

  // Increment existing notification
  const incrementCount = () => {
    incrementNotification("/users", 1);
  };

  // Clear notification
  const clearCount = () => {
    clearNotification("/users");
  };

  return (
    <div>
      <button onClick={addNotification}>Add Notification</button>
      <button onClick={incrementCount}>Increment</button>
      <button onClick={clearCount}>Clear</button>
    </div>
  );
}
```

### Available Hook Methods

```jsx
const {
  // Core methods
  setNotification, // Set notification count and type
  incrementNotification, // Increase count by specified amount
  decrementNotification, // Decrease count by specified amount
  clearNotification, // Remove notification for specific path
  clearAllNotifications, // Remove all notifications

  // Query methods
  getNotification, // Get notification for specific path
  getTotalCount, // Get total count across all notifications
  hasNotifications, // Check if any notifications exist
  getNotificationsByType, // Get notifications filtered by type

  // State
  notifications, // All current notifications object
} = useNotificationContext();
```

## Integration Examples

### Real-time Updates

```jsx
// WebSocket integration
useEffect(() => {
  socket.on("newUser", () => {
    incrementNotification("/users", 1);
  });

  socket.on("examCompleted", () => {
    incrementNotification("/results", 1);
    setNotification("/exams", 0, "success"); // Clear pending exams
  });
}, []);
```

### API Integration

```jsx
// Fetch and set notifications from API
useEffect(() => {
  const fetchNotifications = async () => {
    const response = await fetch("/api/notifications");
    const data = await response.json();

    data.forEach((notification) => {
      setNotification(notification.path, notification.count, notification.type);
    });
  };

  fetchNotifications();
}, []);
```

### User Actions

```jsx
// Clear notification when user visits page
useEffect(() => {
  if (location.pathname === "/users") {
    clearNotification("/users");
  }
}, [location.pathname]);
```

## Styling and Customization

### CSS Classes

- `.notification-badge` - Base badge styling
- `.notification-badge.pulse` - Pulsing animation for urgent notifications

### Custom Badge Colors

```css
/* Custom badge type */
.notification-badge.custom {
  background: linear-gradient(45deg, #ff6b6b, #feca57);
  color: white;
}
```

### Animation Customization

```css
/* Custom bounce animation */
@keyframes custom-bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: scale(1);
  }
  40%,
  43% {
    transform: scale(1.3);
  }
  70% {
    transform: scale(1.1);
  }
}

.notification-badge.custom-bounce {
  animation: custom-bounce 0.8s ease-out;
}
```

## Best Practices

### Performance

- Use `incrementNotification` instead of `setNotification` for frequent updates
- Clear notifications when users visit the relevant pages
- Batch multiple notification updates when possible

### UX Guidelines

- Use appropriate badge types for different scenarios
- Don't overwhelm users with too many notifications
- Provide clear actions to resolve notifications
- Consider notification priority and grouping

### Accessibility

- Ensure sufficient color contrast for all badge types
- Provide alternative text for screen readers
- Use semantic colors that match user expectations

## Common Use Cases

### Admin Dashboard

```jsx
// New user registrations
setNotification("/users", pendingUsers.length, "info");

// Pending exam reviews
setNotification("/exams", pendingReviews.length, "warning");

// System errors
setNotification("/settings", errorCount, "error");
```

### Teacher Panel

```jsx
// Student submissions
setNotification("/results", newSubmissions.length, "success");

// Exam scheduling conflicts
setNotification("/exams", conflicts.length, "warning");
```

### Student Interface

```jsx
// Available exams
setNotification("/exams", availableExams.length, "info");

// Graded results
setNotification("/results", newGrades.length, "success");
```

## Troubleshooting

### Common Issues

1. **Notifications not appearing**
   - Ensure NotificationProvider wraps your app
   - Check that the path matches exactly with menu item paths

2. **Badges not updating**
   - Verify you're using the correct hook methods
   - Check browser console for any errors

3. **Styling issues**
   - Ensure mobile-drawer.css is imported
   - Check for CSS conflicts with existing styles

### Debug Mode

```jsx
// Log all notifications for debugging
const { notifications } = useNotificationContext();
console.log("Current notifications:", notifications);
```

## Future Enhancements

- [ ] Notification grouping by category
- [ ] Custom badge shapes and sizes
- [ ] Sound notifications
- [ ] Push notification integration
- [ ] Notification history and timestamps
- [ ] Bulk notification management
