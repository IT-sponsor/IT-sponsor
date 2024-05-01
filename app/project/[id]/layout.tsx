"use client";
import { useState, useEffect } from 'react';
import ProjectCard from '@/app/components/ProjectCard/ProjectCard';
import Tabs from '@/app/components/Tabs/Tabs';
import { useSession } from 'next-auth/react';
import ProjectCardSkeleton from '@/app/components/ProjectCard/ProjectCardSkeleton';
import CompanyDefault from '@/public/assets/CompanyDefault.png';
import { useRouter } from 'next/navigation';

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
    const router = useRouter();

    const { data: session } = useSession();
    const [project, setProject] = useState<Project | null>(null);
    const [canAccess, setCanAccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const projectId = params.id;

    useEffect(() => {
        if (projectId && !isNaN(Number(projectId))) {
            fetch(`/api/project/${projectId}`)
                .then(res => {
                    if (res.status === 404) {
                        console.error("Project with id", projectId, "not found");
                        router.replace('/404');
                    }
                    return res.json();
                })
                .then(data => {
                    if (data && data.images) {
                        const logoData = data.images.image.data
                        const base64String = Buffer.from(logoData).toString('base64');
                        const modifiedProject = {
                            ...data,
                            logo: `data:image/jpeg;base64,${base64String}`
                        };
                        setTimeout(() => {
                            setProject(modifiedProject);
                            setLoading(false);
                        }, 500);
                    } else {
                        console.error("No image data found");
                        const modifiedProject = {
                            ...data,
                            logo: CompanyDefault.src
                        };
                        setTimeout(() => {
                            setProject(modifiedProject);
                            setLoading(false);
                        }, 500);
                    }
                })
                .catch(console.error);
        } else {
            console.error("Invalid project id:", projectId);
            router.replace('/404');
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
        ...(project?.codebase_visibility === 'public' ? [{
            name: "Repozitorija",
            link: `${project?.repository}`
        }] : []),
        {
            name: "Trūkumai",
            link: `/project/${projectId}/issue`
        },

        ...(canAccess
            ? [
                {
                    name: "Klaidos",
                    link: `/project/${projectId}/fault`
                },
                {
                    name: "Redaguoti projektą",
                    link: `/project/${projectId}/edit`
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
            {loading ? (
                <div className='w-full max-w-5xl max-h-60 mb-3'>
                    <ProjectCardSkeleton />
                </div>
            ) : (
                <>
                    {project ? (
                        <>
                            <div className='w-full max-w-5xl max-h-60 mb-3'>
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

                            <Tabs panels={tabs} />
                            {children}
                        </>

                    ) : (
                        <ProjectCardSkeleton />
                    )}
                </>
            )}
        </div>

    );
};