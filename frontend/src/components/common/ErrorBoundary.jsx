import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo,
    });

    // Log to error reporting service if available
    if (window.errorReporter) {
      window.errorReporter.log(error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleGoHome = () => {
    window.location.href = "/dashboard";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <div>
                  <CardTitle className="text-2xl">
                    Oops! Something went wrong
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    We encountered an unexpected error
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">What happened?</p>
                <p className="text-sm text-muted-foreground">
                  The application encountered an error and couldn't continue.
                  This has been logged and we'll look into it.
                </p>
              </div>

              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="bg-destructive/5 rounded-lg p-4 border border-destructive/20">
                  <summary className="text-sm font-medium cursor-pointer text-destructive mb-2">
                    Error Details (Development Only)
                  </summary>
                  <div className="space-y-2 mt-2">
                    <div className="text-xs font-mono bg-background p-3 rounded border overflow-auto max-h-40">
                      <p className="font-semibold text-destructive mb-1">
                        {this.state.error.toString()}
                      </p>
                      {this.state.errorInfo && (
                        <pre className="text-muted-foreground whitespace-pre-wrap">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      )}
                    </div>
                  </div>
                </details>
              )}

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium">What can you do?</p>
                <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                  <li>Try refreshing the page</li>
                  <li>Go back to the home page</li>
                  <li>Clear your browser cache</li>
                  <li>Contact support if the problem persists</li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  onClick={this.handleReset}
                  variant="default"
                  className="flex-1">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex-1">
                  <Home className="h-4 w-4 mr-2" />
                  Go Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Page-level error boundary with custom fallback
export const PageErrorBoundary = ({ children, pageName }) => {
  return (
    <ErrorBoundary>
      <PageErrorFallback pageName={pageName}>{children}</PageErrorFallback>
    </ErrorBoundary>
  );
};

class PageErrorFallback extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error(`Error in ${this.props.pageName}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center space-y-4">
              <div className="flex justify-center">
                <div className="h-12 w-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Failed to load {this.props.pageName || "this page"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Something went wrong while loading this content. Please try
                  refreshing the page.
                </p>
              </div>
              <Button
                onClick={() => window.location.reload()}
                variant="default"
                className="w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Page
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
