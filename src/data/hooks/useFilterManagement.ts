import { LabelFilter, LabelState } from "../../types/LabelState";
import { useCallback, useState } from "react";

interface UseFilterManagementResult {
  labelFilters: LabelFilter[];
  handleLabelClick: (label: string) => void;
  handleCompletedClick: () => void;
  handleDueDateClick: () => void;
  getLabelState: (label: string) => LabelState;
  getCompletedState: () => LabelState;
  getDueDateState: () => LabelState;
  clearAllFilters: () => void;
}

export const useFilterManagement = (): UseFilterManagementResult => {
  const [labelFilters, setLabelFilters] = useState<LabelFilter[]>([]);

  const handleLabelClick = useCallback((label: string) => {
    setLabelFilters((current: LabelFilter[]) => {
      const existingFilter = current.find(
        (f: LabelFilter) => f.label === label
      );

      if (!existingFilter) {
        // First click: Show only tasks with this label
        return [...current, { label, state: LabelState.SHOW_ONLY }];
      }

      if (existingFilter.state === LabelState.SHOW_ONLY) {
        // Second click: Show tasks without this label
        return current.map((f) =>
          f.label === label ? { ...f, state: LabelState.SHOW_OTHERS } : f
        );
      }

      if (existingFilter.state === LabelState.SHOW_OTHERS) {
        // Third click: Remove filter
        return current.filter((f) => f.label !== label);
      }

      return current;
    });
  }, []);

  const getLabelState = useCallback(
    (label: string): LabelState => {
      const filter = labelFilters.find((f) => f.label === label);
      return filter?.state || LabelState.SHOW_ALL;
    },
    [labelFilters]
  );

  const handleCompletedClick = useCallback(() => {
    setLabelFilters((current) => {
      const existingFilter = current.find((f) => f.label === "completed");

      if (!existingFilter) {
        // First click: Show only completed
        return [
          ...current,
          { label: "completed", state: LabelState.SHOW_ONLY },
        ];
      }

      if (existingFilter.state === LabelState.SHOW_ONLY) {
        // Second click: Show uncompleted
        return current.map((f) =>
          f.label === "completed" ? { ...f, state: LabelState.SHOW_OTHERS } : f
        );
      }

      if (existingFilter.state === LabelState.SHOW_OTHERS) {
        // Third click: Remove filter
        return current.filter((f) => f.label !== "completed");
      }

      return current;
    });
  }, []);

  const getCompletedState = useCallback((): LabelState => {
    const filter = labelFilters.find((f) => f.label === "completed");
    return filter?.state || LabelState.SHOW_ALL;
  }, [labelFilters]);

  const handleDueDateClick = useCallback(() => {
    setLabelFilters((current) => {
      const existingFilter = current.find((f) => f.label === "due-date");

      if (!existingFilter) {
        // First click: Show only tasks with due dates
        return [...current, { label: "due-date", state: LabelState.SHOW_ONLY }];
      }

      if (existingFilter.state === LabelState.SHOW_ONLY) {
        // Second click: Show only tasks without due dates
        return current.map((f) =>
          f.label === "due-date" ? { ...f, state: LabelState.SHOW_OTHERS } : f
        );
      }

      if (existingFilter.state === LabelState.SHOW_OTHERS) {
        // Third click: Remove filter
        return current.filter((f) => f.label !== "due-date");
      }

      return current;
    });
  }, []);

  const getDueDateState = useCallback((): LabelState => {
    const filter = labelFilters.find((f) => f.label === "due-date");
    return filter?.state || LabelState.SHOW_ALL;
  }, [labelFilters]);

  const clearAllFilters = useCallback(() => {
    setLabelFilters([]);
  }, []);

  return {
    labelFilters,
    handleLabelClick,
    handleCompletedClick,
    handleDueDateClick,
    getLabelState,
    getCompletedState,
    getDueDateState,
    clearAllFilters,
  };
};
