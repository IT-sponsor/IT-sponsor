"use client";
import UserModal from "@/app/components/Issue/Cards/IssueFixerModal";
import MarkdownDisplay from "@/app/components/MarkdownDisplay/MarkdownDisplay";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
import prisma from "@/app/utils/prisma/client";
import { set } from "date-fns";
import { useSession } from "next-auth/react";
import { NextResponse } from "next/server";
import { useState, useEffect } from "react";

interface Project {
    id: number;
    name: string;
    short_description: string;
    long_description: string;
    repository: string;
    technologies: string;
    created_at: string;
    updated_at: string;
    star_count: number;
    contributor_count: number;
    codebase_visibility: string;
    fk_imagesid_images: number;

    logo: string;
    images: {
        image: {
            data: Buffer;
            contentType: string;
        }
    }
}

type UserList = {
    fk_usersid: number;
    fk_issuesid: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    github: string;
    banned_until: Date;
    role: string;
    fk_imagesid_images: number;
};

interface Issue {
    id: number;
    title: string;
    description: string;
    visibility: string;
    status: string;
    id_project: number;
}

export default function viewIssuePage({ params }: {
    params: { id: number, issueId: number }
}) {
    const [project, setProject] = useState<Project>();
    const [issue, setIssue] = useState<Issue>();
    const [canApply, setCanApply] = useState(false);
    const { data: session } = useSession();
    const [hasAccess, setHasAccess] = useState(false);
    const [userList, setUserList] = useState(Array<UserList>());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const projectId = params.id;
    const issueId = params.issueId;

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.images.image.data) {
                        const logoData = data.images.image.data
                        const base64String = Buffer.from(logoData).toString('base64');
                        const modifiedProject = {
                            ...data,
                            logo: `data:image/jpeg;base64,${base64String}`
                        };
                        setProject(modifiedProject);
                    } else {
                        console.error("No image data found");

                        setProject(data);
                    }
                })
                .catch(console.error);
        }
    }, [projectId]);

    useEffect(() => {
        if (issueId) {
            fetch(`/api/project/${projectId}/issues/${issueId}`)
                .then(res => res.json())
                .then(data => {
                    setIssue(data);
                })
                .catch(console.error);
        }
    }, [issueId]);

    // TODO: check if user already applied to this issue
    useEffect(() => {
        const fetchAccess = async () => {
            try {
                let hasAccess = false;
                let hasApplied = false;
                const response = await fetch(`/api/controls/${projectId}`);
                const data = await response.json();
                if (data.length > 0) {
                    const ownerId = data[0].fk_usersid.toString();
                    hasAccess = ownerId === session?.user?.id;
                    setHasAccess(hasAccess);
                }
                const response2 = await fetch(`/api/applies/${issueId}/${session?.user?.id}`);
                const data2 = await response2.json();
                if (data2.length > 0) {
                    hasApplied = true;
                }
                setCanApply(!hasAccess && !hasApplied);
            } catch (error) {
                console.error('Error fetching controls:', error);
            }
        };
        fetchAccess();
    }, [projectId, session]);

    const statusLocale = {
        open: 'Aktyvus',
        closed: 'Uždarytas'
    };

    const visibilityLocale = {
        public: 'Viešas',
        private: 'Privatus'
    };

    async function volunteerApplied () {
        const appliesData = {
            id_user: Number(session?.user?.id),
            id_issue: Number(issueId)
        }
        try {
            const response = await fetch(`/api/applies/new`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(appliesData)
            });

            if (response.ok) {
                const result = await response.json();
                setCanApply(false);
                // Display success message
            } else {
                return new NextResponse(JSON.stringify({ message: "Error creating applies", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        } catch (error) {
            return new NextResponse(JSON.stringify({ message: "Network error", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
    }

    async function fetchUserList() {
        try {
            const response = await fetch(`/api/applies/${issueId}`);
            if (response.ok) {
                const data = await response.json();
                const userDetailsPromises = data.map(async (userList: UserList) => {
                    const userResponse = await fetch(`/api/user/${userList.fk_usersid}`);
                    if (userResponse.ok) {
                        const userDetails = await userResponse.json();
                        return userDetails;
                    } else {
                        console.error(`Error fetching user details for userId: ${data.fk_usersid}`);
                        return null;
                    }
                });
                const userListWithDetails = await Promise.all(userDetailsPromises);
                setUserList(userListWithDetails);
                setIsModalOpen(true);
            } else {
                return new NextResponse(JSON.stringify({ message: "Error fetching fixer list", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        } catch (error) {
            return new NextResponse(JSON.stringify({ message: "Network error", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            {project ? (
                <>
                    <div className="p-2 w-[800px]">
                        {issue ? (
                            <>
                                {isModalOpen && <UserModal userList={userList} onClose={() => setIsModalOpen(false)} />}

                                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 mt-4">
                                    <div className="px-4 py-5 sm:px-6 flex items-center justify-between">
                                        <h2 className="text-lg leading-6 font-medium text-gray-900">{issue.title}</h2>
                                        {!hasAccess ? (
                                            canApply ? (
                                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={volunteerApplied}>
                                                    Noriu taisyti
                                                </button>
                                            ) : (
                                                <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed" disabled>
                                                    Laukiama patvirtinimo
                                                </button>
                                            )
                                        ) : (
                                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={fetchUserList}>
                                                Peržiūrėti kandidatus
                                            </button>
                                        )}
                                    </div>
                                    <div className="border-t border-gray-200">
                                        <dl>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Statusas</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{statusLocale[issue.status as keyof typeof statusLocale]}</dd>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"><MarkdownDisplay markdownText={issue.description} /></div>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>Kraunama...</p>
                        )}
                    </div>

                </>
            ) : (
                <p>Kraunama...</p>
            )}
        </div>
    )
}