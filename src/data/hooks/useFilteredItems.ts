import { LabelFilter, LabelState } from "../../types/LabelState";

import { List } from "../../types/List";
import { Task } from "../../types/Task";

interface UseFilteredTasksProps {
  tasks: Task[];
  searchQuery: string;
  labelFilters: LabelFilter[];
  selectedLabel: string | null;
  tab: "todos" | "archive" | "lists" | "docs";
}

interface UseFilteredListsProps {
  lists: List[];
  searchQuery: string;
  labelFilters: LabelFilter[];
  selectedLabel: string | null;
}

export const useFilteredTasks = ({
  tasks,
  searchQuery,
  labelFilters,
  selectedLabel,
  tab,
}: UseFilteredTasksProps) => {
  const filteredTasks = tasks.filter((task) => {
    // First filter by view (todos/archive)
    if (tab === "todos" && task.archived) return false;
    if (tab === "archive" && !task.archived) return false;

    // Then apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.username?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Then apply label filters
    if (labelFilters.length > 0) {
      return labelFilters.every((filter) => {
        if (filter.label === "completed") {
          if (filter.state === LabelState.SHOW_ONLY) return task.completed;
          if (filter.state === LabelState.SHOW_OTHERS) return !task.completed;
          return true;
        }
        if (filter.label === "due-date") {
          if (filter.state === LabelState.SHOW_ONLY) return !!task.dueDate;
          if (filter.state === LabelState.SHOW_OTHERS) return !task.dueDate;
          return true;
        }
        if (
          filter.label === "S" ||
          filter.label === "M" ||
          filter.label === "L"
        ) {
          if (filter.state === LabelState.SHOW_ONLY)
            return task.size === filter.label;
          if (filter.state === LabelState.SHOW_OTHERS)
            return task.size !== filter.label;
          return true;
        }
        const hasLabel = task.labels?.includes(filter.label);
        if (filter.state === LabelState.SHOW_ONLY) return hasLabel;
        if (filter.state === LabelState.SHOW_OTHERS) return !hasLabel;
        return true;
      });
    }

    // Apply selected label filter
    if (selectedLabel) {
      return task.labels?.includes(selectedLabel);
    }

    return true;
  });

  return filteredTasks;
};

export const useFilteredLists = ({
  lists,
  searchQuery,
  labelFilters,
  selectedLabel,
}: UseFilteredListsProps) => {
  const filteredLists = lists.filter((list) => {
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        list.title.toLowerCase().includes(searchLower) ||
        (list.description?.toLowerCase() || "").includes(searchLower) ||
        list.items.some((item) =>
          item.content.toLowerCase().includes(searchLower)
        );
      if (!matchesSearch) return false;
    }

    // Apply label filters
    if (labelFilters.length > 0) {
      return labelFilters.every((filter) => {
        if (filter.label === "completed") {
          const isCompleted = list.items.every((item) => item.completed);
          if (filter.state === LabelState.SHOW_ONLY) return isCompleted;
          if (filter.state === LabelState.SHOW_OTHERS) return !isCompleted;
          return true;
        }
        const hasLabel = list.labels?.includes(filter.label);
        if (filter.state === LabelState.SHOW_ONLY) return hasLabel;
        if (filter.state === LabelState.SHOW_OTHERS) return !hasLabel;
        return true;
      });
    }

    // Apply selected label filter
    if (selectedLabel) {
      return list.labels?.includes(selectedLabel);
    }

    return true;
  });

  return filteredLists;
};
