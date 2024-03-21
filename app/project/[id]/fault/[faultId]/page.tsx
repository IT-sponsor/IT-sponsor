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

export default function viewFaultPage({ params }: {
    params: { id: number, faultId: number }
}) {
    const [project, setProject] = useState<Project>();
    //const [fault, setFault] = useState<Fault>();
    const projectId = params.id;
    const faultId = params.faultId;
    console.log("Project ID: ", projectId);
    console.log("Fault ID: ", faultId);

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
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-4 mt-4">
                            <div className="px-4 py-5 sm:px-6">
                                <h2 className="text-lg leading-6 font-medium text-gray-900">Labai idomus pavadinimas</h2>
                            </div>
                            <div className="border-t border-gray-200">
                                <dl>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Atkūrimo veiksmai</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                                            1. Detalus atkurimo veiksmas<br />
                                            2. Detalus atkurimo veiksmas
                                        </dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Tikėtinas rezultatas</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Taip turėjo būti</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Realus rezultatas</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Ištikruju gavau taip</dd>
                                    </div>
                                    <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Svarbumas</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Aukštas</dd>
                                    </div>
                                    <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                        <dt className="text-sm font-medium text-gray-500">Statusas</dt>
                                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">Aktyvus</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    )
}