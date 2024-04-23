import { useState } from 'react';

type UserFilterProps = {
  users: {
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
  setFilteredUsers: React.Dispatch<React.SetStateAction<User[]>>;
};

const UserFilter: React.FC<UserFilterProps> = ({ users, setFilteredUsers }) => {
  const [filterBy, setFilterBy] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>('first_name');

  const handleFilter = () => {
    const filtered = users.filter(user => {
      if (filterBy.includes('assigned') && user.isAssigned) {
        return true;
      }
      if (filterBy.includes('awaiting') && !user.isAssigned) {
        return true;
      }
      return false;
    });

    const sorted = filtered.sort((a, b) => {
      if (sortBy === 'first_name') {
        return a.first_name?.localeCompare(b.first_name);
      }
      if (sortBy === 'last_name') {
        return a.last_name?.localeCompare(b.last_name);
      }
      if (sortBy === 'service_name') {
        return a.service_name.localeCompare(b.service_name);
      }
      // Add other sorting criteria as needed
      return 0;
    });

    setFilteredUsers(sorted);
  };

  return (
    <div>
      {/* Filter dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Filtruoti pagal:</label>
        <div className="mt-2">
          <input
            type="checkbox"
            className="mr-2"
            value="assigned"
            onChange={e => {
              if (e.target.checked) {
                setFilterBy([...filterBy, 'assigned']);
              } else {
                setFilterBy(filterBy.filter(f => f !== 'assigned'));
              }
            }}
          />
          <label className="mr-4">Assigned</label>

          <input
            type="checkbox"
            className="mr-2"
            value="awaiting"
            onChange={e => {
              if (e.target.checked) {
                setFilterBy([...filterBy, 'awaiting']);
              } else {
                setFilterBy(filterBy.filter(f => f !== 'awaiting'));
              }
            }}
          />
          <label>Awaiting Assignment</label>
        </div>
      </div>

      {/* Sorting dropdown */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700">Rikiuoti pagal:</label>
        <select
          className="mt-1 block w-full p-2 border rounded-md"
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
        >
          <option value="first_name">First Name</option>
          <option value="last_name">Last Name</option>
          <option value="service_name">Service Name</option>
          {/* Add other sorting options as needed */}
        </select>
      </div>

      {/* Filter tags */}
      <div className='flex flex-wrap mt-4'>
        {filterBy.map((filter, index) => (
          <div
            key={index}
            className='m-1 whitespace-nowrap rounded-full bg-purple-100 px-2.5 py-0.5 text-sm text-purple-700 flex items-center'
          >
            {filter}
            <button
              onClick={() => setFilterBy(filterBy.filter(f => f !== filter))}
              className='ml-2 text-xs flex items-center'
            >
              x
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserFilter;
