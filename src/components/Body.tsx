import { useEffect, useRef, useState } from "react";
import {
  useFilteredLists,
  useFilteredTasks,
} from "../data/hooks/useFilteredItems";

import { ANIMATION } from "./task-card/constants";
import DataManagementButtons from "./common/DataManagementButtons";
import DeleteConfirmDialog from "./task-card/DeleteConfirmDialog";
import DocsSection from "./sections/DocsSection";
import { ErrorMessage } from "./common/ErrorMessage";
import { FilterSection } from "./sections/FilterSection";
import Header from "./Header";
import { List } from "../types/List";
import { ListSection } from "./sections/ListSection";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { ResetConfirmModal } from "./common/ResetConfirmModal";
import SidePanel from "./common/SidePanel";
import { SortControls } from "./sections/SortControls";
import Tabs from "./Tabs";
import { Task } from "../types/Task";
import TaskAddPanel from "./TaskAddPanel";
import TaskEditPanel from "./task-card/TaskEditPanel";
import { TaskSection } from "./sections/TaskSection";
import { firebaseTaskService } from "../services/firebaseTaskService";
import { mockLists } from "../data/mock";
import { useAddTaskPanel } from "../data/hooks/useAddTaskPanel";
import { useAuth } from "../context/AuthContext";
import { useExpansionState } from "../data/hooks/useExpansionState";
import { useFilterManagement } from "../data/hooks/useFilterManagement";
import { useLabelsAndCounts } from "../data/hooks/useLabelsAndCounts";
import { useMessagePanel } from "../data/hooks/useMessagePanel";
import { usePriorityManagement } from "../data/hooks/usePriorityManagement";
import { useSearchAndFilter } from "../data/hooks/useSearchAndFilter";
import { useSorting } from "../data/hooks/useSorting";
import { useStorage } from "../context/StorageContext";
import { useTabPersistence } from "../data/hooks/useTabPersistence";
import { useTaskPersistence } from "../data/hooks/useTaskPersistence";

