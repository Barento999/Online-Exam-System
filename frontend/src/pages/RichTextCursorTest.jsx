import { useState } from "react";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle, TestTube } from "lucide-react";

export const RichTextCursorTest = () => {
  const [testContent, setTestContent] = useState("");
  const [testResults, setTestResults] = useState([]);

  const runCursorTest = () => {
    const results = [];

    // Test 1: Basic typing
    results.push({
      test: "Basic Typing Test",
      description: "Type some text and check if cursor appears on the left",
      status: "manual",
      instruction:
        "Click in the editor below and start typing. The cursor should appear on the left side.",
    });

    // Test 2: Direction after formatting
    results.push({
      test: "Formatting Test",
      description: "Apply bold/italic formatting and check cursor direction",
      status: "manual",
      instruction:
        "Select some text, apply bold formatting, then click at the end. Cursor should be on the right of the text.",
    });

    // Test 3: New line test
    results.push({
      test: "New Line Test",
      description: "Press Enter to create new lines and check cursor position",
      status: "manual",
      instruction:
        "Press Enter multiple times. Each new line should start with cursor on the left.",
    });

    setTestResults(results);
  };

  const clearTest = () => {
    setTestContent("");
    setTestResults([]);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <TestTube className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">
          Rich Text Editor Cursor Direction Test
        </h1>
        <p className="text-muted-foreground mt-2">
          Test the cursor direction fix for the rich text editor
        </p>
      </div>

      <div className="flex gap-4 justify-center">
        <Button onClick={runCursorTest}>
          <TestTube className="h-4 w-4 mr-2" />
          Start Cursor Tests
        </Button>
        <Button variant="outline" onClick={clearTest}>
          Clear Test
        </Button>
      </div>

      {testResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Manual Test Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {testResults.map((result, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Badge variant="outline" className="mt-1">
                    Test {index + 1}
                  </Badge>
                  <div className="flex-1">
                    <h4 className="font-medium">{result.test}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.description}
                    </p>
                    <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950 rounded border border-blue-200 dark:border-blue-800">
                      <p className="text-sm text-blue-800 dark:text-blue-200">
                        <strong>Instructions:</strong> {result.instruction}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Rich Text Editor Test Area</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor
            value={testContent}
            onChange={setTestContent}
            placeholder="Click here and start typing to test cursor direction..."
            minHeight="200px"
            maxHeight="400px"
            toolbar="exam"
            showWordCount={true}
            label="Test Editor"
          />

          {testContent && (
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Current Content:</h4>
              <div
                className="text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: testContent }}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Expected Behavior
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium">Cursor Position</p>
              <p className="text-sm text-muted-foreground">
                The text cursor should always appear on the left side when
                clicking in empty areas
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium">Text Direction</p>
              <p className="text-sm text-muted-foreground">
                All text should flow from left to right, regardless of
                formatting
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium">After Formatting</p>
              <p className="text-sm text-muted-foreground">
                After applying bold, italic, or other formatting, cursor should
                maintain correct direction
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
            <div>
              <p className="font-medium">New Lines</p>
              <p className="text-sm text-muted-foreground">
                When pressing Enter, new lines should start with cursor on the
                left
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
              Testing Notes
            </h4>
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
              If you still experience cursor direction issues, please note:
            </p>
            <ul className="text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1 list-disc list-inside">
              <li>Which browser you're using</li>
              <li>Your system language/locale settings</li>
              <li>Specific steps that reproduce the issue</li>
              <li>
                Whether the issue occurs in other contentEditable elements
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
