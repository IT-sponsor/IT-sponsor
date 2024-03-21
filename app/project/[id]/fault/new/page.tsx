"use client";
import ProjectCard from "@/app/components/ProjectCard/ProjectCard";
import { useState, useEffect } from "react";

interface Project {
  id: number;
  name: string;
  short_description: string;
  long_description: string;
  repository: string;
  technology: string;
  created_at: string;
  updated_at: string;
  star_count: number;
  contributor_count: number;
  codebase_visibility: string;

  logo: string;
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

    useEffect(() => {
        if (projectId !== undefined) {
            fetch(`/api/project/${projectId}`)
                .then(res => res.json())
                .then(data => {
                    if (data && data.image && data.image.image_blob && data.image.image_blob.data) {
                        const logoData = data.image.image_blob.data
                        const base64String = Buffer.from(logoData).toString('base64');
                        const modifiedProject = {
                            ...data,
                            logo: `data:image/jpeg;base64,${base64String}`
                        };
                        setProject(modifiedProject);
                    } else {
                        setProject(data);
                    }
                })
                .catch(console.error);
        }
    }, [projectId]);

    const defaultDescription = "# Atkūrimo veiksmai:\n...\n# Tikėtinas rezultatas:\n...\n# Realus rezultatas:\n...";
    const formattedDefaultDescription = defaultDescription.split("\n").map((item, key) => {
        return <span key={key}>{item}<br/></span>
    });

    return (
        <div className="flex flex-col items-center justify-center p-6">
            {project ? (
                <>
                    <div className="p-2 w-[800px] max-h-60">
                        <ProjectCard
                            image_url={project.logo}
                            title={project.name}
                            description={project.short_description}
                            timeUpdated={project.updated_at}
                            issueCount={0}
                            volunteerCount={0}
                            tags={project.technology.split(" ")}
                        />
                    </div>

                    <div className="px-6 py-5 rounded-xl border-2 border-gray-100 bg-white">
                        <h1 className="text-2xl font-bold text-gray-800 text-center">Pranešti apie klaidą</h1>
                        <form className="flex flex-col items-start justify-center w-[800px]">
                            <label htmlFor="title" className="block text-gray-800 font-bold">Pavadinimas</label>
                            <input
                                type="text"
                                id="title"
                                placeholder="Pavadinimas"
                                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                            />

                            <label htmlFor="description" className="block text-gray-800 font-bold mt-4">Aprašymas</label>
                            <textarea
                                id="description"
                                placeholder="Atkūrimo veiksmai"
                                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                                defaultValue={defaultDescription}
                            >
                            </textarea>
                            

                            <label htmlFor="notes" className="block text-gray-800 font-bold mt-4">Svarbumas</label>
                            <select
                                id="notes"
                                className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
                            >
                                <option value="low">Žemas</option>
                                <option value="medium">Vidutinis</option>
                                <option value="high">Aukštas</option>
                            </select>

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