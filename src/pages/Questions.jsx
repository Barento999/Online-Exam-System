import { useState, useEffect } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ConfirmDialog } from '@/components/common/ConfirmDialog';
import { Loader } from '@/components/common/Loader';
import { questionsApi, examsApi } from '@/services/api';
import { Plus, Pencil, Trash2, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

export const Questions = () => {
  const [questions, setQuestions] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, questionId: null });
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [filterExamId, setFilterExamId] = useState('all');
  const [formData, setFormData] = useState({
    examId: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctAnswer: 'A',
    marks: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [questionsRes, examsRes] = await Promise.all([
        questionsApi.getAll(),
        examsApi.getAll(),
      ]);
      setQuestions(questionsRes.data);
      setExams(examsRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const questionData = {
        ...formData,
        examId: parseInt(formData.examId),
        marks: parseInt(formData.marks),
      };
      
      if (editingQuestion) {
        await questionsApi.update(editingQuestion.id, questionData);
        toast.success('Question updated successfully');
      } else {
        await questionsApi.create(questionData);
        toast.success('Question created successfully');
      }
      setIsDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      toast.error(error.message || 'Operation failed');
    }
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setFormData({
      examId: question.examId.toString(),
      questionText: question.questionText,
      optionA: question.optionA,
      optionB: question.optionB,
      optionC: question.optionC,
      optionD: question.optionD,
      correctAnswer: question.correctAnswer,
      marks: question.marks.toString(),
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async () => {
    try {
      await questionsApi.delete(deleteDialog.questionId);
      toast.success('Question deleted successfully');
      setDeleteDialog({ open: false, questionId: null });
      loadData();
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const resetForm = () => {
    setFormData({
      examId: '',
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctAnswer: 'A',
      marks: '',
    });
    setEditingQuestion(null);
  };

  const handleDialogClose = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      resetForm();
    }
  };

  const filteredQuestions = filterExamId === 'all' 
    ? questions 
    : questions.filter(q => q.examId === parseInt(filterExamId));

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Question Bank</h1>
            <p className="text-muted-foreground">Manage exam questions</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Question
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingQuestion ? 'Edit Question' : 'Add New Question'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="exam">Exam</Label>
                  <Select value={formData.examId} onValueChange={(value) => setFormData({ ...formData, examId: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an exam" />
                    </SelectTrigger>
                    <SelectContent>
                      {exams.map((exam) => (
                        <SelectItem key={exam.id} value={exam.id.toString()}>
                          {exam.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="questionText">Question Text</Label>
                  <Textarea
                    id="questionText"
                    value={formData.questionText}
                    onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                    required
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="optionA">Option A</Label>
                    <Input
                      id="optionA"
                      value={formData.optionA}
                      onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="optionB">Option B</Label>
                    <Input
                      id="optionB"
                      value={formData.optionB}
                      onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="optionC">Option C</Label>
                    <Input
                      id="optionC"
                      value={formData.optionC}
                      onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="optionD">Option D</Label>
                    <Input
                      id="optionD"
                      value={formData.optionD}
                      onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                    <Select value={formData.correctAnswer} onValueChange={(value) => setFormData({ ...formData, correctAnswer: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A</SelectItem>
                        <SelectItem value="B">B</SelectItem>
                        <SelectItem value="C">C</SelectItem>
                        <SelectItem value="D">D</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marks">Marks</Label>
                    <Input
                      id="marks"
                      type="number"
                      value={formData.marks}
                      onChange={(e) => setFormData({ ...formData, marks: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="outline" onClick={() => handleDialogClose(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">{editingQuestion ? 'Update' : 'Create'}</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Filter className="h-5 w-5 text-muted-foreground" />
              <Select value={filterExamId} onValueChange={setFilterExamId}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filter by exam" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Exams</SelectItem>
                  {exams.map((exam) => (
                    <SelectItem key={exam.id} value={exam.id.toString()}>
                      {exam.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredQuestions.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  No questions found
                </div>
              ) : (
                filteredQuestions.map((question, index) => {
                  const exam = exams.find(e => e.id === question.examId);
                  return (
                    <Card key={question.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">Q{index + 1}</Badge>
                              <Badge>{exam?.title || 'Unknown Exam'}</Badge>
                              <Badge variant="secondary">{question.marks} marks</Badge>
                            </div>
                            <p className="font-medium mb-4">{question.questionText}</p>
                            <div className="grid grid-cols-2 gap-3">
                              {['A', 'B', 'C', 'D'].map((option) => (
                                <div
                                  key={option}
                                  className={`p-3 rounded-lg border ${
                                    question.correctAnswer === option
                                      ? 'bg-green-50 dark:bg-green-900/20 border-green-500'
                                      : 'bg-muted'
                                  }`}
                                >
                                  <span className="font-medium">{option}. </span>
                                  {question[`option${option}`]}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2 ml-4">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(question)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => setDeleteDialog({ open: true, questionId: question.id })}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </CardContent>
        </Card>

        <ConfirmDialog
          open={deleteDialog.open}
          onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
          title="Delete Question"
          description="Are you sure you want to delete this question? This action cannot be undone."
          onConfirm={handleDelete}
        />
      </div>
    </Layout>
  );
};
