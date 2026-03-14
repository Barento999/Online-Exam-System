# Bulk Upload Troubleshooting Guide

## Issue: 400 Bad Request Error

### Root Cause

The `/upload` route was being matched by the `/:id` parameterized route because Express matches routes in the order they're defined.

### Fix Applied

✅ Reordered routes so specific routes (`/bulk`, `/upload`) come BEFORE parameterized routes (`/:id`)
✅ Added detailed console logging to track the upload process
✅ Verified temp directory exists at `backend/uploads/temp/`

### Steps to Test

1. **Restart Backend Server** (IMPORTANT!)

   ```bash
   cd backend
   # Stop the server (Ctrl+C if running)
   npm run dev
   ```

2. **Check Backend Console**
   When you upload a file, you should see:

   ```
   === Upload request received ===
   File: { ... file details ... }
   Body: { examId: '...' }
   User: [email] [role]
   Processing file: [filename]
   ```

3. **Test Upload**
   - Go to Questions page
   - Click "Bulk Upload"
   - Select an exam
   - Upload the CSV template (download it first)
   - Check backend console for logs

### Expected Behavior

✅ File is uploaded to `backend/uploads/temp/`
✅ File is parsed (CSV/Excel)
✅ Questions are validated
✅ Questions are inserted into database
✅ Temp file is deleted
✅ Success message: "X questions uploaded successfully"

### Common Issues

#### 1. Backend Not Restarted

**Symptom**: Still getting 400 error
**Solution**: Make sure to restart the backend server

#### 2. No File Selected

**Symptom**: "Please upload a file"
**Solution**: Select a CSV or Excel file before clicking Upload

#### 3. No Exam Selected

**Symptom**: "Exam ID is required"
**Solution**: Select an exam from the dropdown

#### 4. Invalid File Format

**Symptom**: "Only CSV and Excel files are allowed"
**Solution**: Use .csv, .xlsx, or .xls files only

#### 5. Missing Columns

**Symptom**: "Validation errors: Row X: Missing required fields"
**Solution**: Ensure your file has all required columns:

- questionText
- optionA
- optionB
- optionC
- optionD
- correctAnswer (A, B, C, or D)
- marks (positive number)

### CSV Template Format

```csv
questionText,optionA,optionB,optionC,optionD,correctAnswer,marks
"What is 2+2?","3","4","5","6","B","1"
"What is the capital of France?","London","Berlin","Paris","Madrid","C","1"
"Which planet is closest to the sun?","Venus","Mercury","Earth","Mars","B","1"
```

### Debugging Steps

1. **Check backend console** for detailed error messages
2. **Verify file format** matches the template
3. **Check examId** is being sent correctly
4. **Verify authentication** - you must be logged in as teacher/admin
5. **Check file size** - must be under 10MB

### Backend Console Logs to Look For

```
=== Upload request received ===
File: {
  fieldname: 'file',
  originalname: 'questions.csv',
  encoding: '7bit',
  mimetype: 'text/csv',
  destination: 'C:\\...\\backend\\uploads\\temp',
  filename: '...',
  path: '...',
  size: 1234
}
Body: { examId: '65f...' }
User: teacher@example.com teacher
Processing file: questions.csv
```

If you don't see these logs, the request isn't reaching the controller.

### Route Order (Fixed)

```javascript
// ✅ CORRECT ORDER
router.post('/bulk', ...)      // Specific route
router.post('/upload', ...)    // Specific route
router.route('/:id')           // Parameterized route (comes last)

// ❌ WRONG ORDER (was causing the issue)
router.post('/bulk', ...)
router.route('/:id')           // This would match '/upload' as id='upload'
router.post('/upload', ...)    // Never reached!
```

## Next Steps

After restarting the backend:

1. Try uploading the template file
2. Check backend console for logs
3. If still failing, share the backend console output
