# WebSocket Flow Diagrams

Visual representation of the WebSocket real-time monitoring flows.

## Connection Flow

```
┌─────────────┐                                    ┌─────────────┐
│   Student   │                                    │   Teacher   │
│   Browser   │                                    │   Browser   │
└──────┬──────┘                                    └──────┬──────┘
       │                                                  │
       │ 1. Login & Get JWT Token                        │ 1. Login & Get JWT Token
       │                                                  │
       ▼                                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Socket.IO Server                              │
│                  (backend/src/config/socket.js)                  │
└─────────────────────────────────────────────────────────────────┘
       │                                                  │
       │ 2. Authenticate with JWT                        │ 2. Authenticate with JWT
       │                                                  │
       ▼                                                  ▼
   ✅ Connected                                      ✅ Connected
```

## Student Taking Exam Flow

```
┌─────────────┐
│   Student   │
│   Browser   │
└──────┬──────┘
       │
       │ 1. Navigate to /exams/:examId/take
       │
       ▼
┌─────────────────────────────┐
│  TakeExam Component         │
│  + useExamSession Hook      │
└──────┬──────────────────────┘
       │
       │ 2. emit('join-exam', { examId, studentId })
       │
       ▼
┌─────────────────────────────┐
│  Socket.IO Server           │
│  Room: exam-{examId}        │
└──────┬──────────────────────┘
       │
       │ 3. Broadcast to room
       │
       ▼
┌─────────────────────────────┐
│  All Monitors in Room       │
│  (Teachers/Admins)          │
└──────┬──────────────────────┘
       │
       │ 4. on('student-joined')
       │
       ▼
   Update UI: Student appears in list
```

## Progress Update Flow

```
┌─────────────┐
│   Student   │
│  Answers Q  │
└──────┬──────┘
       │
       │ 1. handleAnswerChange()
       │
       ▼
┌─────────────────────────────┐
│  updateProgress()           │
│  (useExamSession hook)      │
└──────┬──────────────────────┘
       │
       │ 2. emit('exam-progress', {
       │      examId,
       │      studentId,
       │      currentQuestion,
       │      answeredCount
       │    })
       │
       ▼
┌─────────────────────────────┐
│  Socket.IO Server           │
│  Updates session data       │
└──────┬──────────────────────┘
       │
       │ 3. Broadcast to room
       │
       ▼
┌─────────────────────────────┐
│  All Monitors in Room       │
└──────┬──────────────────────┘
       │
       │ 4. on('student-progress')
       │
       ▼
   Update UI: Progress bar moves
```

## Exam Submission Flow

```
┌─────────────┐
│   Student   │
│  Submits    │
└──────┬──────┘
       │
       │ 1. handleSubmitExam()
       │
       ▼
┌─────────────────────────────┐
│  API: examsApi.submit()     │
│  (HTTP POST)                │
└──────┬──────────────────────┘
       │
       │ 2. Exam saved to DB
       │
       ▼
┌─────────────────────────────┐
│  notifySubmit()             │
│  (useExamSession hook)      │
└──────┬──────────────────────┘
       │
       │ 3. emit('exam-submitted', {
       │      examId,
       │      studentId
       │    })
       │
       ▼
┌─────────────────────────────┐
│  Socket.IO Server           │
│  Updates session status     │
└──────┬──────────────────────┘
       │
       │ 4. Broadcast to room
       │
       ▼
┌─────────────────────────────┐
│  All Monitors in Room       │
└──────┬──────────────────────┘
       │
       │ 5. on('student-submitted')
       │
       ▼
   Update UI: Status = "Submitted"
   Activity Feed: "Student submitted"
```

## Teacher Monitoring Flow

```
┌─────────────┐
│   Teacher   │
│   Browser   │
└──────┬──────┘
       │
       │ 1. Navigate to /exams/:examId/monitor
       │
       ▼
┌─────────────────────────────┐
│  ExamMonitoring Component   │
│  + useExamMonitoring Hook   │
└──────┬──────────────────────┘
       │
       │ 2. emit('monitor-exam', { examId })
       │
       ▼
┌─────────────────────────────┐
│  Socket.IO Server           │
│  Room: exam-{examId}        │
└──────┬──────────────────────┘
       │
       │ 3. Send current active students
       │
       ▼
┌─────────────────────────────┐
│  Teacher Browser            │
└──────┬──────────────────────┘
       │
       │ 4. on('active-students')
       │
       ▼
   Display: List of active students

   Then listen for:
   - student-joined
   - student-progress
   - student-submitted
   - student-left
   - student-disconnected
```

## Disconnection Flow

```
┌─────────────┐
│   Student   │
│  Network ❌  │
└──────┬──────┘
       │
       │ Connection lost
       │
       ▼
┌─────────────────────────────┐
│  Socket.IO Server           │
│  Detects disconnect         │
└──────┬──────────────────────┘
       │
       │ 1. on('disconnect')
       │
       ▼
┌─────────────────────────────┐
│  Update session status      │
│  status = "disconnected"    │
└──────┬──────────────────────┘
       │
       │ 2. Broadcast to room
       │
       ▼
┌─────────────────────────────┐
│  All Monitors in Room       │
└──────┬──────────────────────┘
       │
       │ 3. on('student-disconnected')
       │
       ▼
   Update UI: Status = "Disconnected"
   Activity Feed: "Student disconnected"
```

## Complete Event Flow

