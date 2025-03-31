import { useSingleItemPersistence } from "./useSingleItemPersistence";

interface ExpansionState {
  id: string;
  createdAt: string;
  updatedAt: string;
  expandedTaskId: string | null;
  expandedListId: string | null;
  isAllExpanded: boolean;
  isAllExpandedMode: boolean;
  isCategoriesExpanded: boolean;
}

export const useExpansionPersistence = () => {
  const { loadItem, saveItem } = useSingleItemPersistence<ExpansionState>({
    collectionName: "expansionState",
  });

  const loadExpansionState = async () => {
    const state = await loadItem();
    return {
      expandedTaskId: state?.expandedTaskId || null,
      expandedListId: state?.expandedListId || null,
      isAllExpanded: state?.isAllExpanded || false,
      isAllExpandedMode: state?.isAllExpandedMode || false,
      isCategoriesExpanded: state?.isCategoriesExpanded || false,
    };
  };

  const saveExpansionState = async (state: {
    expandedTaskId: string | null;
    expandedListId: string | null;
    isAllExpanded: boolean;
    isAllExpandedMode: boolean;
    isCategoriesExpanded: boolean;
  }) => {
    await saveItem(state);
  };

  return { loadExpansionState, saveExpansionState };
};
