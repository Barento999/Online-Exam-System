import { useState } from "react";
import { MultiStepForm } from "./MultiStepForm";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { SimpleRichTextEditor } from "@/components/ui/simple-rich-text-editor";
import { LTRTextEditor } from "@/components/ui/ltr-text-editor";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  HelpCircle,
  Image,
  Target,
  Upload,
  X,
  Check,
  AlertCircle,
  Camera,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Step 1: Question Details
const QuestionDetailsStep = ({
  data,
  updateData,
  errors,
  fieldErrors,
  validationAttempted,
}) => {
  const [questionTypes] = useState([
    {
      value: "multiple-choice",
      label: "Multiple Choice",
      description: "Single correct answer from 4 options",
    },
    {
      value: "true-false",
      label: "True/False",
      description: "Simple true or false question",
    },
    {
      value: "short-answer",
      label: "Short Answer",
      description: "Brief text response",
    },
    {
      value: "essay",
      label: "Essay",
      description: "Long-form written response",
    },
  ]);

  const getFieldError = (fieldName) => {
    return fieldErrors?.[fieldName] || null;
  };

  const hasFieldError = (fieldName) => {
    return (
      validationAttempted &&
      (fieldErrors?.[fieldName] ||
        (!data[fieldName] &&
          ["examId", "type", "questionText", "marks"].includes(fieldName)))
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="examId">Select Exam *</Label>
        <Select
          value={data.examId || ""}
          onValueChange={(value) => updateData({ examId: value })}>
          <SelectTrigger
            className={hasFieldError("examId") ? "border-red-500" : ""}>
            <SelectValue placeholder="Choose an exam" />
          </SelectTrigger>
          <SelectContent>
            {/* This would be populated with actual exams */}
            <SelectItem value="exam1">Mathematics Final Exam</SelectItem>
            <SelectItem value="exam2">Physics Midterm</SelectItem>
            <SelectItem value="exam3">Chemistry Quiz</SelectItem>
          </SelectContent>
        </Select>
        {getFieldError("examId") && (
          <p className="text-sm text-red-600 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            {getFieldError("examId")}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Question Type *</Label>
        <div className="grid gap-3">
          {questionTypes.map((type) => (
            <Card
              key={type.value}
              className={cn(
                "cursor-pointer transition-all hover:shadow-md",
                data.type === type.value
                  ? "ring-2 ring-primary bg-primary/5"
                  : "",
              )}
              onClick={() => updateData({ type: type.value })}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-4 h-4 rounded-full border-2 mt-1",
                      data.type === type.value
                        ? "bg-primary border-primary"
                        : "border-muted-foreground",
                    )}>
                    {data.type === type.value && (
                      <Check className="h-2 w-2 text-white m-0.5" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{type.label}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {type.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="questionText">Question Text *</Label>
        <LTRTextEditor
          value={data.questionText || ""}
          onChange={(value) => updateData({ questionText: value })}
          placeholder="Enter your question here... Use the toolbar for formatting"
          minHeight="150px"
          maxHeight="250px"
          label=""
          required={true}
          error={
            hasFieldError("questionText") ? getFieldError("questionText") : null
          }
          showWordCount={true}
        />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
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
          <Label htmlFor="marks">Marks *</Label>
          <Input
            id="marks"
            type="number"
            value={data.marks || ""}
            onChange={(e) => updateData({ marks: parseInt(e.target.value) })}
            placeholder="1"
            min="1"
            max="20"
            className={hasFieldError("marks") ? "border-red-500" : ""}
          />
          {getFieldError("marks") && (
            <p className="text-sm text-red-600 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {getFieldError("marks")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="timeLimit">Time Limit (seconds)</Label>
          <Input
            id="timeLimit"
            type="number"
            value={data.timeLimit || ""}
            onChange={(e) =>
              updateData({ timeLimit: parseInt(e.target.value) })
            }
            placeholder="60"
            min="10"
            max="600"
          />
          <p className="text-xs text-muted-foreground">
            Optional: Set individual question time limit
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="tags">Tags (Optional)</Label>
        <Input
          id="tags"
          value={data.tags || ""}
          onChange={(e) => updateData({ tags: e.target.value })}
          placeholder="algebra, equations, basic (comma separated)"
        />
        <p className="text-xs text-muted-foreground">
          Add tags to help organize and search questions
        </p>
      </div>
    </div>
  );
};

// Step 2: Media and Resources
const MediaStep = ({ data, updateData }) => {
  const [imagePreview, setImagePreview] = useState(data.imageUrl || null);

  const handleImageSelect = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      // This error should be handled by the DragDropUpload component
      return;
    }

    updateData({ imageFile: file });
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    updateData({ imageFile: null, imageUrl: null });
    setImagePreview(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Image className="h-5 w-5" />
          <Label>Question Image</Label>
        </div>

        {!imagePreview ? (
          <DragDropUpload
            onFileSelect={handleImageSelect}
            onFileRemove={handleImageRemove}
            accept="image/*"
            maxSize={5 * 1024 * 1024} // 5MB
            maxFiles={1}
            files={data.imageFile ? [data.imageFile] : []}
            showPreview={false}
            helperText="Upload an image to accompany your question">
            <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
            <div className="space-y-2">
              <p className="text-sm font-medium">Drag & drop an image here</p>
              <p className="text-xs text-muted-foreground">
                Supported formats: JPG, PNG, GIF, WebP (Max 5MB)
              </p>
            </div>
          </DragDropUpload>
        ) : (
          <div className="relative">
            <img
              src={imagePreview}
              alt="Question preview"
              className="max-w-full h-auto max-h-64 rounded-lg border"
            />
            <Button
              type="button"
              variant="destructive"
              size="sm"
              className="absolute top-2 right-2"
              onClick={handleImageRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="hint">Hint (Optional)</Label>
        <MarkdownEditor
          value={data.hint || ""}
          onChange={(value) => updateData({ hint: value })}
          placeholder="Provide a helpful hint for students... (Markdown supported)"
          minHeight="100px"
          maxHeight="150px"
          label=""
          showPreview={true}
          showHelp={false}
        />
        <p className="text-xs text-muted-foreground">
          This hint can be shown to students if enabled in exam settings
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="explanation">Explanation (Optional)</Label>
        <MarkdownEditor
          value={data.explanation || ""}
          onChange={(value) => updateData({ explanation: value })}
          placeholder="Explain the correct answer and reasoning... (Markdown supported)"
          minHeight="120px"
          maxHeight="180px"
          label=""
          showPreview={true}
          showHelp={false}
        />
        <p className="text-xs text-muted-foreground">
          This explanation will be shown after the question is answered
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="references">References (Optional)</Label>
        <Textarea
          id="references"
          value={data.references || ""}
          onChange={(e) => updateData({ references: e.target.value })}
          placeholder="Add references, sources, or additional reading materials..."
          rows={2}
        />
      </div>
    </div>
  );
};

// Step 3: Answer Options (for multiple choice questions)
const AnswerOptionsStep = ({
  data,
  updateData,
  errors,
  fieldErrors,
  validationAttempted,
}) => {
  const questionType = data.type || "multiple-choice";

  const updateOption = (index, value) => {
    const options = [...(data.options || ["", "", "", ""])];
    options[index] = value;
    updateData({ options });
  };

  const setCorrectAnswer = (index) => {
    updateData({ correctAnswer: index });
  };

  const getFieldError = (fieldName) => {
    return fieldErrors?.[fieldName] || null;
  };

  const hasFieldError = (fieldName) => {
    return validationAttempted && fieldErrors?.[fieldName];
  };

  if (questionType === "multiple-choice") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5" />
          <Label>Answer Options</Label>
        </div>

        <div className="space-y-4">
          {(data.options || ["", "", "", ""]).map((option, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex items-center gap-2 mt-2">
                <Checkbox
                  checked={data.correctAnswer === index}
                  onCheckedChange={(checked) => {
                    if (checked) setCorrectAnswer(index);
                  }}
                />
                <Badge
                  variant="outline"
                  className="min-w-[24px] justify-center">
                  {String.fromCharCode(65 + index)}
                </Badge>
              </div>
              <div className="flex-1">
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                  className={
                    hasFieldError("options") && !option ? "border-red-500" : ""
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {(hasFieldError("options") || hasFieldError("correctAnswer")) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-red-800 dark:text-red-200">
                  Answer Configuration Required
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  {getFieldError("options") ||
                    getFieldError("correctAnswer") ||
                    "Please complete all answer options and select the correct answer."}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (questionType === "true-false") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5" />
          <Label>Correct Answer</Label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              data.correctAnswer === true
                ? "ring-2 ring-primary bg-primary/5"
                : "",
            )}
            onClick={() => updateData({ correctAnswer: true })}>
            <CardContent className="p-6 text-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 mx-auto mb-2",
                  data.correctAnswer === true
                    ? "bg-primary border-primary"
                    : "border-muted-foreground",
                )}>
                {data.correctAnswer === true && (
                  <Check className="h-2 w-2 text-white m-1" />
                )}
              </div>
              <h4 className="font-medium text-green-600">True</h4>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              data.correctAnswer === false
                ? "ring-2 ring-primary bg-primary/5"
                : "",
            )}
            onClick={() => updateData({ correctAnswer: false })}>
            <CardContent className="p-6 text-center">
              <div
                className={cn(
                  "w-6 h-6 rounded-full border-2 mx-auto mb-2",
                  data.correctAnswer === false
                    ? "bg-primary border-primary"
                    : "border-muted-foreground",
                )}>
                {data.correctAnswer === false && (
                  <Check className="h-2 w-2 text-white m-1" />
                )}
              </div>
              <h4 className="font-medium text-red-600">False</h4>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (questionType === "short-answer" || questionType === "essay") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="h-5 w-5" />
          <Label>Sample Answer / Keywords</Label>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sampleAnswer">Sample Answer</Label>
            <Textarea
              id="sampleAnswer"
              value={data.sampleAnswer || ""}
              onChange={(e) => updateData({ sampleAnswer: e.target.value })}
              placeholder="Provide a sample correct answer..."
              rows={questionType === "essay" ? 6 : 3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords for Auto-grading</Label>
            <Input
              id="keywords"
              value={data.keywords || ""}
              onChange={(e) => updateData({ keywords: e.target.value })}
              placeholder="keyword1, keyword2, keyword3 (comma separated)"
            />
            <p className="text-xs text-muted-foreground">
              These keywords will be used for automatic partial scoring
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="maxLength">Maximum Answer Length</Label>
            <Input
              id="maxLength"
              type="number"
              value={data.maxLength || ""}
              onChange={(e) =>
                updateData({ maxLength: parseInt(e.target.value) })
              }
              placeholder={questionType === "essay" ? "1000" : "100"}
              min="10"
              max={questionType === "essay" ? "5000" : "500"}
            />
            <p className="text-xs text-muted-foreground">
              Maximum number of characters allowed in the answer
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

// Step 4: Review and Confirm
const ReviewStep = ({ data }) => {
  const getQuestionTypeLabel = (type) => {
    const types = {
      "multiple-choice": "Multiple Choice",
      "true-false": "True/False",
      "short-answer": "Short Answer",
      essay: "Essay",
    };
    return types[type] || type;
  };

  const getCorrectAnswerDisplay = () => {
    if (data.type === "multiple-choice") {
      return data.options && data.correctAnswer !== undefined
        ? `${String.fromCharCode(65 + data.correctAnswer)}. ${data.options[data.correctAnswer]}`
        : "Not set";
    }
    if (data.type === "true-false") {
      return data.correctAnswer !== undefined
        ? data.correctAnswer
          ? "True"
          : "False"
        : "Not set";
    }
    if (data.type === "short-answer" || data.type === "essay") {
      return data.sampleAnswer || "Sample answer provided";
    }
    return "N/A";
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-xl font-semibold">Question Preview</h3>
        <Badge className="mt-2">{getQuestionTypeLabel(data.type)}</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            Question Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium mb-2">Question:</h4>
            <p className="text-sm bg-muted p-3 rounded">{data.questionText}</p>
          </div>

          {data.imageFile && (
            <div>
              <h4 className="font-medium mb-2">Image:</h4>
              <div className="text-sm text-muted-foreground">
                Image attached: {data.imageFile.name}
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-medium text-sm">Difficulty:</h4>
              <Badge variant="outline" className="capitalize">
                {data.difficulty}
              </Badge>
            </div>
            <div>
              <h4 className="font-medium text-sm">Marks:</h4>
              <span>{data.marks}</span>
            </div>
            <div>
              <h4 className="font-medium text-sm">Time Limit:</h4>
              <span>{data.timeLimit ? `${data.timeLimit}s` : "No limit"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {data.type === "multiple-choice" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Answer Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {(data.options || []).map((option, index) => (
                <div
                  key={index}
                  className={cn(
                    "p-3 rounded-lg border flex items-center gap-3",
                    data.correctAnswer === index
                      ? "bg-green-50 dark:bg-green-900/20 border-green-500"
                      : "bg-muted",
                  )}>
                  <Badge
                    variant="outline"
                    className="min-w-[24px] justify-center">
                    {String.fromCharCode(65 + index)}
                  </Badge>
                  <span className="flex-1">{option}</span>
                  {data.correctAnswer === index && (
                    <Check className="h-4 w-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.type === "true-false" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Correct Answer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Badge variant={data.correctAnswer ? "default" : "secondary"}>
                {data.correctAnswer ? "True" : "False"}
              </Badge>
              <Check className="h-4 w-4 text-green-600" />
            </div>
          </CardContent>
        </Card>
      )}

      {(data.explanation || data.hint || data.references) && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.hint && (
              <div>
                <h4 className="font-medium text-sm mb-1">Hint:</h4>
                <p className="text-sm text-muted-foreground">{data.hint}</p>
              </div>
            )}
            {data.explanation && (
              <div>
                <h4 className="font-medium text-sm mb-1">Explanation:</h4>
                <p className="text-sm text-muted-foreground">
                  {data.explanation}
                </p>
              </div>
            )}
            {data.references && (
              <div>
                <h4 className="font-medium text-sm mb-1">References:</h4>
                <p className="text-sm text-muted-foreground">
                  {data.references}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-green-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-green-800 dark:text-green-200">
              Ready to Create Question
            </h4>
            <p className="text-sm text-green-700 dark:text-green-300 mt-1">
              Your question is configured and ready to be added to the question
              bank.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MultiStepQuestionForm = ({
  onSubmit,
  onCancel,
  initialData = {},
}) => {
  const validateQuestionDetails = (data) => {
    const errors = {};
    let isValid = true;

    // Exam ID validation
    if (!data.examId) {
      errors.examId = "Please select an exam";
      isValid = false;
    }

    // Question type validation
    if (!data.type) {
      errors.type = "Please select a question type";
      isValid = false;
    }

    // Question text validation
    if (!data.questionText || data.questionText.trim().length < 10) {
      errors.questionText = "Question text must be at least 10 characters long";
      isValid = false;
    }

    // Marks validation
    if (!data.marks || data.marks < 1 || data.marks > 20) {
      errors.marks = "Marks must be between 1 and 20";
      isValid = false;
    }

    return {
      isValid,
      fieldErrors: errors,
      message: isValid ? null : "Please fix the errors above to continue",
    };
  };

  const validateAnswerOptions = (data) => {
    const errors = {};
    let isValid = true;

    if (data.type === "multiple-choice") {
      // Check if all options are filled
      if (!data.options || data.options.some((opt) => !opt.trim())) {
        errors.options = "All answer options must be filled";
        isValid = false;
      }
      // Check if correct answer is selected
      if (data.correctAnswer === undefined) {
        errors.correctAnswer = "Please select the correct answer";
        isValid = false;
      }
    } else if (data.type === "true-false") {
      if (data.correctAnswer === undefined) {
        errors.correctAnswer = "Please select True or False";
        isValid = false;
      }
    }

    return {
      isValid,
      fieldErrors: errors,
      message: isValid ? null : "Please complete the answer configuration",
    };
  };

  const steps = [
    {
      title: "Question Details",
      description: "Set up the basic question information and type",
      component: QuestionDetailsStep,
      validate: validateQuestionDetails,
    },
    {
      title: "Media & Resources",
      description: "Add images, hints, and explanations",
      component: MediaStep,
      optional: true,
    },
    {
      title: "Answer Options",
      description: "Configure the correct answers and options",
      component: AnswerOptionsStep,
      validate: validateAnswerOptions,
    },
    {
      title: "Review & Create",
      description: "Review your question and create it",
      component: ReviewStep,
    },
  ];

  const handleSubmit = async (formData) => {
    // Transform data for API
    const questionData = {
      examId: formData.examId,
      type: formData.type,
      questionText: formData.questionText,
      difficulty: formData.difficulty,
      marks: formData.marks,
      timeLimit: formData.timeLimit,
      tags: formData.tags
        ? formData.tags.split(",").map((tag) => tag.trim())
        : [],
      hint: formData.hint,
      explanation: formData.explanation,
      references: formData.references,
      imageFile: formData.imageFile,

      // Type-specific data
      ...(formData.type === "multiple-choice" && {
        options: formData.options,
        correctAnswer: formData.correctAnswer,
      }),

      ...(formData.type === "true-false" && {
        correctAnswer: formData.correctAnswer,
      }),

      ...((formData.type === "short-answer" || formData.type === "essay") && {
        sampleAnswer: formData.sampleAnswer,
        keywords: formData.keywords
          ? formData.keywords.split(",").map((kw) => kw.trim())
          : [],
        maxLength: formData.maxLength,
      }),
    };

    await onSubmit(questionData);
  };

  return (
    <MultiStepForm
      steps={steps}
      onSubmit={handleSubmit}
      onCancel={onCancel}
      initialData={initialData}
      title="Create New Question"
      subtitle="Follow the steps to create a comprehensive question"
      showProgress={true}
      showStepNumbers={true}
      validateOnStepChange={true}
      autoSave={true}
      autoSaveInterval={30000}
    />
  );
};
