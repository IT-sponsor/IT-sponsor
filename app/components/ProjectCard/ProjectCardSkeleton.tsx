"use client";
import Issue from "@/public/assets/issue.svg";
import { formatDistanceToNow } from "date-fns";
import { lt } from "date-fns/locale";

const ProjectCardSkeleton = () => {
    return (
        <article className="animate-pulse w-full rounded-xl border-2 border-gray-100 bg-white mx-auto">
            <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:px-6 lg:px-8">
                <div className="h-32 w-32 rouned-full bg-gray-100"></div>

                <div className="flex-grow">
                    <div className="h-6 w-full bg-gray-100 mb-2"></div>
                    <div className="h-24 w-full bg-gray-100"></div>
                </div>
            </div>

            {/* Bottom ribbon */}
            <div className="flex sm:flex-row items-center gap-3 p-4">
                <div className=" ml-3 hidden sm:block sm:text-xs sm:text-gray-500 bg-gray-100 h-4 w-32"></div>

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

                    <div className="text-xs bg-gray-100 h-4 w-16"></div>
                </div>

                <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                <div className="hidden sm:block sm:text-xs sm:text-gray-500 bg-gray-100 h-4 w-32"></div>

                <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                {/* For each tag create badge */}
                <div className="whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700 h-4 w-16">
                </div>
            </div>
        </article>
    );

};

export default ProjectCardSkeleton;