const Body = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [focusDescription, setFocusDescription] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [lists, setLists] = useState<List[]>(mockLists);
  const [tab, setTab] = useState<"todos" | "archive" | "lists" | "docs">(
    "todos"
  );
  const [isSortMinimized, setIsSortMinimized] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [isListMode, setIsListMode] = useState(false);
  const { loadTab, saveTab } = useTabPersistence();
  const { loadTasks, saveTasks, isLoading, error } = useTaskPersistence();
  const { user } = useAuth();
  const { storageType } = useStorage();

  const {
    expandedTaskId,
    showSubTasksId,
    expandedListId,
    isAllExpanded,
    isAllExpandedMode,
    isCategoriesExpanded,
    setExpandedTaskId,
    setExpandedListId,
    setShowSubTasksId,
    setIsAllExpanded,
    setIsAllExpandedMode,
    setIsCategoriesExpanded,
  } = useExpansionState();

  const {
    searchQuery,
    setSearchQuery,
    selectedLabel,
    setSelectedLabel,
    tasksWithDueDate,
    completedCount,
  } = useSearchAndFilter(tasks);

  const { labels: labelsAndCountsLabels, counts: labelsAndCountsCounts } =
    useLabelsAndCounts(tasks, lists, tab, searchQuery);

  const {
    sortField,
    sortDirection,
    handleSort,
    getSortedTasks,
    getSortedLists,
  } = useSorting();

  const {
    labelFilters,
    handleLabelClick,
    handleCompletedClick,
    handleDueDateClick,
    getLabelState,
    getCompletedState,
    getDueDateState,
    clearAllFilters,
  } = useFilterManagement();

  const {
    isAddTaskPanelOpen,
    parentTaskId,
    parentTaskTitle,
    openAddTaskPanel,
    closeAddTaskPanel,
    handleAddTask,
    handleAddList,
  } = useAddTaskPanel(tasks, setTasks, lists, setLists, setExpandedTaskId);

  const {
    isMessagePanelOpen,
    messagePanelTitle,
    messagePanelMessage,
    openMessagePanel,
    closeMessagePanel,
  } = useMessagePanel();

  const {
    sortTasks,
    sortLists,
    handlePriorityChange,
    handleListPriorityChange,
    handleTaskMove,
    handleListMove,
    pendingListMove,
    isCollapsed,
    setIsCollapsed,
  } = usePriorityManagement(setTasks, setLists);

  const filteredTasks = useFilteredTasks({
    tasks,
    searchQuery,
    labelFilters,
    selectedLabel,
    tab,
  });

  const filteredLists = useFilteredLists({
    lists,
    searchQuery,
    labelFilters,
    selectedLabel,
  });

  const sortedAndFilteredTasks = getSortedTasks(filteredTasks);
  const sortedAndFilteredLists = getSortedLists(filteredLists);

  const handleComplete = (taskId: string, allCompleted?: boolean) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task?.completed && !allCompleted) {
      openMessagePanel(
        "Subtasks imcomplete",
        "Please complete or delete all subtasks before completing the task."
      );
      return;
    }

    // First update the completion status immediately
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              completed: !task.completed,
              subtasks: task.subtasks?.map((subtask) => ({
                id: subtask.id,
                title: subtask.title,
                completed: subtask.completed,
              })),
            }
          : task
      );
    });

    // Then sort after a delay
    setTimeout(() => {
      setTasks((prevTasks) => {
        return sortTasks(prevTasks);
      });
    }, 300);
  };

  const handleDelete = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setTaskToDelete(task);
      setIsDeleteModalOpen(true);
    }
  };

  const handleDeleteConfirm = async (taskId: string) => {
    try {
      // First, update the local state to remove the task
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);

      // If using cloud storage and user is authenticated, delete the task from Firestore
      if (storageType === "cloud" && user) {
        try {
          await firebaseTaskService.deleteTask(taskId);
        } catch (error) {
          console.error("Error deleting task:", error);
          // If the deletion fails, reload the tasks to ensure consistency
          loadTasks();
        }
      }
    } catch (error) {
      console.error("Error in handleDeleteConfirm:", error);
      // If there's an error, reload the tasks to ensure consistency
      loadTasks();
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
    setTaskToDelete(null);
  };

  const handleArchive = (taskId: string) => {
    setIsCollapsed(true);

    // Wait for collapse animation
    setTimeout(() => {
      setTasks((prevTasks) => {
        const updatedTasks = prevTasks.map((task) =>
          task.id === taskId ? { ...task, archived: !task.archived } : task
        );
        // Sort remaining tasks and update priorities
        return sortTasks(updatedTasks);
      });
      setIsCollapsed(false);
    }, ANIMATION.DURATION * 2);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleListComplete = (listId: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) => ({ ...item, completed: true })),
            }
          : list
      )
    );
  };

  const handleListDelete = (listId: string) => {
    setIsCollapsed(true);

    // Wait for collapse animation
    setTimeout(() => {
      setLists((prevLists) => {
        const filteredLists = prevLists.filter((list) => list.id !== listId);
        // Sort remaining lists and update priorities
        return sortLists(filteredLists);
      });
      setIsCollapsed(false);
    }, ANIMATION.DURATION * 2);
  };

  const handleListUpdate = (updatedList: List) => {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  };

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleLabelClickWithExpand = (label: string) => {
    setIsCategoriesExpanded(true);
    handleLabelClick(label);
  };

  const handleCompletedClickWithExpand = () => {
    setIsCategoriesExpanded(true);
    handleCompletedClick();
  };

  const handleDueDateClickWithExpand = () => {
    setIsCategoriesExpanded(true);
    handleDueDateClick();
  };

  const handleListCloneToTask = (list: List) => {
    const newTaskId = `task-${Date.now()}`;
    // Create subtasks from list items
    const subtasks = list.items.map((item) => ({
      id: `subtask-${Date.now()}-${item.id}`,
      title: item.content,
      completed: item.completed,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
    }));

    // Create a new task from the list
    const newTask: Task = {
      id: newTaskId,
      title: list.title,
      description: list.description || "",
      completed: false,
      archived: false,
      priority: tasks.length + 1,
      labels: list.labels || [],
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
      subtasks: subtasks,
      dueDate: undefined, // You might want to add a due date field to lists if needed
    };

    // Add the task to the tasks list
    setTasks((prevTasks) => {
      const updatedTasks = [...prevTasks, newTask];
      return sortTasks(updatedTasks);
    });
    setTimeout(() => {
      setExpandedTaskId(newTaskId);
    }, 100);
    setTimeout(() => {
      const taskElement = document.getElementById(`task-${newTaskId}`);
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 200);
  };

  const moreThanOneActiveTask =
    tasks.filter((task) => !task.archived).length > 1;
  const moreThanOneArchivedTask =
    tasks.filter((task) => task.archived).length > 1;
  const moreThanOneList = lists.length > 1;
  const showSortControls =
    (tab === "todos" && moreThanOneActiveTask) ||
    (tab === "archive" && moreThanOneArchivedTask) ||
    (tab === "lists" && moreThanOneList);

  // Start the collapse animation
  useEffect(() => {
    if (pendingListMove) {
      const timer = setTimeout(() => {
        handleListMove();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingListMove, isCollapsed, handleListMove]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPercentage = (currentScrollY + windowHeight) / documentHeight;

      // If the total scroll height is less than 150% of viewport height, always show header
      if (documentHeight <= windowHeight * 1.5) {
        setIsHeaderVisible(true);
        return;
      }

      // If we're in the last 10% of the page, keep header hidden
      if (scrollPercentage > 0.9) {
        setIsHeaderVisible(false);
        return;
      }

      // Otherwise, show header when:
      // 1. Scrolling up
      // 2. At the top of the page
      setIsHeaderVisible(currentScrollY < lastScrollY || currentScrollY < 200);

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Load saved tab on mount
  useEffect(() => {
    loadTab().then((savedTab) => {
      if (savedTab) {
        setTab(savedTab);
      }
    });
  }, []);

  // Load saved tasks on mount
  useEffect(() => {
    loadTasks().then((savedTasks: Task[]) => {
      if (savedTasks.length > 0) {
        setTasks(savedTasks);
      }
    });
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks(tasks);
    }
  }, [tasks]);

  const handleReset = async () => {
    // Clear all localStorage data
    localStorage.clear();

    // Reset state to initial values
    setTasks([]);
    setLists(mockLists);
    setTab("todos");
    setIsSortMinimized(false);
    setSearchQuery("");
    setSelectedLabel(null);
    setIsResetModalOpen(false);
    setIsCategoriesExpanded(false);
    setIsAllExpanded(false);
    setIsAllExpandedMode(false);
    setExpandedTaskId(null);
    setExpandedListId(null);

    // Close the modal
    setIsResetModalOpen(false);
  };

  const handleTabNavigation = (direction: "left" | "right") => {
    setIsAllExpandedMode(false);
    setExpandedTaskId(null);
    scrollToTop();
    const tabs: ("todos" | "archive" | "lists" | "docs")[] = [
      "todos",
      "archive",
      "docs",
    ];
    const currentIndex = tabs.indexOf(tab);
    let newIndex: number;

    if (direction === "right") {
      newIndex = currentIndex === tabs.length - 1 ? 0 : currentIndex + 1;
    } else {
      newIndex = currentIndex === 0 ? tabs.length - 1 : currentIndex - 1;
    }
    saveTab(tabs[newIndex]);
    setTab(tabs[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === "INPUT") {
        return;
      }
      if (e.code === "Space" && e.altKey && !isMessagePanelOpen) {
        e.preventDefault();
        closeAddTaskPanel();
        setTab("todos");
        openAddTaskPanel();
      }
      // Only handle Cmd+Space (Mac) or Ctrl+Space (Windows)
      if (
        e.code === "Space" &&
        (e.metaKey || e.ctrlKey) &&
        !isMessagePanelOpen
      ) {
        closeAddTaskPanel();
        // If a task is expanded, create a subtask
        const task = tasks.find((t) => t.id === expandedTaskId);
        if (task && !isAllExpanded && !isMessagePanelOpen) {
          setShowSubTasksId(expandedTaskId);
          if (task) {
            setTab("todos");
            openAddTaskPanel(task.id, task.title);
          }
        }
        // If we're on the tasks tab and no task is expanded, create a new task
        else if (!isMessagePanelOpen) {
          setTab("todos");
          openAddTaskPanel();
        }
      }
      // Handle Cmd+Enter (Mac) or Ctrl+Enter (Windows) to open expanded task in edit mode
      else if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        closeMessagePanel();
        closeAddTaskPanel();
        if (expandedTaskId && !isAllExpanded && !isAddTaskPanelOpen) {
          const task = tasks.find((t) => t.id === expandedTaskId);
          if (task) {
            setIsEditing(true);
            setFocusDescription(false);
          }
        } else {
          setExpandedTaskId(tasks[0].id);
          setIsEditing(true);
          setFocusDescription(false);
        }
      }
      // Handle Cmd+M (Mac) or Ctrl+M (Windows) to minimize/maximize all tasks
      else if (e.key === "m" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (tab === "todos" || tab === "archive") {
          setIsAllExpanded(!isAllExpanded);
          setIsAllExpandedMode(!isAllExpandedMode);
          if (!isAllExpanded) {
            setExpandedTaskId("all");
          } else {
            setExpandedTaskId(null);
          }
        }
      } else if (e.key === "f" && (e.metaKey || e.ctrlKey) && tab !== "docs") {
        e.preventDefault();
        setIsCategoriesExpanded(!isCategoriesExpanded);
      }
      // Handle Cmd+1-0 (Mac) or Ctrl+1-0 (Windows) to minimize/maximize individual tasks
      else if (e.key >= "0" && e.key <= "9" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (tab === "todos" || tab === "archive") {
          setIsAllExpandedMode(false);
          const taskIndex = e.key === "0" ? 9 : parseInt(e.key) - 1;
          const task = filteredTasks[taskIndex];
          if (task) {
            if (expandedTaskId === task.id) {
              setExpandedTaskId(null);
              setShowSubTasksId(null);
            } else {
              setExpandedTaskId(task.id);
              setShowSubTasksId(task.id);
            }
          }
        }
      }
      // Handle tab navigation with arrow keys
      else if (
        (e.key === "ArrowRight" || e.key === "ArrowLeft") &&
        (e.metaKey || e.ctrlKey)
      ) {
        e.preventDefault();
        handleTabNavigation(e.key === "ArrowRight" ? "right" : "left");
      }
      // Handle right/left arrow move tasks
      else if (
        (e.key === "ArrowRight" || e.key === "ArrowLeft") &&
        e.altKey &&
        (tab === "todos" || tab === "archive")
      ) {
        e.preventDefault();
        const direction = e.key === "ArrowLeft" ? "top" : "bottom";
        handleTaskMove(direction, expandedTaskId);
      }
      // Handle alt+up/down arrow move tasks
      else if (
        (e.key === "ArrowDown" || e.key === "ArrowUp") &&
        e.altKey &&
        (tab === "todos" || tab === "archive")
      ) {
        e.preventDefault();
        const direction = e.key === "ArrowDown" ? "down" : "up";
        handleTaskMove(direction, expandedTaskId);
      }
      // Handle up/down arrow navigation
      else if (
        (e.key === "ArrowDown" || e.key === "ArrowUp") &&
        (tab === "todos" || tab === "archive")
      ) {
        e.preventDefault();
        if (tab === "todos" || tab === "archive") {
          setIsAllExpandedMode(false);
          const currentIndex = expandedTaskId
            ? filteredTasks.findIndex((task) => task.id === expandedTaskId)
            : -1;

          if (e.key === "ArrowDown") {
            // If no task is expanded, expand the first task
            if (currentIndex === -1) {
              if (filteredTasks.length > 0) {
                setExpandedTaskId(filteredTasks[0].id);
                setShowSubTasksId(filteredTasks[0].id);
              }
            }
            // Otherwise, close current task and expand next task
            else if (currentIndex < filteredTasks.length - 1) {
              setExpandedTaskId(filteredTasks[currentIndex + 1].id);
              setShowSubTasksId(filteredTasks[currentIndex + 1].id);
            }
            // If we're at the last task, close it
            else {
              setExpandedTaskId(null);
              setShowSubTasksId(null);
            }
          } else if (e.key === "ArrowUp") {
            // If no task is expanded, expand the last task
            if (currentIndex === -1) {
              if (filteredTasks.length > 0) {
                setExpandedTaskId(filteredTasks[filteredTasks.length - 1].id);
                setShowSubTasksId(filteredTasks[filteredTasks.length - 1].id);
              }
            }
            // Otherwise, close current task and expand previous task
            else if (currentIndex > 0) {
              setExpandedTaskId(filteredTasks[currentIndex - 1].id);
              setShowSubTasksId(filteredTasks[currentIndex - 1].id);
            }
            // If we're at the first task, close it
            else {
              setExpandedTaskId(null);
              setShowSubTasksId(null);
            }
          }
        }
      } else if (
        e.key === "Backspace" &&
        (e.metaKey || e.ctrlKey) &&
        expandedTaskId &&
        !isAllExpanded
      ) {
        e.preventDefault();
        const task = tasks.find((t) => t.id === expandedTaskId);
        if (task) {
          handleDelete(task.id);
        }
      } else if (
        e.key === "Backspace" &&
        e.altKey &&
        expandedTaskId &&
        !isAllExpanded
      ) {
        e.preventDefault();
        const task = tasks.find((t) => t.id === expandedTaskId);
        if (task) {
          handleTaskUpdate({
            ...task,
            subtasks: task.subtasks.slice(0, -1),
          });
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    expandedTaskId,
    tab,
    tasks,
    openAddTaskPanel,
    isAllExpanded,
    setIsAllExpanded,
    setIsAllExpandedMode,
    setExpandedTaskId,
    setExpandedListId,
    setShowSubTasksId,
    handleDelete,
    isAllExpanded,
    isAddTaskPanelOpen,
    filteredTasks,
    isMessagePanelOpen,
    isDeleteModalOpen,
  ]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== "") {
      setTab("todos");
      saveTab("todos");
    }
  };

  return (
    <div className="flex flex-col calc(min-h-screen - 100px)">
      <div
        className={`bg-gray-900 border-b border-gray-800 fixed w-full transition-all duration-200 z-40 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between p-4 max-w-screen-lg mx-auto">
          <div className="flex-1">
            <Header
              ref={searchInputRef}
              onAddTask={() => openAddTaskPanel()}
              searchQuery={searchQuery}
              onSearchChange={handleSearch}
            />
          </div>
        </div>

        {showSortControls && (
          <SortControls
            sortField={sortField}
            sortDirection={sortDirection}
            isSortMinimized={isSortMinimized}
            onSortFieldChange={handleSort}
            onMinimizeToggle={() => {
              setIsSortMinimized(!isSortMinimized);
              if (!isSortMinimized) {
                setIsHeaderVisible(false);
              }
            }}
            onScrollToTop={scrollToTop}
            onScrollToBottom={scrollToBottom}
          />
        )}
      </div>
      <div className="flex-1 overflow-y-auto mt-[120px]">
        <div className="max-w-3xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="pb-10 pt-20">
            <div className="space-y-4">
              {error ? (
                <ErrorMessage message={error} onRetry={loadTasks} />
              ) : (
                <>
                  <div className="flex flex-col gap-6">
                    <Tabs
                      view={tab}
                      onViewChange={(newTab) => {
                        setTab(newTab);
                        saveTab(newTab);
                      }}
                      counts={{
                        todos: tasks.filter((task) => !task.archived).length,
                        archive: tasks.filter((task) => task.archived).length,
                        lists: lists.length,
                        docs: 0,
                      }}
                    />
                    {tab !== "docs" && (
                      <FilterSection
                        tab={tab}
                        isCategoriesExpanded={isCategoriesExpanded}
                        setIsCategoriesExpanded={setIsCategoriesExpanded}
                        isAllExpanded={isAllExpanded}
                        setIsAllExpanded={setIsAllExpanded}
                        setIsAllExpandedMode={setIsAllExpandedMode}
                        setExpandedTaskId={setExpandedTaskId}
                        setExpandedListId={setExpandedListId}
                        tasks={tasks}
                        lists={lists}
                        completedCount={completedCount}
                        tasksWithDueDate={tasksWithDueDate}
                        labels={labelsAndCountsLabels}
                        counts={labelsAndCountsCounts}
                        labelFilters={labelFilters}
                        handleCompletedClick={handleCompletedClickWithExpand}
                        handleDueDateClick={handleDueDateClickWithExpand}
                        handleLabelClick={handleLabelClickWithExpand}
                        clearAllFilters={clearAllFilters}
                        getCompletedState={getCompletedState}
                        getDueDateState={getDueDateState}
                        getLabelState={getLabelState}
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    {tab === "lists" && (
                      <ListSection
                        lists={sortedAndFilteredLists}
                        selectedLabel={selectedLabel}
                        onComplete={handleListComplete}
                        onDelete={handleListDelete}
                        onUpdate={handleListUpdate}
                        onLabelClick={handleLabelClickWithExpand}
                        onCloneToTask={handleListCloneToTask}
                        onPriorityChange={handleListPriorityChange}
                        isCollapsed={isCollapsed}
                        expandedListId={
                          isAllExpandedMode ? "all" : expandedListId
                        }
                        setExpandedListId={setExpandedListId}
                        showPriorityControls={sortField === "priority"}
                        onTabChange={setTab}
                      />
                    )}
                    {(tab === "todos" || tab === "archive") && (
                      <TaskSection
                        tasks={sortedAndFilteredTasks}
                        selectedLabel={selectedLabel}
                        onPriorityChange={handlePriorityChange}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                        onUpdate={handleTaskUpdate}
                        isCollapsed={isCollapsed}
                        onLabelClick={handleLabelClickWithExpand}
                        onAddSubtask={(id, title) =>
                          openAddTaskPanel(id, title)
                        }
                        expandedTaskId={
                          isAllExpandedMode ? "all" : expandedTaskId
                        }
                        setExpandedTaskId={setExpandedTaskId}
                        showPriorityControls={sortField === "priority"}
                        currentSortField={sortField}
                        onAddTask={() => openAddTaskPanel()}
                        showSubTasksId={showSubTasksId}
                        setShowSubTasksId={setShowSubTasksId}
                        onClearFilters={() => {
                          setSelectedLabel(null);
                          setSearchQuery("");
                          clearAllFilters();
                          searchInputRef.current?.focus();
                        }}
                        setIsEditing={(isEditing) => {
                          setIsEditing(isEditing);
                          setFocusDescription(false);
                        }}
                        setFocusDescription={setFocusDescription}
                      />
                    )}
                    {tab === "docs" && <DocsSection />}
                  </div>
                  {isLoading && (
                    <div className="fixed bottom-0 left-0 right-0 flex justify-center py-4 bg-gray-900/80 backdrop-blur-sm z-50 border-t border-gray-700">
                      <LoadingSpinner />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <SidePanel
        isOpen={isAddTaskPanelOpen}
        onClose={closeAddTaskPanel}
        title={
          parentTaskId
            ? `Lägg till deluppgift till "${parentTaskTitle}"`
            : "Lägg till uppgift"
        }
      >
        <TaskAddPanel
          isOpen={isAddTaskPanelOpen}
          onClose={closeAddTaskPanel}
          onAddTask={handleAddTask}
          totalTasks={tasks.length}
          parentTaskId={parentTaskId}
          parentTaskTitle={parentTaskTitle}
          subtasks={tasks.find((task) => task.id === parentTaskId)?.subtasks}
          onTitleChange={(title) => setTaskTitle(title)}
          isListMode={isListMode}
          onToggleMode={() => setIsListMode(!isListMode)}
          onAddList={handleAddList}
        />
      </SidePanel>
      <SidePanel
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={`Redigera "${
          tasks.find((t) => t.id === expandedTaskId)?.title
        }"`}
      >
        <TaskEditPanel
          task={tasks.find((t) => t.id === expandedTaskId)}
          isEditing={isEditing}
          onUpdate={handleTaskUpdate}
          onClose={() => setIsEditing(false)}
          focusDescription={focusDescription}
        />
      </SidePanel>
      <SidePanel
        isOpen={isMessagePanelOpen}
        onClose={closeMessagePanel}
        title={messagePanelTitle || ""}
      >
        <div>{messagePanelMessage}</div>
      </SidePanel>

      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handleReset}
      />

      <DeleteConfirmDialog
        isOpen={isDeleteModalOpen}
        onClose={handleDeleteCancel}
        onConfirm={() => handleDeleteConfirm(taskToDelete?.id || "")}
        taskTitle={taskToDelete?.title || ""}
      />
    </div>
  );
};

export default Body;
