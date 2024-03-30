"use client";
import ProjectCard from '@/app/components/ProjectCard/ProjectCard';
import IssueCardSmall from '@/app/components/Issue/Cards/IssueCardSmall';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Issue {
    id: number;
    title: string;
    description: string;
    visibility: string;
    status: string;
    id_project: number;
}

export default function IssuePage({ params }: {
    params: { id: number }
}) {
    const [issues, setIssues] = useState<Issue[] | null>(null);

    const projectId = params.id;

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}/issues`)
                .then(res => res.json())
                .then(data => {
                    setIssues(data);
                })
                .catch(console.error);
        }
    }, [projectId]);

    return (
        <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl'>
            {issues?.length ? (
                issues.map((issue, index) => (
                    <div className='flex flex-col items-center justify-center w-full overflow-y-auto' key={index}>
                        <IssueCardSmall
                            id={issue.id}
                            title={issue.title}
                            description={issue.description}
                            status={issue.status}
                        />
                    </div>
                ))
            ) : (
                <div>Projektas neturi trūkumų</div>
            )}
        </div>
    );
}