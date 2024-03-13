"use client";
import { useState } from 'react';
import Link from 'next/link';

const NewProjectPage = () => {

  const [projectName, setProjectName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [repository, setRepository] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [fullDescription, setFullDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const projectData = {
      projectName,
      shortDescription,
      repository,
      technologies: technologies.split(' '), 
      fullDescription,
    };

    console.log("Submit:", projectData);
    // Here, you would typically make an API call to your backend to save the projectData
    // Example: await saveProjectData(projectData);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-[#A1A3A7] p-6 rounded-lg shadow-lg" style={{ maxWidth: '600px', width: '100%', height: 'auto' }}>
        <h2 className="text-2xl font-bold mb-4 text-center">Naujas projektas</h2>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div>
            <label htmlFor="projectName" className="block">Pavadinimas</label>
            <input
              type="text"
              id="projectName"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="shortDescription" className="block">Trumpas aprašymas</label>
            <textarea
              id="shortDescription"
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="repository" className="block">Nuoroda į repositoriją</label>
            <input
              type="text"
              id="repository"
              value={repository}
              onChange={(e) => setRepository(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="technologies" className="block">Technologijos (atskirti tarpais)</label>
            <input
              type="text"
              id="technologies"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>

          <div>
            <label htmlFor="fullDescription" className="block">Pilnas aprašymas</label>
            <textarea
              id="fullDescription"
              value={fullDescription}
              onChange={(e) => setFullDescription(e.target.value)}
              className="mt-1 p-2 w-full border rounded-md"
            />
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <Link href="/" passHref> {/*Goes to root*/}
              <a className="py-2 px-4 rounded-lg text-black hover:bg-green-700 transition duration-150 ease-in-out" style={{ backgroundColor: '#C14040' }}>Atšaukti</a>
            </Link>
            <button type="submit" style={{ backgroundColor: '#40C173 '}} className="py-2 px-4 rounded-lg hover:bg-red-700 transition duration-150 ease-in-out">Pateikti</button>
          </div>
        </form>
      </div>
    </div>
  );

};



export default NewProjectPage;
