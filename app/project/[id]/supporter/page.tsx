"use client";
import { useEffect, useState } from 'react';
import UserSearch from '@/app/components/User/UserSearch';
import UserFilter from '@/app/components/User/UserFilter';
import UserList from '@/app/components/User/UserList';
import Modal from '@/app/components/Navigation/Modal';

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
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  // Fetch users from API if they have assignments or registrations
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

  // Should be good: need to make sure BOTH of the database actions are completed successfully, otherwise, reset and throw an error
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
          openModal();
          setModalMessage('Naudotojas priskirtas prie trūkumo');
          console.log('User added to issue');
          fetchUsers();
        } else {
          openModal();
          setModalMessage('Nepavyko pridėti naudotojo prie trūkumo: ' + response.statusText);
          console.log('Failed to add user to issue' + response.statusText);
        }
    } catch (error) {
      openModal();
      setModalMessage('Įvyko klaida pridedant naudotoją prie trūkumo');
      console.error('Failed to add user to issue:', error);
    }
  }

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

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
        openModal();
        setModalMessage('Naudotojas pašalintas iš norinčių remti');
        console.log('User removed from issue');
        fetchUsers();
      } else {
        openModal();
        setModalMessage('Nepavyko pašalinti naudotojo iš norinčių taisyti: ' + response.statusText);
        console.log('Failed to remove user from issue' + response.statusText);
      }
    } catch (error) {
      openModal();
      setModalMessage('Įvyko klaida pašalinant naudotoją iš norinčių taisyti');
      console.error('Failed to remove user from issue:', error);
    }
  };

  async function handleCompleted(user_id: number, issue_id: number): Promise<void> {
    // Close issue
    // Remove all users from issue
    try {
      const response = await fetch(`/api/gets_assigned/${issue_id}/update`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          }
      });

      if (response.ok) {
        openModal();
        setModalMessage('Trūkumas sėkmingai uždarytas');
        console.log('Issue status updated successfully');
        fetchUsers();
      } else {
        openModal();
        setModalMessage('Nepavyko atnaujinti trūkumo būsenos: ' + response.statusText);
        console.log('Failed to update issue status' + response.statusText);
      }
    } catch (error) {
      openModal();
      setModalMessage('Įvyko klaida atnaujinant trūkumo būseną');
      console.error('Failed to update issue status:', error);
    }
  };
  return (
    <>
    <div className='flex flex-row items-end pt-6 w-full max-w-5xl overflow-y-auto'>
      <UserSearch setSearchTerm={setSearchQuery} />
      <UserFilter setFilter={setFilter} />
    </div>
    <div className='flex flex-col items-center justify-center pt-6 w-full max-w-5xl overflow-y-auto'>
      <Modal isOpen={modalOpen} onClose={closeModal} message={modalMessage} />
      {users.length === 0 ? <div>Nėra rėmėjų</div> :
        <UserList users={ users } onAssign={handleAssign} onRemove={handleRemove} onCompleted={handleCompleted} project_id={project_id} filter={filter} searchQuery={searchQuery} />
      }
    </div>
    </>
  );
};