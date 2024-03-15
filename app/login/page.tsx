"use client";
import { useRouter } from "next/navigation";
import { useContext } from 'react';
import RoleContext from './RoleContext';


const LoginComponent = () => {
    const { setRole } = useContext(RoleContext);
    const router = useRouter();

    const handleLogin = (role) => {
    setRole(role);
    router.push("/");
    };
        
    return (
    <div className="flex flex-col sm:flex-row items-start gap-4 p-4 sm:px-6 lg:px-8 justify-center mt-20">
        <button className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mr-4" onClick={() => handleLogin('Savanoris')}>Prisijunkite kaip savanoris</button>
        <button className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg " onClick={() => handleLogin('Užsakovas')}>Prisijunkite kaip užsakovas</button>
    </div>
    );
};
        
export default LoginComponent;