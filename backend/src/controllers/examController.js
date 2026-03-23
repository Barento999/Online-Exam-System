import Exam from "../models/Exam.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";

// @desc    Get all exams
// @route   GET /api/exams
// @access  Private
export const getExams = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.courseId) query.courseId = req.query.courseId;
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { courseName: { $regex: req.query.search, $options: "i" } },
      ];
    }

    // Students only see published exams for courses they're enrolled in
    if (req.user.role === "student") {
      const Enrollment = (await import("../models/Enrollment.js")).default;
      const enrollments = await Enrollment.find({
        studentId: req.user._id,
        status: "active",
      });
      const enrolledCourseIds = enrollments.map((e) => e.courseId);

      query.status = "published";
      query.startTime = { $lte: new Date() };
      query.endTime = { $gte: new Date() };
      query.courseId = { $in: enrolledCourseIds };
    }

    // Teachers only see exams for their courses
    if (req.user.role === "teacher") {
      const Course = (await import("../models/Course.js")).default;
      const teacherCourses = await Course.find({ teacherId: req.user._id });
      const courseIds = teacherCourses.map((c) => c._id);
      query.courseId = { $in: courseIds };
    }

    const exams = await Exam.find(query)
      .populate("courseId", "name description")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Exam.countDocuments(query);

    res.json({
      exams,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Private
export const getExamById = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate(
      "courseId",
      "name description teacherId",
    );

    if (!exam) {
      res.status(404);
      throw new Error("Exam not found");
    }

    // Students can only view exams for courses they're enrolled in
    if (req.user.role === "student") {
      const Enrollment = (await import("../models/Enrollment.js")).default;
      const enrollment = await Enrollment.findOne({
        studentId: req.user._id,
        courseId: exam.courseId._id,
        status: "active",
      });

      if (!enrollment) {
        res.status(403);
        throw new Error("Not enrolled in this course");
      }
    }

    // Teachers can only view exams for their courses
    if (req.user.role === "teacher") {
      if (exam.courseId.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to view this exam");
      }
    }

    res.json(exam);
  } catch (error) {
    next(error);
  }
};

// @desc    Create exam
// @route   POST /api/exams
// @access  Private/Admin/Teacher
export const createExam = async (req, res, next) => {
  try {
    const {
      title,
      courseId,
      duration,
      totalMarks,
      passingMarks,
      startTime,
      endTime,
      status,
      randomizeQuestions,
    } = req.body;

    // Teachers can only create exams for their own courses
    if (req.user.role === "teacher") {
      const Course = (await import("../models/Course.js")).default;
      const course = await Course.findById(courseId);

      if (!course) {
        res.status(404);
        throw new Error("Course not found");
      }

      if (course.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to create exam for this course");
      }
    }

    const exam = await Exam.create({
      title,
      courseId,
      duration,
      totalMarks,
      passingMarks,
      startTime,
      endTime,
      status,
      randomizeQuestions: randomizeQuestions || false,
      createdBy: req.user._id,
    });

    res.status(201).json(exam);
  } catch (error) {
    next(error);
  }
};

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin/Teacher
export const updateExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("courseId");

    if (!exam) {
      res.status(404);
      throw new Error("Exam not found");
    }

    // Teachers can only update exams for their own courses
    if (req.user.role === "teacher") {
      if (exam.courseId.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to update this exam");
      }
    }

    const {
      title,
      courseId,
      duration,
      totalMarks,
      passingMarks,
      startTime,
      endTime,
      status,
      randomizeQuestions,
    } = req.body;

    exam.title = title || exam.title;
    exam.courseId = courseId || exam.courseId;
    exam.duration = duration || exam.duration;
    exam.totalMarks = totalMarks || exam.totalMarks;
    exam.passingMarks = passingMarks || exam.passingMarks;
    exam.startTime = startTime || exam.startTime;
    exam.endTime = endTime || exam.endTime;
    exam.status = status || exam.status;
    if (randomizeQuestions !== undefined) {
      exam.randomizeQuestions = randomizeQuestions;
    }

    const updatedExam = await exam.save();
    res.json(updatedExam);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete exam