```
┌──────────────────────────────────────────────────────────────┐
│                        Student Events                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  join-exam ──────────────────────────────────────────────┐  │
│       │                                                    │  │
│       ▼                                                    │  │
│  [Server: Add to room]                                    │  │
│       │                                                    │  │
│       ▼                                                    │  │
│  student-joined ──────────────────────────────────────────┼──┼──> Monitors
│                                                            │  │
│  exam-progress ───────────────────────────────────────────┐  │
│       │                                                    │  │
│       ▼                                                    │  │
│  [Server: Update session]                                 │  │
│       │                                                    │  │
│       ▼                                                    │  │
│  student-progress ────────────────────────────────────────┼──┼──> Monitors
│                                                            │  │
│  exam-submitted ──────────────────────────────────────────┐  │
│       │                                                    │  │
│       ▼                                                    │  │
│  [Server: Mark submitted]                                 │  │
│       │                                                    │  │
│       ▼                                                    │  │
│  student-submitted ───────────────────────────────────────┼──┼──> Monitors
│                                                            │  │
│  leave-exam ──────────────────────────────────────────────┐  │
│       │                                                    │  │
│       ▼                                                    │  │
│  [Server: Remove from room]                               │  │
│       │                                                    │  │
│       ▼                                                    │  │
│  student-left ────────────────────────────────────────────┼──┼──> Monitors
│                                                            │  │
└────────────────────────────────────────────────────────────┘  │
                                                                 │
┌──────────────────────────────────────────────────────────────┐  │
│                       Monitor Events                          │  │
├──────────────────────────────────────────────────────────────┤  │
│                                                               │  │
│  monitor-exam ────────────────────────────────────────────┐  │  │
│       │                                                    │  │  │
│       ▼                                                    │  │  │
│  [Server: Join room]                                      │  │  │
│       │                                                    │  │  │
│       ▼                                                    │  │  │
│  active-students ◄────────────────────────────────────────┼──┼──┘
│                                                            │  │
│  Listen for all student events ◄──────────────────────────┼──┘
│                                                            │
└────────────────────────────────────────────────────────────┘
```

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend Layer                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │  TakeExam Page   │         │ ExamMonitoring   │         │
│  │                  │         │      Page        │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                            │                    │
│           ▼                            ▼                    │
│  ┌──────────────────┐         ┌──────────────────┐         │
│  │ useExamSession   │         │useExamMonitoring │         │
│  │      Hook        │         │      Hook        │         │
│  └────────┬─────────┘         └────────┬─────────┘         │
│           │                            │                    │
│           └────────────┬───────────────┘                    │
│                        │                                    │
│                        ▼                                    │
│           ┌────────────────────────┐                        │
│           │   SocketContext        │                        │
│           │   (Socket.IO Client)   │                        │
│           └────────────┬───────────┘                        │
│                        │                                    │
└────────────────────────┼────────────────────────────────────┘
                         │
                         │ WebSocket Connection
                         │ (JWT Authentication)
                         │
┌────────────────────────┼────────────────────────────────────┐
│                        │         Backend Layer               │
├────────────────────────┼────────────────────────────────────┤
│                        ▼                                     │
│           ┌────────────────────────┐                        │
│           │   Socket.IO Server     │                        │
│           │  (config/socket.js)    │                        │
│           └────────────┬───────────┘                        │
│                        │                                     │
│                        ▼                                     │
│           ┌────────────────────────┐                        │
│           │  Active Exam Sessions  │                        │
│           │    (In-Memory Map)     │                        │
│           └────────────────────────┘                        │
│                                                              │
│  Room Structure:                                            │
│  exam-{examId}                                              │
│    ├── Student 1 (socket)                                   │
│    ├── Student 2 (socket)                                   │
│    ├── Teacher 1 (socket)                                   │
│    └── Admin 1 (socket)                                     │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## State Management

```
┌─────────────────────────────────────────────────────────────┐
│                    Session State                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  activeExamSessions (Map)                                   │
│    │                                                         │
│    ├── examId: "65f123..."                                  │
│    │     │                                                   │
│    │     ├── studentId: "65f456..."                         │
│    │     │     ├── socketId: "abc123"                       │
│    │     │     ├── studentName: "John Doe"                  │
│    │     │     ├── joinedAt: Date                           │
│    │     │     ├── status: "active"                         │
│    │     │     ├── currentQuestion: 5                       │
│    │     │     └── answeredCount: 8                         │
│    │     │                                                   │
│    │     └── studentId: "65f789..."                         │
│    │           ├── socketId: "def456"                       │
│    │           ├── studentName: "Jane Smith"                │
│    │           ├── joinedAt: Date                           │
│    │           ├── status: "submitted"                      │
│    │           ├── currentQuestion: 10                      │
│    │           └── answeredCount: 10                        │
│    │                                                         │
│    └── examId: "65fabc..."                                  │
│          └── ...                                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

## UI Component Hierarchy

```
App
 └── SocketProvider ◄─── Wraps entire app
      │
      ├── Student Flow
      │    └── TakeExam
      │         ├── useExamSession ◄─── Uses socket from context
      │         └── Connection Indicator
      │
      └── Teacher Flow
           └── ExamMonitoring
                ├── useExamMonitoring ◄─── Uses socket from context
                └── LiveExamMonitor
                     ├── Active Students List
                     │    ├── Student Card
                     │    │    ├── Name
                     │    │    ├── Status Badge
                     │    │    ├── Progress Bar
                     │    │    └── Timestamps
                     │    └── ...
                     │
                     └── Activity Feed
                          ├── Event Item
                          │    ├── Message
                          │    └── Timestamp
                          └── ...
```

This visual documentation helps understand how all the pieces fit together!
