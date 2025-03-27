interface SearchInputProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const SearchInput = ({ searchQuery, onSearchChange }: SearchInputProps) => {
  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        className="pl-10 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
      <svg
        className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>
      {searchQuery && (
        <button
          onClick={() => onSearchChange("")}
          className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-200 transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default SearchInput;
