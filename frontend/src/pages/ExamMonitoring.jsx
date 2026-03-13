import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader } from "@/components/common/Loader";
import { LiveExamMonitor } from "@/components/common/LiveExamMonitor";
import { examsApi, questionsApi } from "@/services/api";
import { ArrowLeft, Eye } from "lucide-react";
import toast from "react-hot-toast";

export const ExamMonitoring = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExamData();
  }, [examId]);

  const loadExamData = async () => {
    try {
      const [examRes, questionsRes] = await Promise.all([
        examsApi.getById(examId),
        questionsApi.getAll(examId),
      ]);
      setExam(examRes.data);
      setTotalQuestions(
        questionsRes.data.questions?.length || questionsRes.data.length || 0,
      );
    } catch (error) {
      toast.error("Failed to load exam data");
      navigate("/exams");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-96">
          <Loader size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Eye className="h-8 w-8 text-primary" />
                Live Exam Monitoring
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor students taking the exam in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Exam Info */}
        <Card>
          <CardHeader>
            <CardTitle>{exam?.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Course</p>
                <p className="font-medium">{exam?.courseName}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">{exam?.duration} minutes</p>
              </div>
              <div>
                <p className="text-muted-foreground">Total Marks</p>
                <p className="font-medium">{exam?.totalMarks}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Questions</p>
                <p className="font-medium">{totalQuestions}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Monitor */}
        <LiveExamMonitor examId={examId} totalQuestions={totalQuestions} />
      </div>
    </Layout>
  );
};
