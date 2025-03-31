import { getAll } from "../../utils/api";
import { useApi } from "./useApi";

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export const useSingleItemPersistence = <T extends BaseEntity>({
  collectionName,
}: {
  collectionName: string;
}) => {
  const { updateItem, createItem, clearItems } = useApi<T>({
    collectionName,
  });

  const loadItem = async () => {
    const items = await getAll<T>(collectionName);
    return items[0] || null;
  };

  const saveItem = async (data: Omit<T, keyof BaseEntity>) => {
    const items = await getAll<T>(collectionName);
    const existingItem = items[0];

    if (existingItem) {
      await updateItem(existingItem.id, data);
    } else {
      await clearItems();
      await createItem(data);
    }
  };

  return { loadItem, saveItem };
};
