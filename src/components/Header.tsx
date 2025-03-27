import AddTaskButton from "./AddTaskButton";
import { ScrollButtons } from "./ScrollButtons";
import { Task } from "../types/Task";

interface HeaderProps {
  onAddTask: (task: Task) => void;
  totalTasks: number;
  onScrollToTop: () => void;
  onScrollToBottom: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header = ({
  onAddTask,
  totalTasks,
  onScrollToTop,
  onScrollToBottom,
  searchQuery,
  onSearchChange,
}: HeaderProps) => {
  return (
    <header className="bg-gray-900">
      <div className="max-w-4xl mx-auto py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/src/assets/heart.svg"
            alt="Heart"
            className="w-8 h-8 animate-heart-pulse"
          />
          <h1 className="text-xl font-semibold text-white">2 of Us</h1>
        </div>
        <div className="flex items-center gap-4">
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
          <ScrollButtons
            onScrollToTop={onScrollToTop}
            onScrollToBottom={onScrollToBottom}
          />
          <AddTaskButton onAddTask={onAddTask} totalTasks={totalTasks} />
        </div>
      </div>
    </header>
  );
};

export default Header;
