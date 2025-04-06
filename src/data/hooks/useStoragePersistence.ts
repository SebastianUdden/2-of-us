import { useSingleItemPersistence } from "./useSingleItemPersistence";

interface StorageState {
  id: string;
  createdAt: string;
  updatedAt: string;
  storageType: "local" | "cloud";
}

export const useStoragePersistence = () => {
  const { loadItem, saveItem } = useSingleItemPersistence<StorageState>({
    collectionName: "storagePreference",
  });

  const loadStorageType = async () => {
    const storageState = await loadItem();
    return storageState?.storageType || "local";
  };

  const saveStorageType = async (storageType: "local" | "cloud") => {
    await saveItem({ storageType });
  };

  return { loadStorageType, saveStorageType };
};
