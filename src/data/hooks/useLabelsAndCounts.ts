import { List } from "../../types/List";
import { Task } from "../../types/Task";
import { useMemo } from "react";

/**
 * Hook to calculate unique labels and their counts from tasks or lists
 * @param tasks - Array of tasks
 * @param lists - Array of lists
 * @param tab - Current tab ('todos' or 'lists')
 * @param searchQuery - Current search query
 * @returns Object containing unique labels and their counts
 */
export const useLabelsAndCounts = (
  tasks: Task[],
  lists: List[],
  tab: string,
  searchQuery: string
) => {
  const array = tab === "todos" ? tasks : lists;
  const labels = useMemo(() => {
    return new Set([...array.flatMap((task) => task.labels || [])]);
  }, [array]);

  const counts = Array.from(labels).reduce((acc, label) => {
    const count = array.filter((item) => {
      // First check if task matches search query
      const matchesSearch = searchQuery
        ? item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description ?? "")
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        : true;

      // Then check if task has the label
      const hasLabel = item.labels?.includes(label);

      return matchesSearch && hasLabel;
    }).length;

    return { ...acc, [label]: count };
  }, {} as Record<string, number>);

  return { labels, counts };
};
