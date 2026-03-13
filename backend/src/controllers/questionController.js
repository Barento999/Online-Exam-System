import Question from "../models/Question.js";

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private
export const getQuestions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.examId) query.examId = req.query.examId;

    // If student is requesting questions, verify they can access the exam
    if (req.user.role === "student" && req.query.examId) {
      const Exam = (await import("../models/Exam.js")).default;
      const exam = await Exam.findById(req.query.examId);

      if (!exam) {
        res.status(404);
        throw new Error("Exam not found");
      }

      const now = new Date();
      if (
        exam.status !== "published" ||
        now < exam.startTime ||
        now > exam.endTime
      ) {
        res.status(403);
        throw new Error("Exam is not available");
      }
    }

    // Teachers can only see questions for their exams
    if (req.user.role === "teacher" && req.query.examId) {
      const Exam = (await import("../models/Exam.js")).default;
      const Course = (await import("../models/Course.js")).default;
      const exam = await Exam.findById(req.query.examId).populate("courseId");

      if (!exam) {
        res.status(404);
        throw new Error("Exam not found");
      }

      if (exam.courseId.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to view these questions");
      }
    }

    const questions = await Question.find(query)
      .populate("examId", "title")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(query);

    // Hide correct answers for students
    if (req.user.role === "student") {
      questions.forEach((q) => {
        q.correctAnswer = undefined;
      });
    }

    res.json({
      questions,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get question by ID
// @route   GET /api/questions/:id
// @access  Private
export const getQuestionById = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate(
      "examId",
      "title",
    );

    if (!question) {
      res.status(404);
      throw new Error("Question not found");
    }

    res.json(question);
  } catch (error) {
    next(error);
  }
};

// @desc    Create question
// @route   POST /api/questions
// @access  Private/Admin/Teacher
export const createQuestion = async (req, res, next) => {
  try {
    const {
      examId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      marks,
    } = req.body;

    // Teachers can only create questions for their exams
    if (req.user.role === "teacher") {
      const Exam = (await import("../models/Exam.js")).default;
      const Course = (await import("../models/Course.js")).default;
      const exam = await Exam.findById(examId).populate("courseId");

      if (!exam) {
        res.status(404);
        throw new Error("Exam not found");
      }

      if (exam.courseId.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to create questions for this exam");
      }
    }

    const question = await Question.create({
      examId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      marks,
    });

    res.status(201).json(question);
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk create questions
// @route   POST /api/questions/bulk
// @access  Private/Admin/Teacher
export const bulkCreateQuestions = async (req, res, next) => {
  try {
    const { examId, questions } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      res.status(400);
      throw new Error("Please provide an array of questions");
    }

    // Teachers can only create questions for their exams
    if (req.user.role === "teacher") {
      const Exam = (await import("../models/Exam.js")).default;
      const exam = await Exam.findById(examId).populate("courseId");

      if (!exam) {
        res.status(404);
        throw new Error("Exam not found");
      }

      if (exam.courseId.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to create questions for this exam");
      }
    }

    const questionsWithExamId = questions.map((q) => ({
      ...q,
      examId,
    }));

    const createdQuestions = await Question.insertMany(questionsWithExamId);

    res.status(201).json({
      message: `${createdQuestions.length} questions created successfully`,
      questions: createdQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin/Teacher
export const updateQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate({
      path: "examId",
      populate: { path: "courseId" },
    });

    if (!question) {
      res.status(404);
      throw new Error("Question not found");
    }

    // Teachers can only update questions for their exams
    if (req.user.role === "teacher") {
      if (
        question.examId.courseId.teacherId.toString() !==
        req.user._id.toString()
      ) {
        res.status(403);
        throw new Error("Not authorized to update this question");
      }
    }

    const {
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      marks,
    } = req.body;

    question.questionText = questionText || question.questionText;
    question.optionA = optionA || question.optionA;
    question.optionB = optionB || question.optionB;
    question.optionC = optionC || question.optionC;
    question.optionD = optionD || question.optionD;
    question.correctAnswer = correctAnswer || question.correctAnswer;
    question.marks = marks !== undefined ? marks : question.marks;

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin/Teacher
export const deleteQuestion = async (req, res, next) => {
  try {
    const question = await Question.findById(req.params.id).populate({
      path: "examId",
      populate: { path: "courseId" },
    });

    if (!question) {
      res.status(404);
      throw new Error("Question not found");
    }

    // Teachers can only delete questions for their exams
    if (req.user.role === "teacher") {
      if (
        question.examId.courseId.teacherId.toString() !==
        req.user._id.toString()
      ) {
        res.status(403);
        throw new Error("Not authorized to delete this question");
      }
    }

    await question.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};
