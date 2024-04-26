"use client";
import Spinner from "@/app/components/Loading/Spinner";
import MarkdownDisplay from "@/app/components/MarkdownDisplay/MarkdownDisplay";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
import { useSession } from "next-auth/react";
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
    const { data: session } = useSession();
    const [canControl, setCanControl] = useState(false);
    const [loading, setLoading] = useState(true);
    const [project, setProject] = useState<Project>();
    const [issue, setIssue] = useState<Issue>();
    const [loading, setLoading] = useState(true);
    const projectId = params.id;
    const issueId = params.issueId;

    useEffect(() => {
        const fetchProjectData = async () => {
            try {
                const projectResponse = await fetch(`/api/project/${projectId}`);
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

    const statusLocale = {
        open: 'Aktyvus',
        closed: 'Uždarytas'
    };

    const visibilityLocale = {
        public: 'Viešas',
        private: 'Privatus'
    };

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
                                            ) : null}
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
                                </>
                            ) : (
                                <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                                    <h1 className='text-2xl font-bold'>Nepavyko užkrauti duomenų. Pabandykite iš naujo</h1>
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