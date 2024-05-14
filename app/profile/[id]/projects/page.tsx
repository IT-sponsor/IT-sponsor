"use client";
import { useState, useEffect } from 'react';
import Link from "next/link";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
import CompanyDefault from '@/public/assets/CompanyDefault.png';
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

interface Profile {
    first_name: String;
    last_name: String;
    email: String;
    github: string;
    linkedin: string;
    phone_number: string;
    job_title: String;
    about_me: String;
    technologies: String;
    experience: String;
    education: String;
}

export default function MyProjects({ params }: { params: { id: number } }) {
    const [user, setUser] = useState<Profile | null>(null);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = params.id;

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/profile/${userId}`);
                if (response.ok) {
                    const profileData = await response.json();
                    setUser(profileData);
                } else {
                    console.error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };

        const fetchProjects = async () => {
            try {
                const response = await fetch(`/api/user/${userId}/controlledProjects`);
                if (response.ok) {
                    const data = await response.json();
                    const modifiedData = data.projects.map((project: Project) => {
                        if (project.images?.image?.data) {
                            const logoData = new Uint8Array(project.images.image.data).reduce((data, byte) => {
                                return data + String.fromCharCode(byte);
                            }, '');
                            const base64String = btoa(logoData);
                            return {
                                ...project,
                                logo: `data:${project.images.image.contentType};base64,${base64String}`
                            };
                        } else {
                            return {
                                ...project,
                                logo: CompanyDefault.src
                            };
                        }
                    });
                    setProjects(modifiedData);
                } else {
                    console.error("Error fetching projects:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
        fetchProjects();
    }, [userId]);

    return (
        <div className='mb-5 w-full flex flex-col justify-center items-center pt-6'>
            <h1 className='text-xl font-bold'>Mano valdomi projektai</h1>
            {loading ? (
                <>
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
                <div>Neturite valdomų projektų</div>
            )}
        </div>
    );
}
