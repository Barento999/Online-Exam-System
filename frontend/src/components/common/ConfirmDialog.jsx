import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  AlertTriangle,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "destructive", // destructive, warning, info, success
  icon: CustomIcon,
  loading = false,
}) => {
  // Select icon based on variant
  const getIcon = () => {
    if (CustomIcon) return CustomIcon;

    switch (variant) {
      case "destructive":
        return Trash2;
      case "warning":
        return AlertTriangle;
      case "info":
        return Info;
      case "success":
        return CheckCircle;
      default:
        return AlertCircle;
    }
  };

  const Icon = getIcon();

  // Get colors based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "destructive":
        return {
          iconBg: "bg-destructive/10",
          iconColor: "text-destructive",
          buttonClass:
            "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        };
      case "warning":
        return {
          iconBg: "bg-orange-500/10",
          iconColor: "text-orange-500",
          buttonClass:
            "bg-orange-500 text-white hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700",
        };
      case "info":
        return {
          iconBg: "bg-blue-500/10",
          iconColor: "text-blue-500",
          buttonClass:
            "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
        };
      case "success":
        return {
          iconBg: "bg-green-500/10",
          iconColor: "text-green-500",
          buttonClass:
            "bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700",
        };
      default:
        return {
          iconBg: "bg-muted",
          iconColor: "text-muted-foreground",
          buttonClass: "bg-primary text-primary-foreground hover:bg-primary/90",
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-start gap-4">
            <div
              className={cn(
                "flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full",
                styles.iconBg,
              )}>
              <Icon className={cn("h-6 w-6", styles.iconColor)} />
            </div>
            <div className="flex-1 space-y-2">
              <AlertDialogTitle className="text-left text-lg">
                {title}
              </AlertDialogTitle>
              <AlertDialogDescription className="text-left text-sm">
                {description}
              </AlertDialogDescription>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-2">
          <AlertDialogCancel
            disabled={loading}
            className="w-full sm:w-auto order-2 sm:order-1">
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={cn(
              "w-full sm:w-auto order-1 sm:order-2",
              styles.buttonClass,
            )}>
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
