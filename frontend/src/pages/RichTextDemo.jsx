import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RichTextEditor,
  useRichTextEditor,
} from "@/components/ui/rich-text-editor";
import {
  ModernRichTextEditor,
  useModernRichTextEditor,
} from "@/components/ui/modern-rich-text-editor";
import {
  MarkdownEditor,
  useMarkdownEditor,
} from "@/components/ui/markdown-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Type,
  FileText,
  Eye,
  Code,
  BookOpen,
  MessageSquare,
  Sparkles,
} from "lucide-react";
import toast from "react-hot-toast";

export const RichTextDemo = () => {
  // Rich Text Editor Demo
  const richTextEditor = useRichTextEditor(
    "<h2>Welcome to Rich Text Editing</h2><p>This is a <strong>rich text editor</strong> with full formatting capabilities. You can make text <em>italic</em>, <u>underlined</u>, and much more!</p>",
  );

  // Modern Rich Text Editor Demo
  const modernEditor = useModernRichTextEditor(
    "<h2>Modern Rich Text Editor</h2><p>This is a <strong>modern editor</strong> using the latest APIs instead of deprecated execCommand. It includes <em>undo/redo</em>, <u>tables</u>, and advanced formatting!</p>",
  );

  // Markdown Editor Demo
  const markdownEditor = useMarkdownEditor(
    "# Welcome to Markdown\n\nThis is a **markdown editor** with live preview. You can:\n\n* Create lists\n* Add [links](https://example.com)\n* Insert `code`\n\n> And even blockquotes!",
  );

  // Form Demo States
  const [blogPost, setBlogPost] = useState("");
  const [announcement, setAnnouncement] = useState("");
  const [examInstructions, setExamInstructions] = useState("");

  const handleSave = (type, content) => {
    toast.success(`${type} saved successfully!`);
    console.log(`${type} content:`, content);
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold">
            Rich Text & Markdown Editors
          </h1>
          <p className="text-muted-foreground">
            Comprehensive text editing solutions for content creation
          </p>
        </div>

        <Tabs defaultValue="modern" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="modern">
              <Sparkles className="h-4 w-4 mr-2" />
              Modern Editor
            </TabsTrigger>
            <TabsTrigger value="rich-text">Rich Text Editor</TabsTrigger>
            <TabsTrigger value="markdown">Markdown Editor</TabsTrigger>
            <TabsTrigger value="comparison">Comparison</TabsTrigger>
            <TabsTrigger value="integration">Integration</TabsTrigger>
          </TabsList>

          {/* Modern Rich Text Editor Demo */}
          <TabsContent value="modern" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Modern Rich Text Editor (Recommended)
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Uses modern Selection API instead of deprecated execCommand.
                  Includes undo/redo, tables, and advanced formatting.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  {/* Full Featured Modern Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Full Featured Modern Editor
                    </h3>
                    <ModernRichTextEditor
                      value={modernEditor.value}
                      onChange={modernEditor.setValue}
                      label="Content"
                      placeholder="Start writing your content..."
                      minHeight="300px"
                      showWordCount={true}
                      showCharCount={true}
                      toolbar="full"
                      allowFullscreen={true}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleSave(
                            "Modern Editor Content",
                            modernEditor.value,
                          )
                        }>
                        Save Content
                      </Button>
                      <Button variant="outline" onClick={modernEditor.reset}>
                        Reset
                      </Button>
                      <Badge variant="outline">
                        {modernEditor.getWordCount()} words
                      </Badge>
                    </div>
                  </div>

                  {/* Exam Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Exam Editor (Recommended for Questions)
                    </h3>
                    <ModernRichTextEditor
                      value={examInstructions}
                      onChange={setExamInstructions}
                      label="Question Text"
                      placeholder="Enter your exam question here..."
                      minHeight="150px"
                      toolbar="exam"
                      allowFullscreen={false}
                      showWordCount={true}
                    />
                  </div>

                  {/* Basic Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Editor</h3>
                    <ModernRichTextEditor
                      value={announcement}
                      onChange={setAnnouncement}
                      label="Announcement"
                      placeholder="Write an announcement..."
                      minHeight="150px"
                      toolbar="basic"
                      allowFullscreen={false}
                    />
                  </div>

                  {/* Minimal Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Minimal Editor</h3>
                    <ModernRichTextEditor
                      value={blogPost}
                      onChange={setBlogPost}
                      label="Simple Text"
                      placeholder="Enter simple text..."
                      minHeight="100px"
                      toolbar="minimal"
                      allowFullscreen={false}
                      showWordCount={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rich Text Editor Demo */}
          <TabsContent value="rich-text" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Rich Text Editor Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  {/* Full Featured Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Full Featured Editor
                    </h3>
                    <RichTextEditor
                      value={richTextEditor.value}
                      onChange={richTextEditor.setValue}
                      label="Content"
                      placeholder="Start writing your content..."
                      minHeight="300px"
                      showWordCount={true}
                      showCharCount={true}
                      toolbar="full"
                      allowFullscreen={true}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleSave("Rich Text Content", richTextEditor.value)
                        }>
                        Save Content
                      </Button>
                      <Button variant="outline" onClick={richTextEditor.reset}>
                        Reset
                      </Button>
                      <Badge variant="outline">
                        {richTextEditor.getWordCount()} words
                      </Badge>
                    </div>
                  </div>

                  {/* Basic Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Basic Editor</h3>
                    <RichTextEditor
                      value={announcement}
                      onChange={setAnnouncement}
                      label="Announcement"
                      placeholder="Write an announcement..."
                      minHeight="150px"
                      toolbar="basic"
                      allowFullscreen={false}
                    />
                  </div>

                  {/* Exam Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Exam Editor (Recommended for Questions)
                    </h3>
                    <RichTextEditor
                      value={examInstructions}
                      onChange={setExamInstructions}
                      label="Question Text"
                      placeholder="Enter your exam question here..."
                      minHeight="150px"
                      toolbar="exam"
                      allowFullscreen={false}
                      showWordCount={true}
                    />
                  </div>

                  {/* Minimal Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Minimal Editor</h3>
                    <RichTextEditor
                      value={blogPost}
                      onChange={setBlogPost}
                      label="Simple Text"
                      placeholder="Enter simple text..."
                      minHeight="100px"
                      toolbar="minimal"
                      allowFullscreen={false}
                      showWordCount={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Markdown Editor Demo */}
          <TabsContent value="markdown" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Markdown Editor Demo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  {/* Full Featured Markdown Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Markdown Editor with Preview
                    </h3>
                    <MarkdownEditor
                      value={markdownEditor.value}
                      onChange={markdownEditor.setValue}
                      label="Markdown Content"
                      placeholder="Start writing in Markdown..."
                      minHeight="300px"
                      showWordCount={true}
                      showCharCount={true}
                      showPreview={true}
                      showHelp={true}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() =>
                          handleSave("Markdown Content", markdownEditor.value)
                        }>
                        Save Markdown
                      </Button>
                      <Button variant="outline" onClick={markdownEditor.reset}>
                        Reset
                      </Button>
                      <Badge variant="outline">
                        {markdownEditor.getWordCount()} words
                      </Badge>
                    </div>
                  </div>

                  {/* Simple Markdown Editor */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Simple Markdown Editor
                    </h3>
                    <MarkdownEditor
                      value={blogPost}
                      onChange={setBlogPost}
                      label="Blog Post"
                      placeholder="Write your blog post in Markdown..."
                      minHeight="200px"
                      showPreview={false}
                      showHelp={false}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Comparison */}
          <TabsContent value="comparison" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Type className="h-5 w-5" />
                    Rich Text Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-600">Advantages:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• WYSIWYG (What You See Is What You Get)</li>
                      <li>• Familiar interface like Word processors</li>
                      <li>• Visual formatting tools</li>
                      <li>• No markup knowledge required</li>
                      <li>• Real-time formatting preview</li>
                      <li>• Color and font customization</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-600">Best For:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Blog posts and articles</li>
                      <li>• Email templates</li>
                      <li>• Marketing content</li>
                      <li>• User-generated content</li>
                      <li>• Non-technical users</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Markdown Editor
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium text-green-600">Advantages:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Clean, distraction-free writing</li>
                      <li>• Consistent formatting output</li>
                      <li>• Version control friendly</li>
                      <li>• Fast typing workflow</li>
                      <li>• Portable and lightweight</li>
                      <li>• Great for technical content</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium text-orange-600">Best For:</h4>
                    <ul className="text-sm space-y-1 text-muted-foreground">
                      <li>• Documentation</li>
                      <li>• Technical writing</li>
                      <li>• README files</li>
                      <li>• Developer-focused content</li>
                      <li>• Academic writing</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Feature Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Feature</th>
                        <th className="text-center p-2">Rich Text</th>
                        <th className="text-center p-2">Markdown</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-2">
                      <tr className="border-b">
                        <td className="p-2">WYSIWYG Editing</td>
                        <td className="text-center p-2">✅</td>
                        <td className="text-center p-2">❌</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Live Preview</td>
                        <td className="text-center p-2">✅</td>
                        <td className="text-center p-2">✅</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Syntax Highlighting</td>
                        <td className="text-center p-2">❌</td>
                        <td className="text-center p-2">✅</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Version Control Friendly</td>
                        <td className="text-center p-2">❌</td>
                        <td className="text-center p-2">✅</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">Learning Curve</td>
                        <td className="text-center p-2">Low</td>
                        <td className="text-center p-2">Medium</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-2">File Size</td>
                        <td className="text-center p-2">Larger</td>
                        <td className="text-center p-2">Smaller</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integration Examples */}
          <TabsContent value="integration" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Educational Content Integration
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Both editors can be integrated into the exam system for
                    various content creation needs:
                  </p>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Rich Text Editor Uses:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Question descriptions with formatting</li>
                        <li>• Exam instructions with emphasis</li>
                        <li>• Student feedback and comments</li>
                        <li>• Course announcements</li>
                        <li>• Email templates</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Markdown Editor Uses:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Technical documentation</li>
                        <li>• Code-based questions</li>
                        <li>• Study guides and notes</li>
                        <li>• API documentation</li>
                        <li>• README files</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Implementation Examples
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">
                        Question Creation Form
                      </h4>
                      <code className="text-xs block">
                        {`<RichTextEditor
  value={questionText}
  onChange={setQuestionText}
  label="Question Description"
  placeholder="Enter your question..."
  toolbar="basic"
  showWordCount={true}
/>`}
                      </code>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Documentation Editor</h4>
                      <code className="text-xs block">
                        {`<MarkdownEditor
  value={documentation}
  onChange={setDocumentation}
  label="Technical Documentation"
  placeholder="Write documentation in Markdown..."
  showPreview={true}
  showHelp={true}
/>`}
                      </code>
                    </div>

                    <div className="bg-muted p-4 rounded-lg">
                      <h4 className="font-medium mb-2">Using with Forms</h4>
                      <code className="text-xs block">
                        {`const { value, setValue, validate, getPlainText } = useRichTextEditor();

// In form validation
const isValid = validate(value, {
  required: true,
  minLength: 50,
  maxLength: 1000
});`}
                      </code>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="font-medium">Rich Text Editor Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Full WYSIWYG editing</li>
                        <li>• Customizable toolbars</li>
                        <li>• Fullscreen mode</li>
                        <li>• Word/character counting</li>
                        <li>• Undo/redo functionality</li>
                        <li>• Link and image insertion</li>
                        <li>• Text alignment options</li>
                        <li>• Font and color customization</li>
                      </ul>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium">Markdown Editor Features</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Live preview mode</li>
                        <li>• Syntax highlighting</li>
                        <li>• Toolbar shortcuts</li>
                        <li>• Built-in help guide</li>
                        <li>• Tab-based interface</li>
                        <li>• Word/character counting</li>
                        <li>• Markdown parsing</li>
                        <li>• Export to HTML</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};
