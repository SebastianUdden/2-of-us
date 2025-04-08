import { LabelFilter, LabelState } from "../../types/LabelState";
import { useCallback, useMemo, useState } from "react";

import { Task } from "../../types/Task";

interface UseFilterManagementResult {
  labelFilters: LabelFilter[];
  handleLabelClick: (label: string) => void;
  handleCompletedClick: () => void;
  handleDueDateClick: () => void;
  getLabelState: (label: string) => LabelState;
  getCompletedState: () => LabelState;
  getDueDateState: () => LabelState;
  handleSizeSmallClick: () => void;
  getSizeSmallState: () => LabelState;
  handleSizeMediumClick: () => void;
  getSizeMediumState: () => LabelState;
  handleSizeLargeClick: () => void;
  getSizeLargeState: () => LabelState;
  clearAllFilters: () => void;
  tasksWithSizeSmall: number;
  tasksWithSizeMedium: number;
  tasksWithSizeLarge: number;
}

export const useFilterManagement = (
  tasks: Task[]
): UseFilterManagementResult => {
  const [labelFilters, setLabelFilters] = useState<LabelFilter[]>([]);

  const tasksWithSizeSmall = useMemo(() => {
    return tasks.filter((task) => task.size === "S").length;
  }, [tasks]);

  const tasksWithSizeMedium = useMemo(() => {
    return tasks.filter((task) => task.size === "M").length;
  }, [tasks]);

  const tasksWithSizeLarge = useMemo(() => {
    return tasks.filter((task) => task.size === "L").length;
  }, [tasks]);

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

  const handleSizeSmallClick = useCallback(() => {
    setLabelFilters((current) => {
      const existingFilter = current.find((f) => f.label === "S");

      if (!existingFilter) {
        return [...current, { label: "S", state: LabelState.SHOW_ONLY }];
      }

      if (existingFilter.state === LabelState.SHOW_ONLY) {
        return current.map((f) =>
          f.label === "S" ? { ...f, state: LabelState.SHOW_OTHERS } : f
        );
      }

      if (existingFilter.state === LabelState.SHOW_OTHERS) {
        return current.filter((f) => f.label !== "S");
      }

      return current;
    });
  }, []);

  const getSizeSmallState = useCallback((): LabelState => {
    const filter = labelFilters.find((f) => f.label === "S");
    return filter?.state || LabelState.SHOW_ALL;
  }, [labelFilters]);

  const handleSizeMediumClick = useCallback(() => {
    setLabelFilters((current) => {
      const existingFilter = current.find((f) => f.label === "M");

      if (!existingFilter) {
        return [...current, { label: "M", state: LabelState.SHOW_ONLY }];
      }

      if (existingFilter.state === LabelState.SHOW_ONLY) {
        return current.map((f) =>
          f.label === "M" ? { ...f, state: LabelState.SHOW_OTHERS } : f
        );
      }

      if (existingFilter.state === LabelState.SHOW_OTHERS) {
        return current.filter((f) => f.label !== "M");
      }

      return current;
    });
  }, []);

  const getSizeMediumState = useCallback((): LabelState => {
    const filter = labelFilters.find((f) => f.label === "M");
    return filter?.state || LabelState.SHOW_ALL;
  }, [labelFilters]);

  const handleSizeLargeClick = useCallback(() => {
    setLabelFilters((current) => {
      const existingFilter = current.find((f) => f.label === "L");

      if (!existingFilter) {
        return [...current, { label: "L", state: LabelState.SHOW_ONLY }];
      }

      if (existingFilter.state === LabelState.SHOW_ONLY) {
        return current.map((f) =>
          f.label === "L" ? { ...f, state: LabelState.SHOW_OTHERS } : f
        );
      }

      if (existingFilter.state === LabelState.SHOW_OTHERS) {
        return current.filter((f) => f.label !== "L");
      }

      return current;
    });
  }, []);

  const getSizeLargeState = useCallback((): LabelState => {
    const filter = labelFilters.find((f) => f.label === "L");
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
    handleSizeSmallClick,
    getSizeSmallState,
    handleSizeMediumClick,
    getSizeMediumState,
    handleSizeLargeClick,
    getSizeLargeState,
    clearAllFilters,
    tasksWithSizeSmall,
    tasksWithSizeMedium,
    tasksWithSizeLarge,
  };
};
