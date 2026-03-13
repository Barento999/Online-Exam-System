import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

let io;

// Store active exam sessions
const activeExamSessions = new Map();

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      credentials: true,
    },
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.name} (${socket.user.role})`);

    // Student joins exam room
    socket.on("join-exam", ({ examId, studentId }) => {
      const roomName = `exam-${examId}`;
      socket.join(roomName);

      // Track active session
      if (!activeExamSessions.has(examId)) {
        activeExamSessions.set(examId, new Map());
      }

      const examSessions = activeExamSessions.get(examId);
      examSessions.set(studentId, {
        socketId: socket.id,
        studentName: socket.user.name,
        joinedAt: new Date(),
        status: "active",
        currentQuestion: 0,
        answeredCount: 0,
      });

      // Notify teachers/admins
      io.to(roomName).emit("student-joined", {
        examId,
        studentId,
        studentName: socket.user.name,
        timestamp: new Date(),
      });

      // Send current active students list
      const activeStudents = Array.from(examSessions.values()).map((s) => ({
        studentId: s.studentId,
        studentName: s.studentName,
        status: s.status,
        joinedAt: s.joinedAt,
        currentQuestion: s.currentQuestion,
        answeredCount: s.answeredCount,
      }));

      socket.emit("active-students", activeStudents);

      console.log(`Student ${socket.user.name} joined exam ${examId}`);
    });

    // Teacher/Admin monitors exam
    socket.on("monitor-exam", ({ examId }) => {
      const roomName = `exam-${examId}`;
      socket.join(roomName);

      // Send current active students
      const examSessions = activeExamSessions.get(examId);
      if (examSessions) {
        const activeStudents = Array.from(examSessions.entries()).map(
          ([studentId, data]) => ({
            studentId,
            studentName: data.studentName,
            status: data.status,
            joinedAt: data.joinedAt,
            currentQuestion: data.currentQuestion,
            answeredCount: data.answeredCount,
          }),
        );

        socket.emit("active-students", activeStudents);
      }

      console.log(`${socket.user.name} monitoring exam ${examId}`);
    });

    // Student progress update
    socket.on(
      "exam-progress",
      ({ examId, studentId, currentQuestion, answeredCount }) => {
        const roomName = `exam-${examId}`;
        const examSessions = activeExamSessions.get(examId);

        if (examSessions && examSessions.has(studentId)) {
          const session = examSessions.get(studentId);
          session.currentQuestion = currentQuestion;
          session.answeredCount = answeredCount;
          session.lastActivity = new Date();

          // Broadcast to monitors
          io.to(roomName).emit("student-progress", {
            examId,
            studentId,
            studentName: session.studentName,
            currentQuestion,
            answeredCount,
            timestamp: new Date(),
          });
        }
      },
    );

    // Student submits exam
    socket.on("exam-submitted", ({ examId, studentId }) => {
      const roomName = `exam-${examId}`;
      const examSessions = activeExamSessions.get(examId);

      if (examSessions && examSessions.has(studentId)) {
        const session = examSessions.get(studentId);
        session.status = "submitted";
        session.submittedAt = new Date();

        // Notify monitors
        io.to(roomName).emit("student-submitted", {
          examId,
          studentId,
          studentName: session.studentName,
          timestamp: new Date(),
        });

        console.log(`Student ${session.studentName} submitted exam ${examId}`);
      }
    });

    // Leave exam room
    socket.on("leave-exam", ({ examId, studentId }) => {
      const roomName = `exam-${examId}`;
      socket.leave(roomName);

      const examSessions = activeExamSessions.get(examId);
      if (examSessions && examSessions.has(studentId)) {
        examSessions.delete(studentId);

        // Notify monitors
        io.to(roomName).emit("student-left", {
          examId,
          studentId,
          timestamp: new Date(),
        });
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.user.name}`);

      // Clean up exam sessions
      activeExamSessions.forEach((examSessions, examId) => {
        examSessions.forEach((session, studentId) => {
          if (session.socketId === socket.id) {
            session.status = "disconnected";
            session.disconnectedAt = new Date();

            // Notify monitors
            io.to(`exam-${examId}`).emit("student-disconnected", {
              examId,
              studentId,
              studentName: session.studentName,
              timestamp: new Date(),
            });
          }
        });
      });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized");
  }
  return io;
};

export const getActiveExamSessions = (examId) => {
  return activeExamSessions.get(examId);
};
