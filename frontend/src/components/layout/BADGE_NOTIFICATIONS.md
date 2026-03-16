# Badge Notifications System

## Overview

A comprehensive notification badge system for sidebar menu items that provides visual indicators for different types of notifications with counts, colors, and animations.

## Features

### 🎯 Dynamic Badge Display

- **Count Display**: Shows notification counts from 1 to 99+
- **Type-based Colors**: Different colors for info, success, warning, and error notifications
- **Responsive Sizing**: Adapts to collapsed/expanded sidebar states
- **Auto-hide**: Badges automatically hide when count is 0

### 🎨 Visual Design

- **Color Coding**:
  - `info`: Blue badges for general information
  - `success`: Green badges for completed tasks
  - `warning`: Amber badges for attention needed
  - `error`: Red badges for critical alerts
- **Smooth Animations**: Bounce and pulse effects with CSS keyframes
- **Hover Effects**: Scale and shadow effects on interaction

### 📱 Mobile Optimized

- **Touch Targets**: Properly sized for mobile interaction
- **Responsive Positioning**: Adjusts position based on sidebar state
- **Performance**: Hardware-accelerated animations

## Implementation

### 1. Context Setup

```jsx
// Wrap your app with the NotificationProvider
import { NotificationProvider } from "@/context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <Layout>{/* Your app content */}</Layout>
    </NotificationProvider>
  );
}
```

### 2. Using the Hook

```jsx
import { useNotificationContext } from "@/context/NotificationContext";

function MyComponent() {
  const {
    setNotification,
    incrementNotification,
    clearNotification,
    getNotification,
  } = useNotificationContext();

  // Set a notification
  const handleNewUser = () => {
    setNotification("/users", 5, "info");
  };

  // Increment existing notification
  const handleNewExam = () => {
    incrementNotification("/exams", 1);
  };

  // Clear notification
  const handleClearResults = () => {
    clearNotification("/results");
  };
}
```

### 3. Badge Component

The `NotificationBadge` component is automatically integrated into the sidebar and handles:

- Positioning based on sidebar state (collapsed/expanded)
- Color coding based on notification type
- Count display with 99+ overflow handling
- Smooth animations and transitions

## API Reference

### NotificationContext Methods

#### `setNotification(path, count, type)`

Set or update a notification for a specific menu path.

- `path` (string): Menu item path (e.g., '/users', '/exams')
- `count` (number): Notification count (0 to clear)
- `type` (string): Badge type ('info', 'success', 'warning', 'error')

#### `incrementNotification(path, increment = 1)`

Increment the notification count for a path.

- `path` (string): Menu item path
- `increment` (number): Amount to increment (default: 1)

#### `decrementNotification(path, decrement = 1)`

Decrement the notification count for a path.

- `path` (string): Menu item path
- `decrement` (number): Amount to decrement (default: 1)

#### `clearNotification(path)`

Clear notification for a specific path.

- `path` (string): Menu item path

#### `clearAllNotifications()`

Clear all notifications across all paths.

#### `getNotification(path)`

Get notification object for a specific path.

- `path` (string): Menu item path
- Returns: `{ count, type }` or `null`

#### `getTotalCount()`

Get total notification count across all paths.

- Returns: `number`

#### `hasNotifications()`

Check if there are any active notifications.

- Returns: `boolean`

#### `getNotificationsByType(type)`

Get all notifications of a specific type.

- `type` (string): Badge type
- Returns: `object` with filtered notifications

## Badge Types and Colors

| Type      | Color | Use Case            | Example                |
| --------- | ----- | ------------------- | ---------------------- |
| `info`    | Blue  | General information | New user registrations |
| `success` | Green | Completed tasks     | Successful submissions |
| `warning` | Amber | Attention needed    | Pending reviews        |
| `error`   | Red   | Critical alerts     | System errors          |

## CSS Classes

### Animation Classes

```css
.notification-badge {
  animation: badge-bounce 0.6s ease-out;
}

.notification-badge.pulse {
  animation: badge-pulse 2s ease-in-out infinite;
}
```

### Hover Effects

```css
.notification-badge:hover {
  transform: scale(1.1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## Usage Examples

### Real-time Notifications

```jsx
// WebSocket or API response handler
const handleNotification = (data) => {
  switch (data.type) {
    case "new_user":
      incrementNotification("/users", 1);
      break;
    case "exam_submitted":
      incrementNotification("/exams", 1);
      break;
    case "system_error":
      setNotification("/settings", 1, "error");
      break;
  }
};
```

### Page-specific Clearing

```jsx
// Clear notifications when user visits the page
useEffect(() => {
  if (location.pathname === "/users") {
    clearNotification("/users");
  }
}, [location.pathname, clearNotification]);
```

### Conditional Badge Display

```jsx
// Only show badges for admin users
const shouldShowBadge = (path) => {
  if (user?.role !== "admin") return false;
  const notification = getNotification(path);
  return notification && notification.count > 0;
};
```

## Persistence

- Notifications are automatically saved to localStorage
- Persist across browser sessions
- Automatically restored on app reload

## Performance Considerations

- Efficient re-renders with React.memo and useCallback
- Hardware-accelerated CSS animations
- Minimal DOM updates with conditional rendering
- Optimized event listeners with proper cleanup

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS animations and transforms
- localStorage API
- Touch events for mobile interaction

## Accessibility

- Proper color contrast ratios for all badge types
- Screen reader friendly with semantic HTML
- Keyboard navigation support
- Focus management for interactive elements

## Future Enhancements

- [ ] Sound notifications (optional)
- [ ] Custom badge shapes and styles
- [ ] Notification grouping and categories
- [ ] Real-time sync with backend
- [ ] Notification history and logs
- [ ] Custom animation preferences
- [ ] Notification scheduling and expiry
