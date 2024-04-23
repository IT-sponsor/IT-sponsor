"use client";

import Link from "next/link";
import { useEffect } from "react";

interface IssueCardSmallProps {
    id: number;
    title: string;
    description: string;
    status: string;
    visibility: string;
}

const IssueCardSmall = (
    {
        id,
        title,
        description,
        status,
        visibility
    }: IssueCardSmallProps) => {

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open':
                return 'green';
            case 'closed':
                return 'red';
            default:
                return 'gray';
        }
    };

    const getVisibilityColor = (visibility: string) => {
        switch (visibility) {
            case 'public':
                return 'bg-white';
            case 'private':
                return 'bg-gray-200';
            default:
                return 'bg-white';
        }
    };

    const visibilityLocale = {
        public: 'viešas',
        private: 'privatus'
    };

    return (
        <Link href={`issue/${id}`} className="rounded-xl border-2 border-gray-100 bg-white w-full mb-3">
            <article>
                <div className={`flex flex-col sm:flex-row items-start gap-4 p-4 sm:px-6 lg:px-8 ${getVisibilityColor(visibility)}`}>
                    <div className="flex-grow">
                        <div className="flex items-center">
                            <span
                                className="hidden sm:block h-4 w-4 rounded-full mr-2"
                                style={{ backgroundColor: getStatusColor(status) }}
                                aria-hidden="true"
                            ></span>
                            <h3 className="font-medium sm:text-lg"> {title} </h3>
                        </div>
                        <p className="line-clamp-2 text-sm text-gray-700"> {description} </p>
                    </div>
                </div>
            </article>
        </Link>
    );
};

export default IssueCardSmall;