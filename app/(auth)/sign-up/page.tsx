'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react'
import LogoGray from "@/public/assets/logo_icon_gray.svg";
import Image from "next/image";

export default function page() {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [registerError, setRegisterError] = useState('');

  const router = useRouter();

  const validateFirstName = () => {
    if (first_name.length < 1) {
      setFirstNameError('Įveskite vardą');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  const validateLastName = () => {
    if (last_name.length < 1) {
      setLastNameError('Įveskite pavardę');
      return false;
    }
    setLastNameError('');
    return true;
  };

  const validateEmail = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email.trim())) {
      setEmailError('Įveskite el. pašto adresą');
      setRegisterError('');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = () => {
    if (password.length < 8) {
      setPasswordError('Įveskite bent 8 simbolių slaptažodį');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const validateConfirmPassword = () => {
    if (!(confirmPassword === password)) {
      setConfirmPasswordError('Slaptažodis nesutampa');
      return false;
    }
    setConfirmPasswordError('');
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateFirstName() || !validateLastName() || !validateEmail() 
        || !validatePassword() || !validateConfirmPassword()) {
      return;
    }

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          first_name: first_name,
          last_name: last_name,
          email: email,
          password: password
        })
      })

      if(response.ok) {
        router.push('/sign-in')
      } else {
        setRegisterError('Paskyra su šiuo el. paštu jau egzistuoja');
      }

      
    } catch (error) {
      console.error(error);
      setRegisterError('Paskyra su šiuo el. paštu jau egzistuoja');
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
          Užsiregistruokite
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" action="#" method="POST" onSubmit={(handleSubmit)}>
          <div>
            <label htmlFor="first_name" className="block text-sm font-medium leading-6 text-gray-900">
              Vardas
            </label>
            <div className="mt-2">
              <input
                id="first_name"
                name="first_name"
                type="first_name"
                autoComplete="first_name"
                placeholder='Vardenis'
                value={first_name}
                onChange={(e) => setFirstName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                required           
              />
              {firstNameError && <span className="text-sm text-red-500">{firstNameError}</span>}
            </div>
          </div>

          <div>
            <label htmlFor="last_name" className="block text-sm font-medium leading-6 text-gray-900">
              Pavardė
            </label>
            <div className="mt-2">
              <input
                id="last_name"
                name="last_name"
                type="last_name"
                autoComplete="last_name"
                placeholder='Pavardenis'
                value={last_name}
                onChange={(e) => setLastName(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                required           
              />
              {lastNameError && <span className="text-sm text-red-500">{lastNameError}</span>}
            </div>
          </div>

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
              {registerError && <span className="text-sm text-red-500">{registerError}</span>}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                Slaptažodis
              </label>
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
                autoComplete="current-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 p-2"
                required
              />
              {confirmPasswordError && <span className="text-sm text-red-500">{confirmPasswordError}</span>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              formNoValidate
              className='flex w-full justify-center rounded-lg text-black bg-[#40C173] px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm hover:bg-green-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
            >
              Užsiregistruoti
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
      </div>
    </div>
  </>
)
}
