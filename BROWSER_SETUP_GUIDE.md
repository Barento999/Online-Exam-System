# Browser Setup Guide for Testing

Visual guide to set up multiple users for testing WebSocket features.

## 🎯 The Problem

```
❌ WRONG WAY:
┌─────────────────────────────────────┐
│  Chrome Browser                     │
├─────────────────────────────────────┤
│  Tab 1: Teacher Login               │
│  Tab 2: Student Login               │
│                                     │
│  Result: Both tabs = Same user!    │
│  (They share localStorage)          │
└─────────────────────────────────────┘
```

## ✅ The Solution

```
✅ CORRECT WAY:
┌─────────────────────────────────────┐
│  Chrome (Normal Window)             │
│  → Teacher Login                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Chrome (Incognito Window)          │
│  → Student Login                    │
└─────────────────────────────────────┘

Result: Different users! ✓
(Separate localStorage)
```

## 📖 Method 1: Incognito Window (Easiest)

### Step-by-Step

**1. Open Normal Browser Window**

```
┌─────────────────────────────────────┐
│  Chrome                             │
│  http://localhost:5173              │
│  Login: teacher@exam.com            │
└─────────────────────────────────────┘
```

**2. Open Incognito Window**

**Windows/Linux:**

- Press: `Ctrl + Shift + N`

**Mac:**

- Press: `Cmd + Shift + N`

```
┌─────────────────────────────────────┐
│  Chrome (Incognito) 🕶️              │
│  http://localhost:5173              │
│  Login: student@exam.com            │
└─────────────────────────────────────┘
```

**3. Result**

```
Window 1 (Normal):     Window 2 (Incognito):
┌──────────────┐      ┌──────────────┐
│   Teacher    │      │   Student    │
│   Monitoring │      │   Taking     │
│   Dashboard  │      │   Exam       │
└──────────────┘      └──────────────┘
       ↓                      ↓
   Real-time updates! ✓
```

## 📖 Method 2: Different Browsers

### Step-by-Step

**1. Open Chrome**

```
┌─────────────────────────────────────┐
│  Chrome                             │
│  http://localhost:5173              │
│  Login: teacher@exam.com            │
└─────────────────────────────────────┘
```

**2. Open Firefox**

```
┌─────────────────────────────────────┐
│  Firefox                            │
│  http://localhost:5173              │
│  Login: student@exam.com            │
└─────────────────────────────────────┘
```

**3. Result**

```
Chrome:                Firefox:
┌──────────────┐      ┌──────────────┐
│   Teacher    │      │   Student    │
└──────────────┘      └──────────────┘
       ↓                      ↓
   Real-time updates! ✓
```

## 📖 Method 3: Browser Profiles

### Chrome Profiles

**1. Create Teacher Profile**

```
1. Click profile icon (top right corner)
2. Click "Add"
3. Name: "Teacher Profile"
4. Click "Add"
```

**2. Create Student Profile**

```
1. Click profile icon
2. Click "Add"
3. Name: "Student Profile"
4. Click "Add"
```

**3. Use Profiles**

```
Profile 1 (Teacher):   Profile 2 (Student):
┌──────────────┐      ┌──────────────┐
│   Teacher    │      │   Student    │
│   Account    │      │   Account    │
└──────────────┘      └──────────────┘
```

### Firefox Profiles

**1. Open Profile Manager**

```
Type in address bar: about:profiles
```

**2. Create Profiles**

```
1. Click "Create a New Profile"
2. Name: "Teacher"
3. Click "Create a New Profile"
4. Name: "Student"
```

**3. Launch Profiles**

```
1. Find "Teacher" profile
2. Click "Launch profile in new browser"
3. Find "Student" profile
4. Click "Launch profile in new browser"
```

## 🎬 Complete Testing Setup

### Scenario: 1 Teacher + 3 Students

```
┌─────────────────────────────────────┐
│  Chrome (Normal)                    │
│  → Teacher Monitoring               │
│  → http://localhost:5173            │
│  → teacher@exam.com                 │
└─────────────────────────────────────┘
              ↓ Monitors
    ┌─────────┴─────────┬─────────┐
    ↓                   ↓         ↓
┌─────────┐      ┌─────────┐  ┌─────────┐
│ Chrome  │      │Firefox  │  │  Edge   │
│Incognito│      │         │  │         │
│Student 1│      │Student 2│  │Student 3│
└─────────┘      └─────────┘  └─────────┘
```

### Setup Commands

**Terminal 1: Backend**

```bash
cd backend
npm run dev
```

**Terminal 2: Frontend**

```bash
cd frontend
npm run dev
```

**Browser 1: Chrome (Normal)**

```
1. Open: http://localhost:5173
2. Login: teacher@exam.com / teacher123
3. Go to: Exams
4. Click: Eye icon (👁️) on published exam
```

**Browser 2: Chrome (Incognito)**

```
1. Press: Ctrl+Shift+N (or Cmd+Shift+N)
2. Open: http://localhost:5173
3. Login: student@exam.com / student123
4. Go to: Exams
5. Click: "Take Exam"
```

**Browser 3: Firefox**

