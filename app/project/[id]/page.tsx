"use client";
import { useState, useEffect } from 'react';
import MarkdownDisplay from '@/app/components/MarkdownDisplay/MarkdownDisplay';

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

    const projectId = params.id;

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

    return (
        <div>
            {project ? (
                <>
                    <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                        <MarkdownDisplay markdownText={project.long_description} />
                    </div>
                </>
            ) : (
                <p>Loading project details...</p>
            )}
        </div>


    );
}
