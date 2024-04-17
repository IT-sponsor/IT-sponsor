"use client";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
import { NextResponse } from "next/server";
import React, { useCallback, useMemo, useState, useEffect } from 'react';

import SimpleMDE, { SimpleMdeReact } from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

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

interface Issue {
    id: number;
    title: string;
    description: string;
    visibility: string;
    status: string;
    id_project: number;
}

export default function newIssuePage({ params }: {
    params: { id: number }
}) {
    const [project, setProject] = useState<Project>();
    const projectId = params.id;

    const [issueTitle, setIssueTitle] = useState<string>("");
    const [issueDescription, setIssueDescription] = useState<string>("");
    const [issueVisibility, setIssueVisibility] = useState<string>("public");
    const [formErrors, setFormErrors] = useState<any>({});

    const onMarkdownChange = useCallback((value: string) => {
        setIssueDescription(value);
    }, []);

    const MarkdownSettings = useMemo(() => {
        return {
            autofocus: true,
            status: false,
            toolbar: [
                {
                    name: "bold",
                    action: SimpleMDE.toggleBold,
                    className: "fa fa-bold",
                    title: "Paryškinti",
                },
                {
                    name: "italic",
                    action: SimpleMDE.toggleItalic,
                    className: "fa fa-italic",
                    title: "Kursyvinis",
                },
                {
                    name: "heading",
                    action: SimpleMDE.toggleHeadingSmaller,
                    className: "fa fa-header",
                    title: "Antraštė",
                },
                "|",
                {
                    name: "quote",
                    action: SimpleMDE.toggleBlockquote,
                    className: "fa fa-quote-left",
                    title: "Citata",
                },
                {
                    name: "unordered-list",
                    action: SimpleMDE.toggleUnorderedList,
                    className: "fa fa-list-ul",
                    title: "Sąrašas",
                },
                {
                    name: "ordered-list",
                    action: SimpleMDE.toggleOrderedList,
                    className: "fa fa-list-ol",
                    title: "Numeruotas sąrašas",
                },
                "|",
                {
                    name: "link",
                    action: SimpleMDE.drawLink,
                    className: "fa fa-link",
                    title: "Nuoroda",
                },
                {
                    name: "image",
                    action: SimpleMDE.drawImage,
                    className: "fa fa-image",
                    title: "Paveikslėlis",
                },
                {
                    name: "table",
                    action: SimpleMDE.drawTable,
                    className: "fa fa-table",
                    title: "Lentelė",
                },
                "|",
                {
                    name: "preview",
                    action: SimpleMDE.togglePreview,
                    className: "fa fa-eye no-disable",
                    title: "Peržiūra",
                }
            ]
        } as SimpleMde.Options;
    }, []);

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.images) {
                        const logoData = data.images.image.data
                        const base64String = Buffer.from(logoData).toString('base64');
                        const modifiedProject = {
                            ...data,
                            logo: `data:image/jpeg;base64,${base64String}`
                        };
                        setProject(modifiedProject);
                    } else {
                        console.error("No image data found");
                        setProject(data);
                    }
                })
                .catch(console.error);
        }
    }, [projectId]);

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
            user_id: 1 // TODO: Get user id from session
        }

        try {
            const response = await fetch(`/api/project/${projectId}/issues/new`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(issueData)
            });

            if (response.ok) {
                const result = await response.json();
                window.location.href = `/project/${projectId}/issue`; // TODO: Add success message
            } else {
                return new NextResponse(JSON.stringify({ message: "Error creating issue", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        } catch (error) {
            return new NextResponse(JSON.stringify({ message: "Network error", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center w-full max-w-5xl">
            {project ? (
                <>
                    <div className="px-6 py-5 rounded-xl border-2 border-gray-100 bg-white w-full">
                        <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center w-full">
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
                            <SimpleMdeReact
                                className='w-full'
                                autoFocus={true}
                                value={issueDescription}
                                onChange={onMarkdownChange}
                                options={MarkdownSettings}
                            />
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

                            <button
                                type="submit"
                                className="py-2 px-4 rounded-lg text-black bg-[#40C173] hover:bg-green-700 transition duration-150 ease-in-out mt-4"
                            >
                                Pridėti
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div>Kraunama...</div>
            )}
        </div>
    );
}