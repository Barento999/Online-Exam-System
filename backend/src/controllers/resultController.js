import Result from "../models/Result.js";
import User from "../models/User.js";
import Exam from "../models/Exam.js";

// @desc    Get all results
// @route   GET /api/results
// @access  Private/Admin/Teacher
export const getResults = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.examId) query.examId = req.query.examId;
    if (req.query.studentId) query.studentId = req.query.studentId;
    if (req.query.status) query.status = req.query.status;

    const results = await Result.find(query)
      .populate("studentId", "name email")
      .populate("examId", "title courseId")
      .limit(limit)
      .skip(skip)
      .sort({ submittedAt: -1 });

    const total = await Result.countDocuments(query);

    res.json({
      results,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
export const getResultById = async (req, res, next) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("examId", "title courseId totalMarks passingMarks")
      .populate("answers.questionId");

    if (!result) {
      res.status(404);
      throw new Error("Result not found");
    }

    // Students can only view their own results
    if (
      req.user.role === "student" &&
      result.studentId._id.toString() !== req.user._id.toString()
    ) {
      res.status(403);
      throw new Error("Not authorized to view this result");
    }

    res.json(result);
  } catch (error) {
    next(error);
  }
};

// @desc    Get results by student
// @route   GET /api/results/student/:studentId
// @access  Private
export const getResultsByStudent = async (req, res, next) => {
  try {
    const studentId = req.params.studentId;

    // Students can only view their own results
    if (req.user.role === "student" && studentId !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorized to view these results");
    }

    const results = await Result.find({ studentId })
      .populate("examId", "title courseId totalMarks passingMarks")
      .sort({ submittedAt: -1 });

    res.json(results);
  } catch (error) {
    next(error);
  }
};

// @desc    Get results by exam
// @route   GET /api/results/exam/:examId
// @access  Private/Admin/Teacher
export const getResultsByExam = async (req, res, next) => {
  try {
    const results = await Result.find({ examId: req.params.examId })
      .populate("studentId", "name email")
      .sort({ score: -1 });

    // Calculate statistics
    const totalStudents = results.length;
    const passedStudents = results.filter((r) => r.status === "passed").length;
    const failedStudents = totalStudents - passedStudents;
    const averageScore =
      totalStudents > 0
        ? results.reduce((sum, r) => sum + r.score, 0) / totalStudents
        : 0;

    res.json({
      results,
      statistics: {
        totalStudents,
        passedStudents,
        failedStudents,
        passRate:
          totalStudents > 0
            ? ((passedStudents / totalStudents) * 100).toFixed(2)
            : 0,
        averageScore: averageScore.toFixed(2),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/admin
// @access  Private/Admin
export const getAdminDashboard = async (req, res, next) => {
  try {
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalTeachers = await User.countDocuments({ role: "teacher" });
    const totalExams = await Exam.countDocuments();
    const totalResults = await Result.countDocuments();

    // Recent results
    const recentResults = await Result.find()
      .populate("studentId", "name")
      .populate("examId", "title")
      .sort({ submittedAt: -1 })
      .limit(5);

    // Exam performance
    const exams = await Exam.find().limit(10);
    const examPerformance = await Promise.all(
      exams.map(async (exam) => {
        const results = await Result.find({ examId: exam._id });
        const passed = results.filter((r) => r.status === "passed").length;
        const failed = results.length - passed;
        return {
          name: exam.title,
          passed,
          failed,
        };
      }),
    );

    res.json({
      totalStudents,
      totalTeachers,
      totalExams,
      totalResults,
      recentResults,
      examPerformance,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get teacher dashboard statistics
// @route   GET /api/dashboard/teacher
// @access  Private/Teacher
export const getTeacherDashboard = async (req, res, next) => {
  try {
    const teacherExams = await Exam.find({ createdBy: req.user._id });
    const examIds = teacherExams.map((e) => e._id);

    const totalExams = teacherExams.length;
    const totalResults = await Result.countDocuments({
      examId: { $in: examIds },
    });

    const results = await Result.find({ examId: { $in: examIds } });
    const avgScore =
      results.length > 0
        ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length
        : 0;

    res.json({
      totalExams,
      totalResults,
      avgScore: avgScore.toFixed(2),
      recentExams: teacherExams.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student dashboard statistics
// @route   GET /api/dashboard/student
// @access  Private/Student
export const getStudentDashboard = async (req, res, next) => {
  try {
    const results = await Result.find({ studentId: req.user._id }).populate(
      "examId",
      "title courseId",
    );

    const completedExams = results.length;
    const passedExams = results.filter((r) => r.status === "passed").length;
    const avgScore =
      results.length > 0
        ? results.reduce((sum, r) => sum + r.percentage, 0) / results.length
        : 0;

    // Available exams
    const now = new Date();
    const allExams = await Exam.find({
      status: "published",
      startTime: { $lte: now },
      endTime: { $gte: now },
    });

    const takenExamIds = results.map((r) => r.examId._id.toString());
    const upcomingExams = allExams.filter(
      (e) => !takenExamIds.includes(e._id.toString()),
    ).length;

    res.json({
      completedExams,
      passedExams,
      upcomingExams,
      avgScore: avgScore.toFixed(2),
      recentResults: results.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};
