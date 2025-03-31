import { Task } from "../../types/Task";

const STORAGE_KEY = "tasks";

export const useTaskPersistence = () => {
  const saveTasks = async (tasks: Task[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error("Error saving tasks:", error);
    }
  };

  const loadTasks = async (): Promise<Task[]> => {
    try {
      const savedTasks = localStorage.getItem(STORAGE_KEY);
      if (savedTasks) {
        return JSON.parse(savedTasks);
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
