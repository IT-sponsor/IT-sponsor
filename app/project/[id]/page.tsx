"use client";
import { useState, useEffect } from 'react';
import ProjectDashboard from "../../components/ProjectDashboard/ProjectDashboard";

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

export default function ProjectPage({ params }: {
  params: { id: number }
}) {
  const [project, setProject] = useState<Project | null>(null);

  const projectId = params.id;

  useEffect(() => {
    if (projectId) {
      fetch(`/api/project/${projectId}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.images.image.data) {
            const logoData = data.images.image.data
            const base64String = Buffer.from(logoData).toString('base64');
            const modifiedProject = {
              ...data,
              logo: `data:image/jpeg;base64,${base64String}`
            };
            setProject(modifiedProject);
          } else {
            console.error("No image data found");


            setProject(data);
          }
        })
        .catch(console.error);
    }
  }, [projectId]);

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
            tags={project.technologies.split(' ')}
            created_at={project.created_at}
            updated_at={project.updated_at}
            id_project={project.id}
          />

        </>
      ) : (
        <p>Loading project details...</p>
      )}
    </div>


  );
}
