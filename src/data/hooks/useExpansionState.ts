import { useCallback, useEffect, useState } from "react";

import { useExpansionPersistence } from "./useExpansionPersistence";

interface UseExpansionStateResult {
  expandedTaskId: string | null;
  expandedListId: string | null;
  isAllExpanded: boolean;
  isAllExpandedMode: boolean;
  isCategoriesExpanded: boolean;
  setExpandedTaskId: (taskId: string | null) => void;
  setExpandedListId: (listId: string | null) => void;
  setIsAllExpanded: (isExpanded: boolean) => void;
  setIsAllExpandedMode: (isMode: boolean) => void;
  setIsCategoriesExpanded: (isExpanded: boolean) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

export const useExpansionState = (): UseExpansionStateResult => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [isAllExpandedMode, setIsAllExpandedMode] = useState(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const { loadExpansionState, saveExpansionState } = useExpansionPersistence();

  // Load saved expansion state on mount
  useEffect(() => {
    loadExpansionState().then((state) => {
      setExpandedTaskId(state.expandedTaskId);
      setExpandedListId(state.expandedListId);
      setIsAllExpanded(state.isAllExpanded);
      setIsAllExpandedMode(state.isAllExpandedMode);
      setIsCategoriesExpanded(state.isCategoriesExpanded);
    });
  }, []);

  // Save expansion state whenever it changes
  useEffect(() => {
    saveExpansionState({
      expandedTaskId,
      expandedListId,
      isAllExpanded,
      isAllExpandedMode,
      isCategoriesExpanded,
    });
  }, [
    expandedTaskId,
    expandedListId,
    isAllExpanded,
    isAllExpandedMode,
    isCategoriesExpanded,
  ]);

  const expandAll = useCallback(() => {
    setIsAllExpanded(true);
    setIsAllExpandedMode(true);
  }, []);

  const collapseAll = useCallback(() => {
    setIsAllExpanded(false);
    setIsAllExpandedMode(false);
    setExpandedTaskId(null);
    setExpandedListId(null);
  }, []);

  return {
    expandedTaskId,
    expandedListId,
    isAllExpanded,
    isAllExpandedMode,
    isCategoriesExpanded,
    setExpandedTaskId,
    setExpandedListId,
    setIsAllExpanded,
    setIsAllExpandedMode,
    setIsCategoriesExpanded,
    expandAll,
    collapseAll,
  };
};
