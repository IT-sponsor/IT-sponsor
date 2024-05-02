"use client";
import IssueCardSmall from '@/app/components/Issue/Cards/IssueCardSmall';
import Spinner from '@/app/components/Loading/Spinner';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

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
    const { data: session } = useSession();
    const [canControl, setCanControl] = useState(false);
    const [issues, setIssues] = useState<Issue[] | null>(null);
    const [loading, setLoading] = useState(true);

    const projectId = params.id;

    useEffect(() => {
        const fetchIssueData = async () => {
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
        };
        const fetchCanControl = async () => {
            try {
                const controlsResponse = await fetch(`/api/controls/${projectId}`);
                const controlsData = await controlsResponse.json();
                if (controlsData.length > 0) {
                    const ownerId = controlsData[0].fk_usersid.toString();
                    const canControl = ownerId === session?.user?.id;
                    setCanControl(canControl);
                }
            } catch (error) {
                console.error("Error fetching controls data", error);
            }
        }
        fetchIssueData();
        fetchCanControl();
    }, [projectId, session]);

    return (
        <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl'>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {issues?.length ? (
                        issues.map((issue) => (
                            <div className='flex flex-col items-center justify-center w-full overflow-y-auto' key={issue.id}>
                                {issue.visibility === "private" && !canControl ? null : (
                                    <IssueCardSmall
                                        id={issue.id}
                                        title={issue.title}
                                        description={issue.description}
                                        status={issue.status}
                                        visibility={issue.visibility}
                                    />
                                )}
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