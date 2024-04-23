import Image from 'next/image';
import { useEffect } from 'react';
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
  };
  onAssign: (userId: number) => void;
  onStatusChange: (userId: number, status: string) => void;
};

const UserCard: React.FC<UserCardProps> = ({ user, onAssign, onStatusChange, issueName }) => {
  const { id, first_name, last_name, github, images } = user;
  const fullName = `${first_name} ${last_name}`;

  const githubUrl = `https://github.com/${github}`;

  return (
    <div className="flex-grow px-4 py-2 w-full rounded-xl border-2 border-gray-100 bg-white">
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
              {github}
            </a>
          </div>
        </div>
        <div className="flex items-center overflow-y-auto ">
          <span className="text-gray-500 font-italic mr-4 ml-8 flex-col break-words flex-wrap">
            Issue: PlaceholderIssue
          </span>
          <button onClick={() => onAssign(id)} className="bg-blue-500 text-white px-4 py-2 rounded-md">
            Priskirti
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserCard;