import { useCallback, useEffect, useState } from "react";

import { List } from "../../types/List";
import { Task } from "../../types/Task";
import { useSortPersistence } from "./useSortPersistence";

type SortField = "dueDate" | "createdAt" | "title" | "updatedAt" | "priority";
type SortDirection = "asc" | "desc";

interface UseSortingResult {
  sortField: SortField;
  sortDirection: SortDirection;
  handleSort: (field: SortField) => void;
  getSortedTasks: (tasks: Task[]) => Task[];
  getSortedLists: (lists: List[]) => List[];
}

export const useSorting = (): UseSortingResult => {
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const { loadSort, saveSort } = useSortPersistence();

  // Load saved sort preferences on mount
  useEffect(() => {
    const loadSavedSort = async () => {
      const { field, direction } = await loadSort();
      setSortField(field);
      setSortDirection(direction);
    };
    loadSavedSort();
  }, []);

  const handleSort = useCallback(
    async (field: SortField) => {
      const newDirection =
        sortField === field
          ? sortDirection === "asc"
            ? "desc"
            : "asc"
          : "asc";

      setSortField(field);
      setSortDirection(newDirection);
      await saveSort(field, newDirection);
    },
    [sortField, sortDirection, saveSort]
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
            return (
              multiplier *
              (new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
            );
          case "updatedAt": {
            const aLatest =
              a.updates && a.updates.length > 0
                ? a.updates[a.updates.length - 1].updatedAt
                : a.createdAt;
            const bLatest =
              b.updates && b.updates.length > 0
                ? b.updates[b.updates.length - 1].updatedAt
                : b.createdAt;
            return (
              multiplier *
              (new Date(aLatest).getTime() - new Date(bLatest).getTime())
            );
          }
          case "title":
            return multiplier * a.title.localeCompare(b.title);
          case "createdAt": {
            return (
              multiplier *
              (new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime())
            );
          }
          default:
            return 0;
        }
      });
    },
    [sortField, sortDirection]
  );

  const getSortedLists = useCallback(
    (lists: List[]): List[] => {
      return [...lists].sort((a, b) => {
        const multiplier = sortDirection === "asc" ? 1 : -1;

        switch (sortField) {
          case "priority":
            return a.priority - b.priority;
          case "title":
            return multiplier * a.title.localeCompare(b.title);
          case "updatedAt": {
            const aLatest = new Date(a.updatedAt);
            const bLatest = new Date(b.updatedAt);
            return multiplier * (aLatest.getTime() - bLatest.getTime());
          }
          case "createdAt": {
            const aLatest = new Date(a.createdAt);
            const bLatest = new Date(b.createdAt);
            return multiplier * (aLatest.getTime() - bLatest.getTime());
          }
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
    getSortedLists,
  };
};
