import Enrollment from "../models/Enrollment.js";
import Course from "../models/Course.js";
import User from "../models/User.js";

// @desc    Enroll student in course
// @route   POST /api/enrollments
// @access  Private/Admin/Teacher
export const enrollStudent = async (req, res, next) => {
  try {
    const { studentId, courseId } = req.body;

    // Verify student exists and has student role
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      res.status(400);
      throw new Error("Invalid student ID");
    }

    // Verify course exists
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    // Teachers can only enroll students in their own courses
    if (req.user.role === "teacher") {
      if (course.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to enroll students in this course");
      }
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      studentId,
      courseId,
    });

    if (existingEnrollment) {
      res.status(400);
      throw new Error("Student is already enrolled in this course");
    }

    const enrollment = await Enrollment.create({
      studentId,
      courseId,
    });

    // Update course student count
    course.studentsCount = await Enrollment.countDocuments({
      courseId,
      status: "active",
    });
    await course.save();

    res.status(201).json(enrollment);
  } catch (error) {
    next(error);
  }
};

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private
export const getEnrollments = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};

    // Filter by courseId if provided
    if (req.query.courseId) query.courseId = req.query.courseId;

    // Filter by studentId if provided
    if (req.query.studentId) query.studentId = req.query.studentId;

    // Students can only see their own enrollments
    if (req.user.role === "student") {
      query.studentId = req.user._id;
    }

    // Teachers can only see enrollments for their courses
    if (req.user.role === "teacher") {
      const teacherCourses = await Course.find({ teacherId: req.user._id });
      const courseIds = teacherCourses.map((c) => c._id);
      query.courseId = { $in: courseIds };
    }

    if (req.query.status) query.status = req.query.status;

    const enrollments = await Enrollment.find(query)
      .populate("studentId", "name email")
      .populate("courseId", "name description teacherName")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Enrollment.countDocuments(query);

    res.json({
      enrollments,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrollment by ID
// @route   GET /api/enrollments/:id
// @access  Private
export const getEnrollmentById = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)
      .populate("studentId", "name email")
      .populate("courseId", "name description teacherName");

    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }

    // Students can only view their own enrollments
    if (req.user.role === "student") {
      if (enrollment.studentId._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to view this enrollment");
      }
    }

    // Teachers can only view enrollments for their courses
    if (req.user.role === "teacher") {
      const course = await Course.findById(enrollment.courseId._id);
      if (course.teacherId.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error("Not authorized to view this enrollment");
      }
    }

    res.json(enrollment);
  } catch (error) {
    next(error);
  }
};

// @desc    Update enrollment status
// @route   PUT /api/enrollments/:id
// @access  Private/Admin/Teacher
export const updateEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate(
      "courseId",
    );

    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }

    // Teachers can only update enrollments for their courses
    if (req.user.role === "teacher") {
      if (
        enrollment.courseId.teacherId.toString() !== req.user._id.toString()
      ) {
        res.status(403);
        throw new Error("Not authorized to update this enrollment");
      }
    }

    const { status } = req.body;
    enrollment.status = status || enrollment.status;

    const updatedEnrollment = await enrollment.save();

    // Update course student count
    const course = await Course.findById(enrollment.courseId._id);
    course.studentsCount = await Enrollment.countDocuments({
      courseId: enrollment.courseId._id,
      status: "active",
    });
    await course.save();

    res.json(updatedEnrollment);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enrollment (unenroll student)
// @route   DELETE /api/enrollments/:id
// @access  Private/Admin/Teacher
export const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id).populate(
      "courseId",
    );

    if (!enrollment) {
      res.status(404);
      throw new Error("Enrollment not found");
    }

    // Teachers can only delete enrollments for their courses
    if (req.user.role === "teacher") {
      if (
        enrollment.courseId.teacherId.toString() !== req.user._id.toString()
      ) {
        res.status(403);
        throw new Error("Not authorized to delete this enrollment");
      }
    }

    const courseId = enrollment.courseId._id;
    await enrollment.deleteOne();

    // Update course student count
    const course = await Course.findById(courseId);
    course.studentsCount = await Enrollment.countDocuments({
      courseId,
      status: "active",
    });
    await course.save();

    res.json({ message: "Enrollment deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private/Student
export const getMyEnrolledCourses = async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.user._id,
      status: "active",
    }).populate("courseId");

    const courses = enrollments.map((e) => e.courseId);

    res.json(courses);
  } catch (error) {
    next(error);
  }
};
