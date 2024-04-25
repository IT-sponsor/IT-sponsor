"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';

interface MarkdownDisplayProps {
  markdownText: string;
}

// Markdown component
const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ markdownText }) => {
    return (
      <div className="w-full markdown-container">
        <ReactMarkdown rehypePlugins={[rehypeSlug]}>{markdownText}</ReactMarkdown>
      </div>
    );
  };
  

export default MarkdownDisplay;
