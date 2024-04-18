"use client";
import Spinner from "@/app/components/Loading/Spinner";
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
    const [loading, setLoading] = useState(true);
    const projectId = params.id;
    const issueId = params.issueId;

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}`)
                .then(res => res.json())
                .then(data => {
                    setTimeout(() => {
                        setProject(data);
                        setLoading(false);
                    }, 500);
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
        <div className='w-full flex flex-col justify-center items-center'>
            {loading ? (
                <div className='mt-5'>
                    <Spinner />
                </div>
            ) : (
                <>
                    {project ? (
                        <div className="p-2 w-[800px]">
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
                                <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                                    <h1 className='text-2xl font-bold'>Nepavyko užkrauti duomenų. Pabandykite iš naujo</h1>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                            <h1 className='text-2xl font-bold'>Nepavyko užkrauti duomenų. Pabandykite iš naujo</h1>
                        </div>
                    )}
                </>
            )}
        </div>


    );
}