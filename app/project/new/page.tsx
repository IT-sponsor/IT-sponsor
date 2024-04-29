"use client";
import React, { useCallback, useMemo, useState } from 'react';
import Link from 'next/link';
import { NextResponse } from 'next/server';

import MarkdownEditor from '@/app/components/MarkdownEditor/MarkdownEditor';

const NewProjectPage = () => {
  const [projectName, setProjectName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [repository, setRepository] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [fullDescription, setFullDescription] = useState("# Apie įmonę:\n...\n# Apie projektą:\n...");
  const [image, setImage] = useState<File | null>(null);
  const [codebase_visibility, setCodebaseVisibility] = useState<string>("public");
  const [formErrors, setFormErrors] = useState<Record<string, any>>({});

  const validateForm = () => {
    const newErrors: Record<string, any> = {};
    if (!projectName.trim()) newErrors.projectName = "Projekto pavadinimas yra privalomas.";
    if (!shortDescription.trim()) newErrors.shortDescription = "Trumpas aprašymas yra privalomas.";
    if (!repository.trim()) newErrors.repository = "Repositorijos nuoroda yra būtina.";
    if (!technologies.trim()) newErrors.technologies = "Pateikite bent vieną technologiją.";
    if (!fullDescription.trim()) newErrors.fullDescription = "Pilnas aprašymas yra privalomas.";
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setImage(file);
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    const projectData = new FormData();
    projectData.append('name', projectName);
    projectData.append('short_description', shortDescription);
    projectData.append('long_description', fullDescription);
    projectData.append('repository', repository);
    projectData.append('technologies', technologies);
    projectData.append('codebase_visibility', codebase_visibility);
    if (image) projectData.append('image', image);

    try {
      const response = await fetch('/api/project/new', {
        method: 'POST',
        body: projectData
      });

      if (response.ok) {
        const result = await response.json();
        window.location.href = `/project/${result.project.id}`;
      } else {
        return new NextResponse(JSON.stringify({ message: "Error creating project", error: response.statusText }), { status: 500, headers: { 'Content-Type': 'application/json' } });
      }
    } catch (error) {
      return new NextResponse(JSON.stringify({ message: "Network error", error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6">
      <div className="px-6 py-5 rounded-xl border-2 border-gray-100 bg-white" style={{ width: '800px' }}>
        <h1 className="text-2xl font-bold text-gray-800 text-center">Naujas projektas</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-start justify-center w-[750px]">

          <label htmlFor="projectName" className="block text-gray-700 font-bold">Pavadinimas</label>
          <input
            type="text"
            id="projectName"
            placeholder="Pavadinimas"
            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500"
            value={projectName} onChange={(e) => setProjectName(e.target.value)}
          />
          {formErrors.projectName && <div className="text-red-500">{formErrors.projectName}</div>}

          <label htmlFor="shortDescription" className="block text-gray-700 font-bold">Trumpas aprašymas</label>
          <input
            type="text"
            id="shortDescription"
            placeholder="Trumpas aprašymas"
            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500"
            value={shortDescription} onChange={(e) => setShortDescription(e.target.value)}
          />
          {formErrors.shortDescription && <div className="text-red-500">{formErrors.shortDescription}</div>}

          <label htmlFor="repository" className="block text-gray-700 font-bold">Repozitorijos nuoroda</label>
          <input
            type="text"
            id="repository"
            placeholder="https://..."
            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500"
            value={repository} onChange={(e) => setRepository(e.target.value)}
          />
          {formErrors.repository && <div className="text-red-500">{formErrors.repository}</div>}

          <label htmlFor="codebase_visibility" className="block text-gray-800 font-bold mt-4">Repositorijos matomumas</label>
          <select
            id="codebase_visibility"
            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            value={codebase_visibility} onChange={(e) => setCodebaseVisibility(e.target.value)}
          >
            <option value="public">Vieša</option>
            <option value="private">Privati</option>
          </select>

          <label htmlFor="technologies" className="block text-gray-700 font-bold">Technologijos (atskirkite tarpais)</label>
          <input
            type="text"
            id="technologies"
            placeholder="Technologijos"
            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-500"
            value={technologies} onChange={(e) => setTechnologies(e.target.value)}
          />
          {formErrors.technologies && <div className="text-red-500">{formErrors.technologies}</div>}

          <label htmlFor="fullDescription" className="block text-gray-800 font-bold mt-4">Pilnas aprašymas</label>
          <MarkdownEditor markdownText={fullDescription} setMarkdownText={setFullDescription} />
          {formErrors.fullDescription && <div className="text-red-500">{formErrors.fullDescription}</div>}

          <div id="image-preview" className="max-w-sm p-6 mb-4 bg-gray-100 border-dashed border-2 border-gray-400 rounded-lg items-center mx-auto text-center cursor-pointer mt-2">

            {image && (
              <label htmlFor="upload" className='cursor-pointer'>
                <img
                  src={URL.createObjectURL(image)}
                  alt='image-preview'
                  className="max-h-48 rounded-lg mx-auto"
                />
              </label>
            ) || (
                <>
                  <label htmlFor="upload" className="cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-8 h-8 text-gray-700 mx-auto mb-4">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-700">Įkelti nuotrauką</h5>
                    <p className="font-normal text-sm text-gray-400 md:px-6">Pasirinkite nuotrauką, kurios dydis būtų mažesnis nei <b className="text-gray-600">2mb</b></p>
                    <p className="font-normal text-sm text-gray-400 md:px-6">leidžiami <b className="text-gray-600">JPG arba PNG</b> formatai.</p>
                    <span id="filename" className="text-gray-500 bg-gray-200 z-50"></span>
                  </label>
                </>
              )}
          </div>
          <input id="upload" type="file" accept='image/*' onChange={handleFileChange} className="hidden" />

          <div className="mt-4 flex justify-between items-center w-full">
            <Link href="/" legacyBehavior>
              <a className="py-2 px-4 rounded-lg text-black bg-[#C14040] hover:bg-red-700 transition duration-150 ease-in-out">Atšaukti</a>
            </Link>
            <button type="submit" className="py-2 px-4 rounded-lg text-black bg-[#40C173] hover:bg-green-700 transition duration-150 ease-in-out">Pateikti</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewProjectPage;
