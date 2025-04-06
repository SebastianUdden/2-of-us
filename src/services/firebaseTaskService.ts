import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { Task } from "../types/Task";
import { db } from "../config/firebase";

const TASKS_COLLECTION = "tasks";

export const firebaseTaskService = {
  async getTasks(userId: string): Promise<Task[]> {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const q = query(tasksRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as Task)
    );
  },

  async addTask(task: Omit<Task, "id">, userId: string): Promise<Task> {
    const tasksRef = collection(db, TASKS_COLLECTION);
    const docRef = await addDoc(tasksRef, { ...task, userId });
    return { id: docRef.id, ...task };
  },

  async updateTask(taskId: string, task: Partial<Task>): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await updateDoc(taskRef, task);
  },

  async deleteTask(taskId: string): Promise<void> {
    const taskRef = doc(db, TASKS_COLLECTION, taskId);
    await deleteDoc(taskRef);
  },
};
