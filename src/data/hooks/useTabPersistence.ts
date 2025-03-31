import { useSingleItemPersistence } from "./useSingleItemPersistence";

interface TabState {
  id: string;
  createdAt: string;
  updatedAt: string;
  currentTab: "todos" | "archive" | "lists";
}

export const useTabPersistence = () => {
  const { loadItem, saveItem } = useSingleItemPersistence<TabState>({
    collectionName: "tabState",
  });

  const loadTab = async () => {
    const tabState = await loadItem();
    return tabState?.currentTab || "todos";
  };

  const saveTab = async (tab: "todos" | "archive" | "lists") => {
    await saveItem({ currentTab: tab });
  };

  return { loadTab, saveTab };
};
