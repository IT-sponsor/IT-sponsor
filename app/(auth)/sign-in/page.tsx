'use client';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import LogoGray from "@/public/assets/logo_icon_gray.svg";
import Image from "next/image";

export default function page() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loginError, setLoginError] = useState('');

  const router = useRouter();

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.trim())) {
      setEmailError('Įveskite el. pašto adresą');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (password.length < 1) {
      setPasswordError('Įveskite slaptažodį');
      setLoginError('');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateEmail() || !validatePassword()) {
      return;
    }

    try {
      const signInData = await signIn('credentials', {
        email: email,
        password: password,
        redirect: false,
      });

      if (!signInData?.ok) {
        setLoginError('Neteisingi prisijungimo duomenys');
        return;
      } else {
        router.push('/');
      }

      
    } catch (error) {
      console.error(error);
      setLoginError('Neteisingi prisijungimo duomenys');
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
          Prisijunkite
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={(handleSubmit)}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
              El. paštas
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
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Slaptažodis
              </label>
              {/* <div className="text-sm">
                <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div> */}
            </div>
            <div className="mt-2">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                required
              />
              {passwordError && <span className="text-sm text-red-500">{passwordError}</span>}
              {loginError && <span className="text-sm text-red-500">{loginError}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              formNoValidate
              className='flex w-full justify-center rounded-lg text-black bg-[#40C173] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Prisijungti
            </button>
          </div>
        </form>

        <div className='mx-auto my-4 flex w-full items-center justify-enevly
        before:mr-4 befor:block before:h-px before:flex-grow before:bg-stone-400
        after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400'>
          *
        </div>
        <p className='text-center text-sm text-gray-600 mt-2'>
          Jei neturite paskyros - 
          <Link className='text-blue-700' href='/sign-up'> Užsiregistruokite</Link>
        </p>
      </div>
    </div>
  </>
)
}
