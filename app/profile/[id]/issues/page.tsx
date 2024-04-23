"use client";
import { useState, useEffect } from 'react';
import IssueCardSmall from '@/app/components/Issue/Cards/IssueCardSmall';
import Link from 'next/link';

interface Profile {
    first_name: String;
    last_name: String;
    email: String;
    github: string;
    linkedin: string;
    phone_number: string;
    job_title: String;
    about_me: String;
    technologies: String;
    experience: String;
    education: String;
}

interface Issue {
    id: number;
    title: string;
    description: string;
    visibility: string;
    status: string;
    fk_projectsid: number;
}

export default function MyIssues({ params }: {
    params: { id: number }
}) {
    const [user, setUser] = useState<Profile | null>(null);
    const [issues, setIssues] = useState<Issue[] | null>(null);
    const userId = params.id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/profile/${userId}`);
                if (response.ok) {
                    const profileData = await response.json();
                    setUser(profileData);
                } else {
                    console.error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        const fetchUserAssignedIssues = async () => {
            try {
                const response = await fetch(`/api/user/${userId}/assignedIssues`);
                if (response.ok) {
                    const assignedIssues = await response.json();
                    setIssues(assignedIssues);
                } else {
                    console.error('Failed to fetch assigned issues');
                }
            } catch (error) {
                console.error('Error fetching assigned issues:', error);
            }
        };
        fetchUserData();
        fetchUserAssignedIssues();
        console.log(issues);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center pt-6 w-full ">
            <h1 className='text-xl font-bold'>Mano trūkumai</h1>
        
            {issues?.length ? (
                issues.map((issue, index) => (
                    <div className='flex flex-col items-center justify-center w-full overflow-y-auto max-w-5xl' key={index}>
                        <Link href={`/project/${issue.fk_projectsid}/issue/${issue.id}`}>
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
                <div>Neturite priskirtų trūkumų</div>
            )}
        </div>
    );
}