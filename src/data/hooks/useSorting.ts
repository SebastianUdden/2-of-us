import { useCallback, useState } from "react";

import { Task } from "../../types/Task";

type SortField = "dueDate" | "createdAt" | "title" | "updatedAt" | "priority";
type SortDirection = "asc" | "desc";

interface UseSortingResult {
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
  getSortedTasks: (tasks: Task[]) => Task[];
}

export const useSorting = (): UseSortingResult => {
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = useCallback(
    (field: SortField) => {
      if (sortField === field) {
        setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      } else {
        setSortField(field);
        setSortDirection("asc");
      }
    },
    [sortField, sortDirection]
  );

  const getSortedTasks = useCallback(
    (tasks: Task[]): Task[] => {
      return [...tasks].sort((a, b) => {
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
    },
    [sortField, sortDirection]
  );

  return {
    sortField,
    sortDirection,
    handleSort,
    getSortedTasks,
  };
};
