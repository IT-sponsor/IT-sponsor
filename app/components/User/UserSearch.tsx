"use client";

type UserSearchProps = {
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
};

const UserSearch: React.FC<UserSearchProps> = ({ setSearchTerm }) => {
  return (
    <div className="pt-2 relative mx-auto text-gray-600">
      <input
        className="border-2 border-gray-300 bg-white h-10 px-5 pr-16 rounded-lg text-sm focus:outline-none"
        type="search"
        name="search"
        placeholder="Ieškoti..."
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default UserSearch;