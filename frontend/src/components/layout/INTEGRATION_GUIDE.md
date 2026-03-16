# Badge Notifications Integration Guide

## Quick Setup

### 1. Add NotificationProvider to App.jsx

```jsx
import { NotificationProvider } from "@/context/NotificationContext";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Routes>{/* Your routes */}</Routes>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}
```

### 2. The Sidebar is Already Configured

The sidebar component already includes:

- ✅ NotificationContext integration
- ✅ Badge rendering for all menu items
- ✅ Responsive positioning
- ✅ Animation effects

### 3. Use Notifications in Your Components

```jsx
import { useNotificationContext } from "@/context/NotificationContext";

function UsersPage() {
  const { clearNotification, incrementNotification } = useNotificationContext();

  // Clear notification when user visits the page
  useEffect(() => {
    clearNotification("/users");
  }, [clearNotification]);

  // Add notification when new user registers
  const handleNewUser = () => {
    incrementNotification("/users", 1);
  };

  return <div>{/* Your users page content */}</div>;
}
```

## Common Integration Patterns

### API Response Handling

```jsx
// In your API service or component
const handleApiResponse = (response) => {
  if (response.notifications) {
    response.notifications.forEach((notification) => {
      setNotification(notification.path, notification.count, notification.type);
    });
  }
};
```

### WebSocket Integration

```jsx
// In your WebSocket handler
useEffect(() => {
  const socket = new WebSocket("ws://localhost:8080");

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "notification") {
      setNotification(data.path, data.count, data.badgeType);
    }
  };

  return () => socket.close();
}, [setNotification]);
```

### Page-specific Clearing

```jsx
// Clear notifications when user visits specific pages
const usePageNotificationClear = () => {
  const { clearNotification } = useNotificationContext();
  const location = useLocation();

  useEffect(() => {
    const pathNotificationMap = {
      "/users": "/users",
      "/exams": "/exams",
      "/questions": "/questions",
      "/results": "/results",
      "/analytics": "/analytics",
      "/enrollments": "/enrollments",
    };

    const notificationPath = pathNotificationMap[location.pathname];
    if (notificationPath) {
      clearNotification(notificationPath);
    }
  }, [location.pathname, clearNotification]);
};
```

## Testing the System

### 1. Use the Demo Component

```jsx
// Add to your routes for testing
import { NotificationExample } from "@/components/layout/NotificationExample";

// In your routes
<Route path="/notifications-demo" element={<NotificationExample />} />;
```

### 2. Browser Console Testing

```javascript
// Open browser console and test directly
const { setNotification } = window.__NOTIFICATION_CONTEXT__;
setNotification("/users", 5, "info");
setNotification("/exams", 3, "warning");
```

### 3. Manual Testing Checklist

- [ ] Badges appear on sidebar menu items
- [ ] Different colors for different types
- [ ] Counts display correctly (1-99+)
- [ ] Badges hide when count is 0
- [ ] Responsive positioning in collapsed/expanded states
- [ ] Smooth animations
- [ ] Persistence across page reloads

## Production Considerations

### 1. Real Data Integration

Replace mock notifications with real API data:

```jsx
// Instead of mock data, fetch from API
useEffect(() => {
  fetchNotifications().then((notifications) => {
    notifications.forEach((notification) => {
      setNotification(notification.path, notification.count, notification.type);
    });
  });
}, []);
```

### 2. Performance Optimization

```jsx
// Debounce frequent updates
const debouncedSetNotification = useMemo(
  () => debounce(setNotification, 300),
  [setNotification],
);
```

### 3. Error Handling

```jsx
// Add error boundaries and fallbacks
const safeSetNotification = (path, count, type) => {
  try {
    setNotification(path, count, type);
  } catch (error) {
    console.error("Failed to set notification:", error);
  }
};
```

## Customization Options

### 1. Custom Badge Colors

Modify the badge styles in the Sidebar component:

```jsx
const getBadgeStyles = (type) => {
  const customColors = {
    urgent: "bg-purple-500 text-white",
    low: "bg-gray-500 text-white",
    // Add your custom types
  };

  return customColors[type] || defaultColors[type];
};
```

### 2. Custom Animation Duration

Update the CSS in `mobile-drawer.css`:

```css
.notification-badge {
  animation: badge-bounce 0.4s ease-out; /* Faster animation */
}
```

### 3. Different Badge Shapes

```css
.notification-badge.square {
  border-radius: 4px; /* Square badges */
}

.notification-badge.pill {
  border-radius: 12px; /* Pill-shaped badges */
}
```

## Troubleshooting

### Common Issues

1. **Badges not showing**
   - Check if NotificationProvider wraps your app
   - Verify the path matches exactly (case-sensitive)
   - Ensure count > 0

2. **Notifications not persisting**
   - Check localStorage permissions
   - Verify browser supports localStorage
   - Check for localStorage quota limits

3. **Performance issues**
   - Use React DevTools to check re-renders
   - Implement debouncing for frequent updates
   - Consider memoization for expensive operations

### Debug Mode

Add this to enable debug logging:

```jsx
// In NotificationContext
const DEBUG = process.env.NODE_ENV === "development";

const setNotification = useCallback((path, count, type) => {
  if (DEBUG) {
    console.log("Setting notification:", { path, count, type });
  }
  // ... rest of the function
}, []);
```

## Next Steps

1. **Add to your main App.jsx** - Wrap with NotificationProvider
2. **Test with demo component** - Verify everything works
3. **Integrate with your API** - Replace mock data with real notifications
4. **Add page-specific clearing** - Clear notifications when users visit pages
5. **Customize styling** - Match your design system
6. **Add real-time updates** - Integrate with WebSocket or polling
