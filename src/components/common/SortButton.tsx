import { DownArrow, UpArrow } from "../icons/TaskIcons";

interface SortButtonProps {
  label: string;
  isActive: boolean;
  direction: "asc" | "desc";
  onClick: () => void;
  field: "dueDate" | "createdAt" | "title" | "updatedAt" | "priority";
}

/**
 * Button component for sorting tasks by different fields
 */
export const SortButton = ({
  label,
  isActive,
  direction,
  onClick,
  field,
}: SortButtonProps) => (
  <button
    onClick={onClick}
    data-sort-field={field}
    className={`flex items-center gap-1 px-2 py-1 text-sm rounded-md transition-colors ${
      isActive
        ? "bg-blue-500 text-white hover:bg-blue-600"
        : "text-gray-400 hover:text-white hover:bg-gray-700"
    }`}
  >
    {label}
    {isActive && (
      <span className="w-4 h-4">
        {direction === "asc" ? (
          <UpArrow className="w-4 h-4" />
        ) : (
          <DownArrow className="w-4 h-4" />
        )}
      </span>
    )}
  </button>
);
