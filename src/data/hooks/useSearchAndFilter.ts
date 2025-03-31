import { useCallback, useMemo, useState } from "react";

import { Task } from "../../types/Task";

interface UseSearchAndFilterResult {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedLabel: string | null;
  setSelectedLabel: (label: string | null) => void;
  tasksWithDueDate: number;
  completedCount: number;
  getFilteredTasks: (tasks: Task[]) => Task[];
}

export const useSearchAndFilter = (tasks: Task[]): UseSearchAndFilterResult => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);

  const getFilteredTasks = useCallback(
    (tasks: Task[]): Task[] => {
      return tasks.filter((task) => {
        const matchesSearch = searchQuery
          ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.description
              .toLowerCase()
              .includes(searchQuery.toLowerCase()) ||
            task.author.toLowerCase().includes(searchQuery.toLowerCase())
          : true;

        const matchesLabel = selectedLabel
          ? task.labels?.includes(selectedLabel) ?? false
          : true;

        return matchesSearch && matchesLabel;
      });
    },
    [searchQuery, selectedLabel]
  );

  const tasksWithDueDate = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = searchQuery
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.author.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesSearch && task.dueDate;
    }).length;
  }, [tasks, searchQuery]);

  const completedCount = useMemo(() => {
    return tasks.filter((task) => {
      const matchesSearch = searchQuery
        ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.author.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesSearch && task.completed;
    }).length;
  }, [tasks, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    selectedLabel,
    setSelectedLabel,
    tasksWithDueDate,
    completedCount,
    getFilteredTasks,
  };
};
