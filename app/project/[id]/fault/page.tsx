"use client";
import ProjectCard from '@/app/components/ProjectCard/ProjectCard';
import FaultCardSmall from '@/app/components/Fault/Cards/FaultCardSmall';
import exp from 'constants';
import { useState, useEffect } from 'react';

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

export default function FaultPage({ params }: {
    params: { id: number }
}) {
    const [project, setProject] = useState<Project>();
    //const [faults, setFaults] = useState<Fault[] | null>(null);

    const projectId = params.id;

    const faults = [
        {
            id: 1,
            title: 'Null Pointer Exception',
            created_at: '2021-10-15',
            description: 'When clicking on the submit button, the application crashes with a null pointer exception. When clicking on the submit button, the application crashes with a null pointer exception.',
            replication_steps: '1. Open the application\n2. Navigate to the form page\n3. Fill in the required fields\n4. Click on the submit button',
            fix_info: 'The issue is caused by accessing a null object. To fix it, check for null values before accessing the object and handle the case appropriately.',
            severity: 'Kritinė',
            status: 'Atviras',
            id_project: 1,
            user_id: 1
        },
        {
            id: 2,
            title: 'Incorrect Calculation',
            created_at: '2021-10-16',
            description: 'The calculation for the total price is incorrect. It is not taking into account the discount applied.',
            replication_steps: '1. Add items to the cart\n2. Apply a discount code\n3. Proceed to checkout\n4. Check the total price',
            fix_info: 'The issue is caused by not considering the discount when calculating the total price. To fix it, apply the discount before calculating the total price.',
            severity: 'Kritinė',
            status: 'Atviras',
            id_project: 1,
            user_id: 1
        },
        {
            id: 3,
            title: 'Incorrect Calculation',
            created_at: '2021-10-16',
            description: 'The calculation for the total price is incorrect. It is not taking into account the discount applied.The calculation for the total price is incorrect. It is not taking into account the discount applied.The calculation for the total price is incorrect. It is not taking into account the discount applied.The calculation for the total price is incorrect. It is not taking into account the discount applied.',
            replication_steps: '1. Add items to the cart\n2. Apply a discount code\n3. Proceed to checkout\n4. Check the total price',
            fix_info: 'The issue is caused by not considering the discount when calculating the total price. To fix it, apply the discount before calculating the total price.',
            severity: 'Kritinė',
            status: 'Atviras',
            id_project: 1,
            user_id: 1
        },
    ];

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
        <div className='flex flex-col items-center justify-center p-6'>
            {project ? (
                <>
                    <div className='p-2 w-[800px] max-h-60'>
                        <ProjectCard
                            image_url={project.logo}
                            title={project.name}
                            description={project.short_description}
                            timeUpdated={project.updated_at}
                            issueCount={0}
                            volunteerCount={0}
                            tags={project.technology.split(' ')}
                        />
                    </div>

                    {/* List of faults */}
                    <div className='flex flex-col items-center justify-center w-[1200px]'>
                        <h1 className='text-2xl font-bold'>Pranešimai apie klaidas</h1>
                        {faults ? (
                            faults.map((fault) => (
                                <FaultCardSmall
                                    id={fault.id}
                                    title={fault.title}
                                    description={fault.description}
                                    severity={fault.severity}
                                    status={fault.status}
                                    reporter_id={fault.user_id}
                                    created_at={fault.created_at}
                                />
                            ))
                        ) : (
                            <div>Loading...</div>
                        )}
                    </div>
                </>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
}