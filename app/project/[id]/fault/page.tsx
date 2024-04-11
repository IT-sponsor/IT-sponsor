"use client";
import defaultUserPhoto from '@/public/assets/defaultUser.jpg';
import FaultCardSmall from '@/app/components/Fault/Cards/FaultCardSmall';
import { useState, useEffect } from 'react';

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
    users: {
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

export default function FaultPage({ params }: {
    params: { id: number }
}) {
    const [faults, setFaults] = useState<Fault[] | null>(null);

    const projectId = params.id;

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}/faults`)
                .then(res => res.json())
                .then(data => {
                    setFaults(data);
                })
                .catch(console.error);
        }
    }, [projectId]);

    return (
        <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl'>
            {faults?.length ? (
                faults.map((fault, index) => (
                    <div className='flex flex-col items-center justify-center w-full overflow-y-auto' key={index}>
                        <FaultCardSmall
                            id={fault.id}
                            title={fault.title}
                            description={fault.description}
                            severity={fault.severity}
                            status={fault.status}
                            created_at={new Date(fault.created_at).toLocaleDateString()}
                            first_name={fault.users.first_name}
                            last_name={fault.users.last_name}
                        />
                    </div>
                ))
            ) : (
                <div>Projektas neturi klaidų pranešimų</div>
            )}
        </div>
    );
}