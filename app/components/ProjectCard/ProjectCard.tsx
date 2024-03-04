"use client";
import Issue from "@/public/assets/issue.svg";
import { formatDistanceToNow } from "date-fns";
import { lt } from "date-fns/locale";

interface ProjectCardProps {
    image_url: string;
    title: string;
    description: string;
    timeUpdated: string;
    issueCount: number;
    volunteerCount: number;
    tags: string[];
}

const ProjectCard = ({ image_url, title, description, timeUpdated, issueCount, volunteerCount, tags }: ProjectCardProps) => {
    const timeDifference = formatDistanceToNow(timeUpdated, { includeSeconds: false, addSuffix: true, locale: lt});
    return (
        <article className="rounded-xl border-2 border-gray-100 bg-white">
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:px-6 lg:px-8">
                <a href="#" className="block shrink-0">
                    <img
                        alt={title}
                        src={image_url}
                        className="h-32 rounded-lg object-cover"
                    />
                </a>
    
                <div className="flex-grow">
                    <h3 className="font-medium sm:text-lg">
                        <a href="#" className="hover:underline"> {title} </a>
                    </h3>
    
                    <p className="line-clamp-5 text-sm text-gray-700"> {description} </p>
                </div>
            </div>
    
            {/* Bottom ribbon */}
            <div className="flex sm:flex-row items-center gap-3 p-4">
                <p className="hidden sm:block sm:text-xs sm:text-gray-500"> Atnaujinta {timeDifference} </p>

                <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                <div className="flex items-center gap-1 text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                        />
                    </svg>
    
                    <p className="text-xs">{issueCount}</p>
                </div>
    
                <span className="hidden sm:block" aria-hidden="true">&middot;</span>
    
                <p className="hidden sm:block sm:text-xs sm:text-gray-500"> {volunteerCount} savanoriai </p>
    
                <span className="hidden sm:block" aria-hidden="true">&middot;</span>
    
                {/* For each tag create badge */}
                {tags.map((tag, index) => (
                    <span key={index} className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700">
                        {tag}
                    </span>
                ))}
            </div>
        </article>
    );
    
};

export default ProjectCard;