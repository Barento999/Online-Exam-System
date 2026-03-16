import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ChevronLeft,
  ChevronRight,
  Check,
  AlertCircle,
  Save,
  X,
  ExclamationTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const MultiStepForm = ({
  steps,
  onSubmit,
  onCancel,
  initialData = {},
  title = "Multi-Step Form",
  subtitle = null,
  className = "",
  showProgress = true,
  showStepNumbers = true,
  allowSkipSteps = false,
  validateOnStepChange = true,
  autoSave = false,
  autoSaveInterval = 30000, // 30 seconds
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [stepValidation, setStepValidation] = useState({});
  const [stepErrors, setStepErrors] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState(null);
  const [validationAttempted, setValidationAttempted] = useState({});

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave) return;

    const interval = setInterval(() => {
      handleAutoSave();
    }, autoSaveInterval);

    return () => clearInterval(interval);
  }, [autoSave, autoSaveInterval, formData]);

  const handleAutoSave = async () => {
    try {
      // Save to localStorage or call API
      localStorage.setItem(
        `multistep-form-${title}`,
        JSON.stringify({
          formData,
          currentStep,
          timestamp: Date.now(),
        }),
      );
      setLastAutoSave(new Date());
    } catch (error) {
      console.warn("Auto-save failed:", error);
    }
  };

  const updateFormData = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
    
    // Clear field errors for updated fields
    const updatedFields = Object.keys(stepData);
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach(field => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const validateStep = async (stepIndex) => {
    const step = steps[stepIndex];
    setValidationAttempted((prev) => ({ ...prev, [stepIndex]: true }));
    
    if (!step.validate) {
      setStepValidation((prev) => ({ ...prev, [stepIndex]: true }));
      setStepErrors((prev) => ({ ...prev, [stepIndex]: null }));
      return true;
    }

    try {
      const validationResult = await step.validate(formData);
      
      // Handle different validation result formats
      if (typeof validationResult === 'boolean') {
        setStepValidation((prev) => ({ ...prev, [stepIndex]: validationResult }));
        setStepErrors((prev) => ({ 
          ...prev, 
          [stepIndex]: validationResult ? null : "Please fill in all required fields correctly." 
        }));
        return validationResult;
      } else if (typeof validationResult === 'object') {
        // Detailed validation with field-specific errors
        const isValid = validationResult.isValid;
        setStepValidation((prev) => ({ ...prev, [stepIndex]: isValid }));
        setStepErrors((prev) => ({ 
          ...prev, 
          [stepIndex]: validationResult.message || null 
        }));
        setFieldErrors((prev) => ({ 
          ...prev, 
          ...validationResult.fieldErrors || {} 
        }));
        return isValid;
      }
      
      return true;
    } catch (error) {
      setStepValidation((prev) => ({ ...prev, [stepIndex]: false }));
      setStepErrors((prev) => ({ 
        ...prev, 
        [stepIndex]: error.message || "Validation failed. Please check your input." 
      }));
      return false;
    }
  };

  const canProceedToStep = (stepIndex) => {
    if (!validateOnStepChange) return true;
    if (allowSkipSteps) return true;

    // Check if all previous steps are valid
    for (let i = 0; i < stepIndex; i++) {
      if (stepValidation[i] === false) return false;
    }
    return true;
  };

  const handleNext = async () => {
    if (validateOnStepChange) {
      const isValid = await validateStep(currentStep);
      if (!isValid) return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (stepIndex) => {
    if (!canProceedToStep(stepIndex)) return;

    if (validateOnStepChange && stepIndex > currentStep) {
      // Validate current step before jumping ahead
      const isValid = await validateStep(currentStep);
      if (!isValid) return;
    }

    setCurrentStep(stepIndex);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate all steps before submission
      if (validateOnStepChange) {
        for (let i = 0; i < steps.length; i++) {
          const isValid = await validateStep(i);
          if (!isValid) {
            setCurrentStep(i);
            setIsSubmitting(false);
            return;
          }
        }
      }

      await onSubmit(formData);

      // Clear auto-save data on successful submission
      if (autoSave) {
        localStorage.removeItem(`multistep-form-${title}`);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;
  const hasCurrentStepError = stepValidation[currentStep] === false && validationAttempted[currentStep];

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {autoSave && lastAutoSave && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Save className="h-3 w-3" />
                  Auto-saved {lastAutoSave.toLocaleTimeString()}
                </div>
              )}
              <Badge variant="outline">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          )}

          {/* Step Navigation */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep || stepValidation[index] === true;
              const isClickable = canProceedToStep(index);
              const hasError = stepValidation[index] === false && validationAttempted[index];

              return (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive && "bg-primary text-primary-foreground",
                    !isActive &&
                      isCompleted &&
                      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                    !isActive &&
                      !isCompleted &&
                      !hasError &&
                      "bg-muted text-muted-foreground",
                    hasError &&
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    !isClickable && "opacity-50 cursor-not-allowed",
                    isClickable && !isActive && "hover:bg-accent",
                  )}>
                  {showStepNumbers && (
                    <span
                      className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full text-xs",
                        isActive && "bg-primary-foreground text-primary",
                        !isActive && isCompleted && "bg-green-600 text-white",
                        hasError && "bg-red-600 text-white",
                      )}>
                      {isCompleted && !hasError ? (
                        <Check className="h-3 w-3" />
                      ) : hasError ? (
                        <AlertCircle className="h-3 w-3" />
                      ) : (
                        index + 1
                      )}
                    </span>
                  )}
                  <span>{step.title}</span>
                  {step.optional && (
                    <Badge variant="secondary" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent>
          {/* Step Error Alert */}
          {hasCurrentStepError && stepErrors[currentStep] && (
            <Alert variant="destructive" className="mb-6">
              <ExclamationTriangle className="h-4 w-4" />
              <AlertDescription>
                {stepErrors[currentStep]}
              </AlertDescription>
            </Alert>
          )}

          {/* Current Step Content */}
          <div className="min-h-[400px]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              {currentStepData.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStepData.description}
                </p>
              )}
            </div>

            {/* Render current step component */}
            <currentStepData.component
              data={formData}
              updateData={updateFormData}
              isActive={true}
              stepIndex={currentStep}
              errors={hasCurrentStepError}
              fieldErrors={fieldErrors}
              validationAttempted={validationAttempted[currentStep]}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              {autoSave && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAutoSave}
                  className="text-xs">
                  <Save className="h-3 w-3 mr-1" />
                  Save Draft
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = async (stepIndex) => {
    if (!canProceedToStep(stepIndex)) return;

    if (validateOnStepChange && stepIndex > currentStep) {
      // Validate current step before jumping ahead
      const isValid = await validateStep(currentStep);
      if (!isValid) return;
    }

    setCurrentStep(stepIndex);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validate all steps before submission
      if (validateOnStepChange) {
        for (let i = 0; i < steps.length; i++) {
          const isValid = await validateStep(i);
          if (!isValid) {
            setCurrentStep(i);
            setIsSubmitting(false);
            return;
          }
        }
      }

      await onSubmit(formData);

      // Clear auto-save data on successful submission
      if (autoSave) {
        localStorage.removeItem(`multistep-form-${title}`);
      }
    } catch (error) {
      console.error("Form submission failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentStepData = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;
  const isFirstStep = currentStep === 0;

  return (
    <div className={cn("max-w-4xl mx-auto", className)}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{title}</CardTitle>
              {subtitle && (
                <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {autoSave && lastAutoSave && (
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Save className="h-3 w-3" />
                  Auto-saved {lastAutoSave.toLocaleTimeString()}
                </div>
              )}
              <Badge variant="outline">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
          </div>

          {/* Progress Bar */}
          {showProgress && (
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
            </div>
          )}

          {/* Step Navigation */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-2">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted =
                index < currentStep || stepValidation[index] === true;
              const isClickable = canProceedToStep(index);
              const hasError = stepValidation[index] === false;

              return (
                <button
                  key={index}
                  onClick={() => handleStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap",
                    isActive && "bg-primary text-primary-foreground",
                    !isActive &&
                      isCompleted &&
                      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
                    !isActive &&
                      !isCompleted &&
                      !hasError &&
                      "bg-muted text-muted-foreground",
                    hasError &&
                      "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
                    !isClickable && "opacity-50 cursor-not-allowed",
                    isClickable && !isActive && "hover:bg-accent",
                  )}>
                  {showStepNumbers && (
                    <span
                      className={cn(
                        "flex items-center justify-center w-5 h-5 rounded-full text-xs",
                        isActive && "bg-primary-foreground text-primary",
                        !isActive && isCompleted && "bg-green-600 text-white",
                        hasError && "bg-red-600 text-white",
                      )}>
                      {isCompleted && !hasError ? (
                        <Check className="h-3 w-3" />
                      ) : hasError ? (
                        <AlertCircle className="h-3 w-3" />
                      ) : (
                        index + 1
                      )}
                    </span>
                  )}
                  <span>{step.title}</span>
                  {step.optional && (
                    <Badge variant="secondary" className="text-xs">
                      Optional
                    </Badge>
                  )}
                </button>
              );
            })}
          </div>
        </CardHeader>

        <CardContent>
          {/* Current Step Content */}
          <div className="min-h-[400px]">
            <div className="mb-6">
              <h3 className="text-lg font-semibold">{currentStepData.title}</h3>
              {currentStepData.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {currentStepData.description}
                </p>
              )}
            </div>

            {/* Render current step component */}
            <currentStepData.component
              data={formData}
              updateData={updateFormData}
              isActive={true}
              stepIndex={currentStep}
              errors={stepValidation[currentStep] === false}
            />
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={onCancel}
                className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Cancel
              </Button>
              {autoSave && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleAutoSave}
                  className="text-xs">
                  <Save className="h-3 w-3 mr-1" />
                  Save Draft
                </Button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={isFirstStep}
                className="flex items-center gap-2">
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              {isLastStep ? (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex items-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4" />
                      Submit
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="flex items-center gap-2">
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
