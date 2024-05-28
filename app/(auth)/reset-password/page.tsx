'use client';
import { useEffect, useState } from 'react'
import LogoGray from "@/public/assets/logo_icon_gray.svg";
import Image from "next/image";
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPasswordPage() {

    const [newPasswordError, setNewPasswordError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const searchParams = useSearchParams();
    const [userId, setUserId] = useState<string | null>(null);
    const [timestamp, setTimestamp] = useState<string | null>(null);
    const [hash, setHash] = useState<string | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const router = useRouter();

    const validateNewPassword = () => {
        if (newPassword.length < 8) {
            setNewPasswordError('Įveskite bent 8 simbolių slaptažodį');
            return false;
        }
        setNewPasswordError('');
        return true;
    };

    const validateConfirmPassword = () => {
        if (!(confirmPassword === newPassword)) {
            setConfirmPasswordError('Slaptažodžiai nesutampa');
            return false;
        }
        setConfirmPasswordError('');
        return true;
    };

    useEffect(() => {
        const userId = searchParams.get('userId');
        const timestamp = searchParams.get('timestamp');
        const hash = searchParams.get('hash');

        if (userId && timestamp && hash) {
            setUserId(userId);
            setTimestamp(timestamp);
            setHash(hash);
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!validateNewPassword() || !validateConfirmPassword()) {
            return;
        }

        const res = await fetch('/api/auth/reset-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId, timestamp, hash, newPassword }),
        });

        const data = await res.json();

        if (!res.ok) {
            setError(data.message || 'Something went wrong');
        } else {
            setMessage(data.message);
            setError('');
            setTimeout(() => {
                router.push('/sign-in');
            }, 2000);
        }
    };

    if (!userId || !timestamp || !hash) {
        return <div>Kraunama...</div>;
    }

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
                            <div className="flex items-center justify-between">
                                <label htmlFor="newPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                    Įveskite naują slaptažodį
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="newPassword"
                                    name="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                    required
                                />
                                {newPasswordError && <span className="text-sm text-red-500">{newPasswordError}</span>}
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="confirmPassword" className="block text-sm font-medium leading-6 text-gray-900">
                                    Pakartokite slaptažodį
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                                    required
                                />
                                {confirmPasswordError && <span className="text-sm text-red-500">{confirmPasswordError}</span>}
                                {error && <span className="text-sm text-red-500">{error}</span>}
                                {message && <span className="text-sm text-green-500">{message}</span>}
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
                </div>
            </div>
        </>
    )
}
