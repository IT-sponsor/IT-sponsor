"use client";
import UserDefault from '@/public/assets/defaultUser.jpg';
import FaultCardSmall from '@/app/components/Fault/Cards/FaultCardSmall';
import { useState, useEffect } from 'react';
import Spinner from '@/app/components/Loading/Spinner';
import { useSession } from 'next-auth/react';

interface Fault {
    id: number;
    title: string;
    created_at: string;
    description: string;
    replication_steps: string;
    fix_info: string;
    severity: string;
    status: string;
    id_project: number;
    users: {
        id: number;
        first_name: string;
        last_name: string;
        logo: string;
    };
}

export default function FaultPage({ params }: {
    params: { id: number }
}) {
    const [faults, setFaults] = useState<Fault[]>([]);
    const [loading, setLoading] = useState(true);
    const [canAccessAll, setCanAccessAll] = useState(false);
    const { data: session } = useSession();

    const projectId = params.id;

    useEffect(() => {
        if (projectId) {
            fetch(`/api/project/${projectId}/faults`)
                .then(res => res.json())
                .then(data => {
                    const processedFaults = data.map((fault: Fault) => {
                        const user = fault.users;
                        if (user.images && user.images.image && user.images.image.data) {
                            const logoData = user.images.image.data;
                            const base64String = Buffer.from(logoData).toString('base64');
                            user.logo = `data:image/jpeg;base64,${base64String}`;
                        } else {
                            user.logo = UserDefault.src;
                        }
                        return fault;
                    });

                    setFaults(processedFaults);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [projectId]);

    useEffect(() => {
        const fetchAccess = async () => {
            try {
                const response = await fetch(`/api/controls/${projectId}`);
                const data = await response.json();
                if (data.length > 0) {
                    const ownerId = data[0].fk_usersid.toString();
                    const hasAccess = ownerId === session?.user?.id;
                    setCanAccessAll(hasAccess);
                }
            } catch (error) {
                console.error('Error fetching controls:', error);
            }
        };
        fetchAccess();
    }, [projectId, session]);
    
    return (
        <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl'>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {faults.length > 0 ? (
                        canAccessAll ? (
                            faults.map(fault => (
                                <div className='flex flex-col items-center justify-center w-full overflow-y-auto' key={fault.id}>
                                    <FaultCardSmall
                                        id={fault.id}
                                        title={fault.title}
                                        description={fault.description}
                                        severity={fault.severity}
                                        status={fault.status}
                                        created_at={new Date(fault.created_at).toLocaleDateString()}
                                        first_name={fault.users.first_name}
                                        last_name={fault.users.last_name}
                                        profile_picture={fault.users.logo}
                                    />
                                </div>
                            ))
                        ) : (
                            faults
                            .filter(fault => fault.users.id === Number(session?.user?.id))
                            .map(fault => (
                                <div className='flex flex-col items-center justify-center w-full overflow-y-auto' key={fault.id}>
                                    <FaultCardSmall
                                        id={fault.id}
                                        title={fault.title}
                                        description={fault.description}
                                        severity={fault.severity}
                                        status={fault.status}
                                        created_at={new Date(fault.created_at).toLocaleDateString()}
                                        first_name={fault.users.first_name}
                                        last_name={fault.users.last_name}
                                        profile_picture={fault.users.logo}
                                    />
                                </div>
                            ))
                        )
                    ) : (
                        <div>Projektas neturi klaidų pranešimų</div>
                    )}
                </>
            )}
        </div>
    );
}