```
1. Open Firefox
2. Open: http://localhost:5173
3. Login: student2@exam.com / student123
   (Create this user first via Register page)
4. Go to: Exams
5. Click: "Take Exam"
```

**Browser 4: Edge**

```
1. Open Edge
2. Open: http://localhost:5173
3. Login: student3@exam.com / student123
   (Create this user first via Register page)
4. Go to: Exams
5. Click: "Take Exam"
```

## 🎥 Visual Testing Flow

```
Step 1: Teacher Opens Monitoring
┌─────────────────────────────────────┐
│  Live Monitoring                    │
│  ┌─────────────────────────────┐   │
│  │ Active Students (0)         │   │
│  │ No students yet...          │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘

Step 2: Student 1 Joins
┌─────────────────────────────────────┐
│  Live Monitoring                    │
│  ┌─────────────────────────────┐   │
│  │ Active Students (1)         │   │
│  │ • John Doe [Active]         │   │
│  │   Progress: 0/10            │   │
│  └─────────────────────────────┘   │
│  Activity Feed:                     │
│  • John Doe joined (10:30 AM)      │
└─────────────────────────────────────┘

Step 3: Student 1 Answers Questions
┌─────────────────────────────────────┐
│  Live Monitoring                    │
│  ┌─────────────────────────────┐   │
│  │ Active Students (1)         │   │
│  │ • John Doe [Active]         │   │
│  │   Progress: 5/10 ████░░░░░  │   │
│  └─────────────────────────────┘   │
│  Activity Feed:                     │
│  • John Doe answered Q5 (10:32)    │
│  • John Doe joined (10:30 AM)      │
└─────────────────────────────────────┘

Step 4: Student 2 Joins
┌─────────────────────────────────────┐
│  Live Monitoring                    │
│  ┌─────────────────────────────┐   │
│  │ Active Students (2)         │   │
│  │ • John Doe [Active]         │   │
│  │   Progress: 5/10 ████░░░░░  │   │
│  │ • Jane Smith [Active]       │   │
│  │   Progress: 0/10 ░░░░░░░░░  │   │
│  └─────────────────────────────┘   │
│  Activity Feed:                     │
│  • Jane Smith joined (10:33 AM)    │
│  • John Doe answered Q5 (10:32)    │
└─────────────────────────────────────┘

Step 5: Student 1 Submits
┌─────────────────────────────────────┐
│  Live Monitoring                    │
│  ┌─────────────────────────────┐   │
│  │ Active Students (2)         │   │
│  │ • John Doe [Submitted] ✓    │   │
│  │   Progress: 10/10 ██████████│   │
│  │ • Jane Smith [Active]       │   │
│  │   Progress: 3/10 ███░░░░░░░ │   │
│  └─────────────────────────────┘   │
│  Activity Feed:                     │
│  • John Doe submitted (10:35 AM)   │
│  • Jane Smith joined (10:33 AM)    │
└─────────────────────────────────────┘
```

## 🔧 Keyboard Shortcuts

### Open Incognito/Private Window

| Browser | Windows/Linux | Mac         |
| ------- | ------------- | ----------- |
| Chrome  | Ctrl+Shift+N  | Cmd+Shift+N |
| Firefox | Ctrl+Shift+P  | Cmd+Shift+P |
| Edge    | Ctrl+Shift+N  | Cmd+Shift+N |
| Safari  | -             | Cmd+Shift+N |

### Open DevTools

| Action   | Windows/Linux       | Mac          |
| -------- | ------------------- | ------------ |
| DevTools | F12 or Ctrl+Shift+I | Cmd+Option+I |
| Console  | Ctrl+Shift+J        | Cmd+Option+J |

## 📝 Quick Checklist

Before testing:

- [ ] Backend running
- [ ] Frontend running
- [ ] At least 1 published exam
- [ ] Know how to open incognito

For each test:

- [ ] Teacher in normal window
- [ ] Student in incognito/different browser
- [ ] Both on same exam
- [ ] Check "Connected" status

## 💡 Pro Tips

**Tip 1:** Keep teacher window on left monitor, student on right
**Tip 2:** Use browser profiles for frequent testing
**Tip 3:** Create multiple student accounts beforehand
**Tip 4:** Keep DevTools open to monitor WebSocket
**Tip 5:** Bookmark the monitoring URL for quick access

## 🐛 Common Mistakes

❌ **Mistake 1:** Opening two tabs in same browser

```
Tab 1: Teacher
Tab 2: Student
Result: Both show same user ❌
```

✅ **Fix:** Use incognito or different browser

❌ **Mistake 2:** Forgetting to use different exam

```
Teacher monitoring Exam A
Student taking Exam B
Result: No updates ❌
```

✅ **Fix:** Ensure both on same exam

❌ **Mistake 3:** Not checking connection status

```
"Disconnected" badge showing
Result: No real-time updates ❌
```

✅ **Fix:** Check backend is running, refresh page

## 📞 Need Help?

See [TESTING_QUICK_REFERENCE.md](TESTING_QUICK_REFERENCE.md) for more details!

---

**Remember:** Each user = Separate browser context! 🎯
