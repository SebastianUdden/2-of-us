import { MinimizeIcon } from "../icons/MinimizeIcon";
import { SortButton } from "./SortButton";
import { useState } from "react";

interface SortSectionProps {
  sortField: "dueDate" | "createdAt" | "title" | "updatedAt" | "priority";
  sortDirection: "asc" | "desc";
  onSortFieldChange: (
    field: "dueDate" | "createdAt" | "title" | "updatedAt" | "priority"
  ) => void;
}

export const SortSection = ({
  sortField,
  sortDirection,
  onSortFieldChange,
}: SortSectionProps) => {
  const [isSortMinimized, setIsSortMinimized] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <SortButton
        label="Priority"
        isActive={sortField === "priority"}
        onClick={() => onSortFieldChange("priority")}
        direction={sortField === "priority" ? sortDirection : "asc"}
      />
      <SortButton
        label="Due Date"
        isActive={sortField === "dueDate"}
        onClick={() => onSortFieldChange("dueDate")}
        direction={sortField === "dueDate" ? sortDirection : "asc"}
      />
      <SortButton
        label="Created"
        isActive={sortField === "createdAt"}
        onClick={() => onSortFieldChange("createdAt")}
        direction={sortField === "createdAt" ? sortDirection : "asc"}
      />
      <SortButton
        label="Updated"
        isActive={sortField === "updatedAt"}
        onClick={() => onSortFieldChange("updatedAt")}
        direction={sortField === "updatedAt" ? sortDirection : "asc"}
      />
      <SortButton
        label="Title"
        isActive={sortField === "title"}
        onClick={() => onSortFieldChange("title")}
        direction={sortField === "title" ? sortDirection : "asc"}
      />
      <button
        onClick={() => setIsSortMinimized(!isSortMinimized)}
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
      >
        <MinimizeIcon
          className="w-4 h-4 text-gray-500"
          isMinimized={isSortMinimized}
        />
      </button>
    </div>
  );
};
