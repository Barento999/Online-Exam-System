# Breadcrumbs Navigation 🧭

## Overview

A comprehensive breadcrumb navigation system that helps users understand their current location within the application hierarchy and provides easy navigation back to parent pages.

## Features Implemented ✅

### 1. Auto-generated Breadcrumbs

- **Smart Path Detection**: Automatically generates breadcrumbs based on current URL path
- **Role-based Display**: Shows different breadcrumbs based on user permissions
- **Dynamic Segments**: Handles dynamic route parameters intelligently

### 2. Custom Breadcrumbs

- **Manual Override**: Set custom breadcrumbs for specific pages
- **Context Management**: Global breadcrumb state with React Context
- **Priority System**: Custom breadcrumbs override auto-generated ones

### 3. Rich Features

- **Icon Support**: Display icons alongside breadcrumb labels
- **Hover Effects**: Smooth transitions and visual feedback
- **Mobile Responsive**: Adapts to different screen sizes
- **Accessibility**: Proper ARIA labels and keyboard navigation

## Technical Implementation

### Components Created

```
frontend/src/components/common/Breadcrumbs.jsx          # Main component
frontend/src/context/BreadcrumbContext.jsx             # Context provider
frontend/src/hooks/useBreadcrumbs.js                   # Management hook
frontend/src/components/common/BreadcrumbsDemo.jsx     # Demo component
```

### Integration Points

- **Layout Component**: Breadcrumbs integrated into main layout
- **App Component**: BreadcrumbProvider added to context hierarchy
- **Route Detection**: Automatic breadcrumb generation based on paths

## Usage Examples

### 1. Basic Auto-generated Breadcrumbs

```jsx
// Breadcrumbs automatically appear based on current URL
// /dashboard → Dashboard
// /users → Dashboard > Users
// /exams/create → Dashboard > Exams > Create
```

### 2. Custom Breadcrumbs with Hook

```jsx
import { useBreadcrumbs, breadcrumbGenerators } from "@/hooks/useBreadcrumbs";

const UsersPage = () => {
  // Set custom breadcrumbs for this page
  useBreadcrumbs(breadcrumbGenerators.list("Users", "/users"));

  return <div>Users page content</div>;
};
```

### 3. Dynamic Breadcrumbs

```jsx
const UserDetailPage = ({ userId }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchUser(userId).then(setUser);
  }, [userId]);

  // Update breadcrumbs when user data loads
  useBreadcrumbs(
    user ? breadcrumbGenerators.detail("Users", user.name, "/users") : null,
  );

  return <div>User detail content</div>;
};
```

### 4. Complex Nested Breadcrumbs

```jsx
const customBreadcrumbs = [
  { label: "Dashboard", href: "/dashboard", icon: Home },
  { label: "Courses", href: "/courses", icon: BookOpen },
  { label: "Mathematics", href: "/courses/math" },
  { label: "Assignment 1", href: null }, // Current page (no link)
];

useBreadcrumbs(customBreadcrumbs);
```

## Breadcrumb Generators

### Available Generators

```jsx
import { breadcrumbGenerators } from "@/hooks/useBreadcrumbs";

// List pages
breadcrumbGenerators.list("Users", "/users");
breadcrumbGenerators.list("Exams", "/exams");

// Detail pages
breadcrumbGenerators.detail("Users", "John Doe", "/users");
breadcrumbGenerators.detail("Exams", "Math Final", "/exams");

// Create pages
breadcrumbGenerators.create("Exams", "/exams");
breadcrumbGenerators.create("Questions", "/questions");

// Edit pages
breadcrumbGenerators.edit("Users", "John Doe", "/users", "/users/123");

// Exam-specific
breadcrumbGenerators.examTake("Mathematics Final");
breadcrumbGenerators.examMonitor("Physics Quiz");

// Settings and profile
breadcrumbGenerators.profile();
breadcrumbGenerators.settings("User Preferences");
breadcrumbGenerators.analytics("Performance Report");
```

## Auto-generation Rules

### Path Mapping

```javascript
const pathMap = {
  users: { label: "Users" },
  courses: { label: "Courses" },
  exams: { label: "Exams" },
  questions: { label: "Questions" },
  results: { label: "Results" },
  analytics: { label: "Analytics" },
  enrollments: { label: "Enrollments" },
  profile: { label: "Profile" },
  settings: { label: "Settings" },
  create: { label: "Create" },
  edit: { label: "Edit" },
  take: { label: "Take Exam" },
  monitor: { label: "Monitor" },
};
```

