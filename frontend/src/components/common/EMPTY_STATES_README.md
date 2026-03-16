# Empty States with Illustrations

Beautiful, animated empty state components with custom SVG illustrations for various scenarios.

## 🎨 Features

- **5 Custom Illustrations**: Exams, Results, Courses, Data, and Default
- **Smooth Animations**: Fade-in and slide-in effects
- **Fully Customizable**: Icons, titles, descriptions, and actions
- **Responsive Design**: Works on all screen sizes
- **Dark Mode Support**: Illustrations adapt to theme
- **Accessible**: Proper semantic HTML and ARIA labels

## 📦 Component API

### EmptyState

```jsx
import { EmptyState } from "@/components/common/EmptyState";

<EmptyState
  illustration="exams"           // Type of illustration
  icon={CalendarIcon}            // Optional Lucide icon
  title="No Exams Available"     // Main heading
  description="..."              // Supporting text
  action={() => navigate(...)}   // Optional action handler
  actionLabel="View All Exams"   // Button text
  className="..."                // Additional classes
/>
```

### Props

| Prop           | Type        | Default     | Description                                                                      |
| -------------- | ----------- | ----------- | -------------------------------------------------------------------------------- |
| `illustration` | `string`    | `"default"` | Type of illustration: `"default"`, `"exams"`, `"results"`, `"courses"`, `"data"` |
| `icon`         | `Component` | `undefined` | Lucide icon component to display                                                 |
| `title`        | `string`    | Required    | Main heading text                                                                |
| `description`  | `string`    | `undefined` | Supporting description text                                                      |
| `action`       | `function`  | `undefined` | Click handler for action button                                                  |
| `actionLabel`  | `string`    | `undefined` | Text for action button                                                           |
| `className`    | `string`    | `""`        | Additional CSS classes                                                           |

## 🎭 Available Illustrations

### 1. Exams (`illustration="exams"`)

- **Use Case**: No exams available, empty exam list
- **Visual**: Document with checkmark
- **Colors**: Blue theme

### 2. Results (`illustration="results"`)

- **Use Case**: No results yet, empty results page
- **Visual**: Trophy with star
- **Colors**: Yellow/Gold theme

### 3. Courses (`illustration="courses"`)

- **Use Case**: No enrolled courses, empty course list
- **Visual**: Book with bookmark and sparkles
- **Colors**: Purple theme

### 4. Data (`illustration="data"`)

- **Use Case**: No analytics data, empty charts
- **Visual**: Bar chart with magnifying glass
- **Colors**: Multi-color bars

### 5. Default (`illustration="default"`)

- **Use Case**: Generic empty state
- **Visual**: Circle with plus icon
- **Colors**: Muted theme

## 💡 Usage Examples

### Basic Empty State

```jsx
<EmptyState
  illustration="exams"
  title="No Exams Available"
  description="There are no exams scheduled at the moment."
/>
```

### With Action Button

```jsx
<EmptyState
  illustration="results"
  title="No Results Yet"
  description="Complete some exams to see your results."
  action={() => navigate("/exams")}
  actionLabel="Take an Exam"
/>
```

### With Custom Icon

```jsx
<EmptyState
  icon={Calendar}
  title="No Events"
  description="You don't have any upcoming events."
  action={() => setShowCreateModal(true)}
  actionLabel="Create Event"
/>
```

### In a Card

```jsx
<Card>
  <CardContent>
    <EmptyState
      illustration="courses"
      title="No Courses Enrolled"
      description="Browse available courses and start learning!"
      action={() => navigate("/courses")}
      actionLabel="Browse Courses"
    />
  </CardContent>
</Card>
```

## 🎨 Chart Empty States

The chart components also have built-in empty states with mini illustrations:

### LineChart Empty State

```jsx
// Automatically shown when data is empty
<LineChart data={[]} />
```

- Shows line chart icon with dots
- Message: "No data available"

### BarChart Empty State

```jsx
<BarChart data={[]} />
```

- Shows bar chart icon
- Message: "No data available"

### DonutChart Empty State

```jsx
<DonutChart data={[]} />
```

- Shows donut/ring icon
- Message: "No data available"

## 🎭 Animation Details

All empty states include:

- **Fade-in animation**: 500ms duration
- **Slide-in from bottom**: 16px offset
- **Pulse effects**: On sparkles and decorative elements
- **Staggered delays**: For multiple elements

## 🎨 Customization

### Custom Illustration

You can add your own illustrations by extending the `illustrations` object in `EmptyState.jsx`:

```jsx
const illustrations = {
  // ... existing illustrations
  custom: (
    <svg className="w-48 h-48 mx-auto mb-6" viewBox="0 0 200 200">
      {/* Your custom SVG */}
    </svg>
  ),
};
```

### Custom Styling

```jsx
<EmptyState
  illustration="exams"
  title="Custom Styled"
  className="bg-accent/50 rounded-lg border-2 border-dashed"
/>
```

## 📱 Responsive Behavior

- **Mobile**: Illustrations scale to 32rem (128px)
- **Tablet**: Illustrations at 40rem (160px)
- **Desktop**: Full size at 48rem (192px)
- Text and buttons stack vertically on all sizes

## ♿ Accessibility

- Semantic HTML structure
- Proper heading hierarchy
- Descriptive text for screen readers
- Keyboard-accessible action buttons
- ARIA labels where appropriate

## 🎯 Best Practices

1. **Use appropriate illustrations** for the context
2. **Keep titles concise** (1-5 words)
3. **Provide helpful descriptions** explaining why it's empty
4. **Include actions** when users can do something about it
5. **Match your app's tone** in the copy

## 🚀 Integration

The EmptyState component is already integrated in:

- ✅ StudentDashboard (Available Exams section)
- ✅ StudentDashboard (Recent Results section)
- ✅ LineChart component
- ✅ BarChart component
- ✅ DonutChart component

## 📚 Demo

View all empty states in action:

- Navigate to `/empty-states-demo` (if route is configured)
- Or check `EmptyStatesDemo.jsx` for examples
