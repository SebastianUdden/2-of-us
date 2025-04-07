import { useCallback, useState } from "react";

import { List } from "../../types/List";
import { SubTask } from "../../types/SubTask";
import { Task } from "../../types/Task";
import { generateUUID } from "../../utils/uuid";

interface UseAddTaskPanelResult {
  isAddTaskPanelOpen: boolean;
  parentTaskId: string | undefined;
  parentTaskTitle: string | undefined;
  openAddTaskPanel: (parentTaskId?: string, parentTaskTitle?: string) => void;
  closeAddTaskPanel: () => void;
  handleAddTask: (newTask: Task) => void;
  handleAddList: (newList: List) => void;
}

export const useAddTaskPanel = (
  tasks: Task[],
  onTasksUpdate: (tasks: Task[]) => void,
  lists: List[],
  onListsUpdate: (lists: List[]) => void,
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
      if (
        tasks.some(
          (t) =>
            t.title === newTask.title ||
            t.subtasks?.some((st) => st?.title === newTask?.subtasks[0]?.title)
        )
      )
        return;
      if (parentTaskId) {
        // Add as subtask
        const newSubtask: SubTask = {
          id: generateUUID(),
          title: newTask.title,
          completed: false,
        };

        onTasksUpdate(
          tasks.map((task) => {
            if (task.id === parentTaskId) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), newSubtask],
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
    },
    [tasks, parentTaskId, onTasksUpdate, onExpandedTaskIdChange]
  );

  const handleAddList = useCallback(
    (newList: List) => {
      onListsUpdate([...lists, newList]);
    },
    [lists, onListsUpdate]
  );

  return {
    isAddTaskPanelOpen,
    parentTaskId,
    parentTaskTitle,
    openAddTaskPanel,
    closeAddTaskPanel,
    handleAddTask,
    handleAddList,
  };
};
