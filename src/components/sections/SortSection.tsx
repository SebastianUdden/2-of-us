import { SortButton } from "../common/SortButton";

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
  return (
    <div className="flex items-center gap-2">
      <SortButton
        label="Prioritet"
        isActive={sortField === "priority"}
        onClick={() => onSortFieldChange("priority")}
        direction={"asc"}
      />
      <SortButton
        label="Tid kvar"
        isActive={sortField === "dueDate"}
        onClick={() => onSortFieldChange("dueDate")}
        direction={sortField === "dueDate" ? sortDirection : "asc"}
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
    </div>
  );
};
