"use client";
import IssueCardSmall from '@/app/components/Issue/Cards/IssueCardSmall';
import Spinner from '@/app/components/Loading/Spinner';
import Link from 'next/link';
import { useState, useEffect } from 'react';

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
    const [loading, setLoading] = useState(true);

    const projectId = params.id;

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}/issues`)
                .then(res => res.json())
                .then(data => {
                    setTimeout(() => {
                        setIssues(data);
                        setLoading(false);
                    }, 300);
                })
                .catch(console.error);
        }
    }, [projectId]);

    return (
        <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl'>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {issues?.length ? (
                        issues.map((issue, index) => (
                            <div className='flex flex-col items-center justify-center w-full overflow-y-auto' key={index}>
                                <Link href={`issue/${issue.id}`}>
                                    <IssueCardSmall
                                        id={issue.id}
                                        title={issue.title}
                                        description={issue.description}
                                        status={issue.status}
                                    />
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div>Projektas neturi trūkumų</div>
                    )}
                </>
            )}


        </div>
    );
}