import { useState, useEffect } from "react";
import { MultiStepForm } from "./MultiStepForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UnifiedTextEditor } from "@/components/ui/unified-text-editor";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BookOpen,
  Clock,
  Settings,
  Users,
  Calendar,
  Target,
  GraduationCap,
  Shield,
  Eye,
  Plus,
  Trash2,
  Check,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Step 1: Basic Information
const BasicInfoStep = ({
  data,
  updateData,
  errors,
  fieldErrors,
  validationAttempted,
  courses = [],
}) => {
  const [titleSuggestions] = useState([
    "Final Assessment",
    "Midterm Examination",
    "Unit Test - Chapter 1",
    "Quiz",
    "Practice Test",
  ]);

  const getFieldError = (fieldName) => {
    return fieldErrors?.[fieldName] || null;
  };

  const hasFieldError = (fieldName) => {
    return (
      validationAttempted &&
      (fieldErrors?.[fieldName] ||
        (!data[fieldName] &&
          [
            "title",
            "subject",
            "duration",
            "totalMarks",
            "passingMarks",
          ].includes(fieldName)))
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Exam Title *</Label>
        <Input
          id="title"
          value={data.title || ""}
          onChange={(e) => updateData({ title: e.target.value })}
          placeholder="Enter exam title"
          className={hasFieldError("title") ? "border-red-500" : ""}
        />
        {getFieldError("title") && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {getFieldError("title")}
          </p>
        )}
        <div className="flex flex-wrap gap-1 mt-2">
          {titleSuggestions.map((suggestion) => (
            <Button
              key={suggestion}
              type="button"
              variant="outline"
              size="sm"
              className="h-6 text-xs"
              onClick={() => updateData({ title: suggestion })}>
              {suggestion}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <UnifiedTextEditor
          value={data.description || ""}
          onChange={(value) => updateData({ description: value })}
          placeholder="Enter exam description and instructions... (Use markdown: **bold**, *italic*, [link](url))"
          minHeight="150px"
          maxHeight="300px"
          showWordCount={true}
          showToolbar={true}
          showPreview={true}
          label="Description & Instructions"
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <Label htmlFor="courseId">Course *</Label>
          <Select
            value={data.courseId || ""}
            onValueChange={(value) => {
              const selectedCourse = courses.find(
                (c) => c._id.toString() === value,
              );
              updateData({
                courseId: value,
                courseName: selectedCourse?.name || "",
              });
            }}>
            <SelectTrigger
              className={hasFieldError("courseId") ? "border-red-500" : ""}>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courses.map((course) => (
                <SelectItem key={course._id} value={course._id.toString()}>
                  {course.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {getFieldError("courseId") && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getFieldError("courseId")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty Level</Label>
          <Select
            value={data.difficulty || "medium"}
            onValueChange={(value) => updateData({ difficulty: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="duration">Duration (minutes) *</Label>
          <Input
            id="duration"
            type="number"
            value={data.duration || ""}
            onChange={(e) => updateData({ duration: parseInt(e.target.value) })}
            placeholder="60"
            min="1"
            max="480"
            className={hasFieldError("duration") ? "border-red-500" : ""}
          />
          {getFieldError("duration") && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getFieldError("duration")}
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="totalMarks">Total Marks *</Label>
          <Input
            id="totalMarks"
            type="number"
            value={data.totalMarks || ""}
            onChange={(e) =>
              updateData({ totalMarks: parseInt(e.target.value) })
            }
            placeholder="100"
            min="1"
            className={hasFieldError("totalMarks") ? "border-red-500" : ""}
          />
          {getFieldError("totalMarks") && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getFieldError("totalMarks")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="passingMarks">Passing Marks *</Label>
          <Input
            id="passingMarks"
            type="number"
            value={data.passingMarks || ""}
            onChange={(e) =>
              updateData({ passingMarks: parseInt(e.target.value) })
            }
            placeholder="40"
            min="1"
            max={data.totalMarks || 100}
            className={hasFieldError("passingMarks") ? "border-red-500" : ""}
          />
          {getFieldError("passingMarks") && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getFieldError("passingMarks")}
            </p>
          )}
        </div>
      </div>

      {data.passingMarks && data.totalMarks && (
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-primary" />
            <span className="font-medium">Passing Percentage</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Students need to score {data.passingMarks} out of {data.totalMarks}{" "}
            marks ({Math.round((data.passingMarks / data.totalMarks) * 100)}%)
            to pass this exam.
          </p>
        </div>
      )}
    </div>
  );
};

// Step 2: Schedule and Availability
const ScheduleStep = ({
  data,
  updateData,
  errors,
  fieldErrors,
  validationAttempted,
}) => {
  const [scheduleType, setScheduleType] = useState(
    data.scheduleType || "immediate",
  );

  const handleScheduleTypeChange = (type) => {
    setScheduleType(type);
    updateData({ scheduleType: type });

    if (type === "immediate") {
      const now = new Date();
      const oneYearLater = new Date(now);
      oneYearLater.setFullYear(now.getFullYear() + 1);

      updateData({
        startTime: now.toISOString().slice(0, 16),
        endTime: oneYearLater.toISOString().slice(0, 16),
      });
    }
  };

  const getScheduleText = () => {
    if (data.startTime && data.endTime) {
      return `${new Date(data.startTime).toLocaleString()} - ${new Date(data.endTime).toLocaleString()}`;
    }
    if (scheduleType === "immediate") {
      return "Available immediately after publishing";
    }
    return "Schedule not set";
  };

  const getFieldError = (fieldName) => {
    return fieldErrors?.[fieldName] || null;
  };

  const hasFieldError = (fieldName) => {
    return validationAttempted && fieldErrors?.[fieldName];
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Exam Schedule</Label>

        <div className="grid gap-4">
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              scheduleType === "immediate"
                ? "ring-2 ring-primary bg-primary/5"
                : "",
            )}
            onClick={() => handleScheduleTypeChange("immediate")}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 mt-1",
                    scheduleType === "immediate"
                      ? "bg-primary border-primary"
                      : "border-muted-foreground",
                  )}>
                  {scheduleType === "immediate" && (
                    <Check className="h-2 w-2 text-white m-0.5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Available Immediately</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Students can take this exam as soon as it's published
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              scheduleType === "scheduled"
                ? "ring-2 ring-primary bg-primary/5"
                : "",
            )}
            onClick={() => handleScheduleTypeChange("scheduled")}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 mt-1",
                    scheduleType === "scheduled"
                      ? "bg-primary border-primary"
                      : "border-muted-foreground",
                  )}>
                  {scheduleType === "scheduled" && (
                    <Check className="h-2 w-2 text-white m-0.5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Scheduled</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Set specific start and end times for the exam
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {scheduleType === "scheduled" && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="startTime">Start Date & Time *</Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={data.startTime || ""}
              min={new Date().toISOString().slice(0, 16)}
              onChange={(e) => updateData({ startTime: e.target.value })}
              className={hasFieldError("startTime") ? "border-red-500" : ""}
            />
            {getFieldError("startTime") && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldError("startTime")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">End Date & Time *</Label>
            <Input
              id="endTime"
              type="datetime-local"
              value={data.endTime || ""}
              min={data.startTime || new Date().toISOString().slice(0, 16)}
              onChange={(e) => updateData({ endTime: e.target.value })}
              className={hasFieldError("endTime") ? "border-red-500" : ""}
            />
            {getFieldError("endTime") && (
              <p className="text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {getFieldError("endTime")}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <Label>Exam Settings</Label>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Randomize Questions</h4>
            <p className="text-sm text-muted-foreground">
              Show questions in random order for each student
            </p>
          </div>
          <Switch
            checked={data.randomizeQuestions || false}
            onCheckedChange={(checked) =>
              updateData({ randomizeQuestions: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Show Results Immediately</h4>
            <p className="text-sm text-muted-foreground">
              Display results to students right after submission
            </p>
          </div>
          <Switch
            checked={data.showResultsImmediately || false}
            onCheckedChange={(checked) =>
              updateData({ showResultsImmediately: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Allow Review</h4>
            <p className="text-sm text-muted-foreground">
              Let students review their answers before final submission
            </p>
          </div>
          <Switch
            checked={data.allowReview || true}
            onCheckedChange={(checked) => updateData({ allowReview: checked })}
          />
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg">
          <div>
            <h4 className="font-medium">Prevent Tab Switching</h4>
            <p className="text-sm text-muted-foreground">
              Monitor and restrict tab switching during exam
            </p>
          </div>
          <Switch
            checked={data.preventTabSwitching || false}
            onCheckedChange={(checked) =>
              updateData({ preventTabSwitching: checked })
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="maxAttempts">Maximum Attempts</Label>
        <Select
          value={data.maxAttempts?.toString() || "1"}
          onValueChange={(value) =>
            updateData({ maxAttempts: parseInt(value) })
          }>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 Attempt</SelectItem>
            <SelectItem value="2">2 Attempts</SelectItem>
            <SelectItem value="3">3 Attempts</SelectItem>
            <SelectItem value="unlimited">Unlimited</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Schedule & Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Schedule:</span>
            <span className="text-sm">{getScheduleText()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Max Attempts:</span>
            <span>
              {data.maxAttempts === 99 ? "Unlimited" : data.maxAttempts}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Questions:</span>
            <span>{(data.questions || []).length}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Step 3: Questions
const QuestionsStep = ({ data, updateData }) => {
  const [questionType, setQuestionType] = useState("create");
  const [questions, setQuestions] = useState(data.questions || []);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      type: "multiple-choice",
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      marks: 1,
      explanation: "",
    };
    const updatedQuestions = [...questions, newQuestion];
    setQuestions(updatedQuestions);
    updateData({ questions: updatedQuestions });
  };

  const updateQuestion = (questionId, updates) => {
    const updatedQuestions = questions.map((q) =>
      q.id === questionId ? { ...q, ...updates } : q,
    );
    setQuestions(updatedQuestions);
    updateData({ questions: updatedQuestions });
  };

  const removeQuestion = (questionId) => {
    const filteredQuestions = questions.filter((q) => q.id !== questionId);
    setQuestions(filteredQuestions);
    updateData({ questions: filteredQuestions });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Question Management</Label>

        <div className="grid gap-4">
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              questionType === "create"
                ? "ring-2 ring-primary bg-primary/5"
                : "",
            )}
            onClick={() => setQuestionType("create")}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 mt-1",
                    questionType === "create"
                      ? "bg-primary border-primary"
                      : "border-muted-foreground",
                  )}>
                  {questionType === "create" && (
                    <Check className="h-2 w-2 text-white m-0.5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Create Questions Now</h4>
                  <p className="text-sm text-muted-foreground">
                    Add questions directly in this form
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              questionType === "later"
                ? "ring-2 ring-primary bg-primary/5"
                : "",
            )}
            onClick={() => setQuestionType("later")}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border-2 mt-1",
                    questionType === "later"
                      ? "bg-primary border-primary"
                      : "border-muted-foreground",
                  )}>
                  {questionType === "later" && (
                    <Check className="h-2 w-2 text-white m-0.5" />
                  )}
                </div>
                <div>
                  <h4 className="font-medium">Add Questions Later</h4>
                  <p className="text-sm text-muted-foreground">
                    Create the exam structure first, add questions afterwards
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {questionType === "create" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium">
              Questions ({(data.questions || []).length})
            </h4>
            <Button onClick={addQuestion} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
          </div>

          {(data.questions || []).length === 0 ? (
            <div className="text-center border-2 border-dashed rounded-lg p-8">
              <BookOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">No questions added yet</p>
              <Button variant="outline" className="mt-2" onClick={addQuestion}>
                Add Your First Question
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {(data.questions || []).map((question, index) => (
                <Card key={question.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">
                        Question {index + 1}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeQuestion(question.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-4 gap-4">
                      <div className="md:col-span-3">
                        <UnifiedTextEditor
                          value={question.question}
                          onChange={(value) =>
                            updateQuestion(question.id, {
                              question: value,
                            })
                          }
                          placeholder="Enter your question here... (Use markdown: **bold**, *italic*)"
                          minHeight="100px"
                          showWordCount={false}
                          showToolbar={true}
                          showPreview={true}
                          label="Question Text"
                        />
                      </div>
                      <div>
                        <Label>Marks</Label>
                        <Input
                          type="number"
                          value={question.marks}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              marks: parseInt(e.target.value),
                            })
                          }
                          min="1"
                          max="10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Answer Options</Label>
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className="flex items-center gap-2">
                          <Checkbox
                            checked={question.correctAnswer === optionIndex}
                            onCheckedChange={(checked) => {
                              if (checked) {
                                updateQuestion(question.id, {
                                  correctAnswer: optionIndex,
                                });
                              }
                            }}
                          />
                          <Input
                            value={option}
                            onChange={(e) => {
                              const newOptions = [...question.options];
                              newOptions[optionIndex] = e.target.value;
                              updateQuestion(question.id, {
                                options: newOptions,
                              });
                            }}
                            placeholder={`Option ${optionIndex + 1}`}
                          />
                        </div>
                      ))}
                    </div>

                    <div>
                      <UnifiedTextEditor
                        value={question.explanation}
                        onChange={(value) =>
                          updateQuestion(question.id, {
                            explanation: value,
                          })
                        }
                        placeholder="Explain the correct answer... (Use markdown: **bold**, *italic*)"
                        minHeight="80px"
                        showWordCount={false}
                        showToolbar={true}
                        showPreview={true}
                        label="Explanation (Optional)"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {questionType === "later" && (
        <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-green-800 dark:text-green-200">
                Ready to Create Exam
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                Your exam is configured and ready to be created. Questions will
                be added later based on your schedule settings.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Step 4: Review and Confirm
const ReviewStep = ({ data }) => {
  const getTotalMarks = () => {
    if (!data.questions || data.questions.length === 0) {
      return data.totalMarks || 0;
    }
    return data.questions.reduce((total, q) => total + (q.marks || 0), 0);
  };

  const getScheduleText = () => {
    if (data.startTime && data.endTime) {
      return `${new Date(data.startTime).toLocaleString()} - ${new Date(data.endTime).toLocaleString()}`;
    }
    if (data.scheduleType === "immediate") {
      return "Available immediately after publishing";
    }
    return "Schedule not set";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <BookOpen className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">{data.title}</h3>
        <p className="text-muted-foreground">{data.courseName || "Course"}</p>
        <Badge className="mt-2 capitalize">{data.difficulty}</Badge>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Exam Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Course:</span>
              <span>{data.courseName || "Not selected"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Duration:</span>
              <span>{data.duration} minutes</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Marks:</span>
              <span>{getTotalMarks()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Passing Marks:</span>
              <span>{data.passingMarks}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Passing Percentage:</span>
              <span>
                {Math.round((data.passingMarks / getTotalMarks()) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Schedule & Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Schedule:</span>
              <span className="text-sm">{getScheduleText()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Max Attempts:</span>
              <span>
                {data.maxAttempts === 99 ? "Unlimited" : data.maxAttempts}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Randomize Questions:
              </span>
              <span>{data.randomizeQuestions ? "Yes" : "No"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Allow Review:</span>
              <Badge variant={data.allowReview ? "default" : "secondary"}>
                {data.allowReview ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Show Results:</span>
              <Badge
                variant={data.showResultsImmediately ? "default" : "secondary"}>
                {data.showResultsImmediately ? "Immediately" : "Manual"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {data.description || "No description provided."}
          </p>
        </CardContent>
      </Card>

      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200">
              Ready to Create Exam
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your exam is configured and ready to be created. Students will be
              able to access it based on your schedule settings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MultiStepExamForm = ({
  onSubmit,
  onCancel,
  initialData = {},
  courses = [],
}) => {
  const validateBasicInfo = (data) => {
    const errors = {};
    let isValid = true;

    // Title validation
    if (!data.title || data.title.trim().length < 3) {
      errors.title = "Exam title must be at least 3 characters long";
      isValid = false;
    }

    // Course validation
    if (!data.courseId) {
      errors.courseId = "Please select a course";
      isValid = false;
    }

    // Duration validation
    if (!data.duration || data.duration < 1 || data.duration > 480) {
      errors.duration = "Duration must be between 1 and 480 minutes";
      isValid = false;
    }

    // Total marks validation
    if (!data.totalMarks || data.totalMarks < 1) {
      errors.totalMarks = "Total marks must be at least 1";
      isValid = false;
    }

    // Passing marks validation
    if (!data.passingMarks || data.passingMarks < 1) {
      errors.passingMarks = "Passing marks must be at least 1";
      isValid = false;
    } else if (data.totalMarks && data.passingMarks > data.totalMarks) {
      errors.passingMarks = "Passing marks cannot exceed total marks";
      isValid = false;
    }

    return {
      isValid,
      fieldErrors: errors,
      message: isValid ? null : "Please fix the errors above to continue",
    };
  };

  const validateScheduleSettings = (data) => {
    const errors = {};
    let isValid = true;

    if (data.scheduleType === "scheduled") {
      if (!data.startTime) {
        errors.startTime = "Start time is required for scheduled exams";
        isValid = false;
      }
      if (!data.endTime) {
        errors.endTime = "End time is required for scheduled exams";
        isValid = false;
      }
      if (
        data.startTime &&
        data.endTime &&
        new Date(data.startTime) >= new Date(data.endTime)
      ) {
        errors.endTime = "End time must be after start time";
        isValid = false;
      }
    }

    return {
      isValid,
      fieldErrors: errors,
      message: isValid ? null : "Please fix the schedule settings to continue",
    };
  };

  const steps = [
    {
      title: "Basic Information",
      description: "Set up the exam title, subject, and basic parameters",
      component: (props) => <BasicInfoStep {...props} courses={courses} />,
      validate: validateBasicInfo,
    },
    {
      title: "Schedule & Settings",
      description: "Configure exam timing and behavior settings",
      component: ScheduleStep,
      validate: validateScheduleSettings,
    },
    {
      title: "Questions",
      description: "Add questions or set up question structure",
      component: QuestionsStep,
      optional: true,
    },
    {
      title: "Review & Create",
      description: "Review all information and create the exam",
      component: ReviewStep,
    },
  ];

  const handleSubmit = async (formData) => {
    // Transform data for API
    const examData = {
      title: formData.title,
      description: formData.description,
      courseId: formData.courseId,
      difficulty: formData.difficulty,
      duration: formData.duration,
      totalMarks: formData.totalMarks,
      passingMarks: formData.passingMarks,
      startTime: formData.startTime,
      endTime: formData.endTime,
      scheduleType: formData.scheduleType,
      randomizeQuestions: formData.randomizeQuestions,
      allowReview: formData.allowReview,
      showResultsImmediately: formData.showResultsImmediately,
      preventTabSwitching: formData.preventTabSwitching,
      maxAttempts: formData.maxAttempts,
      questions: formData.questions || [],
      status: "draft",
    };

    await onSubmit(examData);
  };

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      initialData={initialData}
      title="Create New Exam"
      subtitle="Follow the steps to create a comprehensive exam"
      showProgress={true}
      showStepNumbers={true}
      validateOnStepChange={true}
      autoSave={true}
      autoSaveInterval={30000}
    />
  );
};
