import { Task } from "../../types/Task";
import { useStorage } from "../../context/StorageContext";

const STORAGE_KEY = "tasks";

export const useTaskPersistence = () => {
  const { storageType } = useStorage();

  const saveTasks = async (tasks: Task[]) => {
    try {
      if (storageType === "local") {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
      }
      // TODO: Implement cloud storage
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
      }
      // TODO: Implement cloud storage
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
