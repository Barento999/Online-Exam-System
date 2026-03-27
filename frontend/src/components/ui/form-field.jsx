import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * FormField component with built-in validation display
 */
export const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  helperText,
  showValidIcon = false,
  className,
  inputClassName,
  ...props
}) => {
  const hasError = touched && error;
  const isValid = touched && !error && value;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur && onBlur(name)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            inputClassName,
            hasError && "border-destructive focus-visible:ring-destructive",
            isValid &&
              showValidIcon &&
              "border-green-500 focus-visible:ring-green-500",
            (hasError || (isValid && showValidIcon)) && "pr-10",
          )}
          {...props}
        />
        {hasError && (
          <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-destructive" />
        )}
        {isValid && showValidIcon && (
          <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
        )}
      </div>
      {hasError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

/**
 * FormSelect component with validation
 */
export const FormSelect = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  helperText,
  children,
  className,
  ...props
}) => {
  const hasError = touched && error;

  return (
    <div className={cn("space-y-2", className)}>
      <Label htmlFor={name} className="flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative">{children}</div>
      {hasError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

/**
 * FormTextarea component with validation
 */
export const FormTextarea = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  placeholder,
  disabled = false,
  helperText,
  rows = 3,
  maxLength,
  showCharCount = false,
  className,
  textareaClassName,
  ...props
}) => {
  const hasError = touched && error;
  const charCount = value?.length || 0;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <Label htmlFor={name} className="flex items-center gap-1">
          {label}
          {required && <span className="text-destructive">*</span>}
        </Label>
        {showCharCount && maxLength && (
          <span
            className={cn(
              "text-xs",
              charCount > maxLength
                ? "text-destructive"
                : "text-muted-foreground",
            )}>
            {charCount}/{maxLength}
          </span>
        )}
      </div>
      <div className="relative">
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          onBlur={() => onBlur && onBlur(name)}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          maxLength={maxLength}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            hasError && "border-destructive focus-visible:ring-destructive",
            textareaClassName,
          )}
          {...props}
        />
      </div>
      {hasError && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}
      {!hasError && helperText && (
        <p className="text-sm text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};
