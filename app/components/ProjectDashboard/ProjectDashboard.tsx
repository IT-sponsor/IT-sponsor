"use client";
import ProjectCard from "../ProjectCard/ProjectCard"; // Adjust the path as necessary

interface ProjectDashboardProps {
  name: string;
  short_description: string;
  long_description: string;
  repository: string;
  logo: string;
  tags: string[];
  creation_date: string;
  last_updated: string;
  id_project: number;
}

const ProjectDashboard = ({
  name,
  short_description,
  long_description,
  repository,
  logo,
  tags,
  creation_date,
  last_updated,
  id_project,
}: ProjectDashboardProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 max-w-4xl mx-auto">
      {/* Project Card */}
      <ProjectCard
        image_url={logo}
        title={name}
        description={short_description}
        timeUpdated={last_updated}
        issueCount={0} // Replace with actual data
        volunteerCount={0} // Replace with actual data
        tags={tags}
      />

      {/* Button Group Below Project Card */}
      <div className="mt-4 flex justify-center gap-2">
        <a href={repository} target="_blank" rel="noopener noreferrer" style={{ backgroundColor: '#40C173', color: '#000' }} className="py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out">Repositorija</a>
        <a href="#" style={{ backgroundColor: '#40C173', color: '#000' }} className="py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out">Diskusijos</a>
        <a href="#" style={{ backgroundColor: '#40C173', color: '#000' }} className="py-2 px-4 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out">Pradėti naują diskusiją</a>
        <a href="#" style={{ backgroundColor: '#C14040', color: '#000' }} className="py-2 px-4 rounded-lg hover:bg-red-700 transition duration-150 ease-in-out">Pranešti apie kritinę klaidą</a>
      </div>
    </div>
  );
};

export default ProjectDashboard;
