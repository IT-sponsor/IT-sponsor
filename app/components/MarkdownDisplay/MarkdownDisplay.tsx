"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownDisplayProps {
  markdownText: string;
}

// Markdown component
const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ markdownText }) => {
    return (
      <div className="w-full markdown-container">
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      </div>
    );
  };
  

export default MarkdownDisplay;
