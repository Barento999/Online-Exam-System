# Image Upload Feature for Questions

## 🎯 Overview

Teachers and admins can now add images to exam questions to make them more visual and engaging.

## ✨ Features

- Upload images when creating/editing questions
- Support for JPG, PNG, GIF, WebP formats
- Maximum file size: 5MB
- Image preview before upload
- Images displayed during exam
- Automatic cleanup when questions are deleted

## 📦 Implementation

### Backend

**Dependencies Added:**

- `multer` - File upload handling

**Files Created:**

1. `backend/src/config/upload.js` - Multer configuration

**Files Modified:**

1. `backend/src/models/Question.js` - Added `imageUrl` field
2. `backend/src/controllers/questionController.js` - Image upload/delete handling
3. `backend/src/routes/questionRoutes.js` - Upload middleware
4. `backend/src/server.js` - Static file serving

**Storage:**

- Images stored in: `backend/uploads/questions/`
- Filename format: `originalname-timestamp-random.ext`
- Served at: `http://localhost:3000/uploads/questions/filename`

### Frontend

**Files Modified:**

1. `frontend/src/pages/Questions.jsx` - Image upload UI
2. `frontend/src/pages/TakeExam.jsx` - Image display
3. `frontend/src/services/api.js` - FormData support

## 🚀 Usage

### For Teachers/Admins

**Creating Question with Image:**

1. Go to Questions page
2. Click "Create Question"
3. Fill in question details
4. Click "Choose File" under "Question Image"
5. Select an image (max 5MB)
6. Preview appears
7. Click "Create"

**Editing Question Image:**

1. Click edit icon on question
2. Current image shows (if exists)
3. Upload new image to replace
4. Click "Remove" to delete image
5. Click "Update"

### For Students

**Taking Exam with Images:**

1. Start exam
2. Questions with images show them below question text
3. Images are responsive and fit screen
4. Answer as normal

## 📋 Technical Details

### File Upload Configuration

```javascript
// backend/src/config/upload.js
- Storage: Disk storage
- Destination: backend/uploads/questions/
- Filename: unique with timestamp
- File filter: Images only
- Size limit: 5MB
```

### Database Schema

```javascript
// Question Model
{
  questionText: String,
  imageUrl: String (nullable),  // NEW FIELD
  optionA: String,
  optionB: String,
  optionC: String,
  optionD: String,
  correctAnswer: String,
  marks: Number
}
```

### API Endpoints

**Create Question with Image:**

```http
POST /api/questions
Content-Type: multipart/form-data

FormData:
  - examId: string
  - questionText: string
  - optionA: string
  - optionB: string
  - optionC: string
  - optionD: string
  - correctAnswer: string
  - marks: number
  - image: file (optional)
```

**Update Question with Image:**

```http
PUT /api/questions/:id
Content-Type: multipart/form-data

FormData:
  - (same as create)
  - image: file (optional, replaces existing)
```

**Get Question:**

```http
GET /api/questions/:id

Response:
{
  _id: "...",
  questionText: "...",
  imageUrl: "/uploads/questions/image-123456.jpg",  // NEW
  optionA: "...",
  ...
}
```

### Frontend Implementation

**Image Upload Component:**

```jsx
<Input type="file" accept="image/*" onChange={handleImageChange} />;

{
  imagePreview && <img src={imagePreview} alt="Preview" />;
}
```

**Image Display in Exam:**

```jsx
{
  question.imageUrl && (
    <img src={`${API_URL}${question.imageUrl}`} alt="Question" />
  );
}
```

## 🔒 Security

**File Validation:**

- Only image files allowed (MIME type check)
- File extension validation
- Size limit enforced (5MB)
- Unique filenames prevent conflicts

**Access Control:**

- Only teachers/admins can upload
- Images served as static files (public)
- No sensitive data in filenames

## 📁 File Structure

```
backend/
├── uploads/
│   └── questions/
│       ├── diagram-1234567890-123456789.png
│       ├── chart-1234567891-987654321.jpg
│       └── ...
├── src/
│   ├── config/
│   │   └── upload.js          # NEW
│   ├── models/
│   │   └── Question.js         # MODIFIED
│   ├── controllers/
│   │   └── questionController.js  # MODIFIED
│   ├── routes/
│   │   └── questionRoutes.js   # MODIFIED
│   └── server.js               # MODIFIED

frontend/
├── src/
│   ├── pages/
│   │   ├── Questions.jsx       # MODIFIED
│   │   └── TakeExam.jsx        # MODIFIED
│   └── services/
│       └── api.js              # MODIFIED
```

