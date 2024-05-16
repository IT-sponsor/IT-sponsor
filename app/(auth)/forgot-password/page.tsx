'use client';
import Link from 'next/link';
import { useState } from 'react'
import LogoGray from "@/public/assets/logo_icon_gray.svg";
import Image from "next/image";

export default function ForgotPasswordPage() {

    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');

    const validateEmail = () => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!regex.test(email.trim())) {
            setEmailError('Įveskite el. pašto adresą');
            return false;
        }
        setEmailError('');
        return true;
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateEmail()) {
            return;
        }

        try {
            const response = await fetch('/api/auth/request-reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                setEmail('');
                alert('Slaptažodžio atstatymo laiškas nusiųstas į nurodytą el. paštą!'); ///
            } else {
                setEmailError('El. pašto adresas neegzistuoja');
            }

        } catch (error) {
            console.error('Password reset request failed:', error);
            throw new Error('Failed to request password reset');
        }
    };

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <Image
                        className="mx-auto h-10 w-auto"
                        src={LogoGray}
                        alt="Logo"
                    />
                    <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                        Slaptažodžio atstatymas
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form className="space-y-6" action="#" method="POST" onSubmit={(handleSubmit)}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Įveskite el. pašto adresą
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder='email@gmail.com'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                    required
                                />
                                {emailError && <span className="text-sm text-red-500">{emailError}</span>}
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                formNoValidate
                                className='flex w-full justify-center rounded-lg text-black bg-[#40C173] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                            >
                                Pateikti
                            </button>
                        </div>
                    </form>

                    <div className='mx-auto my-4 flex w-full items-center justify-enevly
        before:mr-4 befor:block before:h-px before:flex-grow before:bg-stone-400
        after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
                        *
                    </div>
                    <p className='text-center text-sm text-gray-600 mt-2'>
                        Jei turite paskyrą -
                        <Link className='text-blue-700' href='/sign-in'> Prisijunkite</Link>
                    </p>
                    <p className='text-center text-sm text-gray-600 mt-3'>
                        Jei neturite paskyros -
                        <Link className='text-blue-700' href='/sign-up'> Užsiregistruokite</Link>
                    </p>
                </div>
            </div>
        </>
    )
}