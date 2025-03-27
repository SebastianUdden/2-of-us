import { ArchiveIcon } from "./icons/ArchiveIcon";
import { CheckmarkIcon } from "./icons/CheckmarkIcon";
import { ListIcon } from "./icons/ListIcon";

interface ViewToggleProps {
  view: "todos" | "archive" | "lists";
  onViewChange: (view: "todos" | "archive" | "lists") => void;
}

export const ViewToggle = ({ view, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onViewChange("todos")}
        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
          view === "todos"
            ? "bg-blue-500/20 text-blue-400"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        <CheckmarkIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Todos</span>
      </button>
      <button
        onClick={() => onViewChange("archive")}
        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
          view === "archive"
            ? "bg-blue-500/20 text-blue-400"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        <ArchiveIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Archive</span>
      </button>
      <button
        onClick={() => onViewChange("lists")}
        className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
          view === "lists"
            ? "bg-blue-500/20 text-blue-400"
            : "text-gray-400 hover:text-gray-300"
        }`}
      >
        <ListIcon className="w-5 h-5" />
        <span className="text-sm font-medium">Lists</span>
      </button>
    </div>
  );
};
