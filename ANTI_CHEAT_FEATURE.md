# Advanced Anti-Cheating System

## Overview

Comprehensive anti-cheating measures to maintain exam integrity and prevent academic dishonesty during online exams.

## Features Implemented

### 1. Tab/Window Switch Detection

- **Monitors**: When students switch to another tab or window
- **Action**: Logs violation and shows warning
- **Counter**: Displays number of tab switches in header
- **Notification**: "⚠️ Warning: Tab switching detected!"

### 2. Copy/Paste Prevention

- **Blocks**: Ctrl+C, Ctrl+V, Ctrl+X
- **Prevents**: Copying questions or pasting answers
- **Notification**: "Copying/Pasting is disabled during exam"
- **Logging**: Records all copy/paste attempts

### 3. Right-Click Disable

- **Blocks**: Context menu (right-click)
- **Prevents**: Inspecting elements, copying, etc.
- **Notification**: "Right-click is disabled during exam"
- **Logging**: Records right-click attempts

### 4. Keyboard Shortcut Prevention

- **Blocks**:
  - Ctrl+C / Cmd+C (Copy)
  - Ctrl+V / Cmd+V (Paste)
  - Ctrl+X / Cmd+X (Cut)
  - Ctrl+A / Cmd+A (Select All)
  - Ctrl+P / Cmd+P (Print)
  - Ctrl+S / Cmd+S (Save)
  - F12 (Developer Tools)
- **Notification**: "Keyboard shortcuts are disabled during exam"
- **Logging**: Records which shortcut was attempted

### 5. Fullscreen Mode (Optional)

- **Prompt**: Asks student to enable fullscreen at exam start
- **Monitoring**: Detects when student exits fullscreen
- **Warning**: "⚠️ Please return to fullscreen mode"
- **Logging**: Records fullscreen exits

### 6. Developer Tools Prevention

- **Blocks**: F12 key
- **Prevents**: Opening browser DevTools
- **Notification**: "Developer tools are disabled during exam"
- **Logging**: Records DevTools attempts

### 7. Real-Time Violation Tracking

- **Counter**: Shows total violations in header
- **Visual Indicator**: Shield icon (green = clean, red = violations)
- **Detailed Logging**: Timestamps and types of all violations
- **Summary**: Categorized violation counts

## Anti-Cheat Indicators

### Header Display:

```
┌─────────────────────────────────────────────────┐
│ Live | Anti-Cheat: Active | Questions: 5/10    │
│      | (or "3 warnings")  | Time: 45:00        │
└─────────────────────────────────────────────────┘
```

### Color Coding:

- **Green Shield**: No violations detected
- **Red Shield**: Violations detected
- **Number**: Count of tab switches (most common violation)

## Violation Types Tracked

1. **TAB_SWITCH**: Student switched to another tab/window
2. **COPY_ATTEMPT**: Attempted to copy content
3. **PASTE_ATTEMPT**: Attempted to paste content
4. **RIGHT_CLICK**: Attempted to right-click
5. **KEYBOARD_SHORTCUT**: Used blocked keyboard shortcut
6. **DEVTOOLS_ATTEMPT**: Attempted to open developer tools
7. **FULLSCREEN_EXIT**: Exited fullscreen mode

## Technical Implementation

### Custom Hook: `useAntiCheat`

```javascript
const {
  violations, // Array of all violations
  tabSwitchCount, // Number of tab switches
  isFullscreen, // Current fullscreen status
  requestFullscreen, // Function to enter fullscreen
  exitFullscreen, // Function to exit fullscreen
  getViolationSummary, // Get categorized counts
} = useAntiCheat(examId, onSuspiciousActivity);
```

### Event Listeners:

- `visibilitychange` - Tab switching
- `copy`, `paste`, `cut` - Clipboard events
- `contextmenu` - Right-click
- `keydown` - Keyboard shortcuts
- `fullscreenchange` - Fullscreen status

### Violation Object Structure:

```javascript
{
  type: "TAB_SWITCH",
  timestamp: "2026-03-14T10:30:45.123Z",
  message: "Student switched to another tab/window"
}
```

## User Experience

### For Students

#### Starting Exam:

1. Exam loads
2. Fullscreen prompt appears (optional)
3. Anti-cheat monitoring begins
4. Shield icon shows "Active" status

#### During Exam:

- All anti-cheat measures active
- Violations trigger immediate warnings
- Counter updates in real-time
- Can still navigate questions normally

#### Violations:

- Toast notification appears
- Violation logged with timestamp
- Counter increments
- Shield icon turns red

#### Ending Exam:

- Submit exam normally
- Fullscreen exits automatically
- Anti-cheat monitoring stops

### For Teachers

Teachers can see (via monitoring):

- Student connection status
- Progress through exam
- Real-time activity feed
- (Future: Violation reports)

## Benefits

