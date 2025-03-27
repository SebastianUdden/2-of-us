import AddTaskButton from "./AddTaskButton";
import { ScrollButtons } from "./ScrollButtons";
import SearchInput from "./SearchInput";
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
          <div className=" hidden md:block">
            <SearchInput
              searchQuery={searchQuery}
              onSearchChange={onSearchChange}
            />
          </div>
          <ScrollButtons
            onScrollToTop={onScrollToTop}
            onScrollToBottom={onScrollToBottom}
          />
          <AddTaskButton onAddTask={onAddTask} totalTasks={totalTasks} />
        </div>
      </div>
      <div className="md:hidden">
        <SearchInput
          searchQuery={searchQuery}
          onSearchChange={onSearchChange}
        />
      </div>
    </header>
  );
};

export default Header;