// @route   DELETE /api/exams/:id
// @access  Private/Admin/Teacher
export const deleteExam = async (req, res, next) => {
  try {
    const exam = await Exam.findById(req.params.id).populate("courseId");

    if (!exam) {
      res.status(404);
      throw new Error("Exam not found");
    }

    // Teachers can only delete exams for their own courses
    if (req.user.role === "teacher") {
      if (exam.courseId.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to delete this exam");
      }
    }

    // Delete all questions associated with this exam
    await Question.deleteMany({ examId: exam._id });

    await exam.deleteOne();
    res.json({ message: "Exam and associated questions deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit exam
// @route   POST /api/exams/:id/submit
// @access  Private/Student
export const submitExam = async (req, res, next) => {
  try {
    const { answers } = req.body; // answers: { questionId: selectedAnswer }
    const examId = req.params.id;

    const exam = await Exam.findById(examId).populate("courseId");
    if (!exam) {
      res.status(404);
      throw new Error("Exam not found");
    }

    // Check if student is enrolled in the course
    const Enrollment = (await import("../models/Enrollment.js")).default;
    const enrollment = await Enrollment.findOne({
      studentId: req.user._id,
      courseId: exam.courseId._id,
      status: "active",
    });

    if (!enrollment) {
      res.status(403);
      throw new Error("Not enrolled in this course");
    }

    // Check if exam is available
    const now = new Date();
    if (now < exam.startTime || now > exam.endTime) {
      res.status(400);
      throw new Error("Exam is not available at this time");
    }

    // Check if student already submitted
    const existingResult = await Result.findOne({
      studentId: req.user._id,
      examId,
    });

    if (existingResult) {
      res.status(400);
      throw new Error("You have already submitted this exam");
    }

    // Get all questions for this exam
    const questions = await Question.find({ examId });

    // Calculate score
    let score = 0;
    const formattedAnswers = [];

    questions.forEach((question) => {
      const selectedAnswer = answers[question._id.toString()];
      formattedAnswers.push({
        questionId: question._id,
        selectedAnswer,
      });

      if (selectedAnswer === question.correctAnswer) {
        score += question.marks;
      }
    });

    const percentage = Math.round((score / exam.totalMarks) * 100);
    const status = score >= exam.passingMarks ? "passed" : "failed";

    // Create result
    const result = await Result.create({
      studentId: req.user._id,
      examId,
      score,
      totalMarks: exam.totalMarks,
      percentage,
      answers: formattedAnswers,
      status,
      submittedAt: new Date(),
    });

    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get available exams for student
// @route   GET /api/exams/available
// @access  Private/Student
export const getAvailableExams = async (req, res, next) => {
  try {
    const now = new Date();

    // Get student's enrolled courses
    const Enrollment = (await import("../models/Enrollment.js")).default;
    const enrollments = await Enrollment.find({
      studentId: req.user._id,
      status: "active",
    });
    const enrolledCourseIds = enrollments.map((e) => e.courseId);

    // Get all published exams for enrolled courses (past, present, and future)
    const exams = await Exam.find({
      status: "published",
      courseId: { $in: enrolledCourseIds },
    })
      .populate("courseId", "name description")
      .sort({ startTime: -1 }); // Sort by start time, newest first

    // Get student's results to mark which exams are taken
    const results = await Result.find({ studentId: req.user._id });
    const takenExamIds = results.map((r) => r.examId.toString());

    // Add metadata to each exam
    const examsWithMetadata = exams.map((exam) => {
      const examObj = exam.toObject();
      const isTaken = takenExamIds.includes(exam._id.toString());
      const hasStarted = new Date(exam.startTime) <= now;
      const hasEnded = new Date(exam.endTime) < now;

      return {
        ...examObj,
        isTaken,
        isActive: hasStarted && !hasEnded && !isTaken,
        isUpcoming: !hasStarted,
        isPast: hasEnded,
      };
    });

    res.json({ exams: examsWithMetadata });
  } catch (error) {
    next(error);
  }
};
