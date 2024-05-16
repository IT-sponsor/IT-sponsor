"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

interface ProfileProps {
    id: Number;
    first_name: String;
    last_name: String;
    email: String;
    github: string;
    linkedin: string;
    phone_number: string;
    job_title: String;
    about_me: String;
    technologies: String[];
    experience: String[];
    education: String[];
    profile_picture: string
}

const Profile = ({
    id,
    first_name,
    last_name,
    email,
    github,
    linkedin,
    phone_number,
    job_title,
    about_me,
    technologies,
    experience,
    education,
    profile_picture
}: ProfileProps) => {
    const { data: session } = useSession();
    let formattedPhoneNumber = null;
    if (phone_number) {
        formattedPhoneNumber = `+${phone_number.slice(0, 3)} ${phone_number.slice(3, 6)}  ${phone_number.slice(6, 8)}  ${phone_number.slice(8)}`;
      }
    return (
        <div className="container mx-auto py-8 px-8">
            <div className="grid grid-cols-4 sm:grid-cols-12 gap-6 px-4">
                <div className="col-span-4 sm:col-span-3">
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="flex flex-col items-center">
                            <img src={profile_picture} alt={`${first_name} ${last_name}`} className="content-center w-32 h-32 bg-gray-300 rounded-full mb-4 shrink-0">
                            </img>
                            <h1 className="text-xl font-bold">{first_name} {last_name}</h1>
                            {job_title && <p className="text-gray-700">{job_title}</p>}
                            {formattedPhoneNumber && <p className="text-blue-700 pt-2">{formattedPhoneNumber}</p>}
                            <div className="mt-6 flex flex-wrap gap-4 justify-center">
                                <a href={`mailto:${email}`} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">Susisiekti</a>
                                {github && <a href={`https://github.com/${github}`} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded" target="_blank" rel="noopener noreferrer">GitHub</a>}
                                {linkedin && <a href={`https://linkedin.com/in/${linkedin}`} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded" target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                            </div>
                        </div>
                        <hr className="my-6 border-t border-gray-300"></hr>
                        {session?.user.id === id && (
                            <div className="flex justify-center">
                                <a href={'/profile/' + session?.user.id + '/edit'} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded">Redaguoti</a>
                                <Link href={'/profile/' + session?.user.id + '/issues'} className="bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 mx-2 rounded">Mano užduotys</Link>
                            </div>
                        )}
                    </div>
                </div>

                <div className="col-span-4 sm:col-span-9">
                    <div className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Apie mane</h2>
                        {about_me ? (
                            <p className="text-gray-700">{about_me}</p>
                        ) : (
                            <p className="text-gray-700">Šis vartotojas dar nėra pateikęs savo aprašymo.</p>
                        )}
                    </div>
                    <div className="my-4"></div>
                    <div className="bg-white shadow rounded-lg p-6">
                        <div className="mb-4">
                            <span className="text-xl font-bold mb-4">Įgūdžiai</span>
                        </div>
                        {technologies ? (
                            <div>
                                {technologies.map((tags, index) => (
                                    <span key={index} className="whitespace-nowrap rounded-full bg-purple-100 mr-4 mb-2 px-2.5 py-0.5 text-l text-purple-700">
                                        {tags}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-gray-700">Šis vartotojas dar nėra pateikęs technologijų, kurias išmano.</div>
                        )}
                    </div>

                    <div className="my-4"></div>

                    {(experience || education) && (
                        <div className="col-span-4 sm:col-span-9">
                            <div className="bg-white shadow rounded-lg p-6">
                                <div className="grid grid-cols-2">
                                    <div>
                                        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                            <span className="text-xl font-bold mb-4">Darbo patirtis</span>
                                        </div>
                                        {experience ? (
                                            <ul className="list-inside space-y-2">
                                                {experience.map((tags, index) => (
                                                    <li key={index} className="mr-4 mb-2 px-2.5 py-0.5 text-l text-teal-600">
                                                        {tags}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-gray-700">Nepateikta.</div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-2 font-semibold text-gray-900 leading-8 mb-3">
                                            <span className="text-xl font-bold mb-4">Išsilavinimas</span>
                                        </div>
                                        {education ? (
                                            <ul className="list-inside space-y-2">
                                                {education.map((tags, index) => (
                                                    <li key={index} className="mr-4 mb-2 px-2.5 py-0.5 text-l text-teal-600">
                                                        {tags}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <div className="text-gray-700">Nepateikta.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;