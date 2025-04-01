import { useCallback, useState } from "react";

import { ANIMATION } from "../../components/task-card/constants";
import { List } from "../../types/List";
import { Task } from "../../types/Task";

interface UsePriorityManagementResult {
  sortTasks: (tasks: Task[]) => Task[];
  sortLists: (lists: List[]) => List[];
  handlePriorityChange: (taskId: string, newPosition: number) => void;
  handleListPriorityChange: (listId: string, newPosition: number) => void;
  handleTaskMove: () => void;
  handleListMove: () => void;
  pendingTaskMove: { taskId: string; newPosition: number } | null;
  pendingListMove: { listId: string; newPosition: number } | null;
  animatingTaskId: string | null;
  animatingListId: string | null;
  animatingTaskHeight: number | null;
  animatingListHeight: number | null;
  isCollapsed: boolean;
  setAnimatingTaskId: (id: string | null) => void;
  setAnimatingListId: (id: string | null) => void;
  setAnimatingTaskHeight: (height: number | null) => void;
  setAnimatingListHeight: (height: number | null) => void;
  setIsCollapsed: (isCollapsed: boolean) => void;
}

export const usePriorityManagement = (
  onTasksUpdate: (tasks: Task[] | ((prevTasks: Task[]) => Task[])) => void,
  onListsUpdate: (lists: List[] | ((prevLists: List[]) => List[])) => void
): UsePriorityManagementResult => {
  const [pendingTaskMove, setPendingTaskMove] = useState<{
    taskId: string;
    newPosition: number;
  } | null>(null);
  const [pendingListMove, setPendingListMove] = useState<{
    listId: string;
    newPosition: number;
  } | null>(null);
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);
  const [animatingListId, setAnimatingListId] = useState<string | null>(null);
  const [animatingTaskHeight, setAnimatingTaskHeight] = useState<number | null>(
    null
  );
  const [animatingListHeight, setAnimatingListHeight] = useState<number | null>(
    null
  );
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

  const handlePriorityChange = useCallback(
    (taskId: string, newPosition: number) => {
      setAnimatingTaskId(taskId);
      setPendingTaskMove({ taskId, newPosition });
      setIsCollapsed(true);
    },
    []
  );

  const handleListPriorityChange = useCallback(
    (listId: string, newPosition: number) => {
      setAnimatingListId(listId);
      setPendingListMove({ listId, newPosition });
      setIsCollapsed(true);
    },
    []
  );

  const handleTaskMove = useCallback(() => {
    if (!pendingTaskMove) return;

    const { taskId, newPosition } = pendingTaskMove;
    onTasksUpdate((prevTasks: Task[]) => {
      const taskIndex = prevTasks.findIndex((task) => task.id === taskId);
      const newTasks = [...prevTasks];
      const [movedTask] = newTasks.splice(taskIndex, 1);
      newTasks.splice(newPosition - 1, 0, movedTask);

      // Sort tasks and update priorities
      return sortTasks(newTasks);
    });

    // Start expand animation
    setIsCollapsed(false);

    // Wait for expand animation and then scroll to the task
    setTimeout(() => {
      setAnimatingTaskId(null);
      setPendingTaskMove(null);
      setAnimatingTaskHeight(null);

      // Scroll to the task
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, ANIMATION.DURATION);
  }, [pendingTaskMove, sortTasks, onTasksUpdate]);

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

    // Wait for expand animation and then scroll to the list
    setTimeout(() => {
      setAnimatingListId(null);
      setPendingListMove(null);
      setAnimatingListHeight(null);

      // Scroll to the list with offset based on the list's height
      const listElement = document.getElementById(`list-${listId}`);
      if (listElement && animatingListHeight) {
        const offset = animatingListHeight / 2;
        const elementPosition = listElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else if (listElement) {
        listElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, ANIMATION.DURATION);
  }, [pendingListMove, sortLists, animatingListHeight, onListsUpdate]);

  return {
    sortTasks,
    sortLists,
    handlePriorityChange,
    handleListPriorityChange,
    handleTaskMove,
    handleListMove,
    pendingTaskMove,
    pendingListMove,
    animatingTaskId,
    animatingListId,
    animatingTaskHeight,
    animatingListHeight,
    isCollapsed,
    setAnimatingTaskId,
    setAnimatingListId,
    setAnimatingTaskHeight,
    setAnimatingListHeight,
    setIsCollapsed,
  };
};
