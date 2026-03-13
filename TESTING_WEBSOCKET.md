# Testing WebSocket Real-Time Features

Quick guide to test the new real-time exam monitoring features.

## Prerequisites

1. Backend and frontend servers running
2. At least one teacher and one student account
3. A published exam with questions

## Step-by-Step Testing

### 1. Setup Test Data

If you haven't already, seed the database:

```bash
cd backend
npm run seed
```

This creates:

- Teacher: teacher@exam.com / teacher123
- Student: student@exam.com / student123
- Sample exams and questions

### 2. Start Servers

**Terminal 1 - Backend:**

```bash
cd backend
npm run dev
```

You should see:

```
Server running in development mode on port 3000
WebSocket server initialized
```

**Terminal 2 - Frontend:**

```bash
cd frontend
npm run dev
```

### 3. Test Live Monitoring

#### A. Open Teacher View

1. Open browser: http://localhost:5173
2. Login as teacher (teacher@exam.com / teacher123)
3. Navigate to "Exams" page
4. Find a published exam
5. Click the eye icon (👁️) to open monitoring
6. You should see "Live Monitoring" page with "Connected" badge

#### B. Open Student View

1. Open a new browser window (or incognito)
2. Go to: http://localhost:5173
3. Login as student (student@exam.com / student123)
4. Navigate to "Exams" page
5. Click "Take Exam" on a published exam

#### C. Observe Real-Time Updates

In the teacher's monitoring view, you should see:

1. **Student Joined**: Student appears in "Active Students" list
2. **Activity Feed**: "Student joined the exam" message
3. **Connection Status**: Green "Live" indicator

#### D. Test Progress Updates

As the student:

1. Answer some questions
2. Move between questions

In the teacher's view:

1. Watch the progress bar update in real-time
2. See "Progress: X/Y" update automatically
3. No page refresh needed!

#### E. Test Submission

As the student:

1. Complete the exam
2. Click "Submit Exam"

In the teacher's view:

1. Student status changes to "Submitted" (blue badge)
2. Activity feed shows "Student submitted the exam"
3. Progress shows 100%

### 4. Test Connection Status

#### A. Student Connection Indicator

While taking an exam, students see:

- 🟢 Green WiFi icon = Connected
- 🔴 Red WiFi icon = Disconnected

#### B. Test Disconnection

1. Student takes exam
2. Open browser DevTools (F12)
3. Go to Network tab
4. Set throttling to "Offline"
5. Watch connection indicator turn red
6. Teacher sees "disconnected" status

### 5. Test Multiple Students

1. Open 3+ browser windows/tabs
2. Login as different students in each
3. Have all students join the same exam
4. Teacher monitoring shows all students
5. Each student's progress updates independently

## Expected Behavior

### Teacher/Admin Monitoring View

✅ Shows all active students
✅ Real-time progress updates
✅ Activity feed with timestamps
✅ Status badges (Active/Submitted/Disconnected)
✅ Connection status indicator
✅ No page refresh needed

### Student Exam View

✅ Connection status indicator in header
✅ Seamless exam experience
✅ Progress automatically tracked
✅ No performance impact

## Common Issues

### Issue: "Disconnected" Status

**Cause**: WebSocket connection failed

**Check**:

1. Backend server is running
2. No firewall blocking WebSocket
3. JWT token is valid
4. Browser console for errors

**Fix**:

```bash
# Restart backend
cd backend
npm run dev
```

### Issue: No Real-Time Updates

**Cause**: Not in same exam room

**Check**:

1. Teacher monitoring correct exam
2. Student taking correct exam
3. Exam is published
4. Both users authenticated

**Fix**: Refresh both pages and try again

### Issue: Connection Keeps Dropping

**Cause**: Network issues or token expiration

**Check**:

1. Network stability
2. JWT token expiration (default 7 days)
3. Browser console errors

**Fix**: Re-login to get fresh token

## Browser Console Debugging

### Check Connection

Open browser console (F12) and look for:

```
Socket connected
Student John Doe joined exam 65f1234567890abcdef12345
```

### Check Events

In console, you can manually test:

```javascript
// Check if socket exists
window.socket;

// Listen to events
socket.on("student-joined", (data) => console.log("Joined:", data));
socket.on("student-progress", (data) => console.log("Progress:", data));
```

## Performance Testing

### Test with Multiple Students

1. Open 10+ browser tabs
2. Login as different students
3. All join same exam
4. Monitor memory usage
5. Check for lag or delays

**Expected**: Smooth updates with minimal delay (<1 second)

### Test Network Conditions

Use browser DevTools to simulate:

- Slow 3G
- Fast 3G
- Offline

**Expected**: Graceful degradation, clear status indicators

## Automated Testing (Optional)

Create a test script:

```javascript
// test-websocket.js
const io = require("socket.io-client");

const socket = io("http://localhost:3000", {
  auth: { token: "YOUR_JWT_TOKEN" },
});

socket.on("connect", () => {
  console.log("Connected!");
  socket.emit("join-exam", {
    examId: "EXAM_ID",
    studentId: "STUDENT_ID",
  });
});

socket.on("active-students", (students) => {
  console.log("Active students:", students);
});
```

Run:

```bash
node test-websocket.js
```

## Success Criteria

✅ Teacher can see students join in real-time
✅ Progress updates appear without refresh
✅ Activity feed shows all events
✅ Connection status is accurate
✅ Multiple students work simultaneously
✅ Disconnections are detected
✅ No errors in console
✅ Performance is smooth

## Next Steps

After successful testing:

1. Test with real users
2. Monitor server logs
3. Check for memory leaks
4. Optimize if needed
5. Deploy to production

## Support

If you encounter issues:

1. Check [WEBSOCKET_FEATURES.md](WEBSOCKET_FEATURES.md)
2. Review browser console
3. Check backend logs
4. Verify Socket.IO version compatibility

Happy testing! 🚀
