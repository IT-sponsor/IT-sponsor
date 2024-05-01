"use client";
import React from 'react';
import Link from 'next/link'
import Image from "next/image";
import NotFound from '@/public/assets/404-page-not-found.svg'; 

export default function NotFoundPage() {    
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 text-center">
            <Image src={NotFound} alt="404 Page Not Found" className="w-1/2 h-auto" />
            <p className="text-2xl">Ups! Puslapis nerastas.</p>
            <p className="mt-4 mb-8">Šis puslapis galėjo būti pašalintas arba jis laikinai neprieinamas.</p>
            <Link href="/" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Grįžti į pagrindinį puslapį</Link>
        </div>
    );
}