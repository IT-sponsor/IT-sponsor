"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { NextResponse } from "next/server";

export default function EditProjectPage({ params }: { params: { id: number } }) {
    const [project, setProject] = useState({
        name: '',
        short_description: '',
        long_description: '',
        repository: '',
        technologies: '',
    });
    const [formErrors, setFormErrors] = useState({});
    const projectId = params.id;

    useEffect(() => {
        const fetchProject = async () => {
            const response = await fetch(`/api/project/${projectId}`);
            if (response.ok) {
                const projectData = await response.json();
                setProject(projectData);
            }
        };
        fetchProject();
    }, [projectId]);

    const validateForm = () => {
        const errors = {};
        if (!project.name.trim()) errors.name = "Projekto pavadinimas yra privalomas.";
        if (!project.short_description.trim()) errors.shortDescription = "Trumpas aprašymas yra privalomas.";
        if (!project.repository.trim()) errors.repository = "Repositorijos nuoroda yra būtina.";
        if (!project.technologies.trim()) errors.technologies = "Technologijos yra privalomos.";
        if (!project.long_description.trim()) errors.longDescription = "Pilnas aprašymas yra privalomas.";
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            const response = await fetch(`/api/project/${projectId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project),
            });
            if (!response.ok) {
                throw new Error(`Failed to update project: ${response.statusText}`);
            }
            const updatedProject = await response.json();
            window.location.href = `/project/${updatedProject.id}`;
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
                    <label htmlFor="projectName" className="block text-gray-700 font-bold">Pavadinimas</label>
                    <input type="text" id="projectName" placeholder="Pavadinimas" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500" value={project.name} onChange={(e) => setProject({ ...project, name: e.target.value })} />
                    {formErrors.name && <div className="text-red-500">{formErrors.name}</div>}

                    <label htmlFor="shortDescription" className="block text-gray-700 font-bold">Trumpas aprašymas</label>
                    <input type="text" id="shortDescription" placeholder="Trumpas aprašymas" className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500" value={project.short_description} onChange={(e) => setProject({ ...project, short_description: e.target.value })} />
                    {formErrors.shortDescription && <div className="text-red-500">{formErrors.shortDescription}</div>}

                    <label htmlFor="repository" className="block text-gray-700 font-bold">Repozitorijos nuoroda</label>
                    <input type="text" id="repository" placeholder="https://..." className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500" value={project.repository} onChange={(e) => setProject({ ...project, repository: e.target.value })} />
                    {formErrors.repository && <div className="text-red-500">{formErrors.repository}</div>}

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
                    <textarea
                        id="fullDescription"
                        placeholder="Pilnas aprašymas"
                        className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                        value={project.long_description}
                        onChange={(e) => setProject({ ...project, long_description: e.target.value })}
                    ></textarea>
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
