"use client";

import { useState, useEffect } from "react";
import Profile from "@/app/components/Profile/Profile";

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

export default function ProfilePage({ params }: {
    params: { id: number }
}) {
    const [user, setUser] = useState<Profile | null>(null);
    const userId = params.id;

    useEffect(() => {
        fetchUserData();
    }, []);

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

    return (
        <div>
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
                    />
                </>
            ) : (
                <div>Kraunama...</div>
            )}
        </div>
    );
}
