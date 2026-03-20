# 🚀 Loading States Quick Reference

## TL;DR - Everything Already Works!

Your app has **comprehensive loading states** with skeleton loaders and smooth transitions. Here's how to use them:

---

## 🎯 Quick Usage

### 1. Page Transition (Automatic)

```jsx
// Already integrated in Layout.jsx - no action needed!
<Layout>
  <YourPage />
</Layout>
```

✅ Shows top progress bar on every navigation
✅ 300ms smooth animation
✅ Automatic - zero configuration

---

### 2. Table Loading

```jsx
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";

if (loading) {
  return (
    <Layout>
      <TableSkeleton rows={5} columns={5} />
    </Layout>
  );
}
```

✅ Use in: Users, Exams, Questions, Results, Enrollments

---

### 3. Dashboard Loading

```jsx
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton";

if (loading) {
  return (
    <Layout>
      <DashboardSkeleton />
    </Layout>
  );
}
```

✅ Use in: StudentDashboard, AdminDashboard, Analytics

---

### 4. Card List Loading

```jsx
import { CardListSkeleton } from "@/components/skeletons/TableSkeleton";

if (loading) {
  return <CardListSkeleton count={5} />;
}
```

✅ Use in: Courses, ExamMonitoring

---

### 5. Stats Cards Loading

```jsx
import { StatsGridSkeleton } from "@/components/skeletons/StatsCardSkeleton";

if (loading) {
  return <StatsGridSkeleton count={4} />;
}
```

✅ Use in: Dashboard stats sections

---

### 6. Full Page Loader

```jsx
import { PageLoader } from "@/components/common/PageTransitionLoader";

{
  isProcessing && <PageLoader message="Processing..." />;
}
```

✅ Use for: Long operations, blocking actions

---

### 7. Inline Content Loader

```jsx
import { ContentLoader } from "@/components/common/PageTransitionLoader";

{
  loading ? <ContentLoader message="Loading data..." /> : <YourContent />;
}
```

✅ Use for: Section loading, non-blocking

---

## 🎨 Available Skeletons

| Skeleton               | File                    | Use Case         |
| ---------------------- | ----------------------- | ---------------- |
| **TableSkeleton**      | `TableSkeleton.jsx`     | Table pages      |
| **DashboardSkeleton**  | `DashboardSkeleton.jsx` | Dashboard pages  |
| **CardListSkeleton**   | `TableSkeleton.jsx`     | Card layouts     |
| **StatsCardSkeleton**  | `StatsCardSkeleton.jsx` | Single stat card |
| **StatsGridSkeleton**  | `StatsCardSkeleton.jsx` | Stats grid       |
| **ExamCardSkeleton**   | `ExamCardSkeleton.jsx`  | Exam cards       |
| **ResultCardSkeleton** | `ExamCardSkeleton.jsx`  | Result cards     |

---

## 🔧 Custom Hooks

### usePageLoading

```jsx
import { usePageLoading } from "@/hooks/usePageLoading";

const { loading, startLoading, stopLoading } = usePageLoading(true, 300);

// Ensures minimum 300ms display time
useEffect(() => {
  loadData().then(() => stopLoading());
}, []);
```

### useAsyncLoading

```jsx
import { useAsyncLoading } from "@/hooks/usePageLoading";

const { loading, error, execute } = useAsyncLoading();

const handleSubmit = async () => {
  await execute(async () => {
    return await api.createUser(data);
  });
};
```

---

## 📊 Standard Pattern

```jsx
import { Layout } from "@/components/layout/Layout";
import { TableSkeleton } from "@/components/skeletons/TableSkeleton";
import { useState, useEffect } from "react";

export const MyPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const response = await api.getData();
      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <TableSkeleton rows={5} columns={5} />
      </Layout>
    );
  }

  return <Layout>{/* Your content */}</Layout>;
};
```

---

## ⏱️ Timing

| Component        | Duration  | Type             |
| ---------------- | --------- | ---------------- |
| Progress bar     | 300ms     | One-time         |
| Skeleton display | 300ms min | Until data loads |
| Fade transitions | 100-200ms | Smooth           |
| Pulse animation  | 2s        | Infinite loop    |
| Spin animation   | 1s        | Infinite loop    |

---

## 🎯 When to Use What

### Use TableSkeleton when:

- Loading table data
- Pages: Users, Exams, Questions, Results, Enrollments

### Use DashboardSkeleton when:

- Loading dashboard
- Pages: StudentDashboard, AdminDashboard, Analytics

### Use CardListSkeleton when:

- Loading card layouts
- Pages: Courses, ExamMonitoring

### Use PageLoader when:

- Processing forms
- Blocking operations
- Full page actions

### Use ContentLoader when:

- Loading sections
- Non-blocking operations
- Inline content

---

## 🎨 Visual Examples

### Progress Bar

```
┌─────────────────────────────────────────────────────────────┐
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░ │
└─────────────────────────────────────────────────────────────┘
```

### Table Skeleton

```
┌─────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓                   │
│  ──────────────────────────────────────────────────────────│
│  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓                   │
│  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓  ▓▓▓▓▓▓                   │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard Skeleton

```
┌─────────────────────────────────────────────────────────────┐
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ ▓▓▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓▓▓ │ │ ▓▓▓▓▓▓▓▓ │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Load Sequence

```
Navigation Click
      ↓
Progress Bar (0-300ms)
      ↓
Page Mounts (300ms)
      ↓
Skeleton Shows (300ms+)
      ↓
Data Loads (500ms+)
      ↓
Content Appears (600ms+)
```

---

## ✅ Pages with Loading States

**Table Pages:**

- ✅ Users
- ✅ Exams
- ✅ Questions
- ✅ Results
- ✅ Enrollments

**Dashboard Pages:**

- ✅ StudentDashboard
- ✅ AdminDashboard
- ✅ Analytics

**Card Pages:**

- ✅ Courses
- ✅ ExamMonitoring

**All Pages:**

- ✅ PageTransitionLoader (automatic)

---

## 📁 Key Files

**Components:**

- `PageTransitionLoader.jsx` - Progress bar & loaders
- `TableSkeleton.jsx` - Table & card list skeletons
- `DashboardSkeleton.jsx` - Dashboard skeleton
- `StatsCardSkeleton.jsx` - Stats skeletons
- `ExamCardSkeleton.jsx` - Exam & result skeletons

**Hooks:**

- `usePageLoading.js` - Loading state management

**Styles:**

- `index.css` - Animation definitions

---

## 🎉 Features

✅ **Automatic** - Progress bar on every navigation
✅ **Smooth** - 300ms transitions
✅ **No Flash** - Minimum display time
✅ **No Shift** - Skeletons match content
✅ **Responsive** - Works on all devices
✅ **Professional** - Pulse animations
✅ **Fast** - GPU accelerated
✅ **Accessible** - Screen reader friendly

---

## 📚 Full Documentation

For complete details, see:

- `LOADING_STATES_COMPLETE_GUIDE.md` - Full implementation
- `UI_ENHANCEMENTS_CHECKLIST.md` - All features

---

**Status**: ✅ Production Ready - All features working!

**Quick Test**: Navigate between pages to see smooth transitions! 🚀
