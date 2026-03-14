# Bulk User Import/Export Feature

## Overview

Administrators can now import and export users in bulk using CSV or Excel files, making it easy to manage large numbers of users efficiently.

## Features

### 1. Export Users to CSV

- Export all users to a CSV file with one click
- Includes: name, email, role, status, and creation date
- Can be filtered by role and status (via query parameters)
- File naming: `users_export_[timestamp].csv`

### 2. Import Users from CSV/Excel

- Upload CSV, XLSX, or XLS files (max 5MB)
- Batch create multiple users at once
- Comprehensive validation and error reporting
- Template download available

## How to Use

### Exporting Users

1. Navigate to Users Management page
2. Click "Export CSV" button
3. File will download automatically

### Importing Users

1. Navigate to Users Management page
2. Click "Import CSV" button
3. Upload your CSV/Excel file or download the template
4. Review the import results

## CSV Template Format

```csv
name,email,password,role,status
John Doe,john@example.com,password123,student,active
Jane Smith,jane@example.com,password123,teacher,active
Admin User,admin@example.com,password123,admin,active
```

### Required Columns

- `name` - Full name of the user
- `email` - Valid email address (must be unique)
- `password` - Minimum 6 characters
- `role` - Must be: `admin`, `teacher`, or `student`

### Optional Columns

- `status` - `active` or `inactive` (defaults to `active` if not provided)

## Validation Rules

The import process validates:

1. **Required fields** - All required columns must have values
2. **Email format** - Must be a valid email address
3. **Email uniqueness** - Email must not already exist in the system
4. **Role validation** - Must be one of: admin, teacher, student
5. **Password length** - Minimum 6 characters
6. **Status validation** - Must be active or inactive (if provided)

## Import Results

After import, you'll receive a detailed report:

- **Created** - Number of users successfully created
- **Skipped** - Users that already exist (by email)
- **Errors** - Validation or creation errors with row numbers

Example response:

```json
{
  "message": "Successfully imported 5 user(s)",
  "created": 5,
  "skipped": 2,
  "errors": 1,
  "details": {
    "skipped": ["Row 3: User with email john@example.com already exists"],
    "validationErrors": ["Row 7: Invalid email format"],
    "creationErrors": []
  }
}
```

## API Endpoints

### Export Users

```
GET /api/users/export/csv
Authorization: Bearer [admin-token]
```

Optional query parameters:

- `role` - Filter by role (admin, teacher, student)
- `status` - Filter by status (active, inactive)

### Import Users

```
POST /api/users/import/csv
Authorization: Bearer [admin-token]
Content-Type: multipart/form-data

Body: file (CSV/XLSX/XLS)
```

## Technical Implementation

### Backend

- **Controller**: `backend/src/controllers/userController.js`
  - `exportUsers()` - Generates CSV from database
  - `importUsers()` - Parses and validates CSV, creates users
- **Routes**: `backend/src/routes/userRoutes.js`
  - Uses multer for file upload handling
  - Temporary file storage in `uploads/temp/`
- **Library**: `xlsx` for CSV/Excel parsing

### Frontend

- **Component**: `frontend/src/pages/Users.jsx`
  - Export button with download functionality
  - Import dialog with file upload
  - Template download button
  - Progress indicators and error handling

## Error Handling

### Common Errors

1. **"Please upload a CSV file"** - No file selected
2. **"Only CSV and Excel files are allowed"** - Wrong file format
3. **"User already exists"** - Email is already in the system
4. **"Invalid email format"** - Email doesn't match pattern
5. **"Password must be at least 6 characters"** - Password too short
6. **"Invalid role"** - Role is not admin, teacher, or student

### Best Practices

- Download and use the provided template
- Check for duplicate emails before importing
- Ensure passwords meet minimum requirements
- Review the import report for any errors
- Keep file size under 5MB

## Security Considerations

- Only admins can import/export users
- Passwords are hashed before storage
- Uploaded files are deleted after processing
- File type validation prevents malicious uploads
- File size limits prevent DoS attacks

## Testing

To test the feature:

1. **Export**: Click Export CSV and verify the downloaded file
2. **Template**: Download template and verify format
3. **Import Valid**: Upload template with sample data
4. **Import Duplicates**: Try importing existing users
5. **Import Invalid**: Test with invalid emails, roles, etc.
6. **Large Files**: Test with 100+ users

## Status

✅ Backend implementation complete
✅ Frontend implementation complete
✅ JSX syntax errors fixed
✅ File validation working
✅ Error handling implemented
✅ Ready for testing
