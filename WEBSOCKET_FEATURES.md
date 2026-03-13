# WebSocket Real-Time Features

This document describes the real-time WebSocket features implemented in the Online Exam System.

## Overview

The system now includes real-time monitoring capabilities using Socket.IO, allowing teachers and admins to monitor students taking exams in real-time.

## Features

### 1. Live Exam Monitoring

Teachers and admins can monitor students taking exams in real-time with the following information:

- **Active Students List**: See all students currently taking the exam
- **Student Status**: Active, Submitted, or Disconnected
- **Progress Tracking**: See how many questions each student has answered
- **Join/Leave Notifications**: Get notified when students join or leave the exam
- **Activity Feed**: Real-time feed of all exam activities

### 2. Student Exam Session

Students taking exams have:

- **Live Connection Status**: Visual indicator showing connection status
- **Automatic Progress Updates**: Progress is automatically sent to monitors
- **Submission Notifications**: Teachers are notified when students submit

## Technical Implementation

### Backend

**Dependencies:**

- `socket.io` - WebSocket server implementation

**Files:**

- `backend/src/config/socket.js` - Socket.IO configuration and event handlers
- `backend/src/server.js` - HTTP server with Socket.IO integration

**Events Emitted by Server:**

- `active-students` - List of students currently in the exam
- `student-joined` - When a student joins the exam
- `student-progress` - When a student answers questions
- `student-submitted` - When a student submits the exam
- `student-left` - When a student leaves the exam
- `student-disconnected` - When a student's connection drops

**Events Received by Server:**

- `join-exam` - Student joins an exam room
- `monitor-exam` - Teacher/admin starts monitoring
- `exam-progress` - Student progress update
- `exam-submitted` - Student submits exam
- `leave-exam` - Student leaves exam room

### Frontend

**Dependencies:**

- `socket.io-client` - WebSocket client implementation

**Files:**

- `frontend/src/context/SocketContext.jsx` - Socket connection provider
- `frontend/src/hooks/useExamSession.js` - Hook for student exam sessions
- `frontend/src/hooks/useExamMonitoring.js` - Hook for monitoring exams
- `frontend/src/components/common/LiveExamMonitor.jsx` - Monitoring UI component
- `frontend/src/pages/ExamMonitoring.jsx` - Full monitoring page
- `frontend/src/pages/TakeExam.jsx` - Updated with WebSocket integration

## Usage

### For Teachers/Admins

1. Navigate to the Exams page
2. Find a published exam
3. Click the eye icon (👁️) to start monitoring
4. View real-time student activity

### For Students

1. Take an exam as usual
2. Connection status is shown in the header
3. Progress is automatically tracked
4. No additional action required

## Authentication

WebSocket connections are authenticated using JWT tokens:

```javascript
const socket = io(SOCKET_URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
});
```

## Data Structure

### Active Student Session

```javascript
{
  studentId: "65f1234567890abcdef12345",
  studentName: "John Doe",
  status: "active", // "active" | "submitted" | "disconnected"
  joinedAt: "2026-03-14T10:00:00Z",
  currentQuestion: 5,
  answeredCount: 8
}
```

### Activity Event

```javascript
{
  type: "joined", // "joined" | "submitted" | "disconnected"
  message: "John Doe joined the exam",
  timestamp: "2026-03-14T10:00:00Z"
}
```

## Configuration

### Backend Environment Variables

No additional environment variables required. Uses existing:

- `CORS_ORIGIN` - For WebSocket CORS configuration
- `JWT_SECRET` - For authentication

### Frontend Environment Variables

Uses existing:

- `VITE_API_URL` - Automatically derives WebSocket URL

## Security

- **Authentication**: All connections require valid JWT token
- **Authorization**: Role-based access (students can only join, teachers/admins can monitor)
- **Room Isolation**: Students can only join their own exam sessions
- **Automatic Cleanup**: Disconnected sessions are tracked and cleaned up

## Performance Considerations

- **Connection Pooling**: Socket.IO handles connection pooling automatically
- **Event Throttling**: Progress updates are sent on answer changes, not continuously
- **Memory Management**: Active sessions are stored in memory (Map structure)
- **Scalability**: For production with multiple servers, consider Redis adapter

## Future Enhancements

1. **Redis Adapter**: For multi-server deployments
2. **Reconnection Handling**: Better UX for connection drops
3. **Bandwidth Optimization**: Compress large payloads
4. **Analytics**: Store real-time data for post-exam analysis
5. **Alerts**: Notify teachers of suspicious activity
6. **Video Streaming**: Add video proctoring capabilities

## Troubleshooting

### Connection Issues

**Problem**: Socket not connecting

**Solutions**:

- Check JWT token is valid
- Verify backend server is running
- Check CORS configuration
- Ensure WebSocket port is not blocked

### Missing Updates

**Problem**: Not receiving real-time updates

**Solutions**:

- Check socket connection status
- Verify user is in correct room
- Check browser console for errors
- Ensure event listeners are properly set up

### Performance Issues

**Problem**: Slow updates or lag

**Solutions**:

- Check network latency
- Reduce number of concurrent connections
- Consider implementing Redis adapter
- Optimize event payload size

## Testing

### Manual Testing

1. **Student Session**:
   - Login as student
   - Start taking an exam
   - Check connection indicator
   - Answer questions and verify progress updates

2. **Teacher Monitoring**:
   - Login as teacher
   - Open exam monitoring page
   - Have students join the exam
   - Verify real-time updates appear

3. **Disconnection Handling**:
   - Start exam as student
   - Disconnect network
   - Verify disconnection is detected
   - Reconnect and verify recovery

### Automated Testing

Consider adding:

- Socket.IO client tests
- Integration tests for event flows
- Load testing for concurrent connections

## API Reference

### useExamSession Hook

```javascript
const { updateProgress, submitExam, connected } = useExamSession(
  examId,
  studentId,
);

// Update progress
updateProgress(currentQuestion, answeredCount);

// Notify submission
submitExam();

// Check connection
if (connected) {
  // Connected
}
```

### useExamMonitoring Hook

```javascript
const { activeStudents, events, connected } = useExamMonitoring(examId);

// activeStudents: Array of student session objects
// events: Array of activity events
// connected: Boolean connection status
```

## Support

For issues or questions:

1. Check browser console for errors
2. Verify backend logs for connection issues
3. Review this documentation
4. Check Socket.IO documentation: https://socket.io/docs/
