# Interactive Charts & Progress Components 📊

A comprehensive collection of animated, interactive chart and progress bar components built with React and CSS animations.

## 🎨 Features

### ✨ Animations

- **Smooth Entry Animations**: Charts animate in with customizable delays
- **Progressive Data Loading**: Values animate from 0 to target with easing
- **Hover Interactions**: Interactive elements respond to user interaction
- **Staggered Timing**: Multiple elements animate in sequence

### 🎯 Accessibility

- **Screen Reader Support**: Proper ARIA labels and descriptions
- **Keyboard Navigation**: Full keyboard accessibility
- **High Contrast**: Works with high contrast themes
- **Reduced Motion**: Respects `prefers-reduced-motion` settings

### 📱 Responsive Design

- **Flexible Sizing**: Components adapt to container sizes
- **Mobile Optimized**: Touch-friendly interactions
- **Scalable Graphics**: SVG-based for crisp rendering at any size

## 📈 Components

### 1. CircularProgress

Animated circular progress indicator with customizable styling.

**Features:**

- Smooth arc animation with easing
- Center content support
- Customizable colors and sizes
- Value display with formatting
- Glowing stroke effects

**Usage:**

```jsx
<CircularProgress
  value={87}
  max={100}
  size={120}
  color="text-primary"
  label="Overall Score"
  animated
  showValue
/>
```

**Props:**

- `value` (number): Current progress value
- `max` (number): Maximum value (default: 100)
- `size` (number): Diameter in pixels (default: 120)
- `strokeWidth` (number): Stroke thickness (default: 8)
- `color` (string): Color class (default: "text-primary")
- `backgroundColor` (string): Background color class
- `showValue` (boolean): Show value in center (default: true)
- `label` (string): Label text below value
- `animated` (boolean): Enable animations (default: true)

### 2. LinearProgress

Horizontal progress bar with optional striped animation.

**Features:**

- Smooth width animation
- Optional striped pattern
- Label and value display
- Color-coded thresholds
- Glow effects on progress

**Usage:**

```jsx
<LinearProgress
  value={85}
  max={100}
  label="Mathematics"
  showValue
  color="bg-blue-600"
  animated
  striped
/>
```

**Props:**

- `value` (number): Current progress value
- `max` (number): Maximum value (default: 100)
- `height` (string): Height class (default: "h-2")
- `color` (string): Progress color class
- `backgroundColor` (string): Background color class
- `showValue` (boolean): Show value text
- `label` (string): Progress label
- `animated` (boolean): Enable animations (default: true)
- `striped` (boolean): Add striped pattern

### 3. BarChart

Animated vertical bar chart with hover interactions.

**Features:**

- Staggered bar animations
- Hover scaling and tooltips
- Grid lines and labels
- Customizable colors
- Value display on hover

**Usage:**

```jsx
<BarChart
  data={[
    { label: "Math", value: 85 },
    { label: "Physics", value: 92 },
    { label: "Chemistry", value: 78 },
  ]}
  height={200}
  color="bg-primary"
  animated
  showValues
  showGrid
/>
```

**Props:**

- `data` (array): Array of {label, value} objects
- `height` (number): Chart height in pixels (default: 200)
- `color` (string): Bar color class
- `animated` (boolean): Enable animations (default: true)
- `showValues` (boolean): Show value tooltips on hover
- `showGrid` (boolean): Show grid lines (default: true)

### 4. DonutChart

Multi-segment donut chart with interactive legend.

**Features:**

- Smooth arc animations with delays
- Interactive hover effects
- Center content support
- Automatic color assignment
- Legend with percentages

**Usage:**

```jsx
<DonutChart
  data={[
    { label: "Completed", value: 65, color: "stroke-green-600" },
    { label: "In Progress", value: 25, color: "stroke-blue-600" },
    { label: "Pending", value: 10, color: "stroke-orange-600" },
  ]}
  size={200}
  strokeWidth={20}
  animated
  showLegend
  centerContent={<div>Total: 100</div>}
/>
```

**Props:**

- `data` (array): Array of {label, value, color?} objects
- `size` (number): Diameter in pixels (default: 200)
- `strokeWidth` (number): Arc thickness (default: 20)
- `animated` (boolean): Enable animations (default: true)
- `showLegend` (boolean): Show legend (default: true)
- `centerContent` (ReactNode): Content for center area

### 5. LineChart

Smooth line chart with interactive data points.

**Features:**

- Animated line drawing effect
- Interactive data points with tooltips
- Smooth curve interpolation
- Area fill gradients
- Grid lines and labels

**Usage:**

