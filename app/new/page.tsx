"use client";
import { useState } from 'react';
import Link from 'next/link';
import { NextResponse } from '@/node_modules/next/server';
//import { error } from 'console';

const NewProjectPage = () => {
  const [projectName, setProjectName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [repository, setRepository] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!projectName.trim()) newErrors.projectName = "Projekto pavadinimas yra privalomas.";
    if (!shortDescription.trim()) newErrors.shortDescription = "Trumpas aprašymas yra privalomas.";
    if (!repository.trim()) newErrors.repository = "Repositorijos nuoroda yra būtina.";
    if (!technologies.trim()) newErrors.technologies = "Pateikite bent vieną technologiją";
    if (!fullDescription.trim()) newErrors.fullDescription = "Pilnas aprašymas yra privalomas.";
    setFormErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const projectData = {
      name: projectName,
      short_description: shortDescription,
      long_description: fullDescription,
      repository,
      technology: technologies
    };

    try {
      const response = await fetch('/api/project/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });

      if (response.ok) {
        const result = await response.json();
        window.location.href = `/project/${result.project.id_project}`;
      } else {
        return new NextResponse(JSON.stringify({ message: "Error creating project", error: error.message }), { status: 500, headers: {'Content-Type': 'application/json'} });
      }
    } catch (error) {
      return new NextResponse(JSON.stringify({ message: "Network error", error: error.message }), { status: 500, headers: {'Content-Type': 'application/json'} });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-[#A1A3A7] p-6 rounded-lg shadow-lg" style={{ maxWidth: '600px', width: '100%', height: 'auto' }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Naujas projektas</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="projectName" className="block">Projekto pavadinimas</label>
            <input type="text" id="projectName" value={projectName} onChange={(e) => setProjectName(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
            {formErrors.projectName && <div className="text-red-500">{formErrors.projectName}</div>}
          </div>

          <div>
            <label htmlFor="shortDescription" className="block">Trumpas aprašymas</label>
            <textarea id="shortDescription" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="mt-1 p-2 w-full border rounded-md"></textarea>
            {formErrors.shortDescription && <div className="text-red-500">{formErrors.shortDescription}</div>}
          </div>

          <div>
            <label htmlFor="repository" className="block">Repozitorijos nuoroda</label>
            <input type="text" id="repository" value={repository} onChange={(e) => setRepository(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
            {formErrors.repository && <div className="text-red-500">{formErrors.repository}</div>}
          </div>

          <div>
            <label htmlFor="technologies" className="block">Technologijos (atskirkite tarpais)</label>
            <input type="text" id="technologies" value={technologies} onChange={(e) => setTechnologies(e.target.value)} className="mt-1 p-2 w-full border rounded-md" />
            {formErrors.technologies && <div className="text-red-500">{formErrors.technologies}</div>}
          </div>

          <div>
            <label htmlFor="fullDescription" className="block">Pilnas aprašymas</label>
            <textarea id="fullDescription" value={fullDescription} onChange={(e) => setFullDescription(e.target.value)} className="mt-1 p-2 w-full border rounded-md"></textarea>
            {formErrors.fullDescription && <div className="text-red-500">{formErrors.fullDescription}</div>}
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Link href="/" legacyBehavior>
              <a className="py-2 px-4 rounded-lg text-black hover:bg-green-700 transition duration-150 ease-in-out" style={{ backgroundColor: '#C14040' }}>Atšaukti</a>
            </Link>
            <button type="submit" style={{ backgroundColor: '#40C173' }} className="py-2 px-4 rounded-lg hover:bg-red-700 transition duration-150 ease-in-out">Pateikti</button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default NewProjectPage;
