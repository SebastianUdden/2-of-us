import { ANIMATION } from "./task-card/constants";
import { ArchiveIcon } from "./icons/ArchiveIcon";
import { CheckmarkIcon } from "./icons/CheckmarkIcon";
import { ListIcon } from "./icons/ListIcon";

interface TabsProps {
  view: "todos" | "archive" | "lists";
  onViewChange: (view: "todos" | "archive" | "lists") => void;
}

const Tabs = ({ view, onViewChange }: TabsProps) => {
  return (
    <div className="flex border-b border-gray-700">
      <button
        onClick={() => onViewChange("todos")}
        className={`
          px-4 py-2 text-sm font-medium transition-all duration-${
            ANIMATION.DURATION
          } ${ANIMATION.EASING}
          ${
            view === "todos"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }
        `}
      >
        <CheckmarkIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Todos</span>
      </button>
      <button
        onClick={() => onViewChange("archive")}
        className={`
          px-4 py-2 text-sm font-medium transition-all duration-${
            ANIMATION.DURATION
          } ${ANIMATION.EASING}
          ${
            view === "archive"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }
        `}
      >
        <ArchiveIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Archive</span>
      </button>
      <button
        onClick={() => onViewChange("lists")}
        className={`
          px-4 py-2 text-sm font-medium transition-all duration-${
            ANIMATION.DURATION
          } ${ANIMATION.EASING}
          ${
            view === "lists"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }
        `}
      >
        <ListIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Lists</span>
      </button>
    </div>
  );
};

export default Tabs;
