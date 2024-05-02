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
  onAssign: (user_id: number, issue_id: number) => void;
  onRemove: (user_id: number, issue_id: number) => void;
  onCompleted: (user_id: number, issue_id: number) => void
  project_id: number;
  filter: string;
  searchQuery: string;
};

const UserList: React.FC<UserListProps> = ({ users, onAssign, onRemove, onCompleted, project_id, filter, searchQuery }) => {
  const combinedIssues = users.flatMap(user => [
    ...user.gets_assigned.map(issueId => ({ ...user, issueId, type: 'assigned' })),
    ...user.applies.map(issueId => ({ ...user, issueId, type: 'applied' }))
  ]);

  const filteredIssues = filter === 'all' ? combinedIssues : combinedIssues.filter(issue => issue.type === filter);

  return (
    <>
      {filteredIssues.map((userWithIssue) => (
        <UserCard 
          key={`${userWithIssue.id}-${userWithIssue.issueId}`}
          user={userWithIssue} 
          onAssign={onAssign} 
          onRemove={onRemove}
          onCompleted={onCompleted}
          project_id={project_id}
          searchQuery={searchQuery}
        />
      ))}
    </>
  );
};

export default UserList;