"use client";
import ProjectCard from "../ProjectCard/ProjectCard";
import MarkdownDisplay from "../MarkdownDisplay/MarkdownDisplay";
import Link from "next/link";

interface ProjectDashboardProps {
    name: string;
    short_description: string;
    long_description: string;
    repository: string;
    logo: string;
    tags: string[];
    created_at: string;
    updated_at: string;
    id_project: number;
}

const ProjectDashboard = ({
    name,
    short_description,
    long_description,
    repository,
    logo,
    tags,
    updated_at,
    id_project
}: ProjectDashboardProps) => {
    return (
        <div className="flex flex-col items-center justify-center p-6">
            {/* Project card details */}
            <div className="p-6 w-[800px] max-h-60">
                <ProjectCard
                    image_url={logo}
                    title={name}
                    description={short_description}
                    timeUpdated={updated_at}
                    issueCount={0}
                    volunteerCount={0}
                    tags={tags}
                />
            </div>

            {/* Buttons after the project card */}
            <div className="mt-4 flex justify-center gap-2">
                <Link href={repository} target="_blank" rel="noopener noreferrer" className="py-2 px-4 rounded-lg text-black bg-[#40C173] hover:bg-green-700 transition duration-150 ease-in-out">Repositorija</Link>
                <Link href="#" className="py-2 px-4 rounded-lg text-black bg-[#40C173] hover:bg-green-700 transition duration-150 ease-in-out">Klaidos</Link>
                <Link href={`/project/${id_project}/fault/new`} className="py-2 px-4 rounded-lg text-black bg-[#40C173] hover:bg-green-700 transition duration-150 ease-in-out">Pranešti apie klaidą</Link>
                <Link href={`/project/${id_project}/fault`} className="py-2 px-4 rounded-lg text-black bg-[#C14040] hover:bg-red-700 transition duration-150 ease-in-out">Privačios klaidos</Link>
                {/* Project owners' feature */}
                {/* <Link href={`/project/${id_project}/edit`} className="py-2 px-4 rounded-lg text-black bg-[#C14040] hover:bg-red-700 transition duration-150 ease-in-out">Redaguoti projektą</Link>*/}
                
            </div>

            {/* Description with markdown features */}
            <div className="mt-4 w-full max-w-lg">
                <MarkdownDisplay markdownText={long_description} />
            </div>
        </div>
    );
};

export default ProjectDashboard;
