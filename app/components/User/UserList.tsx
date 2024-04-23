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
  onRemove: (userId: number) => void;
  onCompleted: (userId: number) => void
};

const UserList: React.FC<UserListProps> = ({ users, onAssign, onRemove, onCompleted }) => {
  const combinedIssues = users.flatMap(user => [
    ...user.gets_assigned.map(issueId => ({ ...user, issueId, type: 'assigned' })),
    ...user.applies.map(issueId => ({ ...user, issueId, type: 'applied' }))
  ]);

  return (
    <>
      {combinedIssues.map((userWithIssue) => (
        <UserCard 
          key={`${userWithIssue.id}-${userWithIssue.issueId}`}
          user={userWithIssue} 
          onAssign={onAssign} 
          onRemove={onRemove}
          onCompleted={onCompleted} 
        />
      ))}
    </>
  );
};

export default UserList;