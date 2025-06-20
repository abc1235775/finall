'use client';

const SearchBar = ({ onSearch }) => {
  return (
    <div className="relative mb-6">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <span className="text-gray-500">🔍</span>
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg 
                 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                 bg-white shadow-sm"
        placeholder="搜尋停車場名稱..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;