"use client";
import MarkdownDisplay from "@/app/components/MarkdownDisplay/MarkdownDisplay";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
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
    const [project, setProject] = useState<Project>();
    const [issue, setIssue] = useState<Issue>();
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

    const statusLocale = {
        open: 'Aktyvus',
        closed: 'Uždarytas'
    };

    const visibilityLocale = {
        public: 'Viešas',
        private: 'Privatus'
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            {project ? (
                <>
                    <div className="p-2 w-[800px]">
                        <ProjectCard
                            image_url={project.logo}
                            title={project.name}
                            description={project.short_description}
                            timeUpdated={project.updated_at}
                            issueCount={0}
                            volunteerCount={0}
                            tags={project.technologies.split(" ")}
                        />
                        {issue ? (
                            <>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 mt-4">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h2 className="text-lg leading-6 font-medium text-gray-900">{issue.title}</h2>
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