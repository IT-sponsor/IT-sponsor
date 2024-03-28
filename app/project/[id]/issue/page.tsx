"use client";
import ProjectCard from '@/app/components/ProjectCard/ProjectCard';
import IssueCardSmall from '@/app/components/Issue/Cards/IssueCardSmall';
import { useState, useEffect } from 'react';

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

export default function IssuePage({ params }: {
    params: { id: number }
}) {
    const [project, setProject] = useState<Project>();
    const [issues, setIssues] = useState<Issue[] | null>(null);

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

            fetch(`/api/project/${projectId}/issues`)
                .then(res => res.json())
                .then(data => {
                    setIssues(data);
                })
                .catch(console.error);
        }
    }, [projectId]);

    return (
        <div className='flex flex-col items-center justify-center p-6'>
            {project ? (
                <>
                    <div className='p-2 w-[800px] max-h-60'>
                        <ProjectCard
                            image_url={project.logo}
                            title={project.name}
                            description={project.short_description}
                            timeUpdated={project.updated_at}
                            issueCount={0}
                            volunteerCount={0}
                            tags={project.technologies.split(' ')}
                        />
                    </div>

                    {/* List of faults */}
                    <div className='flex flex-col items-center justify-center w-[1200px]'>
                        <h1 className='text-2xl font-bold mb-2'>Projekto trūkumai</h1>
                        {issues ? (
                            issues.map((issue) => (
                                <IssueCardSmall
                                    id={issue.id}
                                    title={issue.title}
                                    description={issue.description}
                                    status={issue.status}
                                />
                            ))
                        ) : (
                            <div>Projektas neturi trūkumų</div>
                        )}
                    </div>
                </>
            ) : (
                <div>Kraunama...</div>
            )}
        </div>
    );
}