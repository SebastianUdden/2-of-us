import { forwardRef, useState } from "react";

import { PlusIcon } from "./icons/PlusIcon";
import { SearchIcon } from "./icons/SearchIcon";

interface HeaderProps {
  onAddTask: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = forwardRef(
  ({ onAddTask, searchQuery, onSearchChange }: HeaderProps, ref) => {
    const [isSearchVisible, setIsSearchVisible] = useState(false);

    return (
      <div className="flex flex-col gap-4 max-w-screen-lg mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/heart.svg"
              alt="Heart"
              className="w-8 h-8 animate-heart-pulse"
            />
            <h1 className="text-xl font-semibold text-white">Collab</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchVisible(!isSearchVisible)}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors sm:hidden"
              aria-label={isSearchVisible ? "Hide search" : "Show search"}
            >
              <SearchIcon className="w-5 h-5" />
            </button>
            <button
              onClick={onAddTask}
              className="p-2 text-gray-400 hover:text-gray-300 transition-colors"
              aria-label="Add task"
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        <div className={`${isSearchVisible ? "block" : "hidden"} sm:block`}>
          <div className="relative">
            <input
              ref={ref as React.RefObject<HTMLInputElement>}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Sök uppgifter..."
              className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-300 transition-colors"
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
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
        </div>
      </div>
    );
  }
);

export default Header;
