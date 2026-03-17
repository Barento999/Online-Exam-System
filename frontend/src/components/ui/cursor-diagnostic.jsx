import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Info } from "lucide-react";

export const CursorDiagnostic = () => {
  const [diagnostics, setDiagnostics] = useState({});
  const [cursorInfo, setCursorInfo] = useState({});
  const testRef = useRef(null);

  const runDiagnostics = () => {
    const results = {};

    // Check browser info
    results.browser = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      languages: navigator.languages,
    };

    // Check document direction
    results.document = {
      dir: document.dir || "not set",
      documentElement: {
        dir: document.documentElement.dir || "not set",
        lang: document.documentElement.lang || "not set",
        style: {
          direction: getComputedStyle(document.documentElement).direction,
          textAlign: getComputedStyle(document.documentElement).textAlign,
          writingMode: getComputedStyle(document.documentElement).writingMode,
        },
      },
      body: {
        dir: document.body.dir || "not set",
        style: {
          direction: getComputedStyle(document.body).direction,
          textAlign: getComputedStyle(document.body).textAlign,
          writingMode: getComputedStyle(document.body).writingMode,
        },
      },
    };

    // Check test element
    if (testRef.current) {
      const computedStyle = getComputedStyle(testRef.current);
      results.testElement = {
        dir: testRef.current.dir || "not set",
        contentEditable: testRef.current.contentEditable,
        style: {
          direction: computedStyle.direction,
          textAlign: computedStyle.textAlign,
          writingMode: computedStyle.writingMode,
          unicodeBidi: computedStyle.unicodeBidi,
        },
      };
    }

    // Check CSS features
    results.cssSupport = {
      direction: CSS.supports("direction", "ltr"),
      writingMode: CSS.supports("writing-mode", "horizontal-tb"),
      unicodeBidi: CSS.supports("unicode-bidi", "embed"),
    };

    setDiagnostics(results);
  };

  const handleCursorMove = () => {
    if (testRef.current) {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        setCursorInfo({
          collapsed: range.collapsed,
          startOffset: range.startOffset,
          endOffset: range.endOffset,
          commonAncestor: range.commonAncestorContainer.nodeName,
          selectionDirection:
            selection.anchorOffset <= selection.focusOffset
              ? "forward"
              : "backward",
        });
      }
    }
  };

  useEffect(() => {
    runDiagnostics();

    // Add selection change listener for cursor tracking
    const handleSelectionChange = () => {
      if (testRef.current && document.activeElement === testRef.current) {
        handleCursorMove();
      }
    };

    document.addEventListener("selectionchange", handleSelectionChange);

    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, []);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Cursor Direction Diagnostics
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={runDiagnostics}>Refresh Diagnostics</Button>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">
                Test ContentEditable Element:
              </h4>
              <div
                ref={testRef}
                contentEditable
                className="border rounded p-4 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary"
                style={{
                  direction: "ltr",
                  textAlign: "left",
                  unicodeBidi: "embed",
                  writingMode: "horizontal-tb",
                }}
                onInput={handleCursorMove}
                onClick={handleCursorMove}
                onKeyUp={handleCursorMove}
                placeholder="Type here to test cursor behavior..."
              />

              {Object.keys(cursorInfo).length > 0 && (
                <div className="mt-2 p-2 bg-muted rounded text-sm">
                  <strong>Cursor Info:</strong>
                  <pre className="mt-1">
                    {JSON.stringify(cursorInfo, null, 2)}
                  </pre>
                </div>
              )}
            </div>

            {Object.keys(diagnostics).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium">System Information:</h4>

                <div className="grid gap-3">
                  <div className="p-3 bg-muted rounded">
                    <h5 className="font-medium text-sm mb-2">Browser</h5>
                    <div className="text-xs space-y-1">
                      <div>
                        <strong>Language:</strong>{" "}
                        {diagnostics.browser?.language}
                      </div>
                      <div>
                        <strong>Platform:</strong>{" "}
                        {diagnostics.browser?.platform}
                      </div>
                      <div>
                        <strong>User Agent:</strong>{" "}
                        {diagnostics.browser?.userAgent?.substring(0, 100)}...
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted rounded">
                    <h5 className="font-medium text-sm mb-2">
                      Document Direction
                    </h5>
                    <div className="text-xs space-y-1">
                      <div>
                        <strong>Document dir:</strong>{" "}
                        {diagnostics.document?.dir}
                      </div>
                      <div>
                        <strong>HTML dir:</strong>{" "}
                        {diagnostics.document?.documentElement?.dir}
                      </div>
                      <div>
                        <strong>HTML computed direction:</strong>{" "}
                        {
                          diagnostics.document?.documentElement?.style
                            ?.direction
                        }
                      </div>
                      <div>
                        <strong>Body computed direction:</strong>{" "}
                        {diagnostics.document?.body?.style?.direction}
                      </div>
                    </div>
                  </div>

                  {diagnostics.testElement && (
                    <div className="p-3 bg-muted rounded">
                      <h5 className="font-medium text-sm mb-2">Test Element</h5>
                      <div className="text-xs space-y-1">
                        <div>
                          <strong>dir attribute:</strong>{" "}
                          {diagnostics.testElement.dir}
                        </div>
                        <div>
                          <strong>Computed direction:</strong>{" "}
                          {diagnostics.testElement.style.direction}
                        </div>
                        <div>
                          <strong>Computed text-align:</strong>{" "}
                          {diagnostics.testElement.style.textAlign}
                        </div>
                        <div>
                          <strong>Computed writing-mode:</strong>{" "}
                          {diagnostics.testElement.style.writingMode}
                        </div>
                        <div>
                          <strong>Computed unicode-bidi:</strong>{" "}
                          {diagnostics.testElement.style.unicodeBidi}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-orange-500" />
            Common Issues & Solutions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Badge variant="outline">System Language RTL</Badge>
            <p className="text-sm text-muted-foreground">
              If your system language is Arabic, Hebrew, or another RTL
              language, the browser might default to RTL cursor behavior.
            </p>
          </div>

          <div className="space-y-2">
            <Badge variant="outline">Browser Extension</Badge>
            <p className="text-sm text-muted-foreground">
              Some browser extensions can affect text direction. Try testing in
              incognito mode.
            </p>
          </div>

          <div className="space-y-2">
            <Badge variant="outline">CSS Inheritance</Badge>
            <p className="text-sm text-muted-foreground">
              Check if any parent elements have RTL direction that's being
              inherited.
            </p>
          </div>

          <div className="space-y-2">
            <Badge variant="outline">Input Method</Badge>
            <p className="text-sm text-muted-foreground">
              Some input methods or keyboard layouts can affect cursor
              direction.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
