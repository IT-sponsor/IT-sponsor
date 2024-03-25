"use client";
import { useState } from 'react';
import Link from 'next/link';
import { NextResponse } from 'next/server';

interface Project {
  id: number;
  name: string;
  short_description: string;
  long_description: string;
  repository: string;
  technologies: string;
  created_at: string;
  updated_at: string;
  star_count: number;
  contributor_count: number;
  codebase_visibility: string;
  fk_imagesid_images: number;

  logo: string;
  images: {
      image: {
          data: Buffer;
          contentType: string;
      }
  }
}

const NewProjectPage = () => {
  const [projectName, setProjectName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [repository, setRepository] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [formErrors, setFormErrors] = useState({});

  const defaultDescription = "# Apie įmonę:\n...\n# Apie projektą:\n...";

  fullDescription === "" && setFullDescription(defaultDescription);
  const formattedDefaultDescription = defaultDescription.split("\n").map((item, key) => {
    return <span key={key}>{item}<br /></span>
});

  const validateForm = () => {
    const newErrors = {};
    if (!projectName.trim()) newErrors.projectName = "Projekto pavadinimas yra privalomas.";
    if (!shortDescription.trim()) newErrors.shortDescription = "Trumpas aprašymas yra privalomas.";
    if (!repository.trim()) newErrors.repository = "Repositorijos nuoroda yra būtina.";
    if (!technologies.trim()) newErrors.technologies = "Pateikite bent vieną technologiją.";
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
      technology: technologies,
      codebase_visibility: "public",
      fk_imagesid_images: 3 // TODO: upload a picture
    };

    try {
      const response = await fetch('/api/project/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData)
      });
      if (response.ok) {
        const result = await response.json();
        window.location.href = `/project/${result.project.id}`;
      } else {
        return new NextResponse(JSON.stringify({ message: "Error creating project" }), { status: 500, headers: {'Content-Type': 'application/json'} });
      }
    } catch (error) {
      return new NextResponse(JSON.stringify({ message: "Network error", error: error.message }), { status: 500, headers: {'Content-Type': 'application/json'} });
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
          <textarea
            id="fullDescription"
            placeholder="Aprašymas"
            className="w-full border border-gray-300 py-2 pl-3 rounded mt-2 outline-none focus:ring-indigo-600"
            value={fullDescription} onChange={(e) => setFullDescription(e.target.value)}
          >
          </textarea>
          {formErrors.fullDescription && <div className="text-red-500">{formErrors.fullDescription}</div>}

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
