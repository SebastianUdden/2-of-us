import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
  getDoc,
} from "firebase/firestore";

import { Task } from "../types/Task";
import { db } from "../config/firebase";

const TASKS_COLLECTION = "tasks";

// Helper function to remove undefined values from an object
const removeUndefined = <T extends Record<string, unknown>>(
  obj: T
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as Partial<T>;
};

export const firebaseTaskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as Task[];
  },

  async addTask(task: Omit<Task, "id">, userId: string): Promise<Task> {
    const tasksRef = collection(db, TASKS_COLLECTION);
    // Remove undefined values before sending to Firestore
    const cleanTask = removeUndefined({ ...task, userId });
    const docRef = await addDoc(tasksRef, cleanTask);
    return { ...task, id: docRef.id };
  },

  async updateTask(taskId: string, task: Partial<Task>): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    const taskDoc = await getDoc(taskRef);

    if (!taskDoc.exists()) {
      throw new Error("TASK_NOT_FOUND");
    }

    // Remove undefined values before sending to Firestore
    const cleanTask = removeUndefined(task);
    await updateDoc(taskRef, cleanTask);
  },

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  },

  onTasksUpdate: (userId: string, callback: (tasks: Task[]) => void) => {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, where("userId", "==", userId));
    return onSnapshot(q, (querySnapshot) => {
      const tasks = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as Task[];
      callback(tasks);
    });
  },
};
