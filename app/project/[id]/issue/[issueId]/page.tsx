"use client";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Loading/Spinner";
import MarkdownDisplay from "@/app/components/MarkdownDisplay/MarkdownDisplay";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
import prisma from "@/app/utils/prisma/client";
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
    const router = useRouter();
    const { data: session } = useSession();
    const [canControl, setCanControl] = useState(false);
    const [project, setProject] = useState<Project>();
    const [issue, setIssue] = useState<Issue>();
    const [canApply, setCanApply] = useState(false);
    const [isAssigned, setIsAssigned] = useState(false);
    const [loading, setLoading] = useState(true);
    const projectId = params.id;
    const issueId = params.issueId;

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const projectResponse = await fetch(`/api/project/${projectId}`);
                if (projectResponse.status === 404) {
                    console.error("Project with id", projectId, "not found");
                    router.replace('/404');
                }
                const projectData = await projectResponse.json();
                if (projectData && projectData.images) {
                    const logoData = projectData.images.image.data;
                    const base64String = Buffer.from(logoData).toString('base64');
                    const modifiedProject = {
                        ...projectData,
                        logo: `data:image/jpeg;base64,${base64String}`
                    };
                    setProject(modifiedProject);
                    setLoading(false);
                } else {
                    console.error("No image data found");
                    setProject(projectData);
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching project data", error);
            }
        };
        
        const fetchIssueData = async () => {
            try {
                const issueResponse = await fetch(`/api/project/${projectId}/issues/${issueId}`);
                if (issueResponse.status === 404) {
                    console.error("Issue with id", issueId, "not found");
                    router.replace('/404');
                }
                const issueData = await issueResponse.json();
                setIssue(issueData);
            } catch (error) {
                console.error("Error fetching issue data", error);
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
                console.error("Error fetching controls", error);
            }
        };

        fetchProjectData();
        fetchCanControl();
        fetchIssueData();
    }, [projectId, issueId, session]);

    const updateIssue = async (updatedIssue: Issue) => {
        try {
            const response = await fetch(`/api/project/${projectId}/issues/${issueId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedIssue),
            });

            if (!response.ok) {
                throw new Error(`Failed to update issue: ${response.statusText}`);
            }

            window.location.reload();
        } catch (error) {
            console.error(error);
        }
    };

    const changeIssueStatus = async (status: string) => {
        const updatedIssue = issue ? { ...issue, status } : undefined;
        await updateIssue(updatedIssue as Issue);
    };

    const changeIssueVisibility = async (visibility: 'public' | 'private') => {
        const updatedIssue = issue ? { ...issue, visibility } : undefined;
        await updateIssue(updatedIssue as Issue);
    };

    // DONE: check if user already applied to this issue
    // DONE: Check if user has been assigned to this issue
    // TODO: Update on database changes
    useEffect(() => {
        const fetchAccess = async () => {
            try {
                let hasApplied = false;

                const response = await fetch(`/api/applies/${issueId}`);
                const application = await response.json();
                if (application.length > 0 && application.some((item: { fk_usersid: any; }) => String(item.fk_usersid) === String(session?.user?.id))) {
                    hasApplied = true;
                }
                setCanApply(!canControl && !hasApplied);

                const response3 = await fetch(`/api/gets_assigned/${issueId}`);
                const assignment = await response3.json();
                if (assignment.length > 0 && assignment.some((item: { fk_usersid: any; }) => String(item.fk_usersid) === String(session?.user?.id))) {
                    setIsAssigned(true);
                }
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

    return (
        <div className="flex flex-col items-center justify-center">
            {loading ? (
                <div className="mt-5">
                    <Spinner />
                </div>
            ) : (
                <>
                    <div className="p-2 w-[800px]">
                        {issue ? (
                            <>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 mt-4">
                                    <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                        <h2 className="text-lg leading-6 font-medium text-gray-900">{issue.title}</h2>
                                        <div className="flex space-x-2">
                                            {canControl ? (
                                                <>
                                                    {issue.status === 'open' ? (
                                                        <button onClick={() => changeIssueStatus("closed")} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Uždaryti trūkumą</button>
                                                    ) : (
                                                        <button onClick={() => changeIssueStatus("open")} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Atidaryti trūkumą</button>
                                                    )}
                                                    {issue.visibility === 'public' ? (
                                                        <button onClick={() => changeIssueVisibility("private")} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Padaryti privatų</button>
                                                    ) : (
                                                        <button onClick={() => changeIssueVisibility("public")} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Padaryti viešą</button>
                                                    )}
                                                </>
                                            ) : (
                                            canApply && !isAssigned ? (
                                                <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={volunteerApplied}>
                                                    Noriu taisyti
                                                </button>
                                            ) : (
                                                isAssigned ? (
                                                    <button className="bg-white border-2 border-green-500 font-bold py-2 px-4 rounded cursor-not-allowed" disabled>
                                                        Jau priskirtas
                                                    </button>
                                                ) : (
                                                    <button className="bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed" disabled>
                                                        Laukiama patvirtinimo
                                                    </button>
                                                )
                                            )
                                        )}
                                        </div>

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
                            <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                                <h1 className='text-2xl font-bold'>Nepavyko užkrauti duomenų. Pabandykite iš naujo</h1>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}