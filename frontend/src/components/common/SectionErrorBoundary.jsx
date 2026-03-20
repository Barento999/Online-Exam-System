import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Error boundary for specific sections/components
 * Shows inline error message instead of full page error
 */
export class SectionErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error(
      `Error in ${this.props.section || "section"}:`,
      error,
      errorInfo,
    );
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <Card className="border-destructive/50">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div className="flex-1 space-y-3">
                <div>
                  <h3 className="font-semibold text-destructive">
                    {this.props.title || "Error Loading Content"}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {this.props.message ||
                      "We encountered an error while loading this section. Please try again."}
                  </p>
                </div>
                {this.props.showRetry !== false && (
                  <Button
                    onClick={this.handleReset}
                    variant="outline"
                    size="sm">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}

/**
 * Inline error display component (not a boundary)
 * Use this for displaying error states from try-catch blocks
 */
export const InlineError = ({
  title = "Error",
  message = "Something went wrong",
  onRetry,
  showRetry = true,
}) => {
  return (
    <Card className="border-destructive/50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <h3 className="font-semibold text-destructive">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{message}</p>
            </div>
            {showRetry && onRetry && (
              <Button onClick={onRetry} variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
