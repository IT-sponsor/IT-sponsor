"use client";

type UserSearchProps = {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const UserSearch: React.FC<UserSearchProps> = ({ setSearchTerm }) => {
  return (
    <div className="flex">
      <input
        className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-gray-200"
        type="search"
        name="search"
        placeholder="Ieškoti..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default UserSearch;