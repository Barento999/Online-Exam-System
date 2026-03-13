import dotenv from "dotenv";
import connectDB from "../config/database.js";
import User from "../models/User.js";
import Course from "../models/Course.js";
import Exam from "../models/Exam.js";
import Question from "../models/Question.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Course.deleteMany();
    await Exam.deleteMany();
    await Question.deleteMany();

    console.log("Cleared existing data");

    // Create users
    const admin = await User.create({
      name: "Admin User",
      email: "admin@exam.com",
      password: "admin123",
      role: "admin",
      status: "active",
    });

    const teacher1 = await User.create({
      name: "John Teacher",
      email: "teacher@exam.com",
      password: "teacher123",
      role: "teacher",
      status: "active",
    });

    const teacher2 = await User.create({
      name: "Mike Johnson",
      email: "mike@exam.com",
      password: "teacher123",
      role: "teacher",
      status: "active",
    });

    const student1 = await User.create({
      name: "Jane Student",
      email: "student@exam.com",
      password: "student123",
      role: "student",
      status: "active",
    });

    const student2 = await User.create({
      name: "Sarah Smith",
      email: "sarah@exam.com",
      password: "student123",
      role: "student",
      status: "active",
    });

    console.log("Users created");

    // Create courses
    const course1 = await Course.create({
      name: "Mathematics 101",
      description: "Introduction to Algebra and Calculus",
      teacherId: teacher1._id,
      studentsCount: 45,
    });

    const course2 = await Course.create({
      name: "Physics Advanced",
      description: "Classical and Modern Physics",
      teacherId: teacher2._id,
      studentsCount: 32,
    });

    const course3 = await Course.create({
      name: "Computer Science",
      description: "Data Structures and Algorithms",
      teacherId: teacher1._id,
      studentsCount: 58,
    });

    console.log("Courses created");

    // Create exams
    const exam1 = await Exam.create({
      title: "Mathematics Midterm",
      courseId: course1._id,
      duration: 90,
      totalMarks: 100,
      passingMarks: 40,
      startTime: new Date("2026-03-15T09:00:00"),
      endTime: new Date("2026-03-15T10:30:00"),
      status: "published",
      createdBy: teacher1._id,
    });

    const exam2 = await Exam.create({
      title: "Physics Quiz 1",
      courseId: course2._id,
      duration: 45,
      totalMarks: 50,
      passingMarks: 20,
      startTime: new Date("2026-03-20T14:00:00"),
      endTime: new Date("2026-03-20T14:45:00"),
      status: "published",
      createdBy: teacher2._id,
    });

    console.log("Exams created");

    // Create questions for exam1
    await Question.create([
      {
        examId: exam1._id,
        questionText: "What is the derivative of x²?",
        optionA: "2x",
        optionB: "x",
        optionC: "2",
        optionD: "x²",
        correctAnswer: "A",
        marks: 5,
      },
      {
        examId: exam1._id,
        questionText: "What is the integral of 1/x?",
        optionA: "x²",
        optionB: "ln|x| + C",
        optionC: "1/x²",
        optionD: "e^x",
        correctAnswer: "B",
        marks: 5,
      },
      {
        examId: exam1._id,
        questionText: "What is the value of π (pi)?",
        optionA: "3.14159",
        optionB: "2.71828",
        optionC: "1.41421",
        optionD: "1.61803",
        correctAnswer: "A",
        marks: 5,
      },
    ]);

    // Create questions for exam2
    await Question.create([
      {
        examId: exam2._id,
        questionText: "What is the speed of light in vacuum?",
        optionA: "3 × 10⁸ m/s",
        optionB: "2 × 10⁸ m/s",
        optionC: "4 × 10⁸ m/s",
        optionD: "1 × 10⁸ m/s",
        correctAnswer: "A",
        marks: 10,
      },
      {
        examId: exam2._id,
        questionText: "What is Newton's first law of motion?",
        optionA: "F = ma",
        optionB: "An object at rest stays at rest",
        optionC: "E = mc²",
        optionD: "For every action, there is an equal and opposite reaction",
        correctAnswer: "B",
        marks: 10,
      },
    ]);

    console.log("Questions created");

    console.log("\n=== Seed Data Created Successfully ===\n");
    console.log("Admin Credentials:");
    console.log("Email: admin@exam.com");
    console.log("Password: admin123\n");
    console.log("Teacher Credentials:");
    console.log("Email: teacher@exam.com");
    console.log("Password: teacher123\n");
    console.log("Student Credentials:");
    console.log("Email: student@exam.com");
    console.log("Password: student123\n");

    process.exit(0);
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