1. **Deters Cheating**: Students know they're being monitored
2. **Fair Testing**: All students have same restrictions
3. **Evidence Collection**: Violations logged with timestamps
4. **Non-Intrusive**: Doesn't interfere with legitimate exam-taking
5. **Transparent**: Students see their violation count
6. **Flexible**: Can be enhanced with more checks

## Limitations & Considerations

### What It CAN Detect:

- ✅ Tab switching
- ✅ Copy/paste attempts
- ✅ Right-click attempts
- ✅ Keyboard shortcut usage
- ✅ Fullscreen exits
- ✅ DevTools attempts

### What It CANNOT Detect:

- ❌ Second device usage (phone, tablet)
- ❌ Physical notes or books
- ❌ Another person helping
- ❌ Screen sharing to another person
- ❌ Camera-based cheating
- ❌ Virtual machine usage

### Privacy Considerations:

- Does NOT access webcam
- Does NOT record screen
- Does NOT track mouse movements
- Does NOT access files
- Only monitors browser events
- All client-side (no spyware)

## Future Enhancements (Optional)

1. **Webcam Monitoring**: Require webcam during exam
2. **Face Recognition**: Verify student identity
3. **Eye Tracking**: Detect looking away from screen
4. **Screen Recording**: Record exam session
5. **AI Proctoring**: Automated suspicious behavior detection
6. **Multiple Monitor Detection**: Detect second screens
7. **Mobile Device Detection**: Detect phone usage
8. **Network Monitoring**: Detect suspicious network activity
9. **Violation Reports**: Send detailed reports to teachers
10. **Automatic Flagging**: Flag exams with high violation counts

## Configuration Options (Future)

Allow teachers to configure:

- Enable/disable specific checks
- Set violation thresholds
- Require fullscreen mode
- Auto-fail on X violations
- Send real-time alerts
- Generate violation reports

## Testing

### Test Anti-Cheat Features:

1. **Tab Switching**:
   - Start exam
   - Press Alt+Tab or click another window
   - Verify warning appears
   - Check counter increments

2. **Copy/Paste**:
   - Try to copy question text (Ctrl+C)
   - Try to paste (Ctrl+V)
   - Verify blocked and warning shown

3. **Right-Click**:
   - Right-click anywhere on exam
   - Verify context menu blocked
   - Verify warning shown

4. **Keyboard Shortcuts**:
   - Try Ctrl+C, Ctrl+V, Ctrl+A, F12
   - Verify all blocked
   - Verify warnings shown

5. **Fullscreen**:
   - Enable fullscreen
   - Press Esc to exit
   - Verify warning appears

6. **Violation Counter**:
   - Trigger multiple violations
   - Verify counter updates
   - Verify shield turns red

## Best Practices

### For Teachers:

1. **Inform Students**: Tell students about anti-cheat before exam
2. **Test First**: Do a practice exam to familiarize students
3. **Be Reasonable**: Some violations may be accidental
4. **Review Violations**: Check violation logs after exam
5. **Combine Methods**: Use with question randomization

### For Students:

1. **Close Other Tabs**: Before starting exam
2. **Disable Notifications**: Turn off system notifications
3. **Stable Connection**: Ensure good internet
4. **Quiet Environment**: Minimize distractions
5. **Read Instructions**: Understand anti-cheat measures

## Troubleshooting

### False Positives:

- **Issue**: Accidental tab switch
- **Solution**: Students can continue, just be careful

### Fullscreen Issues:

- **Issue**: Can't enter fullscreen
- **Solution**: It's optional, can skip

### Notifications Blocked:

- **Issue**: Warnings not showing
- **Solution**: Enable browser notifications

### Performance Issues:

- **Issue**: Exam running slow
- **Solution**: Close other applications

## Files Created/Modified

1. `frontend/src/hooks/useAntiCheat.js` - Anti-cheat hook
2. `frontend/src/pages/TakeExam.jsx` - Integrated anti-cheat
3. `ANTI_CHEAT_FEATURE.md` - This documentation

## Dependencies

All required dependencies already installed:

- `react-hot-toast` - For notifications
- `lucide-react` - For icons
- React hooks - For event handling

## Legal & Ethical Considerations

### Transparency:

- Students must be informed about monitoring
- Clear communication about what's tracked
- Privacy policy should cover anti-cheat

### Fairness:

- Same rules for all students
- Reasonable accommodations for disabilities
- Clear violation policies

### Data Protection:

- Violation logs should be secure
- Limited retention period
- GDPR/privacy law compliance

## Conclusion

The anti-cheating system provides a robust set of measures to maintain exam integrity while respecting student privacy. It focuses on preventing common cheating methods through browser-level controls and real-time monitoring, creating a fair testing environment for all students.

The system is transparent (students see their violation count), non-invasive (no webcam/screen recording), and effective at deterring most common cheating attempts. Combined with question randomization and time limits, it creates a comprehensive exam security solution.
