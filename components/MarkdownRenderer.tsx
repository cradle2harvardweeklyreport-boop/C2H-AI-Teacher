import React, { Fragment } from 'react';

interface MarkdownRendererProps {
  content: string;
}

const parseInlineMarkdown = (text: string) => {
  // Split the text by our bold markdown delimiter, but keep the delimiter in the resulting array.
  // This allows us to easily identify and replace the bolded segments.
  const parts = text.split(/(\*\*.*?\*\*)/g);

  return parts.map((part, i) => {
    // If the part is a bolded segment (e.g., "**text**"), render it as a <strong> element.
    if (part.startsWith('**') && part.endsWith('**')) {
      // We slice off the first two and last two characters (the asterisks).
      return <strong key={i} className="font-semibold text-gray-900">{part.slice(2, -2)}</strong>;
    }
    // Otherwise, it's a regular text segment, so we render it as is.
    return <Fragment key={i}>{part}</Fragment>;
  });
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  if (!content) return null;

  // Process the entire content block line by line to handle headings and paragraphs correctly.
  const elements = content.split('\n').map((line, index) => {
    // Check for Heading 2 markdown syntax (## ).
    if (line.startsWith('## ')) {
      // Remove the markdown characters from the start of the line.
      const headingContent = line.substring(3);
      return (
        <h2 key={index} className="text-xl font-bold mt-4 mb-2 text-gray-900">
          {parseInlineMarkdown(headingContent)}
        </h2>
      );
    }

    // Render non-empty lines as paragraphs. This will create paragraph breaks
    // for lines that are separated by an empty line in the source markdown from the AI.
    if (line.trim() !== '') {
        return (
          <p key={index}>
            {parseInlineMarkdown(line)}
          </p>
        );
    }

    // Return null for empty lines. This prevents creating empty <p> tags and allows
    // the CSS margins on the surrounding elements to control the spacing.
    return null;
  });

  return (
    <div className="prose prose-blue max-w-none">
      {elements}
    </div>
  );
};
