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

interface Fault {
    id: number;
    title: string;
    created_at: string;
    description: string;
    severity: string;
    status: string;
    fk_projectid: number;
    fk_userid: number;
}

export default function viewFaultPage({ params }: {
    params: { id: number, faultId: number }
}) {
    const [project, setProject] = useState<Project>();
    const [fault, setFault] = useState<Fault>();
    const projectId = params.id;
    const faultId = params.faultId;

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
        if (faultId) {
            fetch(`/api/project/${projectId}/faults/${faultId}`)
                .then(res => res.json())
                .then(data => {
                    setFault(data);
                })
                .catch(console.error);
        }
    }, [faultId]);

    const severityLocale = {
        low: 'žemas',
        medium: 'vidutinis',
        high: 'aukštas'
    };

    const statusLocale = {
        open: 'atviras',
        closed: 'uždarytas'
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            {project ? (
                <>
                    <div className="p-2 w-[800px] max-h-60">
                        <ProjectCard
                            image_url={project.logo}
                            title={project.name}
                            description={project.short_description}
                            timeUpdated={project.updated_at}
                            issueCount={0}
                            volunteerCount={0}
                            tags={project.technologies.split(" ")}
                        />
                        {fault ? (
                            <>
                                <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 mt-4">
                                    <div className="px-4 py-5 sm:px-6">
                                        <h2 className="text-lg leading-6 font-medium text-gray-900">{fault.title}</h2>
                                    </div>
                                    <div className="border-t border-gray-200">

                                        <dl>
                                            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Svarbumas</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{severityLocale[fault.severity as keyof typeof severityLocale]}</dd>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Statusas</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{statusLocale[fault.status as keyof typeof statusLocale]}</dd>
                                            </div>
                                            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                <dt className="text-sm font-medium text-gray-500">Atkūrimo veiksmai</dt>
                                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"><MarkdownDisplay markdownText={fault.description} /></dd>
                                            </div>
                                        </dl>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>

                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}