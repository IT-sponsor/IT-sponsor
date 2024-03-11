"use client";
import { useState, useEffect } from 'react';
import ProjectDashboard from "../../components/ProjectDashboard/ProjectDashboard";

interface Project {
  name: string;
  short_description: string;
  long_description: string;
  repository: string;
  logo: string; // Changed type to string
  technology: string;
  creation_date: string;
  last_updated: string;
  id_project: number;
}

export default function ProjectPage({ params }: {
  params: { id: number }
}) {
  const [project, setProject] = useState<Project | null>(null);

  const productId = params.id;

  useEffect(() => {
    if (productId) {
      fetch(`/api/project/${productId}`)
        .then(res => res.json())
        .then(data => {
          // Assuming the logo data is within the response and needs conversion
          if (data && data.logo && data.logo.data) {
            const logoData = data.logo.data;
            const base64String = Buffer.from(logoData).toString('base64');
            const modifiedProject = {
              ...data,
              logo: `data:image/jpeg;base64,${base64String}` // Modify as per the actual format of the logo if not JPEG
            };
            setProject(modifiedProject);
          } else {
            // Set project data directly if there's no logo to modify or if the format is different
            setProject(data);
          }
        })
        .catch(console.error);
    }
  }, [productId]);

  return (
    <div>
    {project ? (
      <>
        <ProjectDashboard
          name={project.name}
          short_description={project.short_description}
          long_description={project.long_description}
          repository={project.repository}
          logo={project.logo}
          tags={project.technology.split(' ')}
          creation_date={project.creation_date}
          last_updated={project.last_updated}
          id_project={project.id_project}
          // Pass any additional props that ProjectDashboard expects
        />

      </>
    ) : (
      <p>Loading project details...</p>
    )}
  </div>
  

  );
}