```jsx
<LineChart
  data={[
    { label: "Jan", value: 75 },
    { label: "Feb", value: 82 },
    { label: "Mar", value: 78 },
  ]}
  width={400}
  height={200}
  color="stroke-primary"
  animated
  showDots
  showGrid
  smooth
/>
```

**Props:**

- `data` (array): Array of {label, value} objects
- `width` (number): Chart width in pixels (default: 400)
- `height` (number): Chart height in pixels (default: 200)
- `color` (string): Line color class
- `animated` (boolean): Enable animations (default: true)
- `showDots` (boolean): Show data point dots (default: true)
- `showGrid` (boolean): Show grid lines (default: true)
- `smooth` (boolean): Use smooth curves (default: true)

## 🎛️ Dashboard Widgets

### PerformanceWidget

Comprehensive performance overview with multiple chart types.

**Features:**

- Circular progress for overall score
- Linear progress bars for subjects
- Bar chart comparison
- Trend indicators

### StudyProgressWidget

Study progress tracking with donut chart and goals.

**Features:**

- Donut chart for progress distribution
- Weekly goal tracking
- Progress indicators
- Quick statistics

### ExamTrendsWidget

Exam performance trends with line chart.

**Features:**

- Line chart for score progression
- Upcoming exam preparation status
- Performance metrics
- Streak tracking

## 🎨 Styling & Theming

### Color System

Charts use a consistent color system with semantic meanings:

- `text-primary` / `bg-primary`: Primary brand color
- `text-green-600` / `bg-green-600`: Success, completion
- `text-blue-600` / `bg-blue-600`: Information, progress
- `text-orange-600` / `bg-orange-600`: Warning, attention
- `text-red-600` / `bg-red-600`: Error, critical
- `text-purple-600` / `bg-purple-600`: Special, premium

### Animation Timing

```css
/* Standard timing functions */
transition: all 300ms ease-out;
animation-duration: 600ms;
animation-fill-mode: both;

/* Staggered delays */
animation-delay: calc(index * 100ms);
```

### CSS Custom Properties

Charts support CSS custom properties for dynamic theming:

```css
--chart-primary-color: theme(colors.primary);
--chart-animation-duration: 600ms;
--chart-easing: cubic-bezier(0.4, 0, 0.2, 1);
```

## 🚀 Performance

### Optimization Techniques

- **CSS Transforms**: Hardware-accelerated animations
- **SVG Graphics**: Scalable vector graphics for crisp rendering
- **Efficient Re-renders**: Optimized React rendering with keys
- **Animation Batching**: Grouped animations for smooth performance

### Best Practices

- Use `transform` and `opacity` for animations
- Implement `will-change` for complex animations
- Debounce rapid data updates
- Use `requestAnimationFrame` for smooth transitions

## 🔧 Customization

### Creating Custom Charts

```jsx
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export const CustomChart = ({ data, animated = true }) => {
  const [animatedData, setAnimatedData] = useState(
    animated ? data.map(() => 0) : data,
  );

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setAnimatedData(data);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [data, animated]);

  // Chart implementation...
};
```

### Extending Existing Components

```jsx
import { CircularProgress } from "@/components/charts";

export const CustomCircularProgress = (props) => {
  return (
    <CircularProgress
      {...props}
      className={cn("custom-styling", props.className)}
      // Add custom logic here
    />
  );
};
```

## 📱 Responsive Behavior

### Breakpoint Adaptations

- **Mobile (< 768px)**: Smaller chart sizes, simplified layouts
- **Tablet (768px - 1024px)**: Medium chart sizes, grid layouts
- **Desktop (> 1024px)**: Full-size charts, complex layouts

### Container Queries

Charts automatically adapt to their container size:

```jsx
<div className="w-full max-w-md">
  <CircularProgress size="100%" /> {/* Responsive sizing */}
</div>
```

## 🧪 Testing

### Component Testing

```jsx
import { render, screen } from "@testing-library/react";
import { CircularProgress } from "@/components/charts";

test("renders progress value", () => {
  render(<CircularProgress value={75} />);
  expect(screen.getByText("75")).toBeInTheDocument();
});
```

### Animation Testing

```jsx
test("animates progress value", async () => {
  render(<CircularProgress value={75} animated />);
  // Test animation behavior
});
```

## 🔮 Future Enhancements

1. **Advanced Chart Types**
   - Scatter plots
   - Radar charts
   - Heatmaps
   - Gantt charts

2. **Interactive Features**
   - Zoom and pan
   - Data brushing
   - Real-time updates
   - Export functionality

3. **Performance Improvements**
   - Canvas rendering for large datasets
   - Virtual scrolling for data
   - Web Workers for calculations

4. **Accessibility Enhancements**
   - Voice navigation
   - Haptic feedback
   - Audio descriptions
   - High contrast themes
