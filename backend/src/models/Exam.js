import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide an exam title"],
      trim: true,
    },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please assign a course"],
    },
    courseName: {
      type: String,
    },
    duration: {
      type: Number,
      required: [true, "Please provide exam duration in minutes"],
    },
    totalMarks: {
      type: Number,
      required: [true, "Please provide total marks"],
    },
    passingMarks: {
      type: Number,
      required: [true, "Please provide passing marks"],
    },
    startTime: {
      type: Date,
      required: [true, "Please provide start time"],
    },
    endTime: {
      type: Date,
      required: [true, "Please provide end time"],
    },
    status: {
      type: String,
      enum: ["draft", "published", "completed", "cancelled"],
      default: "draft",
    },
    questionsCount: {
      type: Number,
      default: 0,
    },
    randomizeQuestions: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Populate course name before saving
examSchema.pre("save", async function (next) {
  if (this.isModified("courseId")) {
    const Course = mongoose.model("Course");
    const course = await Course.findById(this.courseId);
    if (course) {
      this.courseName = course.name;
    }
  }
  next();
});

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
