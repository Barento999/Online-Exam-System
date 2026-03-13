import Question from "../models/Question.js";

// @desc    Get all questions
// @route   GET /api/questions
// @access  Private/Admin/Teacher
export const getQuestions = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.examId) query.examId = req.query.examId;

    const questions = await Question.find(query)
      .populate("examId", "title")
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Question.countDocuments(query);

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
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error("Question not found");
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
    const question = await Question.findById(req.params.id);

    if (!question) {
      res.status(404);
      throw new Error("Question not found");
    }

    await question.deleteOne();
    res.json({ message: "Question deleted successfully" });
  } catch (error) {
    next(error);
  }
};
