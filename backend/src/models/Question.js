import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    examId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: [true, "Please assign an exam"],
    },
    questionText: {
      type: String,
      required: [true, "Please provide question text"],
    },
    optionA: {
      type: String,
      required: [true, "Please provide option A"],
    },
    optionB: {
      type: String,
      required: [true, "Please provide option B"],
    },
    optionC: {
      type: String,
      required: [true, "Please provide option C"],
    },
    optionD: {
      type: String,
      required: [true, "Please provide option D"],
    },
    correctAnswer: {
      type: String,
      required: [true, "Please provide correct answer"],
      enum: ["A", "B", "C", "D"],
    },
    marks: {
      type: Number,
      required: [true, "Please provide marks for this question"],
      default: 1,
    },
  },
  {
    timestamps: true,
  },
);

// Update exam questions count after save
questionSchema.post("save", async function () {
  const Exam = mongoose.model("Exam");
  const count = await mongoose
    .model("Question")
    .countDocuments({ examId: this.examId });
  await Exam.findByIdAndUpdate(this.examId, { questionsCount: count });
});

// Update exam questions count after delete
questionSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    const Exam = mongoose.model("Exam");
    const count = await mongoose
      .model("Question")
      .countDocuments({ examId: doc.examId });
    await Exam.findByIdAndUpdate(doc.examId, { questionsCount: count });
  }
});

const Question = mongoose.model("Question", questionSchema);

export default Question;
