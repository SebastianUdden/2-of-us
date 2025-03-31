import { useCallback, useState } from "react";

interface UseExpansionStateResult {
  expandedTaskId: string | null;
  expandedListId: string | null;
  isAllExpanded: boolean;
  isAllExpandedMode: boolean;
  setExpandedTaskId: (taskId: string | null) => void;
  setExpandedListId: (listId: string | null) => void;
  setIsAllExpanded: (isExpanded: boolean) => void;
  setIsAllExpandedMode: (isMode: boolean) => void;
  expandAll: () => void;
  collapseAll: () => void;
}

export const useExpansionState = (): UseExpansionStateResult => {
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [isAllExpandedMode, setIsAllExpandedMode] = useState(false);

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
    setExpandedTaskId,
    setExpandedListId,
    setIsAllExpanded,
    setIsAllExpandedMode,
    expandAll,
    collapseAll,
  };
};
