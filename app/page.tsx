"use client";
import { useState, useEffect, useRef } from 'react';
import Link from "next/link";

import ProjectCard from "./components/ProjectCard/ProjectCard";

interface Project {
  name: string;
  short_description: string;
  long_description: string;
  repository: string;
  logo: string; // Changed type to string
  technology: string;
  created_at: string;
  updated_at: string;
  id_project: number;
  fk_imageid_image: number; 
}

export default function Home() {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [sortBy, setSortBy] = useState('newest_updated');
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const filterDropdownRef = useRef(null);
  const sortDropdownRef = useRef(null);

  const closeDropdowns = (event: MouseEvent) => {
    if ((filterDropdownRef.current) && !(filterDropdownRef.current as HTMLElement).contains(event.target as Node)) {
      setIsFilterOpen(false);
    }
    if ((sortDropdownRef.current) && !(sortDropdownRef.current as HTMLElement).contains(event.target as Node)) {
      setIsSortOpen(false);
    }
  };

  // Guessing this is where the image does not load, the api get image by id returns correct results
  useEffect(() => {
    fetch("/api/project/all")
      .then(res => res.json())
      .then(data => {
        const modifiedData = data.map((project: Project) => {
          // Convert buffer to base64 string
          const logoData = project.image.image_blob.data;
          const base64String = Buffer.from(logoData).toString('base64');
          return {
            ...project,
            logo: `data:image/jpeg;base64,${base64String}` // Assuming the logo is JPEG
          };
        });
        setProjects(modifiedData);
      })
      .catch(err => console.error(err));
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', closeDropdowns);

    // Clean up the event listener when the component is unmounted
    return () => {
      document.removeEventListener('mousedown', closeDropdowns);
    };
  }, []);

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  }

  const toggleSortDropdown = () => {
    setIsSortOpen(!isSortOpen);
  }

  const handleSort = (sortBy: string) => {
    setSortBy(sortBy);
    setIsSortOpen(false);
  }

  const sortedProjects = () => {
    if (sortBy === 'newest_updated') {
      return projects.slice().sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
    } else if (sortBy === 'newest_created') {
      return projects.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    } else if (sortBy === 'oldest_updated') {
      return projects.slice().sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
    } else if (sortBy === 'oldest_created') {
      return projects.slice().sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else {
      return projects;
    }
  }

  // Filter projects by search query
  const filteredProjects = sortedProjects().filter(project => {
    const isNameDescriptionMatch = project.name.toLowerCase().includes(searchQuery.toLocaleLowerCase()) ||
      project.short_description.toLowerCase().includes(searchQuery.toLocaleLowerCase());

    const isTagMatch = project.technology.toLowerCase().split(' ').some(tag =>
      tag.includes(searchQuery.toLocaleLowerCase())
    );

    const isTechMatch = filterBy.every(tech => project.technology.includes(tech));

    return (isNameDescriptionMatch || isTagMatch) && isTechMatch;
  });

  const calculateTechFrequency = () => {
    const techFrequency: { [key: string]: number } = {};

    filteredProjects.forEach(project => {
      project.technology.split(' ').forEach(tech => {
        if (techFrequency[tech]) {
          techFrequency[tech]++;
        } else {
          techFrequency[tech] = 1;
        }
      });
    });

    // Convert the object to an array of [tech, frequency] pairs
    return Object.entries(techFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(([tech, _]) => tech);
  }

  return (
    <div className="flex flex-col items-center" >
      {/* Search bar */}
      <div className='flex items-center'>
        <div className="pt-2 relative mx-auto text-gray-600">
          <input
            className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
            type="search"
            name="search"
            placeholder="Ieškoti..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          >
          </input>
          <button
            type="submit"
            className="absolute right-0 top-0 mt-5 mr-4">
            <svg
              className="text-gray-600 h-4 w-4 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              version="1.1"
              x="0px"
              y="0px"
              viewBox="0 0 56.966 56.966"
              width="512px"
              height="512px">
              <path
                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
            </svg>
          </button>
        </div>

        {/* Filter dropdown */}
        <div className="relative inline-block text-left mt-2 ml-2" ref={filterDropdownRef}>
          <div>
            <button
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-2"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={toggleFilterDropdown}
            >
              Filtruoti pagal
              <svg
                className="-mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Filter dropdown content */}
          {isFilterOpen && (
            <div
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-auto max-h-40"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                {calculateTechFrequency().map((tech, index) => (
                  <button
                    onClick={() => {
                      if (filterBy.includes(tech)) {
                        setFilterBy(filterBy.filter(t => t !== tech));
                      } else {
                        setFilterBy([...filterBy, tech]);
                      }
                    }}
                    className={`text-gray-700 w-full block px-4 py-2 text-sm ${filterBy.includes(tech) ? 'bg-gray-200' : ''}`}
                    role='menuitem'
                    id={`menu-item-${index}`}
                  >
                    {tech}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sort dropdown */}
        <div className="relative inline-block text-left mt-2 ml-2" ref={sortDropdownRef}>
          <div>
            <button
              type="button"
              className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 ml-2"
              id="menu-button"
              aria-expanded="true"
              aria-haspopup="true"
              onClick={toggleSortDropdown}
            >
              Rikiuoti Pagal
              <svg
                className="-mr-1 h-5 w-5 text-gray-400"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Sort dropdown content */}
          {isSortOpen && (
            <div
              className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              <div className="py-1" role="none">
                <button onClick={() => handleSort('newest_updated')} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-0">Naujausiai atnaujintą</button>
                <button onClick={() => handleSort('newest_created')} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-1">Naujausiai sukurtą</button>
                <button onClick={() => handleSort('oldest_updated')} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-2">Seniausiai atnaujintą</button>
                <button onClick={() => handleSort('oldest_created')} className="text-gray-700 block px-4 py-2 text-sm" role="menuitem" id="menu-item-3">Seniausiai sukurtą</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Display selected technologies */}
      <div className='flex flex-wrap'>
        {filterBy.map((tech, index) => (
          <div
            key={index}
            className='m-1 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700 flex items-center'
          >
            {tech}
            <button
              onClick={() => setFilterBy(filterBy.filter(t => t !== tech))}
              className='ml-2 text-xs flex items-center'
            >
              x
            </button>
          </div>
        ))}
      </div>


      {filteredProjects.map((project, index) => (
      <div className="p-6 w-[800px] max-h-60" key={index}>
        {/* link to the project page by the id*/}
        <Link href={`/project/${project.id_project}`} passHref>
          <div style={{ cursor: 'pointer' }}>
            <ProjectCard 
              image_url={project.logo}
              title={project.name}
              description={project.short_description}
              timeUpdated={project.updated_at}
              issueCount={0} 
              volunteerCount={0}
              tags={project.technology.split(' ')}
            />
          </div>
        </Link>
      </div>
    ))}
    </div>
  );
}
