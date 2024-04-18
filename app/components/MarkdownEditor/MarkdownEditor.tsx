"use client";
import React, { useCallback, useMemo, useState } from 'react';

import SimpleMDE, { SimpleMdeReact } from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';

interface MarkdownEditorProps {
  markdownText: string;
  setMarkdownText: (markdownText: string) => void;
}

// Markdown component
const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ markdownText, setMarkdownText }) => {
  const handleTextChange = useCallback((value: string) => {
    setMarkdownText(value);
  }, [setMarkdownText]);

  const MarkdownSettings = useMemo(() => {
    return {
      autofocus: true,
      status: false,
      toolbar: [
        "bold",
        "italic",
        "heading",
        "|",
        "quote",
        "unordered-list",
        "ordered-list",
        "|",
        "link",
        "image",
        "table",
        "|",
        "preview"
      ]
    } as SimpleMDE.Options;
  }, []);

  return (
    <SimpleMdeReact
      className='w-full h-full'
      options={MarkdownSettings}
      value={markdownText}
      onChange={handleTextChange}
    />
  );
};

export default MarkdownEditor;