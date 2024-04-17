"use client";
import { useState, useEffect } from 'react';
import ProjectCard from '@/app/components/ProjectCard/ProjectCard';
import Tabs from '@/app/components/Tabs/Tabs';
import { useSession } from 'next-auth/react';

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

export default function ProjectLayout({
    params,
    children
}: {
    params: { id: string };
    children: React.ReactNode;
}) {
    const { data: session } = useSession();
    const [project, setProject] = useState<Project | null>(null);
    const [canAccess, setCanAccess] = useState(false);
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

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const response = await fetch(`/api/controls/${projectId}`);
                const data = await response.json();
                if (data.length > 0) {
                    const ownerId = data[0].fk_usersid.toString();
                    const hasAccess = ownerId === session?.user?.id;
                    setCanAccess(hasAccess);
                }
            } catch (error) {
                console.error('Error fetching controls:', error);
            }
        };
        fetchAccess();
    }, [projectId, session]);

    const tabs = [
        {
            name: "Pagrindinis",
            link: `/project/${projectId}`
        },
        {
            name: "Repozitorija",
            link: `${project?.repository}`
        },
        {
            name: "Trūkumai",
            link: `/project/${projectId}/issue`
        },

        ...(canAccess
            ? [
                {
                    name: "Klaidos",
                    link: `/project/${projectId}/fault`
                }
            ]
            : [
                {
                    name: "Naujas trūkumas",
                    link: `/project/${projectId}/issue/new`
                }
            ])
    ];



    return (
        <div className="flex flex-col items-center justify-center p-6">
            {project ? (
                <>
                    <div className='max-w-5xl max-h-60 mb-3'>
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

                    {/* Navigation buttons after the project card */}
                    <Tabs panels={tabs} />

                    {children}
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>

    );
};