"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
import ProjectCardSkeleton from '@/app/components/ProjectCard/ProjectCardSkeleton';

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

export default function MyProjects({ params }: { params: { id: number } }) {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch(`/api/user/${params.id}/controlledProjects`);
                const data = await response.json();
                setProjects(data.projects);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [params.id]);

    return (
        <div className='mb-5 w-full flex flex-col justify-center items-center'>
            {loading ? (
                <>
                    <div className='my-4 w-full max-w-5xl max-h-60'>
                        <ProjectCardSkeleton />
                    </div>
                    <div className='my-4 w-full max-w-5xl max-h-60'>
                        <ProjectCardSkeleton />
                    </div>
                    <div className='my-4 w-full max-w-5xl max-h-60'>
                        <ProjectCardSkeleton />
                    </div>
                </>
            ) : projects.length > 0 ? (
                projects.map((project, index) => (
                    <div className="my-4 w-full max-w-5xl max-h-60" key={index}>
                        <Link href={`/project/${project.id}`} passHref>
                            <div style={{ cursor: 'pointer' }}>
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
                        </Link>
                    </div>
                ))
            ) : (
                <div className="mt-5 text-center text-lg text-gray-600">
                    No projects found that match your criteria. Try different keywords or filters.
                </div>
            )}
        </div>
    );
}
