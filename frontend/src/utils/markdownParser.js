/**
 * Simple Markdown Parser
 * Converts markdown syntax to HTML for display
 */

export const parseMarkdown = (text) => {
  if (!text) return "";

  let html = text;

  // Escape HTML to prevent XSS
  html = html
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Headers (must be at start of line)
  html = html.replace(/^### (.*$)/gim, "<h3>$1</h3>");
  html = html.replace(/^## (.*$)/gim, "<h2>$1</h2>");
  html = html.replace(/^# (.*$)/gim, "<h1>$1</h1>");

  // Bold
  html = html.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/__(.*?)__/g, "<strong>$1</strong>");

  // Italic
  html = html.replace(/\*(.*?)\*/g, "<em>$1</em>");
  html = html.replace(/_(.*?)_/g, "<em>$1</em>");

  // Strikethrough
  html = html.replace(/~~(.*?)~~/g, "<s>$1</s>");

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Images
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />',
  );

  // Code blocks (must be on separate lines)
  html = html.replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>");

  // Blockquotes (must be at start of line)
  html = html.replace(/^&gt; (.*$)/gim, "<blockquote>$1</blockquote>");

  // Unordered lists (must be at start of line)
  html = html.replace(/^\* (.*$)/gim, "<li>$1</li>");
  html = html.replace(/^- (.*$)/gim, "<li>$1</li>");

  // Ordered lists (must be at start of line)
  html = html.replace(/^\d+\. (.*$)/gim, "<li>$1</li>");

  // Wrap consecutive <li> tags in <ul> or <ol>
  html = html.replace(/(<li>.*?<\/li>\n?)+/g, (match) => {
    return `<ul>${match}</ul>`;
  });

  // Line breaks
  html = html.replace(/\n/g, "<br>");

  return html;
};

/**
 * Strip HTML tags to get plain text
 */
export const stripHtml = (html) => {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
};

/**
 * Get word count from text (HTML or plain text)
 */
export const getWordCount = (text) => {
  const plainText = stripHtml(text).trim();
  return plainText ? plainText.split(/\s+/).length : 0;
};

/**
 * Get character count from text (HTML or plain text)
 */
export const getCharCount = (text) => {
  return stripHtml(text).length;
};

/**
 * Validate markdown/HTML content
 */
export const validateContent = (content, rules = {}) => {
  const plainText = stripHtml(content).trim();

  if (rules.required && !plainText) {
    return "This field is required";
  }

  if (rules.minLength && plainText.length < rules.minLength) {
    return `Minimum ${rules.minLength} characters required`;
  }

  if (rules.maxLength && plainText.length > rules.maxLength) {
    return `Maximum ${rules.maxLength} characters allowed`;
  }

  if (rules.minWords) {
    const wordCount = getWordCount(content);
    if (wordCount < rules.minWords) {
      return `Minimum ${rules.minWords} words required`;
    }
  }

  if (rules.maxWords) {
    const wordCount = getWordCount(content);
    if (wordCount > rules.maxWords) {
      return `Maximum ${rules.maxWords} words allowed`;
    }
  }

  return null;
};