## 🎨 UI/UX

**Question Form:**

```
┌─────────────────────────────────────┐
│ Question Text                       │
│ ┌─────────────────────────────────┐ │
│ │ What is shown in the diagram?   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ Question Image (Optional)           │
│ [Choose File] No file chosen        │
│ Max size: 5MB. Supported: JPG...   │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │     [Image Preview]             │ │
│ │     [Remove Button]             │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

**Exam Question Display:**

```
┌─────────────────────────────────────┐
│ Question 5 of 10          [5 marks] │
│                                     │
│ What is shown in the diagram?      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │                                 │ │
│ │     [Question Image]            │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ○ A. Option A                      │
│ ○ B. Option B                      │
│ ○ C. Option C                      │
│ ○ D. Option D                      │
└─────────────────────────────────────┘
```

## 🐛 Error Handling

**Upload Errors:**

- File too large → "Image size must be less than 5MB"
- Invalid format → "Only image files are allowed"
- Upload failed → File deleted, error returned

**Display Errors:**

- Image not found → Broken image icon
- Load failed → Fallback to text-only question

## 🧪 Testing

### Manual Testing

**Test 1: Upload Image**

1. Create question with image
2. Verify image saved
3. Check file exists in uploads/questions/
4. Verify imageUrl in database

**Test 2: Display Image**

1. Take exam with image question
2. Verify image displays correctly
3. Check responsive sizing
4. Test on mobile

**Test 3: Update Image**

1. Edit question
2. Upload new image
3. Verify old image deleted
4. Verify new image displays

**Test 4: Delete Question**

1. Delete question with image
2. Verify image file deleted
3. Check uploads folder

**Test 5: File Validation**

1. Try uploading 10MB file → Error
2. Try uploading .txt file → Error
3. Try uploading .pdf file → Error
4. Upload valid image → Success

### Automated Testing

```javascript
// Test file upload
describe("Question Image Upload", () => {
  it("should upload image with question", async () => {
    const formData = new FormData();
    formData.append("examId", examId);
    formData.append("questionText", "Test question");
    formData.append("image", imageFile);

    const response = await questionsApi.create(formData);
    expect(response.data.imageUrl).toBeDefined();
  });

  it("should reject large files", async () => {
    const largeFile = createLargeFile(10 * 1024 * 1024); // 10MB
    await expect(upload(largeFile)).rejects.toThrow();
  });
});
```

## 📊 Performance

**Optimization:**

- Images served as static files (fast)
- No database queries for images
- Lazy loading in exam (future enhancement)
- Image compression (future enhancement)

**Storage:**

- Average image: 500KB
- 1000 questions: ~500MB
- Consider CDN for production

## 🚀 Deployment

### Production Checklist

- [ ] Create uploads directory
- [ ] Set proper permissions (755)
- [ ] Configure static file serving
- [ ] Set up CDN (optional)
- [ ] Enable image compression
- [ ] Set up backup for uploads folder
- [ ] Configure max upload size in nginx/apache

### Environment Variables

```env
# No new env vars needed
# Uses existing VITE_API_URL
```

### Nginx Configuration

```nginx
# Serve uploaded files
location /uploads {
    alias /path/to/backend/uploads;
    expires 30d;
    add_header Cache-Control "public, immutable";
}
```

## 🔮 Future Enhancements

1. **Image Compression**
   - Automatically compress on upload
   - Generate thumbnails
   - WebP conversion

2. **Cloud Storage**
   - AWS S3 integration
   - Cloudinary support
   - CDN delivery

3. **Advanced Features**
   - Multiple images per question
   - Image annotations
   - Drag-and-drop upload
   - Crop/resize before upload

4. **Performance**
   - Lazy loading images
   - Progressive image loading
   - Image caching

## 📝 Migration

If you have existing questions without images:

```javascript
// No migration needed
// imageUrl defaults to null
// Existing questions work as before
```

## 🆘 Troubleshooting

**Issue: Images not displaying**

- Check uploads folder exists
- Verify file permissions
- Check static file serving in server.js
- Verify CORS allows image requests

**Issue: Upload fails**

- Check file size < 5MB
- Verify file is image format
- Check disk space
- Verify multer configuration

**Issue: Old images not deleted**

- Check deleteFile function
- Verify file path is correct
- Check file permissions

## ✅ Summary

Image upload feature is now fully implemented:

- ✅ Backend file handling
- ✅ Database schema updated
- ✅ Frontend upload UI
- ✅ Image display in exams
- ✅ File validation
- ✅ Error handling
- ✅ Documentation complete

Ready for testing and deployment!
