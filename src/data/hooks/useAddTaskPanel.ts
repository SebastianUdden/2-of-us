import { useCallback, useState } from "react";

import { Task } from "../../types/Task";

interface UseAddTaskPanelResult {
  isAddTaskPanelOpen: boolean;
  parentTaskId: string | undefined;
  parentTaskTitle: string | undefined;
  openAddTaskPanel: (parentTaskId?: string, parentTaskTitle?: string) => void;
  closeAddTaskPanel: () => void;
  handleAddTask: (newTask: Task) => void;
}

export const useAddTaskPanel = (
  tasks: Task[],
  onTasksUpdate: (tasks: Task[]) => void,
  onExpandedTaskIdChange?: (taskId: string | null) => void
): UseAddTaskPanelResult => {
  const [isAddTaskPanelOpen, setIsAddTaskPanelOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<string | undefined>();
  const [parentTaskTitle, setParentTaskTitle] = useState<string | undefined>();

  const openAddTaskPanel = useCallback(
    (parentTaskId?: string, parentTaskTitle?: string) => {
      setIsAddTaskPanelOpen(true);
      setParentTaskId(parentTaskId);
      setParentTaskTitle(parentTaskTitle);
    },
    []
  );

  const closeAddTaskPanel = useCallback(() => {
    setIsAddTaskPanelOpen(false);
    setParentTaskId(undefined);
    setParentTaskTitle(undefined);
  }, []);

  const handleAddTask = useCallback(
    (newTask: Task) => {
      if (parentTaskId) {
        // Add as subtask
        onTasksUpdate(
          tasks.map((task) => {
            if (task.id === parentTaskId) {
              return {
                ...task,
                subtasks: [...task.subtasks, newTask],
              };
            }
            return task;
          })
        );
        // Automatically expand the parent task
        onExpandedTaskIdChange?.(parentTaskId);
      } else {
        // Add as main task
        onTasksUpdate([...tasks, newTask]);
        onExpandedTaskIdChange?.(newTask.id);
        setTimeout(() => {
          const taskElement = document.getElementById(`task-${newTask.id}`);
          if (taskElement) {
            taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        }, 100);
      }
      closeAddTaskPanel();
    },
    [
      tasks,
      parentTaskId,
      onTasksUpdate,
      onExpandedTaskIdChange,
      closeAddTaskPanel,
    ]
  );

  return {
    isAddTaskPanelOpen,
    parentTaskId,
    parentTaskTitle,
    openAddTaskPanel,
    closeAddTaskPanel,
    handleAddTask,
  };
};
