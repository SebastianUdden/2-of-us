import { List } from "../../types/List";
import { Task } from "../../types/Task";

type SortField = "dueDate" | "createdAt" | "title" | "updatedAt" | "priority";
type SortDirection = "asc" | "desc";

interface UseSortedTasksProps {
  tasks: Task[];
  sortField: SortField;
  sortDirection: SortDirection;
}

interface UseSortedListsProps {
  lists: List[];
  sortField: SortField;
  sortDirection: SortDirection;
}

export const useSortedTasks = ({
  tasks,
  sortField,
  sortDirection,
}: UseSortedTasksProps) => {
  const sortedTasks = [...tasks].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "priority":
        // For priority, always sort by lowest number first (highest priority)
        return a.priority - b.priority;
      case "dueDate":
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return multiplier * (a.dueDate.getTime() - b.dueDate.getTime());
      case "createdAt": {
        // Use the latest update time instead of creation time
        const aLatest =
          a.updates[a.updates.length - 1]?.updatedAt || a.createdAt;
        const bLatest =
          b.updates[b.updates.length - 1]?.updatedAt || b.createdAt;
        return multiplier * (aLatest.getTime() - bLatest.getTime());
      }
      case "updatedAt": {
        const aLatest =
          a.updates[a.updates.length - 1]?.updatedAt || a.createdAt;
        const bLatest =
          b.updates[b.updates.length - 1]?.updatedAt || b.createdAt;
        return multiplier * (aLatest.getTime() - bLatest.getTime());
      }
      case "title":
        return multiplier * a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  return sortedTasks;
};

export const useSortedLists = ({
  lists,
  sortField,
  sortDirection,
}: UseSortedListsProps) => {
  const sortedLists = [...lists].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;

    switch (sortField) {
      case "priority":
        return a.priority - b.priority;
      case "title":
        return multiplier * a.title.localeCompare(b.title);
      case "createdAt": {
        // Use the latest update time instead of creation time
        const aLatest = a.updatedAt || a.createdAt;
        const bLatest = b.updatedAt || b.createdAt;
        return multiplier * (aLatest.getTime() - bLatest.getTime());
      }
      case "updatedAt": {
        const aLatest = a.updatedAt || a.createdAt;
        const bLatest = b.updatedAt || b.createdAt;
        return multiplier * (aLatest.getTime() - bLatest.getTime());
      }
      default:
        return 0;
    }
  });

  return sortedLists;
};
