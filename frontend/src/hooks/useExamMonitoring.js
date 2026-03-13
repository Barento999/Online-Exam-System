import { useEffect, useState } from "react";
import { useSocket } from "@/context/SocketContext";

export const useExamMonitoring = (examId) => {
  const { socket, connected } = useSocket();
  const [activeStudents, setActiveStudents] = useState([]);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!socket || !connected || !examId) return;

    // Join monitoring room
    socket.emit("monitor-exam", { examId });

    // Listen for active students
    socket.on("active-students", (students) => {
      setActiveStudents(students);
    });

    // Listen for student joined
    socket.on("student-joined", (data) => {
      setEvents((prev) => [
        {
          type: "joined",
          message: `${data.studentName} joined the exam`,
          timestamp: data.timestamp,
        },
        ...prev,
      ]);

      setActiveStudents((prev) => [
        ...prev,
        {
          studentId: data.studentId,
          studentName: data.studentName,
          status: "active",
          joinedAt: data.timestamp,
          currentQuestion: 0,
          answeredCount: 0,
        },
      ]);
    });

    // Listen for student progress
    socket.on("student-progress", (data) => {
      setActiveStudents((prev) =>
        prev.map((student) =>
          student.studentId === data.studentId
            ? {
                ...student,
                currentQuestion: data.currentQuestion,
                answeredCount: data.answeredCount,
              }
            : student,
        ),
      );
    });

    // Listen for student submitted
    socket.on("student-submitted", (data) => {
      setEvents((prev) => [
        {
          type: "submitted",
          message: `${data.studentName} submitted the exam`,
          timestamp: data.timestamp,
        },
        ...prev,
      ]);

      setActiveStudents((prev) =>
        prev.map((student) =>
          student.studentId === data.studentId
            ? { ...student, status: "submitted" }
            : student,
        ),
      );
    });

    // Listen for student left
    socket.on("student-left", (data) => {
      setActiveStudents((prev) =>
        prev.filter((student) => student.studentId !== data.studentId),
      );
    });

    // Listen for student disconnected
    socket.on("student-disconnected", (data) => {
      setEvents((prev) => [
        {
          type: "disconnected",
          message: `${data.studentName} disconnected`,
          timestamp: data.timestamp,
        },
        ...prev,
      ]);

      setActiveStudents((prev) =>
        prev.map((student) =>
          student.studentId === data.studentId
            ? { ...student, status: "disconnected" }
            : student,
        ),
      );
    });

    return () => {
      socket.off("active-students");
      socket.off("student-joined");
      socket.off("student-progress");
      socket.off("student-submitted");
      socket.off("student-left");
      socket.off("student-disconnected");
    };
  }, [socket, connected, examId]);

  return { activeStudents, events, connected };
};
