# Multi-Step Form Overlay Display Fix

## Issue

The multi-step form windows were not appearing fully on screen due to restrictive CSS styling that limited the height and prevented proper scrolling.

## Root Cause

The overlay containers were using:

- `max-h-[95vh]` which limited the maximum height
- `overflow-hidden` which prevented scrolling
- `items-center` which centered content but could cut off tall content

## Solution Applied

### Before (Problematic CSS):

```jsx
<div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
  <div className="w-full max-w-6xl max-h-[95vh] overflow-hidden">
    <MultiStepForm ... />
  </div>
</div>
```

### After (Fixed CSS):

```jsx
<div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
  <div className="w-full max-w-6xl min-h-screen flex items-center justify-center py-8">
    <div className="w-full">
      <MultiStepForm ... />
    </div>
  </div>
</div>
```

## Key Changes

1. **Changed `items-center` to `items-start`**: Prevents content from being cut off at the top
2. **Added `overflow-y-auto`**: Enables vertical scrolling when content exceeds viewport
3. **Removed `max-h-[95vh] overflow-hidden`**: Eliminates height restrictions
4. **Added `min-h-screen`**: Ensures proper vertical centering space
5. **Added `py-8`**: Provides padding at top and bottom for better spacing
6. **Wrapped form in additional div**: Better control over form positioning

## Benefits

- ✅ **Full Visibility**: Multi-step forms now display completely on screen
- ✅ **Responsive**: Works on all screen sizes and orientations
- ✅ **Scrollable**: Long forms can be scrolled when needed
- ✅ **Centered**: Forms remain properly centered horizontally
- ✅ **Accessible**: Better keyboard navigation and screen reader support

## Files Updated

1. `frontend/src/pages/Users.jsx` - Fixed MultiStepUserForm overlay
2. `frontend/src/pages/Exams.jsx` - Fixed MultiStepExamForm overlay
3. `frontend/src/pages/Questions.jsx` - Fixed MultiStepQuestionForm overlay

## Testing

The fix ensures that:

- Multi-step forms appear fully visible on all screen sizes
- Content can be scrolled when it exceeds viewport height
- Forms remain properly centered and accessible
- No content is cut off or hidden

This resolves the "window not fully appeared" issue and provides a better user experience for the multi-step form functionality.
