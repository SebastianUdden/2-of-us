import { useCallback, useState } from "react";

import { List } from "../../types/List";
import { SubTask } from "../../types/SubTask";
import { Task } from "../../types/Task";
import { firebaseTaskService } from "../../services/firebaseTaskService";
import { generateUUID } from "../../utils/uuid";
import { useAuth } from "../../context/AuthContext";
import { useStorage } from "../../context/StorageContext";

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
  const { user } = useAuth();
  const { storageType } = useStorage();

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
    async (newTask: Task) => {
      if (
        tasks.some(
          (t) =>
            t.title === newTask.title ||
            t.subtasks?.some((st) => st?.title === newTask?.subtasks[0]?.title)
        )
      )
        return;

      try {
        if (parentTaskId) {
          // Add as subtask
          const newSubtask: SubTask = {
            id: generateUUID(),
            title: newTask.title,
            completed: false,
          };

          const updatedTasks = tasks.map((task) => {
            if (task.id === parentTaskId) {
              return {
                ...task,
                subtasks: [...(task.subtasks || []), newSubtask],
              };
            }
            return task;
          });

          // Save to API if user is logged in
          if (storageType === "cloud" && user) {
            const parentTask = updatedTasks.find((t) => t.id === parentTaskId);
            if (parentTask) {
              await firebaseTaskService.updateTask(parentTaskId, parentTask);
            }
          }

          onTasksUpdate(updatedTasks);
          onExpandedTaskIdChange?.(parentTaskId);
        } else {
          // Add as main task
          const updatedTasks = [...tasks, newTask];

          // Save to API if user is logged in
          if (storageType === "cloud" && user) {
            await firebaseTaskService.addTask(newTask, user.uid);
          }

          onTasksUpdate(updatedTasks);
          onExpandedTaskIdChange?.(newTask.id);
          setTimeout(() => {
            const taskElement = document.getElementById(`task-${newTask.id}`);
            if (taskElement) {
              taskElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
              });
            }
          }, 100);
        }
      } catch (error) {
        console.error("Error saving task:", error);
        // TODO: Add error handling UI
      }
    },
    [
      tasks,
      parentTaskId,
      onTasksUpdate,
      onExpandedTaskIdChange,
      user,
      storageType,
    ]
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
