# Quick Testing Reference

## 🚨 Important: Testing with Multiple Users

**Problem:** Opening two tabs in the same browser logs you in as the same user because they share `localStorage`.

**Solution:** Use separate browser contexts for each user.

## 🎯 Quick Setup for Testing

### Scenario 1: Teacher Monitoring + 1 Student

```
Window 1 (Normal Browser):
  → http://localhost:5173
  → Login: teacher@exam.com / teacher123
  → Go to: Exams → Click eye icon (👁️)
  → Result: Monitoring dashboard

Window 2 (Incognito - Ctrl+Shift+N):
  → http://localhost:5173
  → Login: student@exam.com / student123
  → Go to: Exams → Click "Take Exam"
  → Result: Teacher sees student join in real-time
```

### Scenario 2: Teacher Monitoring + Multiple Students

```
Window 1 (Chrome - Normal):
  → Teacher monitoring

Window 2 (Chrome - Incognito):
  → Student 1 taking exam

Window 3 (Firefox):
  → Student 2 taking exam

Window 4 (Edge):
  → Student 3 taking exam

Result: Teacher sees all 3 students in real-time
```

### Scenario 3: Create Additional Test Students

**Option A: Use Register Page**

```
1. Open incognito window
2. Go to: http://localhost:5173/register
3. Register new student:
   - Name: Test Student 2
   - Email: student2@exam.com
   - Password: student123
   - Role: Student
4. Use this account in another window
```

**Option B: Use Admin Panel**

```
1. Login as admin (admin@exam.com / admin123)
2. Go to: Users → Create User
3. Create multiple students
4. Use each in different browser contexts
```

## 🔧 Browser Context Options

### Option 1: Incognito/Private Window ⭐ (Recommended)

**Chrome/Edge:**

- Windows: `Ctrl + Shift + N`
- Mac: `Cmd + Shift + N`

**Firefox:**

- Windows: `Ctrl + Shift + P`
- Mac: `Cmd + Shift + P`

**Safari:**

- Mac: `Cmd + Shift + N`

### Option 2: Different Browsers

Install multiple browsers:

- Chrome
- Firefox
- Edge
- Safari (Mac)
- Brave

Use one browser per user.

### Option 3: Browser Profiles

**Chrome:**

1. Click profile icon (top right)
2. Click "Add"
3. Create "Teacher Profile" and "Student Profile"
4. Each profile has separate storage

**Firefox:**

1. Type `about:profiles` in address bar
2. Create new profile
3. Launch in separate window

### Option 4: Clear Storage (Not Recommended)

Between each user:

1. Open DevTools (F12)
2. Application tab → Storage
3. Click "Clear site data"
4. Refresh page
5. Login as different user

**Downside:** Tedious for multiple tests

## 📋 Testing Checklist

### Before Testing

- [ ] Backend running (`cd backend && npm run dev`)
- [ ] Frontend running (`cd frontend && npm run dev`)
- [ ] Database seeded (`cd backend && npm run seed`)
- [ ] At least 1 published exam exists

### Test 1: Basic Connection

- [ ] Teacher opens monitoring page
- [ ] Student opens exam in different context
- [ ] Teacher sees "Student joined" notification
- [ ] Connection status shows "Connected"

### Test 2: Progress Updates

- [ ] Student answers questions
- [ ] Teacher sees progress bar update
- [ ] Answered count increases
- [ ] No page refresh needed

### Test 3: Submission

- [ ] Student submits exam
- [ ] Teacher sees "Student submitted" notification
- [ ] Status changes to "Submitted"
- [ ] Activity feed updates

### Test 4: Multiple Students

- [ ] 3+ students join same exam
- [ ] Teacher sees all students
- [ ] Each progress updates independently
- [ ] All submissions tracked

### Test 5: Disconnection

- [ ] Student taking exam
- [ ] Disconnect network (DevTools → Network → Offline)
- [ ] Teacher sees "Disconnected" status
- [ ] Reconnect network
- [ ] Status updates

## 🎬 Step-by-Step Video Script

### Setup (2 minutes)

1. Start backend server
2. Start frontend server
3. Open Chrome (normal window)
4. Login as teacher
5. Navigate to Exams
6. Click eye icon on published exam
7. Show monitoring dashboard

### Demo (3 minutes)

1. Open Chrome Incognito
2. Login as student
3. Navigate to Exams
4. Click "Take Exam"
5. **Switch to teacher window**
6. Show student appeared in list
7. **Switch to student window**
8. Answer some questions
9. **Switch to teacher window**
10. Show progress updating
11. **Switch to student window**
12. Submit exam
13. **Switch to teacher window**
14. Show submission notification

## 🐛 Troubleshooting

### Issue: Both tabs show same user

**Cause:** Using same browser context

**Fix:** Use incognito or different browser

### Issue: Student not appearing in monitoring

**Cause:** Not in same exam or connection failed

**Fix:**

1. Verify both on same exam
2. Check browser console for errors
3. Verify backend is running
4. Check WebSocket connection

### Issue: No real-time updates

**Cause:** WebSocket not connected

**Fix:**

1. Check "Connected" badge on monitoring page
2. Check browser console for Socket.IO errors
3. Verify backend logs show "WebSocket server initialized"
4. Refresh both pages

### Issue: "Disconnected" status

**Cause:** Network or authentication issue

**Fix:**

1. Check network connection
2. Verify JWT token is valid
3. Re-login if token expired
4. Check backend logs

## 💡 Pro Tips

### Tip 1: Use Browser Profiles for Frequent Testing

Create permanent profiles:

- "Teacher Profile"
- "Student 1 Profile"
- "Student 2 Profile"
- "Admin Profile"

### Tip 2: Bookmark Test URLs

```
Teacher Monitoring: http://localhost:5173/exams/[EXAM_ID]/monitor
Student Exam: http://localhost:5173/exams/[EXAM_ID]/take
```

### Tip 3: Keep DevTools Open

Monitor:

- Console for errors
- Network tab for WebSocket connection
- Application tab for localStorage

### Tip 4: Use Multiple Monitors

- Monitor 1: Teacher view
- Monitor 2: Student views
- Easy to see real-time updates

### Tip 5: Create Test Script

```bash
# test.sh
#!/bin/bash

# Start backend
cd backend && npm run dev &

# Wait for backend
sleep 5

# Start frontend
cd frontend && npm run dev &

# Open browsers
google-chrome http://localhost:5173 &
google-chrome --incognito http://localhost:5173 &
firefox http://localhost:5173 &
```

## 📞 Quick Help

**Can't login as different users?**
→ Use incognito window

**Student not showing in monitoring?**
→ Check both are on same exam

**No real-time updates?**
→ Check "Connected" badge

**Need more students?**
→ Use Register page or Admin panel

**WebSocket not connecting?**
→ Check backend logs and browser console

---

**Remember:** Each user needs a separate browser context (incognito, different browser, or profile)!
