import { mockLists, mockTasks } from "../data/mock";
import { useEffect, useRef, useState } from "react";
import {
  useFilteredLists,
  useFilteredTasks,
} from "../data/hooks/useFilteredItems";

import { ANIMATION } from "./task-card/constants";
import DeleteConfirmDialog from "./task-card/DeleteConfirmDialog";
import DocsSection from "./sections/DocsSection";
import { ErrorMessage } from "./common/ErrorMessage";
import { FilterSection } from "./sections/FilterSection";
import Header from "./Header";
import { List } from "../types/List";
import { ListSection } from "./sections/ListSection";
import { Loader } from "./common/Loader";
import { LoadingSpinner } from "./common/LoadingSpinner";
import { ResetConfirmModal } from "./common/ResetConfirmModal";
import SidePanel from "./common/SidePanel";
import { SignInModal } from "./common/SignInModal";
import { SortControls } from "./sections/SortControls";
import Tabs from "./Tabs";
import { Task } from "../types/Task";
import TaskAddPanel from "./TaskAddPanel";
import TaskEditPanel from "./task-card/TaskEditPanel";
import { TaskSection } from "./sections/TaskSection";
import clsx from "clsx";
import { firebaseTaskService } from "../services/firebaseTaskService";
import { useAddTaskPanel } from "../data/hooks/useAddTaskPanel";
import { useAuth } from "../context/AuthContext";
import { useExpansionState } from "../data/hooks/useExpansionState";
import { useFilterManagement } from "../data/hooks/useFilterManagement";
import { useKeyboardShortcuts } from "../data/hooks/useKeyboardShortcuts";
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
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const { loadTab, saveTab } = useTabPersistence();
  const { loadTasks, saveTasks, isLoading, error } = useTaskPersistence();
  const { user, loading: isAuthLoading } = useAuth();
  const loading = isLoading || isAuthLoading;
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
    getSizeSmallState,
    getSizeMediumState,
    getSizeLargeState,
    clearAllFilters,
    handleSizeSmallClick,
    handleSizeMediumClick,
    handleSizeLargeClick,
    tasksWithSizeSmall,
    tasksWithSizeMedium,
    tasksWithSizeLarge,
  } = useFilterManagement(tasks);

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

  const [showSignInModal, setShowSignInModal] = useState(false);

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

  const handleUpdateTask = async (updatedTask: Task) => {
    try {
      if (storageType === "cloud" && user) {
        try {
          await firebaseTaskService.updateTask(updatedTask.id, updatedTask);
        } catch (error) {
          // If we get a permissions error, it likely means the task was deleted
          if (error instanceof Error && error.message.includes("permissions")) {
            // Re-add the task with the same data but a new ID
            const { id, ...taskWithoutId } = updatedTask;
            console.log(id);
            const newTask = await firebaseTaskService.addTask(
              taskWithoutId,
              user.uid
            );
            setTasks((prevTasks) =>
              prevTasks.map((task) =>
                task.id === updatedTask.id ? newTask : task
              )
            );
            return;
          }
          throw error;
        }
      }
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === updatedTask.id ? updatedTask : task
        )
      );
    } catch (error) {
      console.error("Error updating task:", error);
      loadTasks();
    }
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
    const loadInitialTasks = async () => {
      try {
        // Wait for auth loading to complete
        if (loading) {
          return;
        }

        if (user) {
          // If user is logged in, try to load from API first
          try {
            const apiTasks = await firebaseTaskService.getTasks(user.uid);
            setTasks(apiTasks);
            return;
          } catch (error) {
            console.error("Error loading tasks from API:", error);
            // If API fails, try localStorage
            const savedTasks = await loadTasks();
            if (savedTasks.length > 0) {
              setTasks(savedTasks);
            }
            return;
          }
        }

        // If not logged in, try localStorage first
        const savedTasks = await loadTasks();
        if (savedTasks.length > 0) {
          setTasks(savedTasks);
        } else {
          // Only use mock data if not logged in and no saved tasks
          setTasks(mockTasks);
        }
      } catch (error) {
        console.error("Error loading tasks:", error);
        if (!user) {
          setTasks(mockTasks);
        }
      }
    };

    loadInitialTasks();
  }, [user, loading]);

  useEffect(() => {
    if (!user && !loading) {
      setShowSignInModal(true);
    } else {
      setShowSignInModal(false);
    }
  }, [loading, user]);

  const handleReset = async () => {
    // Clear all localStorage data
    localStorage.clear();

    // Reset state to initial values
    setTasks([]);
    setLists(mockLists);
    setTab("docs");
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

  useKeyboardShortcuts({
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
    onTabChange: (newTab) => {
      setTab(newTab);
      saveTab(newTab);
    },
    onExpandedTaskIdChange: setExpandedTaskId,
    onShowSubTasksIdChange: setShowSubTasksId,
    onIsAllExpandedChange: setIsAllExpanded,
    onIsAllExpandedModeChange: setIsAllExpandedMode,
    onIsCategoriesExpandedChange: setIsCategoriesExpanded,
    onIsEditingChange: setIsEditing,
    onFocusDescriptionChange: setFocusDescription,
    onTaskMove: handleTaskMove,
    onTaskDelete: handleDelete,
    onTaskUpdate: handleUpdateTask,
    onAddTaskPanelOpen: openAddTaskPanel,
    onAddTaskPanelClose: closeAddTaskPanel,
    onMessagePanelClose: closeMessagePanel,
    onSortTasks: () => {
      setTasks((prevTasks) => sortTasks(prevTasks));
    },
    onTaskComplete: handleComplete,
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== "") {
      setTab("todos");
      saveTab("todos");
    }
  };

  const handleSkipSignIn = () => {
    setShowSignInModal(false);
  };

  return (
    <div className="flex flex-col h-full">
      <Header
        ref={searchInputRef}
        onAddTask={() => openAddTaskPanel()}
        searchQuery={searchQuery}
        onSearchChange={handleSearch}
        isSearchVisible={isSearchVisible}
        showSearch={
          (tab === "todos" && tasks.length > 0) ||
          (tab === "archive" &&
            tasks.filter((task) => task.archived).length > 0)
        }
        onSearchVisibilityChange={(visible) => {
          setIsSearchVisible(visible);
          setTimeout(() => {
            if (visible) {
              searchInputRef.current?.focus();
            }
          }, 100);
        }}
      />
      {loading ? (
        <Loader />
      ) : (
        showSignInModal && <SignInModal onSkip={handleSkipSignIn} />
      )}
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
              showSearch={
                (tab === "todos" && tasks.length > 0) ||
                (tab === "archive" &&
                  tasks.filter((task) => task.archived).length > 0)
              }
              isSearchVisible={isSearchVisible}
              onSearchVisibilityChange={(visible) => {
                setIsSearchVisible(visible);
                setTimeout(() => {
                  if (visible) {
                    searchInputRef.current?.focus();
                  }
                }, 100);
              }}
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
      <div
        className={clsx(
          "flex-1 overflow-y-auto",
          showSortControls || isSearchVisible ? "mt-[60px]" : "",
          isSearchVisible && showSortControls ? "mt-[60px]" : ""
        )}
      >
        <div className="max-w-3xl mx-auto px-2 sm:px-6 lg:px-8">
          <div className="pb-10 pt-14">
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
                        getSizeSmallState={getSizeSmallState}
                        getSizeMediumState={getSizeMediumState}
                        getSizeLargeState={getSizeLargeState}
                        handleSizeSmallClick={handleSizeSmallClick}
                        handleSizeMediumClick={handleSizeMediumClick}
                        handleSizeLargeClick={handleSizeLargeClick}
                        tasksWithSizeSmall={tasksWithSizeSmall}
                        tasksWithSizeMedium={tasksWithSizeMedium}
                        tasksWithSizeLarge={tasksWithSizeLarge}
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
                    {!loading && (tab === "todos" || tab === "archive") && (
                      <TaskSection
                        tasks={sortedAndFilteredTasks}
                        selectedLabel={selectedLabel}
                        onPriorityChange={handlePriorityChange}
                        onComplete={handleComplete}
                        onDelete={handleDelete}
                        onArchive={handleArchive}
                        onUpdate={handleUpdateTask}
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
          onUpdate={handleUpdateTask}
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
