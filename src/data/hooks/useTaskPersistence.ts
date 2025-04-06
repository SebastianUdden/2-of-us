import { Task } from "../../types/Task";
import { firebaseTaskService } from "../../services/firebaseTaskService";
import { useAuth } from "../../context/AuthContext";
import { useStorage } from "../../context/StorageContext";

const STORAGE_KEY = "tasks";

export const useTaskPersistence = () => {
  const { storageType } = useStorage();
  const { user } = useAuth();

  const saveTasks = async (tasks: Task[]) => {
    try {
      if (storageType === "local") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      } else if (storageType === "cloud") {
        if (!user) {
          console.warn("Cannot save to cloud storage: User not signed in");
          return;
        }
        // First, get all existing tasks for this user
        const existingTasks = await firebaseTaskService.getTasks(user.uid);

        // Delete tasks that are no longer in the list
        for (const existingTask of existingTasks) {
          if (!tasks.find((t) => t.id === existingTask.id)) {
            await firebaseTaskService.deleteTask(existingTask.id);
          }
        }

        // Update or create tasks
        for (const task of tasks) {
          if (existingTasks.find((t) => t.id === task.id)) {
            await firebaseTaskService.updateTask(task.id, task);
          } else {
            await firebaseTaskService.addTask(task, user.uid);
          }
        }
      }
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const loadTasks = async (): Promise<Task[]> => {
    try {
      if (storageType === "local") {
        const savedTasks = localStorage.getItem(STORAGE_KEY);
        if (savedTasks) {
          return JSON.parse(savedTasks);
        }
      } else if (storageType === "cloud") {
        if (!user) {
          console.warn("Cannot load from cloud storage: User not signed in");
          return [];
        }
        return await firebaseTaskService.getTasks(user.uid);
      }
      return [];
    } catch (error) {
      console.error("Error loading tasks:", error);
      return [];
    }
  };

  return {
    saveTasks,
    loadTasks,
  };
};
