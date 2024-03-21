"use client";

import Link from "next/link";
import { useEffect } from "react";

interface User {
    name: string;
    photo: string;
}

interface FaultCardSmallProps {
    id: number;
    title: string;
    description: string;
    severity: string;
    status: string;
    reporter_id: number;
    created_at: string;
}

const FaultCardSmall = (
    { 
        id,
        title, 
        description, 
        severity, 
        status, 
        reporter_id, 
        created_at 
    }: FaultCardSmallProps) => {

    const user = {
        name: "John Doe",
        photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Atviras':
                return 'red';
            case 'Baigtas':
                return 'green';
            default:
                return 'gray';
        }
    };

    useEffect(() => {
        console.log("Get user info for reporter_id: ", reporter_id);
    }, []);
    
    return (
        <Link href={`fault/${id}`} className="rounded-xl border-2 border-gray-100 bg-white w-2/3 mb-3">
            <article>
                <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:px-6 lg:px-8">
                    <div className="flex-grow">
                        <div className="flex items-center">
                            <span
                                className="hidden sm:block h-4 w-4 rounded-full mr-2"
                                style={{backgroundColor: getStatusColor(status)}}
                                aria-hidden="true"
                            ></span>
                            <h3 className="font-medium sm:text-lg"> {title} </h3>
                        </div>
                        <p className="line-clamp-2 text-sm text-gray-700"> {description} </p>
                    </div>
                </div>

                {/* Bottom ribbon */}
                <div className="flex sm:flex-row items-center gap-3 sm:px-6 lg:px-8 pb-2">

                    <img
                        alt={user.name}
                        src={user.photo}
                        className="h-6 w-6 rounded-full"
                    />
                    <p className="hidden sm:block sm:text-xs sm:text-gray-500">{user.name}</p>

                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                    <p className="hidden sm:block sm:text-xs sm:text-gray-500"> {severity} </p>

                    <span className="hidden sm:block" aria-hidden="true">&middot;</span>

                    <p className="hidden sm:block sm:text-xs sm:text-gray-500"> {created_at} </p>
                </div>
            </article>
        </Link>
    );
};

export default FaultCardSmall;