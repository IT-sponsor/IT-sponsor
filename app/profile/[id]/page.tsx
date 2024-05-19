"use client";
import UserDefault from '@/public/assets/defaultUser.jpg';
import { useState, useEffect } from "react";
import Profile from "@/app/components/Profile/Profile";
import Spinner from '@/app/components/Loading/Spinner';
import { useRouter } from 'next/navigation';

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
    logo: string;
}

export default function ProfilePage({ params }: {
    params: { id: number }
}) {
    const router = useRouter();
    const [user, setUser] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);
    const userId = params.id;

    useEffect(() => {
        if (userId && !isNaN(Number(userId))) {
            fetch(`/api/profile/${userId}`)
                .then(res => {
                    if (res.status === 404) {
                        console.error("Profile with id", userId, "not found");
                        router.replace('/404');
                    }
                    return res.json();
                })
                .then(data => {
                    if (data && data.images) {
                        const logoData = data.images.image.data
                        const base64String = Buffer.from(logoData).toString('base64');
                        const modifiedUser = {
                            ...data,
                            logo: `data:image/jpeg;base64,${base64String}`
                        };
                        setTimeout(() => {
                            setUser(modifiedUser);
                            setLoading(false);
                        }, 500);
                    } else {
                        console.error("No image data found");
                        const modifiedUser = {
                            ...data,
                            logo: UserDefault.src
                        };
                        setTimeout(() => {
                            setUser(modifiedUser);
                            setLoading(false);
                        }, 500);
                    }
                })
                .catch(console.error);
        } else {
            console.error("Invalid profile id:", userId);
            router.replace('/404');
        }
    }, [userId]);

    return (
        <div className='w-full flex flex-col justify-center items-center'>
            {loading ? (
                <div className='mt-5'>
                    <Spinner />
                </div>
            ) : (
                <>
                    {user ? (
                        <>
                            <Profile
                                id={userId}
                                first_name={user.first_name}
                                last_name={user.last_name}
                                email={user.email}
                                github={user.github}
                                linkedin={user.linkedin}
                                phone_number={user.phone_number}
                                job_title={user.job_title}
                                about_me={user.about_me}
                                technologies={user.technologies ? user.technologies.split(' ') : null as unknown as string[]}
                                experience={user.experience ? user.experience.split(',') : null as unknown as string[]}
                                education={user.education ? user.education.split(',') : null as unknown as string[]}
                                profile_picture={user.logo}
                            />
                        </>
                    ) : (
                        <div className='rounded-xl border-2 border-gray-100 w-full max-w-5xl p-10'>
                            <h1 className='text-2xl font-bold'>Nepavyko užkrauti duomenų. Pabandykite iš naujo</h1>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}