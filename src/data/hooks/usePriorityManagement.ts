import { useCallback, useState } from "react";

import { ANIMATION } from "../../components/task-card/constants";
import { List } from "../../types/List";
import { Task } from "../../types/Task";

type Direction = "top" | "bottom" | "up" | "down";
interface UsePriorityManagementResult {
  sortTasks: (tasks: Task[]) => Task[];
  sortLists: (lists: List[]) => List[];
  handlePriorityChange: (taskId: string, newPosition: number) => void;
  handleListPriorityChange: (listId: string, newPosition: number) => void;
  handleTaskMove: (direction: Direction, expandedTaskId: string | null) => void;
  handleListMove: () => void;
  pendingListMove: { listId: string; newPosition: number } | null;
  isCollapsed: boolean;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const usePriorityManagement = (
  onTasksUpdate: (tasks: Task[] | ((prevTasks: Task[]) => Task[])) => void,
  onListsUpdate: (lists: List[] | ((prevLists: List[]) => List[])) => void
): UsePriorityManagementResult => {
  const [pendingListMove, setPendingListMove] = useState<{
    listId: string;
    newPosition: number;
  } | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const sortTasks = useCallback((tasks: Task[]): Task[] => {
    // First sort by completion status (completed tasks go to bottom)
    const sortedByCompletion = [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    // Then sort by priority within each group (completed/uncompleted)
    return sortedByCompletion.map((task, index) => ({
      ...task,
      priority: index + 1,
    }));
  }, []);

  const sortLists = useCallback((lists: List[]): List[] => {
    // First sort by completion status (completed lists go to bottom)
    const sortedByCompletion = [...lists].sort((a, b) => {
      const aCompleted = a.items.every((item) => item.completed);
      const bCompleted = b.items.every((item) => item.completed);
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      return 0;
    });

    // Then sort by priority within each group (completed/uncompleted)
    return sortedByCompletion.map((list, index) => ({
      ...list,
      priority: index + 1,
    }));
  }, []);

  const handlePriorityChange = (taskId: string, newPosition: number) => {
    onTasksUpdate((prevTasks: Task[]) => {
      setIsCollapsed(true);
      const movedTask = prevTasks.find((t) => t.id === taskId) as Task;
      const newTasks = prevTasks.filter((t) => t.id !== taskId);
      newTasks.splice(newPosition - 1, 0, movedTask);
      return sortTasks(newTasks);
    });
    setTimeout(() => {
      setIsCollapsed(false);
    }, ANIMATION.DURATION);
  };

  const handleListPriorityChange = useCallback(
    (listId: string, newPosition: number) => {
      setPendingListMove({ listId, newPosition });
      setIsCollapsed(true);
    },
    []
  );

  const handleTaskMove = useCallback(
    (direction: Direction = "down", expandedTaskId: string | null = null) => {
      onTasksUpdate((prevTasks: Task[]) => {
        const taskIndex = prevTasks.findIndex(
          (task) => task.id === expandedTaskId
        );
        const newTasks = [...prevTasks];
        const [movedTask] = newTasks.splice(taskIndex, 1);
        if (direction === "bottom" || (direction === "up" && taskIndex === 0)) {
          newTasks.splice(newTasks.length, 0, movedTask);
        } else if (
          direction === "top" ||
          (direction === "down" && taskIndex === newTasks.length)
        ) {
          newTasks.splice(0, 0, movedTask);
        } else {
          newTasks.splice(
            taskIndex + (direction === "down" ? 1 : -1),
            0,
            movedTask
          );
        }

        // Sort tasks and update priorities
        return sortTasks(newTasks);
      });

      // Start expand animation
      setIsCollapsed(true);

      // Wait for expand animation and then scroll to the task
      setTimeout(() => {
        setIsCollapsed(false);

        // Scroll to the task
        const taskElement = document.getElementById(`task-${expandedTaskId}`);
        if (taskElement) {
          taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, ANIMATION.DURATION);
    },
    [sortTasks, onTasksUpdate]
  );

  const handleListMove = useCallback(() => {
    if (!pendingListMove) return;
    const { listId, newPosition } = pendingListMove;

    onListsUpdate((prevLists: List[]) => {
      const listIndex = prevLists.findIndex((list) => list.id === listId);
      const newLists = [...prevLists];
      const [movedList] = newLists.splice(listIndex, 1);
      newLists.splice(newPosition - 1, 0, movedList);
      return sortLists(newLists);
    });

    // Start expand animation
    setIsCollapsed(false);
  }, [pendingListMove, sortLists, onListsUpdate]);

  return {
    sortTasks,
    sortLists,
    handlePriorityChange,
    handleListPriorityChange,
    handleTaskMove,
    handleListMove,
    pendingListMove,
    isCollapsed,
    setIsCollapsed,
  };
};