### Dynamic Segment Handling

- **Numeric IDs**: Automatically skipped (e.g., `/users/123` → `/users`)
- **Object IDs**: MongoDB ObjectIds are detected and skipped
- **Special Actions**: `create`, `edit`, `take`, `monitor` are properly labeled

## Context API

### BreadcrumbContext Methods

```jsx
const {
  customBreadcrumbs, // Current custom breadcrumbs
  setBreadcrumbs, // Set new breadcrumbs
  clearBreadcrumbs, // Clear custom breadcrumbs
  addBreadcrumb, // Add single breadcrumb
  updateBreadcrumb, // Update specific breadcrumb
} = useBreadcrumbContext();
```

### Hook Options

```jsx
useBreadcrumbs(breadcrumbs, {
  clearOnUnmount: true, // Clear breadcrumbs when component unmounts
});
```

## Styling and Design

### Visual Elements

- **Separator**: ChevronRight icon between breadcrumb items
- **Current Page**: Bold text, no link
- **Parent Pages**: Clickable links with hover effects
- **Icons**: Optional icons for visual hierarchy

### Responsive Behavior

- **Desktop**: Full breadcrumb display
- **Mobile**: Responsive text sizing and spacing
- **Touch**: Appropriate touch targets for mobile devices

### Theme Support

- **Light/Dark**: Adapts to current theme
- **Colors**: Uses semantic color tokens
- **Contrast**: Maintains accessibility standards

## Integration with Existing Pages

### Automatic Integration

All pages using the Layout component automatically get breadcrumbs:

```jsx
// Layout.jsx includes <Breadcrumbs /> component
<main className="pt-16">
  <div className="p-4 md:p-6">
    <Breadcrumbs /> {/* Automatically included */}
    {children}
  </div>
</main>
```

### Page-specific Customization

Pages can override default breadcrumbs:

```jsx
const ExamCreatePage = () => {
  useBreadcrumbs(breadcrumbGenerators.create("Exams", "/exams"));

  return (
    <div>
      {/* Breadcrumbs automatically show: Dashboard > Exams > Create */}
      <h1>Create New Exam</h1>
      {/* Page content */}
    </div>
  );
};
```

## Performance Considerations

### Optimization Features

- **Memoization**: Breadcrumb generation is optimized
- **Context Updates**: Only re-render when breadcrumbs change
- **Path Parsing**: Efficient URL segment processing

### Memory Management

- **Cleanup**: Breadcrumbs cleared on component unmount
- **State Management**: Minimal context state overhead

## Accessibility Features

### Screen Reader Support

- **Semantic HTML**: Uses `<nav>` element with proper structure
- **ARIA Labels**: Descriptive labels for navigation
- **Link Context**: Clear link purposes and destinations

### Keyboard Navigation

- **Tab Order**: Proper focus management
- **Link Navigation**: Standard link keyboard behavior
- **Skip Links**: Can be enhanced with skip navigation

## Future Enhancements

### Planned Features

1. **Breadcrumb History**: Track user navigation history
2. **Deep Linking**: Generate shareable URLs with breadcrumb state
3. **Animation**: Smooth transitions between breadcrumb changes
4. **Truncation**: Smart truncation for very long breadcrumb chains
5. **Search Integration**: Breadcrumbs from search results
6. **Favorites**: Pin frequently used breadcrumb paths

### API Integration

- **Dynamic Names**: Fetch actual names for dynamic segments
- **Permissions**: Hide breadcrumbs based on user permissions
- **Metadata**: Rich breadcrumb data from API responses

## Testing the Breadcrumbs

### Manual Testing

1. Navigate to different pages and verify breadcrumbs appear
2. Click breadcrumb links to ensure proper navigation
3. Test on mobile devices for responsive behavior
4. Verify auto-generation vs custom breadcrumbs

### Test Scenarios

- **Dashboard**: Should show no breadcrumbs or just "Dashboard"
- **List Pages**: Dashboard > [Entity Name]
- **Detail Pages**: Dashboard > [Entity] > [Item Name]
- **Create Pages**: Dashboard > [Entity] > Create
- **Nested Pages**: Multiple levels of navigation

The breadcrumb system provides intuitive navigation and helps users maintain context while moving through the application hierarchy.
