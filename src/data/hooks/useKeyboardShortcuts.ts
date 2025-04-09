import { Task } from "../../types/Task";
import { useEffect } from "react";

interface UseKeyboardShortcutsProps {
  tab: "todos" | "archive" | "lists" | "docs";
  tasks: Task[];
  filteredTasks: Task[];
  expandedTaskId: string | null;
  isAllExpanded: boolean;
  isAllExpandedMode: boolean;
  isAddTaskPanelOpen: boolean;
  isMessagePanelOpen: boolean;
  isEditing: boolean;
  isCategoriesExpanded: boolean;
  onTabChange: (tab: "todos" | "archive" | "lists" | "docs") => void;
  onExpandedTaskIdChange: (id: string | null) => void;
  onShowSubTasksIdChange: (id: string | null) => void;
  onIsAllExpandedChange: (expanded: boolean) => void;
  onIsAllExpandedModeChange: (mode: boolean) => void;
  onIsCategoriesExpandedChange: (expanded: boolean) => void;
  onIsEditingChange: (editing: boolean) => void;
  onFocusDescriptionChange: (focus: boolean) => void;
  onTaskMove: (
    direction: "up" | "down" | "top" | "bottom",
    taskId: string | null
  ) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskUpdate: (task: Task) => void;
  onAddTaskPanelOpen: (parentTaskId?: string, parentTaskTitle?: string) => void;
  onAddTaskPanelClose: () => void;
  onMessagePanelClose: () => void;
}

