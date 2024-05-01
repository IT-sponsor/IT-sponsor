"use client";
import React from 'react';
import Link from 'next/link'

export default function NotFoundPage() {    
    return (
        <div className="flex flex-col items-center justify-center w-full min-h-screen bg-gray-50 text-center">
            <h1 className="text-6xl font-bold">404</h1>
            <p className="text-2xl">Ups! Puslapis nerastas.</p>
            <p className="mt-4 mb-8">Šis puslapis galėjo būti pašalintas arba jis laikinai neprieinamas.</p>
            <Link href="/" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">Grįžti į pagrindinį puslapį</Link>
        </div>
    );
}