import { useSingleItemPersistence } from "./useSingleItemPersistence";

export type SortField =
  | "dueDate"
  | "createdAt"
  | "title"
  | "updatedAt"
  | "priority";
export type SortDirection = "asc" | "desc";

interface SortState {
  id: string;
  createdAt: string;
  updatedAt: string;
  field: SortField;
  direction: SortDirection;
}

export const useSortPersistence = () => {
  const { loadItem, saveItem } = useSingleItemPersistence<SortState>({
    collectionName: "sortState",
  });

  const loadSort = async () => {
    const sortState = await loadItem();
    return {
      field: sortState?.field || "dueDate",
      direction: sortState?.direction || "desc",
    };
  };

  const saveSort = async (field: SortField, direction: SortDirection) => {
    await saveItem({ field, direction });
  };

  return { loadSort, saveSort };
};