export const useKeyboardShortcuts = ({
  tab,
  tasks,
  filteredTasks,
  expandedTaskId,
  isAllExpanded,
  isAllExpandedMode,
  isAddTaskPanelOpen,
  isMessagePanelOpen,
  isEditing,
  isCategoriesExpanded,
  onTabChange,
  onExpandedTaskIdChange,
  onShowSubTasksIdChange,
  onIsAllExpandedChange,
  onIsAllExpandedModeChange,
  onIsCategoriesExpandedChange,
  onIsEditingChange,
  onFocusDescriptionChange,
  onTaskMove,
  onTaskDelete,
  onTaskUpdate,
  onAddTaskPanelOpen,
  onAddTaskPanelClose,
  onMessagePanelClose,
}: UseKeyboardShortcutsProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keyboard shortcuts when typing in input fields
      if (
        (document.activeElement?.tagName === "INPUT" ||
          document.activeElement?.tagName === "TEXTAREA") &&
        !(e.key === "s" && e.metaKey)
      ) {
        return;
      }

      // Handle Space key combinations
      if (e.code === "Space") {
        if (e.altKey && !isMessagePanelOpen) {
          e.preventDefault();
          onAddTaskPanelClose();
          onTabChange("todos");
          onAddTaskPanelOpen();
        } else if ((e.metaKey || e.ctrlKey) && !isMessagePanelOpen) {
          e.preventDefault();
          onAddTaskPanelClose();
          const task = tasks.find((t) => t.id === expandedTaskId);
          if (task && !isAllExpanded && !isMessagePanelOpen) {
            onShowSubTasksIdChange(expandedTaskId);
            onTabChange("todos");
            onAddTaskPanelOpen(task.id, task.title);
          } else if (!isMessagePanelOpen) {
            onTabChange("todos");
            onAddTaskPanelOpen();
          }
        } else if (
          expandedTaskId &&
          !isAllExpanded &&
          !isAddTaskPanelOpen &&
          !isMessagePanelOpen
        ) {
          e.preventDefault();
          const task = tasks.find((t) => t.id === expandedTaskId);
          if (task) {
            onTaskUpdate({
              ...task,
              completed: !task.completed,
              subtasks: task.subtasks?.map((subtask) => ({
                id: subtask.id,
                title: subtask.title,
                completed: subtask.completed,
              })),
            });
          }
        }
      }

      // Handle Enter key combinations
      else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onMessagePanelClose();
        onAddTaskPanelClose();
        if (expandedTaskId && !isAllExpanded && !isAddTaskPanelOpen) {
          const task = tasks.find((t) => t.id === expandedTaskId);
          if (task) {
            onIsEditingChange(true);
            onFocusDescriptionChange(false);
          }
        } else {
          onExpandedTaskIdChange(tasks[0].id);
          onIsEditingChange(true);
          onFocusDescriptionChange(false);
        }
      }

      // Handle M key combinations
      else if (e.key === "m" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (tab === "todos" || tab === "archive") {
          onIsAllExpandedChange(!isAllExpanded);
          onIsAllExpandedModeChange(!isAllExpandedMode);
          if (!isAllExpanded) {
            onExpandedTaskIdChange("all");
          } else {
            onExpandedTaskIdChange(null);
          }
        }
      }

      // Handle F key combinations
      else if (e.key === "f" && (e.metaKey || e.ctrlKey) && tab !== "docs") {
        e.preventDefault();
        onIsCategoriesExpandedChange(!isCategoriesExpanded);
      }

      // Handle number key combinations
      else if (e.key >= "0" && e.key <= "9" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (tab === "todos" || tab === "archive") {
          onIsAllExpandedModeChange(false);
          const taskIndex = e.key === "0" ? 9 : parseInt(e.key) - 1;
          const task = filteredTasks[taskIndex];
          if (task) {
            if (expandedTaskId === task.id) {
              onExpandedTaskIdChange(null);
              onShowSubTasksIdChange(null);
            } else {
              onExpandedTaskIdChange(task.id);
              onShowSubTasksIdChange(task.id);
            }
          }
        }
      }

      // Handle arrow key combinations
      else if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
        if (e.metaKey || e.ctrlKey) {
          e.preventDefault();
          const tabs: ("todos" | "archive" | "lists" | "docs")[] = [
            "todos",
            "archive",
            "docs",
          ];
          const currentIndex = tabs.indexOf(tab);
          let newIndex: number;

          if (e.key === "ArrowRight") {
            newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
          } else {
            newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
          }
          onTabChange(tabs[newIndex]);
        } else if (e.altKey && (tab === "todos" || tab === "archive")) {
          e.preventDefault();
          const direction = e.key === "ArrowLeft" ? "top" : "bottom";
          onTaskMove(direction, expandedTaskId);
        }
      } else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (e.altKey && (tab === "todos" || tab === "archive")) {
          e.preventDefault();
          const direction = e.key === "ArrowDown" ? "down" : "up";
          onTaskMove(direction, expandedTaskId);
        } else if (tab === "todos" || tab === "archive") {
          e.preventDefault();
          onIsAllExpandedModeChange(false);
          const currentIndex = expandedTaskId
            ? filteredTasks.findIndex((task) => task.id === expandedTaskId)
            : -1;

          if (e.key === "ArrowDown") {
            if (currentIndex === -1) {
              if (filteredTasks.length > 0) {
                onExpandedTaskIdChange(filteredTasks[0].id);
                onShowSubTasksIdChange(filteredTasks[0].id);
              }
            } else if (currentIndex < filteredTasks.length - 1) {
              onExpandedTaskIdChange(filteredTasks[currentIndex + 1].id);
              onShowSubTasksIdChange(filteredTasks[currentIndex + 1].id);
            } else {
              onExpandedTaskIdChange(null);
              onShowSubTasksIdChange(null);
            }
          } else {
            if (currentIndex === -1) {
              if (filteredTasks.length > 0) {
                onExpandedTaskIdChange(
                  filteredTasks[filteredTasks.length - 1].id
                );
                onShowSubTasksIdChange(
                  filteredTasks[filteredTasks.length - 1].id
                );
              }
            } else if (currentIndex > 0) {
              onExpandedTaskIdChange(filteredTasks[currentIndex - 1].id);
              onShowSubTasksIdChange(filteredTasks[currentIndex - 1].id);
            } else {
              onExpandedTaskIdChange(null);
              onShowSubTasksIdChange(null);
            }
          }
        }
      }

      // Handle Backspace key combinations
      else if (e.key === "Backspace") {
        if ((e.metaKey || e.ctrlKey) && !isAllExpanded) {
          e.preventDefault();
          const task = tasks.find((t) => t.id === expandedTaskId);
          if (task) {
            onTaskDelete(task.id);
          } else {
            onTaskDelete(tasks[0].id);
          }
        } else if (e.altKey && expandedTaskId && !isAllExpanded) {
          e.preventDefault();
          const task = tasks.find((t) => t.id === expandedTaskId);
          if (task) {
            onTaskUpdate({
              ...task,
              subtasks: task.subtasks.slice(0, -1),
            });
          }
        }
      }

      // Handle S key combinations
      else if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        const task = tasks.find((t) => t.id === expandedTaskId);
        if (isEditing && task) {
          onTaskUpdate(task);
          onIsEditingChange(false);
        } else if (isAddTaskPanelOpen && task) {
          onAddTaskPanelClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    tab,
    tasks,
    filteredTasks,
    expandedTaskId,
    isAllExpanded,
    isAllExpandedMode,
    isAddTaskPanelOpen,
    isMessagePanelOpen,
    isEditing,
    isCategoriesExpanded,
    onTabChange,
    onExpandedTaskIdChange,
    onShowSubTasksIdChange,
    onIsAllExpandedChange,
    onIsAllExpandedModeChange,
    onIsCategoriesExpandedChange,
    onIsEditingChange,
    onFocusDescriptionChange,
    onTaskMove,
    onTaskDelete,
    onTaskUpdate,
    onAddTaskPanelOpen,
    onAddTaskPanelClose,
    onMessagePanelClose,
  ]);
};
