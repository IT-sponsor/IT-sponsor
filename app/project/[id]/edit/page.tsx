"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { NextResponse } from "next/server";
import MarkdownEditor from "@/app/components/MarkdownEditor/MarkdownEditor";
import { useRouter } from "next/navigation";

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

export default function EditProjectPage({ params }: { params: { id: number } }) {
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [formErrors, setFormErrors] = useState<Record<string, any>>({});
    const projectId = params.id;

    useEffect(() => {
        const fetchProject = async () => {
            const response = await fetch(`/api/project/${projectId}`);
            if (response.ok) {
                const projectData = await response.json();
                setProject(projectData);
                // This is the easiest way I could think of converting Buffer data to a File object
                // NOTE: This is dumb, we need to stop saving images in the database
                const blob = new Blob([new Uint8Array(projectData.images.image.data)], { type: projectData.images.image.contentType });
                const file = new File([blob], 'ProjectImage.png', { type: projectData.images.image.contentType });

                setImage(file);
            }
        };

        fetchProject();
    }, [projectId]);

    const validateForm = () => {
        const errors: Record<string, any> = {};
        if (!project?.name.trim()) errors.name = "Projekto pavadinimas yra privalomas.";
        if (!project?.short_description.trim()) errors.shortDescription = "Trumpas aprašymas yra privalomas.";
        if (!project?.repository.trim()) errors.repository = "Repositorijos nuoroda yra būtina.";
        if (!project?.technologies.trim()) errors.technologies = "Technologijos yra privalomos.";
        if (!project?.long_description.trim()) errors.longDescription = "Pilnas aprašymas yra privalomas.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const validateFile = (file: File) => {
        if (!['image/jpeg', 'image/png'].includes(file.type)) {
            setFormErrors({ ...formErrors, image: 'Nuotrauka turi būti JPG arba PNG formato.' });
            return false;
        }

        if (file.size > 2 * 1024 * 1024) {
            setFormErrors({ ...formErrors, image: 'Nuotrauka turi būti mažesnė nei 2mb.' });
            return false;
        }

        return true;
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setImage(file);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        if (!validateForm()) return;
        if (image && !validateFile(image)) return;
        if (!project) return;

        const projectData = new FormData();
        projectData.append('name', project.name);
        projectData.append('short_description', project.short_description);
        projectData.append('long_description', project.long_description);
        projectData.append('repository', project.repository);
        projectData.append('technologies', project.technologies);
        projectData.append('codebase_visibility', project.codebase_visibility);
        if (image) projectData.append('image', image);

        try {
            const response = await fetch(`/api/project/${projectId}`, {
                method: 'PUT',
                body: projectData
            });
            if (!response.ok) {
                throw new Error(`Failed to update project: ${response.statusText}`);
            }
            const updatedProject = await response.json();
            router.push(`/project/${updatedProject.project.id}`);
        } catch (error) {
            setFormErrors({ ...formErrors, api: error.message });
        }
    };

    if (!project) {
        return <div className="flex justify-center items-center" style={{ height: '100vh' }}>Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <div className="px-6 py-5 rounded-xl border-2 border-gray-100 bg-white" style={{ width: '800px' }}>
                <h1 className="text-2xl font-bold text-gray-800 text-center">Redaguoti projektą</h1>
                <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center w-full">

                    {formErrors.image && <div className="text-center text-red-500">{formErrors.image}</div>}
                    <div id="image-preview" className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer mt-2">
                        {image && (
                            <label htmlFor="upload" className="cursor-pointer">
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt='project image'
                                    className="max-h-48 rounded-lg mx-auto"
                                />
                            </label>
                        ) || (
                                <>
                                    <label htmlFor="upload" className="cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-8 h-8 text-gray-700 mx-auto mb-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">Įkelti nuotrauką</h5>
                                        <p className="font-normal text-sm text-gray-400 md:px-6">Pasirinkite nuotrauką, kurios dydis būtų mažesnis nei <b className="text-gray-600">2mb</b></p>
                                        <p className="font-normal text-sm text-gray-400 md:px-6">leidžiami <b className="text-gray-600">JPG arba PNG</b> formatai.</p>
                                        <span id="filename" className="text-gray-500 bg-gray-200 z-50"></span>
                                    </label>
                                </>
                            )}
                    </div>
                    <input id="upload" type="file" accept='image/jpeg, image/png' onChange={handleFileChange} className="hidden" />

                    <label htmlFor="projectName" className="block text-gray-700 font-bold">Pavadinimas</label>
                    <input type="text" id="projectName" placeholder="Pavadinimas" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500" value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} />
                    {formErrors.name && <div className="text-red-500">{formErrors.name}</div>}

                    <label htmlFor="shortDescription" className="block text-gray-700 font-bold">Trumpas aprašymas</label>
                    <input type="text" id="shortDescription" placeholder="Trumpas aprašymas" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500" value={project.short_description} onChange={(e) => setProject({ ...project, short_description: e.target.value })} />
                    {formErrors.shortDescription && <div className="text-red-500">{formErrors.shortDescription}</div>}

                    <label htmlFor="repository" className="block text-gray-700 font-bold">Repozitorijos nuoroda</label>
                    <input type="text" id="repository" placeholder="https://..." className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500" value={project.repository} onChange={(e) => setProject({ ...project, repository: e.target.value })} />
                    {formErrors.repository && <div className="text-red-500">{formErrors.repository}</div>}

                    <label htmlFor="codebase_visibility" className="block text-gray-800 font-bold mt-4">Repozitorijos matomumas</label>
                    <select
                        id="codebase_visibility"
                        className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                        value={project.codebase_visibility} onChange={(e) => setProject({ ...project, codebase_visibility: e.target.value })}
                    >
                        <option value="public">Vieša</option>
                        <option value="private">Privati</option>
                    </select>

                    <label htmlFor="technologies" className="block text-gray-700 font-bold">Technologijos (atskirkite tarpais)</label>
                    <input
                        type="text"
                        id="technologies"
                        placeholder="Technologijos"
                        className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500"
                        value={project.technologies}
                        onChange={(e) => setProject({ ...project, technologies: e.target.value })}
                    />
                    {formErrors.technologies && <div className="text-red-500">{formErrors.technologies}</div>}

                    <label htmlFor="fullDescription" className="block text-gray-700 font-bold">Pilnas aprašymas</label>
                    <MarkdownEditor markdownText={project.long_description} setMarkdownText={(value) => setProject({ ...project, long_description: value })} />
                    {formErrors.longDescription && <div className="text-red-500">{formErrors.longDescription}</div>}

                    <div className="mt-4 flex justify-between items-center w-full">
                        <Link href="/" legacyBehavior>
                            <a className="py-2 px-4 rounded-lg text-black bg-[#C14040] hover:bg-red-700 transition duration-150 ease-in-out">Atšaukti</a>
                        </Link>
                        <button type="submit" className="py-2 px-4 rounded-lg text-black bg-[#40C173] hover:bg-green-700 transition duration-150 ease-in-out">Išsaugoti</button>
                    </div>
                </form>
            </div>
        </div>
    );
};
