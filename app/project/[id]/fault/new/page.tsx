"use client";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
import { NextResponse } from "next/server";
import { title } from "process";
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
    replication_steps: string;
    fix_info: string;
    severity: string;
    status: string;
    id_project: number; // Project that the fault is associated with
    user_id: number;    // User that reported the fault
}

export default function newFaultPage({ params }: {
    params: { id: number }
}) {
    const [project, setProject] = useState<Project>();
    const projectId = params.id;

    const [faultTitle, setFaultTitle] = useState<string>("");
    const [faultDescription, setFaultDescription] = useState<string>("");
    const [faultSeverity, setFaultSeverity] = useState<string>("low");
    const [formErrors, setFormErrors] = useState<any>({});

    useEffect(() => {
        if (projectId) {
          fetch(`/api/project/${projectId}`)
            .then(res => res.json())
            .then(data => {
              if (data && data.images.image.data) {
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

    const defaultDescription = "# Atkūrimo veiksmai:\n...\n# Tikėtinas rezultatas:\n...\n# Realus rezultatas:\n...";
    const formattedDefaultDescription = defaultDescription.split("\n").map((item, key) => {
        return <span key={key}>{item}<br /></span>
    });

    faultDescription === "" && setFaultDescription(defaultDescription);

    const formValidated = () => {
        const errors = {};
        
        if(!faultTitle.trim()) errors.faultTitle = "Pavadinimas negali būti tuščias.";
        if(!faultDescription.trim()) errors.faultDescription = "Aprašymas negali būti tuščias.";
        if(!faultSeverity.trim()) errors.faultSeverity = "Svarbumas negali būti tuščias.";

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if(!formValidated()) return;

        const faultData = {
            title: faultTitle,
            description: faultDescription,
            severity: faultSeverity,
            status: "open",
            id_project: Number(projectId),
            user_id: 1 // TODO: Get user id from session
        }

        try {
            const response = await fetch(`/api/project/${projectId}/faults/new`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(faultData)
            });

            if (response.ok) {
                const result = await response.json();
                window.location.href = `/project/${projectId}`; // TODO: Add success message
            } else {
                return new NextResponse(JSON.stringify({ message: "Error creating fault", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
            }
        } catch (error) {
            return new NextResponse(JSON.stringify({ message: "Network error", error: error.message }), { status: 500, headers: { "Content-Type": "application/json" } });
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            {project ? (
                <>

                    <div className="px-6 py-5 rounded-xl border-2 border-gray-100 bg-white">
                        <h1 className="text-2xl font-bold text-gray-800 text-center">Pranešti apie klaidą</h1>
                        <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center w-[800px]">
                            <label htmlFor="title" className="block text-gray-800 font-bold">Pavadinimas</label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Pavadinimas"
                                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                                value={faultTitle} onChange={(e) => setFaultTitle(e.target.value)}
                            />
                            {formErrors.faultTitle && <div className="text-red-500">{formErrors.faultTitle}</div>}

                            <label htmlFor="description" className="block text-gray-800 font-bold mt-4">Aprašymas</label>
                            <textarea
                                id="description"
                                placeholder="Atkūrimo veiksmai"
                                rows={10}
                                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                                value={faultDescription} onChange={(e) => setFaultDescription(e.target.value)}
                            >
                            </textarea>
                            {formErrors.faultDescription && <div className="text-red-500">{formErrors.faultDescription}</div>}


                            <label htmlFor="severity" className="block text-gray-800 font-bold mt-4">Svarbumas</label>
                            <select
                                id="severity"
                                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                                value={faultSeverity} onChange={(e) => setFaultSeverity(e.target.value)}
                            >
                                <option value="low">Žemas</option>
                                <option value="medium">Vidutinis</option>
                                <option value="high">Aukštas</option>
                            </select>
                            {formErrors.faultSeverity && <div className="text-red-500">{formErrors.faultSeverity}</div>}

                            <button
                                type="submit"
                                className="py-2 px-4 rounded-lg text-black bg-[#40C173] hover:bg-green-700 transition duration-150 ease-in-out mt-4"
                            >
                                Pranešti
                            </button>
                        </form>
                    </div>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}