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

import { List } from "../types/List";
import { db } from "../config/firebase";

const LISTS_COLLECTION = "lists";

export const firebaseListService = {
  async getLists(userId: string): Promise<List[]> {
    const listsRef = collection(db, LISTS_COLLECTION);
    const q = query(listsRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as List)
    );
  },

  async addList(list: Omit<List, "id">, userId: string): Promise<List> {
    const listsRef = collection(db, LISTS_COLLECTION);
    const docRef = await addDoc(listsRef, { ...list, userId });
    return { id: docRef.id, ...list };
  },

  async updateList(listId: string, list: Partial<List>): Promise<void> {
    const listRef = doc(db, LISTS_COLLECTION, listId);
    await updateDoc(listRef, list);
  },

  async deleteList(listId: string): Promise<void> {
    const listRef = doc(db, LISTS_COLLECTION, listId);
    await deleteDoc(listRef);
  },
};
