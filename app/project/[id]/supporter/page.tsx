"use client";
import { useEffect, useState } from 'react';
import UserSearch from '@/app/components/User/UserSearch';
import UserFilter from '@/app/components/User/UserFilter';
import UserList from '@/app/components/User/UserList';

interface User {
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

export default function Supporter() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [ issue, setIssue ] = useState<any>(null);
  
  // Fetch users from API if they have assignments or registrations
  useEffect(() => {
    fetch('/api/user', {
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
      setUsers(data.users);
    })
    .catch(error => {
      console.error("Error fetching users:", error.message);
    });
  }, []);

  const handleAssign = (userId: number) => {
    // Logic to assign user to service
  };

  const handleRemove = (userId: number) => {
    // Logic to remove user from service
  };

  const handleCompleted = (userId: number) => {
    // Logic to mark user as completed
  };

  return (
    <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl overflow-y-auto'>
      {/* <UserSearch setSearchTerm={setSearchTerm} /> */}
      {/* <UserFilter users={users} setFilteredUsers={setFilteredUsers} /> */}
      <UserList users={users} onAssign={handleAssign} onRemove={handleRemove} onCompleted={handleCompleted} />
    </div>
  );
};