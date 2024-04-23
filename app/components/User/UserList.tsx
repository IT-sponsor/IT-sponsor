"use client";
import UserCard from './UserCard';

type UserListProps = {
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
  }[];
  onAssign: (userId: number) => void;
  onStatusChange: (userId: number, status: string) => void;
};

const UserList: React.FC<UserListProps> = ({ users, onAssign, onStatusChange }) => {
  return (
    <>
      {users.map((user) => (
        <UserCard key={user.id} user={user} onAssign={onAssign} onStatusChange={onStatusChange} />
      ))}
    </>
  );
};

export default UserList;