import { getFromLocalStorage, saveToLocalStorage } from "./localStorage";

import { generateUUID } from "./uuid";

/**
 * Generic CRUD API implementation using localStorage as a mock backend
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type EntityData<T extends BaseEntity> = Omit<T, keyof BaseEntity>;

/**
 * Creates a new item in the collection
 * @param collectionName - Name of the collection to store items in
 * @param item - The item to create
 * @returns The created item with generated id and timestamps
 */
export const create = async <T extends BaseEntity>(
  collectionName: string,
  item: EntityData<T>
): Promise<T> => {
  const items = await getAll<T>(collectionName);
  const newItem = {
    ...item,
    id: generateUUID(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } as T;

  items.push(newItem);
  saveToLocalStorage(collectionName, items);
  return newItem;
};

/**
 * Retrieves all items from a collection
 * @param collectionName - Name of the collection to retrieve items from
 * @returns Array of items
 */
export const getAll = async <T extends BaseEntity>(
  collectionName: string
): Promise<T[]> => {
  const items = getFromLocalStorage<T[]>(collectionName);
  return items || [];
};

/**
 * Retrieves a single item by id
 * @param collectionName - Name of the collection to retrieve the item from
 * @param id - The id of the item to retrieve
 * @returns The item if found, null otherwise
 */
export const getById = async <T extends BaseEntity>(
  collectionName: string,
  id: string
): Promise<T | null> => {
  const items = await getAll<T>(collectionName);
  return items.find((item) => item.id === id) || null;
};

/**
 * Updates an existing item
 * @param collectionName - Name of the collection containing the item
 * @param id - The id of the item to update
 * @param updates - The updates to apply to the item
 * @returns The updated item if found, null otherwise
 */
export const update = async <T extends BaseEntity>(
  collectionName: string,
  id: string,
  updates: Partial<Omit<T, "id" | "createdAt" | "updatedAt">>
): Promise<T | null> => {
  const items = await getAll<T>(collectionName);
  const index = items.findIndex((item) => item.id === id);

  if (index === -1) return null;

  const updatedItem = {
    ...items[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  items[index] = updatedItem;
  saveToLocalStorage(collectionName, items);
  return updatedItem;
};

/**
 * Deletes an item by id
 * @param collectionName - Name of the collection containing the item
 * @param id - The id of the item to delete
 * @returns boolean indicating success
 */
export const remove = async (
  collectionName: string,
  id: string
): Promise<boolean> => {
  const items = await getAll(collectionName);
  const filteredItems = items.filter((item) => item.id !== id);

  if (filteredItems.length === items.length) return false;

  saveToLocalStorage(collectionName, filteredItems);
  return true;
};

/**
 * Deletes all items from a collection
 * @param collectionName - Name of the collection to clear
 * @returns boolean indicating success
 */
export const clear = async (collectionName: string): Promise<boolean> => {
  return saveToLocalStorage(collectionName, []);
};
