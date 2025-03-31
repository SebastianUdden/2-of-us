import { mockLists, mockTasks } from "../data/mock";
import { useEffect, useState } from "react";

import { ANIMATION } from "./task-card/constants";
import AddTaskPanel from "./AddTaskPanel";
import { FilterSection } from "./sections/FilterSection";
import Header from "./Header";
import { List } from "../types/List";
import { ListSection } from "./sections/ListSection";
import { SortControls } from "./sections/SortControls";
import Tabs from "./Tabs";
import { Task } from "../types/Task";
import { TaskSection } from "./sections/TaskSection";
import { useAddTaskPanel } from "../data/hooks/useAddTaskPanel";
import { useExpansionState } from "../data/hooks/useExpansionState";
import { useFilterManagement } from "../data/hooks/useFilterManagement";
import { useFilteredTasks } from "../data/hooks/useFilteredItems";
import { useLabelsAndCounts } from "../data/hooks/useLabelsAndCounts";
import { usePriorityManagement } from "../data/hooks/usePriorityManagement";
import { useSearchAndFilter } from "../data/hooks/useSearchAndFilter";
import { useSorting } from "../data/hooks/useSorting";

const Body = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [lists, setLists] = useState<List[]>(mockLists);
  const [tab, setTab] = useState<"todos" | "archive" | "lists">("todos");
  const [isSortMinimized, setIsSortMinimized] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);

  const {
    expandedTaskId,
    expandedListId,
    isAllExpanded,
    isAllExpandedMode,
    setExpandedTaskId,
    setExpandedListId,
    setIsAllExpanded,
    setIsAllExpandedMode,
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

  const { sortField, sortDirection, handleSort, getSortedTasks } = useSorting();

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
  } = useAddTaskPanel(tasks, setTasks, setExpandedTaskId);

  const {
    sortTasks,
    sortLists,
    handlePriorityChange,
    handleListPriorityChange,
    handleTaskMove,
    handleListMove,
    pendingTaskMove,
    pendingListMove,
    animatingTaskId,
    animatingListId,
    animatingTaskHeight,
    animatingListHeight,
    isCollapsed,
    setAnimatingTaskId,
    setAnimatingListId,
    setAnimatingTaskHeight,
    setAnimatingListHeight,
    setIsCollapsed,
  } = usePriorityManagement(tasks, lists, setTasks, setLists);

  const filteredTasks = useFilteredTasks({
    tasks,
    searchQuery,
    labelFilters,
    selectedLabel,
    tab,
  });

  const sortedAndFilteredTasks = getSortedTasks(filteredTasks);

  const handleAddSubtask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      openAddTaskPanel(task.id, task.title);
    }
  };

  const handleComplete = (taskId: string) => {
    // First update the completion status immediately
    setTasks((prevTasks) => {
      return prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
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
    setAnimatingTaskId(taskId);
    setIsCollapsed(true);

    // Wait for collapse animation
    setTimeout(() => {
      setTasks((prevTasks) => {
        const filteredTasks = prevTasks.filter((task) => task.id !== taskId);
        // Sort remaining tasks and update priorities
        return sortTasks(filteredTasks);
      });
      setAnimatingTaskId(null);
      setAnimatingTaskHeight(null);
      setIsCollapsed(false);
    }, ANIMATION.DURATION * 2);
  };

  const handleArchive = (taskId: string) => {
    setAnimatingTaskId(taskId);
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
      setAnimatingTaskId(null);
      setAnimatingTaskHeight(null);
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
    setAnimatingListId(listId);
    setIsCollapsed(true);

    // Wait for collapse animation
    setTimeout(() => {
      setLists((prevLists) => {
        const filteredLists = prevLists.filter((list) => list.id !== listId);
        // Sort remaining lists and update priorities
        return sortLists(filteredLists);
      });
      setAnimatingListId(null);
      setAnimatingListHeight(null);
      setIsCollapsed(false);
    }, ANIMATION.DURATION * 2);
  };

  const handleListUpdate = (updatedList: List) => {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  };

  const handleListLabelClick = (label: string) => {
    setSelectedLabel(selectedLabel === label ? null : label);
  };

  const sortedLists = [...lists].sort((a, b) => {
    // First sort by completion status (completed lists go to bottom)
    const aCompleted = a.items.every((item) => item.completed);
    const bCompleted = b.items.every((item) => item.completed);
    if (aCompleted !== bCompleted) {
      return aCompleted ? 1 : -1;
    }
    // Then sort by priority
    return a.priority - b.priority;
  });

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
      author: list.author,
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

  // Start the collapse animation
  useEffect(() => {
    if (pendingTaskMove) {
      const timer = setTimeout(() => {
        handleTaskMove();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pendingTaskMove, isCollapsed, handleTaskMove]);

  // Start the collapse animation for lists
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

  return (
    <div className="flex flex-col min-h-screen">
      <div
        className={`bg-gray-900 border-b border-gray-800 fixed w-full transition-all duration-200 z-40 ${
          isHeaderVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Header Section */}
        <div className="flex items-start justify-between p-4">
          <div className="flex-1">
            <Header
              onAddTask={() => openAddTaskPanel()}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>

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
      </div>
      <div
        className={`flex-1 overflow-y-auto ${
          isHeaderVisible ? "mt-[120px]" : "mt-0"
        }`}
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pt-8 sm:pt-20 pb-8">
            <div className="space-y-4">
              <div className="flex flex-col gap-6">
                <Tabs
                  view={tab}
                  onViewChange={setTab}
                  counts={{
                    todos: tasks.length,
                    archive: tasks.filter((task) => task.archived).length,
                    lists: lists.length,
                  }}
                />
                <FilterSection
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
                  handleCompletedClick={handleCompletedClick}
                  handleDueDateClick={handleDueDateClick}
                  handleLabelClick={handleLabelClick}
                  clearAllFilters={clearAllFilters}
                  getCompletedState={getCompletedState}
                  getDueDateState={getDueDateState}
                  getLabelState={getLabelState}
                />
              </div>
              <div className="space-y-2">
                {tab === "lists" ? (
                  <ListSection
                    lists={sortedLists}
                    selectedLabel={selectedLabel}
                    onComplete={handleListComplete}
                    onDelete={handleListDelete}
                    onUpdate={handleListUpdate}
                    onLabelClick={handleListLabelClick}
                    onCloneToTask={handleListCloneToTask}
                    onPriorityChange={handleListPriorityChange}
                    isCollapsed={isCollapsed}
                    onHeightChange={(height) =>
                      setAnimatingListHeight(height || 0)
                    }
                    expandedListId={isAllExpandedMode ? "all" : expandedListId}
                    setExpandedListId={setExpandedListId}
                    showPriorityControls={sortField === "priority"}
                    animatingListId={animatingListId}
                    animatingListHeight={animatingListHeight}
                    onTabChange={setTab}
                  />
                ) : (
                  <TaskSection
                    tasks={sortedAndFilteredTasks}
                    selectedLabel={selectedLabel}
                    onPriorityChange={handlePriorityChange}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                    onArchive={handleArchive}
                    onUpdate={() => {}}
                    isCollapsed={isCollapsed}
                    onHeightChange={setAnimatingTaskHeight}
                    onLabelClick={handleLabelClick}
                    onAddSubtask={handleAddSubtask}
                    expandedTaskId={isAllExpandedMode ? "all" : expandedTaskId}
                    setExpandedTaskId={setExpandedTaskId}
                    showPriorityControls={sortField === "priority"}
                    currentSortField={sortField}
                    animatingTaskId={animatingTaskId}
                    animatingTaskHeight={animatingTaskHeight}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {isAddTaskPanelOpen && (
        <AddTaskPanel
          isOpen={isAddTaskPanelOpen}
          onClose={closeAddTaskPanel}
          onAddTask={handleAddTask}
          totalTasks={tasks.length}
          parentTaskId={parentTaskId}
          parentTaskTitle={parentTaskTitle}
        />
      )}
    </div>
  );
};

export default Body;
