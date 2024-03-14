"use client";
import ProjectCard from "../ProjectCard/ProjectCard"; 
import MarkdownDisplay from "../MarkdownDisplay/MarkdownDisplay"; 

interface ProjectDashboardProps {
  name: string;
  short_description: string;
  long_description: string;
  repository: string;
  logo: string;
  tags: string[];
  created_at: string;
  updated_at: string;
  id_project: number;
}

const ProjectDashboard = ({
  name,
  short_description,
  long_description,
  repository,
  logo,
  tags,
  updated_at,
}: ProjectDashboardProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
      {/* project card details */}
      <ProjectCard
        image_url={logo}
        title={name}
        description={short_description}
        timeUpdated={updated_at}
        issueCount={0} 
        volunteerCount={0} 
        tags={tags}
      />

      {/* buttons after the project card */}
      <div className="mt-4 flex justify-center gap-2">
        <a href={repository} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#40C173', color: '#000' }} className="py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out">Repositorija</a>
        <a href="#" style={{ backgroundColor: '#40C173', color: '#000' }} className="py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out">Diskusijos</a>
        <a href="#" style={{ backgroundColor: '#40C173', color: '#000' }} className="py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out">Pradėti naują diskusiją</a>
        <a href="#" style={{ backgroundColor: '#C14040', color: '#000' }} className="py-2 px-4 rounded-lg hover:bg-red-700 transition duration-150 ease-in-out">Pranešti apie kritinę klaidą</a>
      </div>

      {/* description with markdown features */}
      <div className="mt-4 long-description-right">
        <MarkdownDisplay markdownText={long_description} />
      </div>


    </div>
  );
};

export default ProjectDashboard;
