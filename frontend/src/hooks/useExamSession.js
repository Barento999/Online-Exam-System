import { useEffect } from "react";
import { useSocket } from "@/context/SocketContext";

export const useExamSession = (examId, studentId) => {
  const { socket, connected } = useSocket();

  useEffect(() => {
    if (!socket || !connected || !examId || !studentId) return;

    // Join exam room
    socket.emit("join-exam", { examId, studentId });

    return () => {
      // Leave exam room on unmount
      socket.emit("leave-exam", { examId, studentId });
    };
  }, [socket, connected, examId, studentId]);

  const updateProgress = (currentQuestion, answeredCount) => {
    if (socket && connected) {
      socket.emit("exam-progress", {
        examId,
        studentId,
        currentQuestion,
        answeredCount,
      });
    }
  };

  const submitExam = () => {
    if (socket && connected) {
      socket.emit("exam-submitted", { examId, studentId });
    }
  };

  return { updateProgress, submitExam, connected };
};
