import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Loader } from "@/components/common/Loader";
import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { examsApi, questionsApi } from "@/services/api";
import { useExamSession } from "@/hooks/useExamSession";
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Flag,
  Wifi,
  WifiOff,
} from "lucide-react";
import toast from "react-hot-toast";

export const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitDialog, setSubmitDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const {
    updateProgress,
    submitExam: notifySubmit,
    connected,
  } = useExamSession(examId, user._id);

  useEffect(() => {
    loadExamData();
  }, [examId]);

  useEffect(() => {
    if (timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleAutoSubmit();
          return 0;
        }

        // Warning notifications
        if (prev === 300) {
          // 5 minutes remaining
          toast.warning("⏰ 5 minutes remaining!", { duration: 5000 });
        } else if (prev === 60) {
          // 1 minute remaining
          toast.error("⏰ Only 1 minute left!", { duration: 5000 });
        } else if (prev === 30) {
          // 30 seconds remaining
          toast.error("⏰ 30 seconds left! Hurry up!", { duration: 5000 });
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const loadExamData = async () => {
    try {
      const [examRes, questionsRes] = await Promise.all([
        examsApi.getById(examId),
        questionsApi.getAll(examId),
      ]);
      setExam(examRes.data);
      setQuestions(questionsRes.data.questions || questionsRes.data);
      setTimeRemaining(examRes.data.duration * 60); // Convert to seconds
    } catch (error) {
      toast.error("Failed to load exam");
      navigate("/exams");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    toast.error("Time is up! Submitting exam...");
    await handleSubmitExam();
  };

  const handleSubmitExam = async () => {
    setSubmitting(true);
    try {
      await examsApi.submit(examId, answers);
      notifySubmit(); // Notify via WebSocket
      toast.success(
        "Exam submitted successfully! Results will be published by your teacher.",
      );
      navigate("/exams");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit exam");
    } finally {
      setSubmitting(false);
      setSubmitDialog(false);
    }
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({
      ...answers,
      [questionId]: answer,
    });

    // Update progress via WebSocket
    const newAnsweredCount = Object.keys({
      ...answers,
      [questionId]: answer,
    }).length;
    updateProgress(currentQuestionIndex, newAnsweredCount);
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const answeredCount = Object.keys(answers).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader size="lg" />
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold">{exam?.title}</h1>
              <p className="text-sm text-muted-foreground">
                {exam?.courseName}
              </p>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                {connected ? (
                  <Wifi className="h-4 w-4 text-green-500" />
                ) : (
                  <WifiOff className="h-4 w-4 text-destructive" />
                )}
                <span className="text-xs text-muted-foreground">
                  {connected ? "Live" : "Offline"}
                </span>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  Questions Answered
                </p>
                <p className="text-xl font-semibold">
                  {answeredCount} / {questions.length}
                </p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 mb-1">
                  <Clock
                    className={`h-5 w-5 ${timeRemaining < 300 ? "text-destructive animate-pulse" : "text-primary"}`}
                  />
                  <p className="text-sm text-muted-foreground">
                    Time Remaining
                  </p>
                </div>
                <p
                  className={`text-2xl font-semibold ${
                    timeRemaining < 60
                      ? "text-destructive animate-pulse"
                      : timeRemaining < 300
                        ? "text-orange-500"
                        : "text-primary"
                  }`}>
                  {formatTime(timeRemaining)}
                </p>
                {timeRemaining < 300 && (
                  <p className="text-xs text-destructive mt-1">
                    {timeRemaining < 60
                      ? "⚠️ Time almost up!"
                      : "⚠️ Less than 5 min"}
                  </p>
                )}
              </div>
            </div>
          </div>
          <Progress value={progress} className="mt-4" />
        </div>
      </div>

      {/* Time Warning Banner */}
      {timeRemaining > 0 && timeRemaining < 300 && (
        <div
          className={`${
            timeRemaining < 60
              ? "bg-destructive/10 border-destructive"
              : "bg-orange-500/10 border-orange-500"
          } border-b`}>
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              <Clock
                className={`h-5 w-5 ${timeRemaining < 60 ? "text-destructive" : "text-orange-500"} animate-pulse`}
              />
              <p
                className={`font-medium ${timeRemaining < 60 ? "text-destructive" : "text-orange-500"}`}>
                {timeRemaining < 60
                  ? "⚠️ Less than 1 minute remaining! Exam will auto-submit soon."
                  : `⚠️ ${Math.floor(timeRemaining / 60)} minutes remaining. Please complete your answers.`}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Question Navigation Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-4 gap-2">
                  {questions.map((q, index) => (
                    <button
                      key={q._id || index}
                      onClick={() => setCurrentQuestionIndex(index)}
                      className={`h-10 w-10 rounded-lg border transition-colors ${
                        currentQuestionIndex === index
                          ? "bg-primary text-primary-foreground border-primary"
                          : answers[q._id]
                            ? "bg-green-100 dark:bg-green-900/20 border-green-500 text-green-700 dark:text-green-400"
                            : "bg-muted hover:bg-accent border-border"
                      }`}>
                      {index + 1}
                    </button>
                  ))}
                </div>
                <div className="mt-4 space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-primary"></div>
                    <span className="text-muted-foreground">Current</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-green-100 dark:bg-green-900/20 border border-green-500"></div>
                    <span className="text-muted-foreground">Answered</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded bg-muted border border-border"></div>
                    <span className="text-muted-foreground">Not Answered</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Question and Options */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-2">
                      Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                    <CardTitle className="text-xl">
                      {currentQuestion?.questionText}
                    </CardTitle>
                    {currentQuestion?.imageUrl && (
                      <div className="mt-4">
                        <img
                          src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${currentQuestion.imageUrl}`}
                          alt="Question"
                          className="max-w-full h-auto max-h-96 rounded border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-lg">
                    <Flag className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">
                      {currentQuestion?.marks} marks
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={answers[currentQuestion?._id] || ""}
                  onValueChange={(value) =>
                    handleAnswerChange(currentQuestion?._id, value)
                  }>
                  <div className="space-y-3">
                    {["A", "B", "C", "D"].map((option) => (
                      <div
                        key={option}
                        className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors ${
                          answers[currentQuestion?._id] === option
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-accent"
                        }`}>
                        <RadioGroupItem
                          value={option}
                          id={`option-${option}`}
                        />
                        <Label
                          htmlFor={`option-${option}`}
                          className="flex-1 cursor-pointer font-normal">
                          <span className="font-medium mr-2">{option}.</span>
                          {currentQuestion?.[`option${option}`]}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>

              {currentQuestionIndex === questions.length - 1 ? (
                <Button
                  onClick={() => setSubmitDialog(true)}
                  className="bg-green-600 hover:bg-green-700"
                  disabled={submitting}>
                  Submit Exam
                </Button>
              ) : (
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentQuestionIndex((prev) =>
                      Math.min(questions.length - 1, prev + 1),
                    )
                  }>
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={submitDialog}
        onOpenChange={setSubmitDialog}
        title="Submit Exam"
        description={`You have answered ${answeredCount} out of ${questions.length} questions. Are you sure you want to submit your exam? This action cannot be undone.`}
        onConfirm={handleSubmitExam}
      />
    </div>
  );
};
