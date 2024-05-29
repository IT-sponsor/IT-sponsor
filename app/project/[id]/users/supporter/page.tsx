"use client";
import { useEffect, useState } from 'react';
import UserSearch from '@/app/components/User/UserSearch';
import UserFilter from '@/app/components/User/UserFilter';
import UserList from '@/app/components/User/UserList';
import { toast } from 'sonner';

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

export default function Supporter( { params }: { params: { id: number } }) {
  const project_id = params.id;
  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  async function fetchUsers() {
    fetch(`/api/user`, {
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
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function handleAssign(user_id: number, issue_id: number) {
    try {
        const response = await fetch(`/api/gets_assigned/new`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                issue_id: issue_id,
                user_id: user_id,
            }),
        });

        if (response.ok) {
          toast.success('Naudotojas pridėtas prie trūkumo');
          fetchUsers();
        } else {
          console.error('Failed to add user to issue' + response.status);
          toast.error('Nepavyko pridėti naudotojo prie trūkumo');
        }
    } catch (error) {
      console.log('Error adding user to issue:', error);
      toast.error('Įvyko klaida pridedant naudotoją prie trūkumo');
    }
  }

  async function handleRemove(user_id: number, issue_id: number): Promise<void> {
    try {
      const response = await fetch(`/api/gets_assigned/${issue_id}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              issue_id: issue_id,
              user_id: user_id,
          }),
      });

      if (response.ok) {
        toast.success('Naudotojas pašalintas iš trūkumo');
        fetchUsers();
      } else {
        console.log('Failed to remove user from issue' + response.status);
        toast.error('Nepavyko pašalinti naudotojo iš trūkumo');
      }
    } catch (error) {
      console.log('Error removing user from issue:', error);
      toast.error('Įvyko klaida pašalinant naudotoją iš trūkumo');
    }
  };

  async function handleCompleted(user_id: number, issue_id: number): Promise<void> {
    try {
      const response = await fetch(`/api/gets_assigned/${issue_id}/update`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
      });

      if (response.ok) {
        toast.success('Trūkumas pažymėtas kaip išspręstas');
        fetchUsers();
      } else {
        console.log('Failed to mark issue as completed' + response.status);
        toast.error('Nepavyko pažymėti trūkumo kaip išspręsto');
      }
    } catch (error) {
      console.log('Error marking issue as completed:', error);
      toast.error('Įvyko klaida pažymint trūkumą kaip išspręstą');
    }
  };
  return (
    <>
    <div className='flex flex-row items-end pt-6 w-full max-w-5xl overflow-y-auto'>
      <UserSearch setSearchTerm={setSearchQuery} />
      <UserFilter setFilter={setFilter} />
    </div>
    <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl overflow-y-auto'>
      {users.length === 0 ? <div>Nėra rėmėjų</div> :
        <UserList users={ users } onAssign={handleAssign} onRemove={handleRemove} onCompleted={handleCompleted} project_id={project_id} filter={filter} searchQuery={searchQuery} />
      }
    </div>
    </>
  );
};