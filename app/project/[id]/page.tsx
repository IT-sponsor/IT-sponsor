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
  created_at: string;
  updated_at: string;
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
          if (data && data.logo && data.logo.data) {
            const logoData = data.logo.data;
            const base64String = Buffer.from(logoData).toString('base64');
            const modifiedProject = {
              ...data,
              logo: `data:image/jpeg;base64,${base64String}` 
            };
            setProject(modifiedProject);
          } else {
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
          created_at={project.created_at}
          updated_at={project.updated_at}
          id_project={project.id_project}
        />

      </>
    ) : (
      <p>Loading project details...</p>
    )}
  </div>
  

  );
}
