import { FaGithub } from 'react-icons/fa';

interface UserModalProps {
    userList: Array<{ 
        fk_usersid: number;
        fk_issuesid: number;
        first_name: string;
        last_name: string;
        email: string;
        password: string;
        github: string;
        banned_until: Date;
        role: string;
        fk_imagesid_images: number;
     }>;
    onClose: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ userList, onClose }) => {
    console.log(userList);
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-2/4 p-4">
                <h2 className="text-lg font-medium mb-4">User List</h2>
                <ul className="divide-y divide-gray-300">
                    {userList.map(user => (
                        <li key={user.fk_usersid} className="py-4 flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="flex-shrink-0">
                                    <img src={`https://avatars.githubusercontent.com/${user.github}`} alt={`${user.first_name} ${user.last_name}`} className="w-10 h-10 rounded-full" />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium">{`${user.first_name} ${user.last_name}`}</h3>
                                    {user.github && (
                                        <a href={`https://github.com/${user.github}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                            <FaGithub />
                                        </a>
                                    )}
                                </div>
                            </div>
                            <button className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded">
                                Pridėti
                            </button>
                        </li>
                    ))}
                </ul>
                <button className="bg-blue-500 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4" onClick={onClose}>
                    Uždaryti
                </button>
            </div>
        </div>
    );
};

export default UserModal;