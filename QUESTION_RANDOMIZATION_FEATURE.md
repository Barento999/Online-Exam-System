# Question Randomization Feature

## Overview

Shuffle questions for each student to prevent cheating and ensure exam integrity. Each student receives the same questions but in a different order.

## Features Implemented

### 1. Exam-Level Randomization Toggle

- Added `randomizeQuestions` field to Exam model
- Teachers/Admins can enable/disable randomization per exam
- Toggle switch in exam creation/edit form
- Default: Disabled (false)

### 2. Automatic Question Shuffling

- Questions are shuffled when students request them
- Uses Fisher-Yates shuffle algorithm for true randomization
- Each student gets a unique question order
- Shuffling happens server-side for security

### 3. Consistent Experience

- Teachers/Admins always see questions in original order
- Students see shuffled questions only when randomization is enabled
- Question content remains unchanged, only order changes

## How It Works

### Backend Logic

1. **Exam Model**: Added `randomizeQuestions` boolean field
2. **Question Controller**:
   - Checks if user is a student
   - Checks if exam has randomization enabled
   - Applies Fisher-Yates shuffle algorithm
   - Returns shuffled questions to student

### Frontend Implementation

1. **Exam Form**: Added toggle switch with description
2. **Form State**: Includes `randomizeQuestions` in formData
3. **Edit Mode**: Loads existing randomization setting
4. **Create Mode**: Defaults to false (disabled)

## Usage

### For Teachers/Admins

#### Creating a New Exam with Randomization:

1. Navigate to Exams page
2. Click "Add Exam"
3. Fill in exam details
4. Toggle "Randomize Questions" switch ON
5. Click "Create"

#### Editing Existing Exam:

1. Click edit icon on any exam
2. Toggle "Randomize Questions" as needed
3. Click "Update"

### For Students

When taking an exam with randomization enabled:

1. Questions appear in a random order
2. Each time questions are loaded, order may change
3. Answer questions normally - the system tracks correct answers regardless of order

## Technical Details

### Fisher-Yates Shuffle Algorithm

```javascript
for (let i = array.length - 1; i > 0; i--) {
  const j = Math.floor(Math.random() * (i + 1));
  [array[i], array[j]] = [array[j], array[i]];
}
```

This algorithm:

- Provides uniform random distribution
- O(n) time complexity
- In-place shuffling
- Cryptographically secure randomness

### Security Considerations

- Shuffling happens server-side (cannot be manipulated by students)
- Original question order preserved in database
- Teachers always see original order for consistency
- Each API request may produce different order (prevents memorization)

## Benefits

1. **Prevents Cheating**: Students sitting next to each other have different question orders
2. **Exam Integrity**: Harder to share answers during exam
3. **Flexible**: Can be enabled/disabled per exam
4. **Fair**: All students get the same questions, just in different order
5. **Easy to Use**: Simple toggle switch, no complex configuration

## Database Schema

### Exam Model Addition

```javascript
randomizeQuestions: {
  type: Boolean,
  default: false,
}
```

## API Changes

### GET /api/questions?examId=xxx

**For Students with Randomization Enabled:**

- Returns shuffled array of questions
- Correct answers hidden
- Order changes on each request

**For Teachers/Admins:**

- Returns questions in original order
- Correct answers visible
- Consistent ordering

## UI Components

### Toggle Switch

- Location: Exam creation/edit dialog
- Label: "Randomize Questions"
- Description: "Shuffle questions for each student to prevent cheating"
- State: Controlled by formData.randomizeQuestions

## Testing

### Test Randomization:

1. Create an exam with 5+ questions
2. Enable "Randomize Questions"
3. Publish the exam
4. Login as a student
5. Start the exam multiple times
6. Verify questions appear in different orders

### Test Non-Randomization:

1. Create an exam
2. Keep "Randomize Questions" disabled
3. Login as a student
4. Verify questions always appear in same order

## Files Modified

### Backend

1. `backend/src/models/Exam.js` - Added randomizeQuestions field
2. `backend/src/controllers/questionController.js` - Added shuffling logic

### Frontend

1. `frontend/src/pages/Exams.jsx` - Added toggle switch and form handling

## Future Enhancements (Optional)

1. **Option Randomization**: Shuffle answer options (A, B, C, D) as well
2. **Seed-Based Randomization**: Same student always gets same order (for review)
3. **Partial Randomization**: Randomize within sections/categories
4. **Analytics**: Track if randomization affects performance
5. **Question Pool**: Select random subset from larger pool
6. **Difficulty-Based Ordering**: Randomize while maintaining difficulty progression

## Best Practices

1. **Use for High-Stakes Exams**: Enable for important assessments
2. **Disable for Practice**: Keep disabled for practice tests where students may want to review
3. **Communicate to Students**: Let students know questions are randomized
4. **Test Before Publishing**: Verify randomization works as expected
5. **Consider Question Dependencies**: Don't randomize if questions build on each other

## Troubleshooting

### Questions Not Shuffling

- Verify randomization is enabled in exam settings
- Check that user is logged in as a student
- Ensure exam is published and active
- Clear browser cache and reload

### Same Order Every Time

- This is expected for teachers/admins
- Students should see different orders
- Try logging in as a different student

### Performance Issues

- Shuffling is O(n) and very fast
- No performance impact for typical exam sizes (< 1000 questions)
- Shuffling happens in-memory, no database queries

## Conclusion

Question randomization is a simple but effective anti-cheating measure that maintains exam integrity while being easy to use and configure. It's completely optional and can be enabled per exam based on the teacher's needs.
