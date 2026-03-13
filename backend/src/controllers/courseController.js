import Course from "../models/Course.js";

// @desc    Get all courses
// @route   GET /api/courses
// @access  Private
export const getCourses = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.teacherId) query.teacherId = req.query.teacherId;
    if (req.query.status) query.status = req.query.status;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const courses = await Course.find(query)
      .populate("teacherId", "name email")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Course.countDocuments(query);

    res.json({
      courses,
      page,
      pages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Private
export const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "teacherId",
      "name email",
    );

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    res.json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Admin/Teacher
export const createCourse = async (req, res, next) => {
  try {
    const { name, description, teacherId } = req.body;

    const course = await Course.create({
      name,
      description,
      teacherId,
    });

    res.status(201).json(course);
  } catch (error) {
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin/Teacher
export const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    const { name, description, teacherId, status } = req.body;

    course.name = name || course.name;
    course.description = description || course.description;
    course.teacherId = teacherId || course.teacherId;
    course.status = status || course.status;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
export const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      res.status(404);
      throw new Error("Course not found");
    }

    await course.deleteOne();
    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    next(error);
  }
};
