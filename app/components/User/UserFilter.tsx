"use client";

type UserFilterProps = {
  setFilter: React.Dispatch<React.SetStateAction<string>>
};

const UserFilter: React.FC<UserFilterProps> = ({ setFilter }) => {
  return (
  <div className="flex">
  <div className="mt-4 ml-4">
    <label className="flex text-sm font-medium text-gray-700">Filtras:</label>
    <select
      className="border-2 border-gray-300 bg-white h-10 px-2 mt-1 rounded-lg text-sm focus:outline-gray-300 active:outline-gray-300"
      onChange={e => setFilter(e.target.value)}
    >
      <option value="all">Visi</option>
      <option value="applied">Norintys taisyti</option>
      <option value="assigned">Paskirti taisyti</option>
    </select>
  </div>
  </div>
  );
};

export default UserFilter;
