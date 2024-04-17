import { FaGithub } from 'react-icons/fa';

interface UserModalProps {
    userList: Array<{ 
        fk_issuesid: number;
        id: number;
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

// Need to make sure BOTH of the database actions are completed successfully, otherwise, reset and throw an error
async function handleAdd(user: { id: number, fk_issuesid: number }) {
    try {
        const response = await fetch(`/api/gets_assigned/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                issue_id: user.fk_issuesid,
                user_id: user.id,
            }),
        });
        const response2 = await fetch(`/api/applies/delete`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                issue_id: user.fk_issuesid,
                user_id: user.id,
            }),
        });

        if (response.ok && response2.ok) {
            console.log('User added to issue');
        } else {
            console.log('Failed to add user to issue' + response.statusText);
        }
    } catch (error) {
        console.error('Failed to add user to issue:', error);
    }
}   

const UserModal: React.FC<UserModalProps> = ({ userList, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 overflow-auto bg-gray-500 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg w-2/4 p-4">
                <h2 className="text-lg font-medium mb-4">Naudotojai, norintys taisyti</h2>
                <ul className="divide-y divide-gray-300">
                    {userList.map(user => (
                        <li key={user.id} className="py-4 flex items-center justify-between">
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
                            <button className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded" onClick={() => handleAdd(user)}>
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