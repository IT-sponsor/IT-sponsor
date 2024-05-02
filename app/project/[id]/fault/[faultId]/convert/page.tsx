"use client";
import MarkdownEditor from "@/app/components/MarkdownEditor/MarkdownEditor";
import MarkdownDisplay from "@/app/components/MarkdownDisplay/MarkdownDisplay";
import { useState, useEffect } from "react";
import { NextResponse } from "next/server";
import Spinner from "@/app/components/Loading/Spinner";
import Link from "next/link";
import { useSession } from "next-auth/react";

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
}

export default function FaultConvertPage({ params }: {
    params: { id: number, faultId: number }
}) {
    const [project, setProject] = useState<Project>();
    const [loading, setLoading] = useState(true);
    const [fault, setFault] = useState<Fault>();
    const projectId = params.id;
    const faultId = params.faultId;
    const [issueTitle, setIssueTitle] = useState<string>("");
    const [formErrors, setFormErrors] = useState<any>({});
    const [issueDescription, setIssueDescription] = useState<string>("");
    const [issueVisibility, setIssueVisibility] = useState<string>("public");
    const { data: session } = useSession();

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}`)
                .then(res => res.json())
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
                .then(res => res.json())
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

    const defaultDescription = "# Aprašymas:\n...\n# Priėmimo kriterijai:\n...";
    const formattedDefaultDescription = defaultDescription.split("\n").map((item, key) => {
        return <span key={key}>{item}<br /></span>
    });

    issueDescription === "" && setIssueDescription(defaultDescription);

    const formValidated = () => {
        const errors = {};

        if (!issueTitle.trim()) errors.issueTitle = "Pavadinimas negali būti tuščias.";
        if (!issueDescription.trim()) errors.issueDescription = "Aprašymas negali būti tuščias.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formValidated()) return;

        const issueData = {
            title: issueTitle,
            description: issueDescription,
            visibility: issueVisibility,
            status: "open",
            id_project: Number(projectId),
            user_id: Number(session?.user?.id)
        }

        try {
            const response = await fetch(`/api/project/${projectId}/issues/new`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(issueData)
            });

            if (response.ok) {
                await fetch(`/api/fault/${projectId}`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ faultId })
                });

                window.location.href = `/project/${projectId}/fault`; // TODO: Add success message
            } else {
                return new NextResponse(JSON.stringify({ message: "Error creating issue", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        } catch (error) {
            return new NextResponse(JSON.stringify({ message: "Network error", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
    };

    return (
        <div className='w-full flex flex-col justify-center items-center mt-4'>
            {loading ? (
                <div className='mt-5'>
                    <Spinner />
                </div>
            ) : (
                <>
                    {project && fault ? (
                        <form onSubmit={handleSubmit}>
                            <div className="bg-gray-200 px-1 shadow overflow-hidden sm:rounded-lg mb-4 w-[1200px] break-words">
                                <div className="px-4 py-5 sm:px-6 border-b border-black-800">
                                    <h2 className="text-lg leading-6 font-medium text-gray-900 text-center">Klaidos konvertavimas į trūkumą</h2>
                                </div>
                                <div className="flex flex-row bg-gray-200 overflow-hidden sm:rounded-lg mb-4">

                                    <div className="bg-white px-6 py-5 rounded-xl border-2 border-gray-100 w-2/5 mr-2">

                                        <div className="px-4 py-2 sm:px-6">
                                            <h2 className="text-lg leading-6 font-medium text-gray-900">{fault.title}</h2>
                                        </div>
                                        <div className="border-t border-gray-200">

                                            <div className="bg-white px-4 py-5 sm:gap-4 sm:px-6">
                                                <label className="block text-gray-800 font-bold">Svarbumas</label>
                                                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">{severityLocale[fault.severity as keyof typeof severityLocale]}</div>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:gap-4 sm:px-6">
                                                <label className="block text-gray-800 font-bold">Statusas</label>
                                                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3">{statusLocale[fault.status as keyof typeof statusLocale]}</div>
                                            </div>
                                            <div className="bg-white px-4 py-5 sm:gap-4 sm:px-6">
                                                <label className="block text-gray-800 font-bold">Atkūrimo veiksmai</label>
                                                <div className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-3"><MarkdownDisplay markdownText={fault.description} /></div>
                                            </div>

                                        </div>
                                    </div>
                                    <div className="px-6 py-5 rounded-xl border-2 border-gray-100 bg-white w-3/5">
                                        <div className="flex flex-col items-start justify-center w-full h-full">
                                            <label htmlFor="title" className="block text-gray-800 font-bold">Pavadinimas</label>
                                            <input
                                                type="text"
                                                id="title"
                                                placeholder="Pavadinimas"
                                                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                                                value={issueTitle} onChange={(e) => setIssueTitle(e.target.value)}
                                            />
                                            {formErrors.issueTitle && <div className="text-red-500">{formErrors.issueTitle}</div>}

                                            <label htmlFor="description" className="block text-gray-800 font-bold mt-4">Aprašymas</label>
                                            <MarkdownEditor markdownText={issueDescription} setMarkdownText={(value) => setIssueDescription(value)} />
                                            {formErrors.issueDescription && <div className="text-red-500">{formErrors.issueDescription}</div>}

                                            <label htmlFor="severity" className="block text-gray-800 font-bold mt-4">Matomumas</label>
                                            <select
                                                id="severity"
                                                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                                                value={issueVisibility} onChange={(e) => setIssueVisibility(e.target.value)}
                                            >
                                                <option value="public">Viešas</option>
                                                <option value="private">Privatus</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-center mb-4 mt-2">
                                    <button
                                        type="submit"
                                        className="py-2 px-4 mr-2 rounded-lg text-black bg-[#40C173] hover:bg-green-700 transition duration-150 ease-in-out">
                                        Konvertuoti klaidą
                                    </button>
                                    <Link href={`/project/${projectId}/fault`} passHref className="py-2 px-4 rounded-lg text-black bg-gray-400 hover:bg-red-700 transition duration-150 ease-in-out">
                                        Atšaukti
                                    </Link>
                                </div>
                            </div>
                        </form>
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