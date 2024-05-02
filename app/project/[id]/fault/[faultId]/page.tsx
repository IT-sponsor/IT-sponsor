"use client";
import { useRouter } from "next/navigation";
import Spinner from "@/app/components/Loading/Spinner";
import MarkdownDisplay from "@/app/components/MarkdownDisplay/MarkdownDisplay";
import Link from "next/link";
import { useState, useEffect } from "react";

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

interface Fault {
    id: number;
    title: string;
    created_at: string;
    description: string;
    severity: string;
    status: string;
    fk_projectid: number;
    fk_userid: number;
    users: {
        id: number;
        first_name: string;
        last_name: string;
        logo: string;
        images: {
            image: {
                data: Buffer;
            }
        }
    };
}

export default function viewFaultPage({ params }: {
    params: { id: number, faultId: number }
}) {
    const router = useRouter();
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState(true);
    const [fault, setFault] = useState<Fault>();
    const projectId = params.id;
    const faultId = params.faultId;

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}`)
                .then(res => {
                    if (res.status === 404) {
                        console.error("Project with id", projectId, "not found");
                        router.replace('/404');
                    }
                    return res.json();
                })
                .then(data => {
                    setTimeout(() => {
                        setProject(data);
                        setLoading(false);
                    }, 500);
                })
                .catch(console.error);
        }
    }, [projectId]);

    useEffect(() => {
        if (faultId) {
            fetch(`/api/project/${projectId}/faults/${faultId}`)
                .then(res => {
                    if (res.status === 404) {
                        console.error("Fault with id", faultId, "not found");
                        router.replace('/404');
                    }
                    return res.json();
                })
                .then(data => {
                    setFault(data);
                })
                .catch(console.error);
        }
    }, [faultId]);

    const severityLocale = {
        low: 'žemas',
        medium: 'vidutinis',
        high: 'aukštas'
    };

    const statusLocale = {
        open: 'atviras',
        closed: 'uždarytas'
    };

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            {loading ? (
                <div className='mt-5'>
                    <Spinner />
                </div>
            ) : (
                <>
                    {project ? (
                        <div className="p-2 w-[800px]">
                            {fault ? (
                                <>
                                    <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4">
                                        <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                                            <h2 className="text-lg leading-6 font-medium text-gray-900">{fault.title}</h2>
                                            <Link href={`${faultId}/convert`} type="button" className="rounded-lg text-black bg-[#40C173] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Konvertuoti</Link>
                                        </div>

                                        <div className="border-t border-gray-200 break-words">
                                            <dl>
                                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Pranešėjas</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                        <div className="flex items-center mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                                            <a href={`/profile/${fault.users.id}`} className="flex items-center hover:bg-green-100 rounded-lg pr-1">
                                                                <img
                                                                    alt=''
                                                                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                                                    className="h-6 w-6 rounded-full mr-2"
                                                                />
                                                                {fault.users.first_name + ' ' + fault.users.last_name}
                                                            </a>
                                                        </div>
                                                    </dd>
                                                </div>
                                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Svarbumas</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{severityLocale[fault.severity as keyof typeof severityLocale]}</dd>
                                                </div>
                                                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Statusas</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{statusLocale[fault.status as keyof typeof statusLocale]}</dd>
                                                </div>
                                                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                                    <dt className="text-sm font-medium text-gray-500">Atkūrimo veiksmai</dt>
                                                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2"><MarkdownDisplay markdownText={fault.description} /></dd>
                                                </div>
                                            </dl>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                                    <h1 className='text-2xl font-bold'>Nepavyko užkrauti duomenų. Pabandykite iš naujo</h1>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                            <h1 className='text-2xl font-bold'>Nepavyko užkrauti duomenų. Pabandykite iš naujo</h1>
                        </div>
                    )}
                </>
            )}
        </div>

    );
}