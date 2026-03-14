import Question from "../models/Question.js";
import { deleteFile } from "../config/upload.js";
import xlsx from "xlsx";

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

    const questionData = {
      examId,
      questionText,
      optionA,
      optionB,
      optionC,
      optionD,
      correctAnswer,
      marks,
    };

    // Add image URL if file was uploaded
    if (req.file) {
      questionData.imageUrl = `/uploads/questions/${req.file.filename}`;
    }

    const question = await Question.create(questionData);

    // Update exam questionsCount
    const Exam = (await import("../models/Exam.js")).default;
    const exam = await Exam.findById(examId);
    if (exam) {
      exam.questionsCount = await Question.countDocuments({ examId });
      await exam.save();
    }

    res.status(201).json(question);
  } catch (error) {
    // Delete uploaded file if question creation fails
    if (req.file) {
      deleteFile(req.file.filename);
    }
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

    // Update exam questionsCount
    const Exam = (await import("../models/Exam.js")).default;
    const exam = await Exam.findById(examId);
    if (exam) {
      exam.questionsCount = await Question.countDocuments({ examId });
      await exam.save();
    }

    res.status(201).json({
      message: `${createdQuestions.length} questions created successfully`,
      questions: createdQuestions,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload questions from file (CSV/Excel)
// @route   POST /api/questions/upload
// @access  Private/Admin/Teacher
export const uploadQuestionsFile = async (req, res, next) => {
  try {
    console.log("=== Upload request received ===");
    console.log("File:", req.file);
    console.log("Body:", req.body);
    console.log("User:", req.user?.email, req.user?.role);

    if (!req.file) {
      console.error("No file uploaded");
      res.status(400);
      throw new Error("Please upload a file");
    }

    const { examId } = req.body;

    if (!examId) {
      console.error("No examId provided");
      res.status(400);
      throw new Error("Exam ID is required");
    }

    console.log("Processing file:", req.file.originalname);

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

    // Read the uploaded file
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate and transform data
    const questions = [];
    const errors = [];

    data.forEach((row, index) => {
      const rowNum = index + 2; // Excel rows start at 1, header is row 1

      // Validate required fields
      if (
        !row.questionText ||
        !row.optionA ||
        !row.optionB ||
        !row.optionC ||
        !row.optionD ||
        !row.correctAnswer ||
        !row.marks
      ) {
        errors.push(`Row ${rowNum}: Missing required fields`);
        return;
      }

      // Validate correct answer
      if (!["A", "B", "C", "D"].includes(row.correctAnswer.toUpperCase())) {
        errors.push(`Row ${rowNum}: Correct answer must be A, B, C, or D`);
        return;
      }

      // Validate marks
      const marks = parseInt(row.marks);
      if (isNaN(marks) || marks < 1) {
        errors.push(`Row ${rowNum}: Marks must be a positive number`);
        return;
      }

      questions.push({
        examId,
        questionText: row.questionText.toString().trim(),
        optionA: row.optionA.toString().trim(),
        optionB: row.optionB.toString().trim(),
        optionC: row.optionC.toString().trim(),
        optionD: row.optionD.toString().trim(),
        correctAnswer: row.correctAnswer.toString().toUpperCase().trim(),
        marks: marks,
      });
    });

    // Delete the uploaded file
    const fs = await import("fs");
    fs.unlinkSync(req.file.path);

    if (errors.length > 0) {
      res.status(400);
      throw new Error(`Validation errors:\n${errors.join("\n")}`);
    }

    if (questions.length === 0) {
      res.status(400);
      throw new Error("No valid questions found in file");
    }

    // Insert questions
    const createdQuestions = await Question.insertMany(questions);

    // Update exam questionsCount
    const Exam = (await import("../models/Exam.js")).default;
    const exam = await Exam.findById(examId);
    if (exam) {
      exam.questionsCount = await Question.countDocuments({ examId });
      await exam.save();
    }

    res.status(201).json({
      message: `${createdQuestions.length} questions uploaded successfully`,
      count: createdQuestions.length,
      questions: createdQuestions,
    });
  } catch (error) {
    // Delete uploaded file if it exists
    if (req.file) {
      const fs = await import("fs");
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        // File already deleted or doesn't exist
      }
    }
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

    // Handle image upload
    if (req.file) {
      // Delete old image if exists
      if (question.imageUrl) {
        const oldFilename = question.imageUrl.split("/").pop();
        deleteFile(oldFilename);
      }
      question.imageUrl = `/uploads/questions/${req.file.filename}`;
    }

    const updatedQuestion = await question.save();
    res.json(updatedQuestion);
  } catch (error) {
    // Delete uploaded file if update fails
    if (req.file) {
      deleteFile(req.file.filename);
    }
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

    // Delete image file if exists
    if (question.imageUrl) {
      const filename = question.imageUrl.split("/").pop();
      deleteFile(filename);
    }

    const examId = question.examId._id;
    await question.deleteOne();

    // Update exam questionsCount
    const Exam = (await import("../models/Exam.js")).default;
    const exam = await Exam.findById(examId);
    if (exam) {
      exam.questionsCount = await Question.countDocuments({ examId });
      await exam.save();
    }

    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};
