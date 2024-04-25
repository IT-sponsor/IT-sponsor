import React from 'react';
import { useMemo } from 'react';
import { useMarkdownHeaders } from '@/app/utils/hooks/useMarkdownHeaders';

const TOC = ({ markdownText }) => {
    const headers = useMarkdownHeaders(markdownText);

    const getPadding = (level) => {
        switch(level) {
            case 1: return 'pl-2';
            case 2: return 'pl-4';
            case 3: return 'pl-6';
            case 4: return 'pl-8';
            case 5: return 'pl-10';
            case 6: return 'pl-12';
            default: return 'pl-2';
        }
    };

    return (
        <div className="toc-container" style={{
            position: 'sticky',
            top: '0',
            height: '100vh',
            overflowY: 'auto',
            paddingTop: '2.5rem',
            paddingLeft: '1.25rem',
            paddingRight: '1.25rem',
            zIndex: 10,
        }}>
            <h1 className="font-medium sm:text-lg border-b">Turinys</h1>
            <ul className="list-inside">
                {headers.map((header, index) => (
                    <li key={index} className={getPadding(header.level)}>
                        <a href={`#${header.id}`} className="hover:underline text-blue-600 block text-sm py-1">
                            {header.text}
                        </a>
                    </li>
                ))}
            </ul>
        </div>
        
    );
};

export default TOC;
