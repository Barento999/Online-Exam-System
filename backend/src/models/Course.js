import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a course name"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a course description"],
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please assign a teacher"],
    },
    teacherName: {
      type: String,
    },
    studentsCount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  {
    timestamps: true,
  },
);

// Populate teacher name before saving
courseSchema.pre("save", async function (next) {
  if (this.isModified("teacherId")) {
    const User = mongoose.model("User");
    const teacher = await User.findById(this.teacherId);
    if (teacher) {
      this.teacherName = teacher.name;
    }
  }
  next();
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
