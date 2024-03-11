"use client";
import React from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownDisplayProps {
  markdownText: string;
}

// In your MarkdownDisplay component
const MarkdownDisplay: React.FC<MarkdownDisplayProps> = ({ markdownText }) => {
    return (
      <div className="markdown-container">
        <ReactMarkdown>{markdownText}</ReactMarkdown>
      </div>
    );
  };
  

export default MarkdownDisplay;
