import { useMemo } from 'react';

export const useMarkdownHeaders = (markdownText) => {
    return useMemo(() => {
        const regex = /^(#{1,6})\s+(.*)/gm;
        const headers = [];
        let match;

        while ((match = regex.exec(markdownText)) !== null) {
            const id = match[2].toLowerCase().replace(/\s+/g, '-');  // Generate ID
            headers.push({
                id: id,
                level: match[1].length,
                text: match[2]
            });
        }

        return headers;
    }, [markdownText]);
};

