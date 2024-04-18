"use client";
import { useEffect, useState } from "react";

interface Profile {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    github: string;
    job_title: string;
    about_me: string;
    technologies: string;
    experience: string;
    education: string;
}

export default function EditProfile({ params }: {
    params: { id: number }
}) {
    const [profileData, setProfileData] = useState<Profile | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const userId = params.id;
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const isValidEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    useEffect(() => {
        fetchUserData();
    }, [userId]);

    const fetchUserData = async () => {
        try {
            const response = await fetch(`/api/profile/${userId}`);
            if (response.ok) {
                const userData = await response.json();
                // Omit the password field from the fetched data
                const { password, ...userDataWithoutPassword } = userData;
                setProfileData(userDataWithoutPassword);

            } else {
                console.error('Failed to fetch user data');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errorsObj: { [key: string]: string } = {};
        if (!profileData?.first_name || profileData.first_name.trim().length === 0) {
            errorsObj['first_name'] = 'Įveskite vardą.';
        }
        if (!profileData?.last_name || profileData.last_name.trim().length === 0) {
            errorsObj['last_name'] = 'Įveskite pavardę.';
        }
        if (!profileData?.email || profileData.email.trim().length === 0) {
            errorsObj['email'] = 'Įveskite el. pašto adresą.';
        } else if (!isValidEmail(profileData.email)) {
            errorsObj['email'] = 'Netinkamas el. pašto adresas.';
        }

        // Check if both password fields are empty
        if (!profileData?.password && !confirmPassword) {
            console.warn('Password was not updated.');
        } else {
            if (!profileData?.password || profileData.password.trim().length < 8) {
                errorsObj['password'] = 'Slaptažodis turi būti bent 8 simbolių ilgio.';
            }
            if (profileData?.password !== confirmPassword) {
                errorsObj['confirmPassword'] = 'Slaptažodžiai turi sutapti.';
            }
        }

        if (Object.keys(errorsObj).length > 0) {
            setErrors(errorsObj);
            return;
        }

        try {
            const response = await fetch(`/api/profile/${userId}/edit`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log(data.message);
                setSubmitSuccess(true);
            } else if (response.status === 409) {
                setSubmitSuccess(false);
                const { message } = await response.json();
                // Handle specific error messages
                if (message === "Email already exists") {
                    setErrors({ ...errors, email: "El. pašto adresas egzistuoja" });
                } else if (message === "GitHub username already exists") {
                    setErrors({ ...errors, github: "Github paskyra egzistuoja" });
                }
            } else {
                setSubmitSuccess(false);
                throw new Error('Failed to update user');
            }
        } catch (error) {
            setSubmitSuccess(false);
            console.error('Error updating user:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === 'confirmPassword') {
            setConfirmPassword(value);

            setErrors(prevErrors => ({
                ...prevErrors,
                confirmPassword: '', // Clear the error message for confirmPassword
            }));
        } else {
            // Update other profile data fields
            setProfileData(prevState => ({
                ...prevState!,
                [name]: value === "" ? null : value, // Save empty fields as null
            }));

            // Clear error message for the specific field being updated
            setErrors(prevErrors => ({
                ...prevErrors,
                [name]: '', // Clear the error message for the specific field
            }));
        }
    };

    return (
        <div>
            {profileData ? (
                <form onSubmit={handleSubmit}>
                    <div className="bg-white shadow rounded-lg px-12">
                        <h2 className="text-xl text-center font-semibold leading-7 text-black-900 mb-5">Profilio redagavimas</h2>
                        <div className="border-b border-gray-900/10">
                            <div className="flex flex-col sm:flex-row justify-center">
                                <div className="w-full sm:w-1/2 border-r border-gray-900/10 pr-3">
                                    <div className="border-b border-gray-900/10 pb-12">
                                        <h2 className="text-base font-semibold leading-7 text-gray-900">Profilio informacija</h2>

                                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                            <div className="col-span-full">
                                                <label htmlFor="photo" className="block text-sm font-medium leading-6 text-gray-900">Nuotrauka</label>
                                                <div className="mt-2 flex items-center gap-x-3">
                                                    <img className="w-28 h-28 bg-gray-300 rounded-full mb-4 shrink-0" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""></img>
                                                    <button type="button" className="rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">Pakeisti</button>
                                                </div>
                                            </div>

                                            <div className="sm:col-span-3">
                                                <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">Vardas</label>
                                                <div className="mt-2">
                                                    <input type="text"
                                                        name="first_name"
                                                        id="first_name"
                                                        autoComplete="first_name"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        defaultValue={profileData?.first_name && profileData?.first_name.toString()}
                                                        onChange={handleChange}>
                                                    </input>
                                                    {errors['first_name'] && <p className="text-red-500 text-sm mt-1">{errors['first_name']}</p>}
                                                </div>
                                            </div>

                                            <div className="sm:col-span-3">
                                                <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">Pavardė</label>
                                                <div className="mt-2">
                                                    <input type="text"
                                                        name="last_name"
                                                        id="last_name"
                                                        autoComplete="last_name"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        defaultValue={profileData?.last_name && profileData?.last_name.toString()}
                                                        onChange={handleChange}>
                                                    </input>
                                                    {errors['last_name'] && <p className="text-red-500 text-sm mt-1">{errors['last_name']}</p>}
                                                </div>
                                            </div>

                                            <div className="sm:col-span-4">
                                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">El. pašto adresas</label>
                                                <div className="mt-2">
                                                    <input id="email"
                                                        name="email"
                                                        type="email"
                                                        autoComplete="email"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        defaultValue={profileData?.email && profileData?.email.toString()}
                                                        onChange={handleChange}>
                                                    </input>
                                                    {errors['email'] && <p className="text-red-500 text-sm mt-1">{errors['email']}</p>}
                                                </div>
                                            </div>

                                            <div className="sm:col-span-full">
                                                <label htmlFor="github" className="block text-sm font-medium leading-6 text-gray-900">Github</label>
                                                <div className="mt-2">
                                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                                        <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">github.com/</span>
                                                        <input type="text"
                                                            name="github"
                                                            id="github"
                                                            autoComplete="github"
                                                            className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                                            placeholder="pavyzdys"
                                                            defaultValue={profileData?.github && profileData?.github.toString()}
                                                            onChange={handleChange}>
                                                        </input>
                                                    </div>
                                                </div>
                                                <p className="mt-1 text-sm leading-6 text-gray-600">Nuoroda į jūsų Github repositoriją.</p>
                                                {errors['github'] && <p className="text-red-500 text-sm mt-1">{errors['github']}</p>}
                                            </div>

                                        </div>
                                    </div>
                                    <div>
                                        <h2 className="text-base font-semibold leading-7 text-gray-900 pt-5">Slaptažodžio keitimas</h2>

                                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">

                                            <div className="sm:col-span-4">
                                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Įveskite naują slaptažodį</label>
                                                <div className="mt-2">
                                                    <input type="password"
                                                        name="password"
                                                        id="password"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        onChange={handleChange}>
                                                    </input>
                                                    {errors['password'] && <p className="text-red-500 text-sm mt-1">{errors['password']}</p>}
                                                </div>
                                            </div>

                                            <div className="sm:col-span-4 pb-8">
                                                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">Pakartokite naują slaptažodį</label>
                                                <div className="mt-2">
                                                    <input type="password"
                                                        name="confirmPassword"
                                                        id="confirmPassword"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        onChange={handleChange}>
                                                    </input>
                                                    {errors['confirmPassword'] && <p className="text-red-500 text-sm mt-1">{errors['confirmPassword']}</p>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full sm:w-1/2 pl-3">
                                    <div>
                                        <h2 className="text-base font-semibold leading-7 text-gray-900">Informacija apie jus</h2>

                                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                                            <div className="col-span-full">
                                                <label htmlFor="about_me" className="block text-sm font-medium leading-6 text-gray-900">Apie mane</label>
                                                <div className="mt-2">
                                                    <textarea id="about_me"
                                                        name="about_me"
                                                        rows={3}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        defaultValue={profileData?.about_me && profileData?.about_me.toString()}
                                                        onChange={handleChange}>
                                                    </textarea>
                                                </div>
                                                <p className="mt-1 text-sm leading-6 text-gray-600">Parašykite keletą sakinių apie save.</p>
                                            </div>

                                            <div className="sm:col-span-4">
                                                <label htmlFor="job_title" className="block text-sm font-medium leading-6 text-gray-900">Profesija</label>
                                                <div className="mt-2">
                                                    <input name="job_title"
                                                        type="job_title"
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        placeholder="pvz., Full-Stack programuotojas, Duomenų analitikas, Studentas"
                                                        defaultValue={profileData?.job_title && profileData?.job_title.toString()}
                                                        onChange={handleChange}>
                                                    </input>
                                                </div>
                                                <p className="mt-1 text-sm leading-6 text-gray-600">Parašykite kokioje IT srityje specializuojatės.</p>
                                            </div>

                                            <div className="col-span-full">
                                                <label htmlFor="technologies" className="block text-sm font-medium leading-6 text-gray-900">Technologijos</label>
                                                <div className="mt-2">
                                                    <textarea id="technologies"
                                                        name="technologies"
                                                        rows={1}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        placeholder="pvz., Javascript C++ MySql"
                                                        defaultValue={profileData?.technologies && profileData?.technologies.toString()}
                                                        onChange={handleChange}>
                                                    </textarea>
                                                </div>
                                                <p className="mt-1 text-sm leading-6 text-gray-600">Parašykite technologijas, kurias išmanote (technologijas atskirti tarpais).</p>
                                            </div>

                                            <div className="col-span-full">
                                                <label htmlFor="experience" className="block text-sm font-medium leading-6 text-gray-900">Darbo patirtis</label>
                                                <div className="mt-2">
                                                    <textarea id="experience"
                                                        name="experience"
                                                        rows={2}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        placeholder="pvz., Python programuotojas Oxylabs, Full-Stack Web programuotojas Intellerts"
                                                        defaultValue={profileData?.experience && profileData?.experience.toString()}
                                                        onChange={handleChange}>
                                                    </textarea>
                                                </div>
                                                <p className="mt-1 text-sm leading-6 text-gray-600">Parašykite savo darbo patirtį, įskaitant užimamas pareigas ir darbo vietą (atskirti kableliais).</p>
                                            </div>

                                            <div className="col-span-full">
                                                <label htmlFor="education" className="block text-sm font-medium leading-6 text-gray-900">Išsilavinimas</label>
                                                <div className="mt-2">
                                                    <textarea id="education"
                                                        name="education"
                                                        rows={2}
                                                        className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                                        placeholder="pvz., Bakalauro laipsnis KTU, Aplikacijų testavimo kursas CodeAcademy, Vidurinis išsilavinimas Kauno Varpo gimnazija"
                                                        defaultValue={profileData?.education && profileData?.education.toString()}
                                                        onChange={handleChange}>
                                                    </textarea>
                                                </div>
                                                <p className="mt-1 text-sm leading-6 text-gray-600">Parašykite savo išsilavinimą, įskaitant išsilavinimo laipsnį ir mokymo įstaigą (atskirti kableliais).</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex content-center items-center justify-center ">
                        {submitSuccess && (
                            <div className="p-4 mb-2 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                                <span className="font-medium">Redagavimas sėkmingas!</span>
                            </div>
                        )}
                        </div>
                        <div className="mt-2 flex items-center justify-center gap-x-6 pb-10">
                            <button type="submit" className="rounded-lg text-black bg-[#40C173] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Išsaugoti</button>
                            <a href={'/profile/' + encodeURIComponent(profileData.id)} type="button" className="rounded-lg text-black bg-white px-5 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-200">Grįžti</a>
                        </div>

                    </div>
                </form>
            ) : (
                <div>Kraunama...</div>
            )}
        </div>
    );
}