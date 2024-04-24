"use client";
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaGithub } from 'react-icons/fa';

type UserCardProps = {
  user: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    github: string;
    role: string;
    password: string;
    fk_imagesid_images: number;
    gets_assigned: number[];
    applies: number[];
    issueId: number;
    type: string;
  };
  onAssign: (userId: number) => void;
  onRemove: (userId: number, type: string) => void;
  onCompleted: (userId: number, type: string) => void;
  project_id: number;
};
interface Issue {
  id: number;
  title: string;
  description: string;
  fk_projectsid: number;
  visibility: string;
  status: string;
}

const UserCard: React.FC<UserCardProps> = ({ user, onAssign, onRemove, onCompleted, project_id }) => {
  const { id, first_name, last_name, github, fk_imagesid_images: images, issueId, type } = user;
  const fullName = `${first_name} ${last_name}`;
  const githubUrl = `https://github.com/${github}`;
  const [issue, setIssue] = useState({} as Issue);

  useEffect(() => {
    fetch(`/api/project/${project_id}/issues/${issueId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      setIssue(data);
    })
    .catch(error => {
      console.error("Error fetching issue:", error.message);
    });
  }, []);

  if(!issue) return null;

  return (
    <div className="flex-grow px-4 py-2 mt-2 w-full rounded-xl border-2 border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 shrink-0">
          {/* Placeholder image */}
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
            {images ? (
              <Image src={githubUrl} alt={fullName} width={50} height={50} className="rounded-full" />
            ) : (
              <span className="text-gray-500">No Image</span>
            )}
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-lg">{fullName}</h3>
            <a href={githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 font-medium flex items-center text-lg">
              <FaGithub className="text-gray-500 mr-2" />
              <div className="hover:underline">{github}</div>
            </a>
          </div>
        </div>
        <div className="flex items-center overflow-y-auto ">
          <Link href={`/project/${project_id}/issue/${issueId}`}>
            <span className="text-gray-700 hover:underline font-italic mr-4 ml-8 flex-col break-words flex-wrap">
              {issue.title}
            </span>
          </Link>
          {type === 'applied' && issue.status === 'open' ? (
            <button onClick={() => onAssign(id)} className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded-md">
              Priskirti
            </button>
          ) : (
            <>
            <button onClick={() => onRemove(id, 'assigned')} className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 mr-2 rounded-md">
              Pašalinti
            </button>
            <button onClick={() => onCompleted(id, 'assigned')} className="bg-green-500 hover:bg-green-700 text-white px-4 py-2 rounded-md">
              Atliko pataisymą
            </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserCard;
