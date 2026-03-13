import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide student ID"],
    },
    studentName: {
      type: String,
    },
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Please provide exam ID"],
    },
    examName: {
      type: String,
    },
    score: {
      type: Number,
      required: true,
      default: 0,
    },
    totalMarks: {
      type: Number,
      required: true,
    },
    percentage: {
      type: Number,
      default: 0,
    },
    answers: [
      {
        questionId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Question",
        },
        selectedAnswer: {
          type: String,
          enum: ["A", "B", "C", "D"],
        },
      },
    ],
    status: {
      type: String,
      enum: ["passed", "failed"],
      required: true,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

// Populate student and exam names before saving
resultSchema.pre("save", async function (next) {
  if (this.isNew) {
    const User = mongoose.model("User");
    const Exam = mongoose.model("Exam");

    const student = await User.findById(this.studentId);
    const exam = await Exam.findById(this.examId);

    if (student) this.studentName = student.name;
    if (exam) this.examName = exam.title;
  }
  next();
});

const Result = mongoose.model("Result", resultSchema);

export default Result;
