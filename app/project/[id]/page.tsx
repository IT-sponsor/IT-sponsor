"use client";
import { useState, useEffect } from 'react';
import MarkdownDisplay from '@/app/components/MarkdownDisplay/MarkdownDisplay';
import Spinner from '@/app/components/Loading/Spinner';
import CompanyDefault from '@/public/assets/CompanyDefault.png';

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

export default function ProjectPage({ params }: {
    params: { id: number }
}) {
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    const projectId = params.id;

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

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            {loading ? (
                <div className='mt-5'>
                    <Spinner />
                </div>
            ) : (
                <>
                    {project ? (
                        <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                            <MarkdownDisplay markdownText={project.long_description} />
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
