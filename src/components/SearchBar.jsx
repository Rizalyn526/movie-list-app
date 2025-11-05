function SearchBar({ searchTerm, setSearchTerm, onSearch }) {
  return (
    <div className="w-full max-w-xl px-4 py-4 sm:py-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
          placeholder="Search for movies..."
          className="flex-1 px-3 sm:px-4 py-2 sm:py-3 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={onSearch}
          className="px-4 sm:px-6 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm sm:text-base font-medium"
        >
          Search
        </button>
      </div>
    </div>
  );
}

export default SearchBar;