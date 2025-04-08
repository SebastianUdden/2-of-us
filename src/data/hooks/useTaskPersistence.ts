import { useEffect, useState } from "react";

import { Task } from "../../types/Task";
import { firebaseTaskService } from "../../services/firebaseTaskService";
import { mockTasks } from "../mock";
import { useAuth } from "../../context/AuthContext";
import { useStorage } from "../../context/StorageContext";

const STORAGE_KEY = "tasks";

export const useTaskPersistence = () => {
  const { storageType } = useStorage();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

  const saveTasks = async (newTasks: Task[]) => {
    try {
      setIsLoading(true);
      setError(null);

      // Always update localStorage first
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTasks));

      if (storageType === "cloud" && user) {
        // Get existing tasks from Firestore
        const existingTasks = await firebaseTaskService.getTasks(user.uid);

        // Delete tasks that are not in the new list
        const tasksToDelete = existingTasks.filter(
          (existingTask) =>
            !newTasks.some((newTask) => newTask.id === existingTask.id)
        );
        for (const task of tasksToDelete) {
          await firebaseTaskService.deleteTask(task.id);
        }

        // Update or add tasks
        for (const task of newTasks) {
          if (existingTasks.some((t) => t.id === task.id)) {
            await firebaseTaskService.updateTask(task.id, task);
          } else {
            await firebaseTaskService.addTask(task, user.uid);
          }
        }
      }

      setTasks(newTasks);
    } catch (err) {
      console.error("Error saving tasks:", err);
      setError("Failed to save tasks");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let loadedTasks: Task[] = [];

      if (storageType === "cloud" && user) {
        console.log("Loading tasks from cloud for user:", user.uid);
        // Always try to load from cloud first
        loadedTasks = await firebaseTaskService.getTasks(user.uid);
        console.log("Loaded tasks from cloud:", loadedTasks.length);
        // Update localStorage with cloud data
        localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedTasks));
      } else {
        loadedTasks = mockTasks;
      }

      setTasks(loadedTasks);
      return loadedTasks;
    } catch (err) {
      console.error("Error loading tasks:", err);
      setError("Failed to load tasks");
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  // Set up real-time updates for cloud storage
  useEffect(() => {
    if (storageType === "cloud" && user) {
      const unsubscribe = firebaseTaskService.onTasksUpdate(
        user.uid,
        (updatedTasks: Task[]) => {
          // Update both state and localStorage when cloud data changes
          setTasks(updatedTasks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
        }
      );

      return () => unsubscribe();
    }
  }, [storageType, user]);

  // Reload tasks when user signs in/out
  useEffect(() => {
    loadTasks();
  }, [user]);

  return { tasks, saveTasks, loadTasks, isLoading, error };
};
