"use client";
import { useState, useEffect } from 'react';
import FaultCardSmall from '@/app/components/Fault/Cards/FaultCardSmall';
import Link from 'next/link';
import Spinner from '@/app/components/Loading/Spinner';

interface Profile {
    first_name: String;
    last_name: String;
    email: String;
    github: string;
    linkedin: string;
    phone_number: string;
    job_title: String;
    about_me: String;
    technologies: String;
    experience: String;
    education: String;
}

interface Fault {
    id: number
    title: string
    created_at: string
    description: string
    replication_steps: string
    fix_info: string
    severity: string
    status: string
    fk_projectsid: number;
    users: {
        id: number
        first_name: string
        last_name: string
        logo: string
        images: {
            image: {
                data: Buffer
            }
        }
    }
}

export default function MyFaults({ params }: {
    params: { id: number }
}) {
    const [user, setUser] = useState<Profile | null>(null);
    const [faults, setFaults] = useState<Fault[] | null>(null);
    const userId = params.id;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`/api/profile/${userId}`);
                if (response.ok) {
                    const profileData = await response.json();
                    setUser(profileData);
                } else {
                    console.error('Failed to fetch profile data');
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
            }
        };
        const fetchUserCreatedFaults = async () => {
            try {
                const response = await fetch(`/api/user/${userId}/createdFaults`);
                if (response.ok) {
                    const createdFaults = await response.json();
                    setFaults(createdFaults);
                    setLoading(false);
                } else {
                    console.error('Failed to fetch created faults');
                }
            } catch (error) {
                console.error('Error fetching created faults:', error);
            }
        };
        fetchUserData();
        fetchUserCreatedFaults();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center pt-6 w-full ">
            <h1 className='text-xl font-bold'>Mano sukurtos klaidos</h1>
            {loading ? (
                <Spinner />
            ) : (
                <>
                    {faults?.length ? (
                        faults.map((fault, index) => (
                            <Link href={`/project/${fault.fk_projectsid}/fault/${fault.id}`} className='flex flex-col items-center justify-center w-full overflow-y-auto max-w-5xl' key={index}>
                                <FaultCardSmall
                                    id={fault.id}
                                    title={fault.title}
                                    description={fault.description}
                                    severity={fault.severity}
                                    status={fault.status}
                                    created_at={new Date(
                                        fault.created_at,
                                    ).toLocaleDateString()}
                                    first_name={fault.users.first_name}
                                    last_name={fault.users.last_name}
                                />
                            </Link>
                        ))
                    ) : (
                        <div>Neturite sukurtų klaidų</div>
                    )}
                </>
            )}
        </div>
    );
}