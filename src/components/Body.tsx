import { LabelFilter, LabelState } from "../types/LabelState";
import { mockLists, mockTasks } from "../data/mock";
import { useEffect, useRef, useState } from "react";

import { ANIMATION } from "./task-card/constants";
import AddTaskPanel from "./AddTaskPanel";
import Header from "./Header";
import { LabelPill } from "./LabelPill";
import { List } from "../types/List";
import ListCard from "./list-card/ListCard";
import { MinimizeIcon } from "./icons/MinimizeIcon";
import { Task } from "../types/Task";
import TaskCard from "./task-card/TaskCard";
import { ViewToggle } from "./ViewToggle";

type SortField = "priority" | "dueDate" | "createdAt" | "updatedAt" | "title";
type SortDirection = "asc" | "desc";

const Body = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [lists, setLists] = useState<List[]>(mockLists);
  const [view, setView] = useState<"todos" | "archive" | "lists">("todos");
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);
  const [animatingTaskHeight, setAnimatingTaskHeight] = useState<number | null>(
    null
  );
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingTaskMove, setPendingTaskMove] = useState<{
    taskId: string;
    newPosition: number;
  } | null>(null);
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [isHeaderMinimized, setIsHeaderMinimized] = useState(false);
  const [isSortMinimized, setIsSortMinimized] = useState(false);
  const [labelFilters, setLabelFilters] = useState<LabelFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTaskPanelOpen, setIsAddTaskPanelOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Get all unique labels from tasks and lists
  const allLabels = Array.from(
    new Set(
      tasks
        .flatMap((task) => task.labels || [])
        .concat(lists.flatMap((list) => list.labels || []))
    )
  ).sort();

  // Get task counts for each label
  const labelCounts = allLabels.reduce((acc, label) => {
    acc[label] = tasks.filter((task) => task.labels?.includes(label)).length;
    return acc;
  }, {} as Record<string, number>);

  // Get count of tasks with due dates
  const tasksWithDueDate = tasks.filter((task) => task.dueDate).length;

  const sortTasks = (tasks: Task[]): Task[] => {
    // First sort by completion status (completed tasks go to bottom)
    const sortedByCompletion = [...tasks].sort((a, b) => {
      if (a.completed === b.completed) return 0;
      return a.completed ? 1 : -1;
    });

    // Then sort by priority within each group (completed/uncompleted)
    return sortedByCompletion.map((task, index) => ({
      ...task,
      priority: index + 1,
    }));
  };

  const handleAddTask = (newTask: Task) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  const handlePriorityChange = (taskId: string, newPosition: number) => {
    setAnimatingTaskId(taskId);
    setPendingTaskMove({ taskId, newPosition });
    setIsCollapsed(true);
  };

  const handleTaskHeight = (height: number) => {
    setAnimatingTaskHeight(height);
  };

  // Handle the actual task move after collapse animation
  const handleTaskMove = () => {
    if (!pendingTaskMove) return;

    const { taskId, newPosition } = pendingTaskMove;
    setTasks((prevTasks) => {
      const taskIndex = prevTasks.findIndex((task) => task.id === taskId);
      const newTasks = [...prevTasks];
      const [movedTask] = newTasks.splice(taskIndex, 1);
      newTasks.splice(newPosition - 1, 0, movedTask);

      // Sort tasks and update priorities
      return sortTasks(newTasks);
    });

    // Start expand animation
    setIsCollapsed(false);

    // Wait for expand animation
    setTimeout(() => {
      setAnimatingTaskId(null);
      setPendingTaskMove(null);
      setAnimatingTaskHeight(null);
    }, ANIMATION.DURATION);
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

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({
        top: scrollContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleLabelClick = (label: string) => {
    setLabelFilters((current: LabelFilter[]) => {
      const existingFilter = current.find(
        (f: LabelFilter) => f.label === label
      );
      if (existingFilter) {
        return current.filter((f: LabelFilter) => f.label !== label);
      }
      return [...current, { label, state: LabelState.SHOW_ALL }];
    });
  };

  const getLabelState = (label: string): LabelState => {
    const filter = labelFilters.find((f) => f.label === label);
    return filter?.state || LabelState.SHOW_ALL;
  };

  const handleCompletedClick = () => {
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
  };

  const getCompletedState = (): LabelState => {
    const filter = labelFilters.find((f) => f.label === "completed");
    return filter?.state || LabelState.SHOW_ALL;
  };

  const handleArchive = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, archived: true } : task
      )
    );
  };

  const handleUpdate = (updatedTask: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDueDateClick = () => {
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
  };

  const getDueDateState = () => {
    const filter = labelFilters.find((f) => f.label === "due-date");
    return filter?.state || LabelState.SHOW_ALL;
  };

  const filteredTasks = tasks.filter((task) => {
    // First filter by view (todos/archive)
    if (view === "todos" && task.archived) return false;
    if (view === "archive" && !task.archived) return false;

    // Then apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower) ||
        task.author.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }

    // Then apply label filters
    if (labelFilters.length > 0) {
      return labelFilters.every((filter) => {
        if (filter.label === "completed") {
          if (filter.state === LabelState.SHOW_ONLY) return task.completed;
          if (filter.state === LabelState.SHOW_OTHERS) return !task.completed;
          return true;
        }
        if (filter.label === "due-date") {
          if (filter.state === LabelState.SHOW_ONLY) return !!task.dueDate;
          if (filter.state === LabelState.SHOW_OTHERS) return !task.dueDate;
          return true;
        }
        const hasLabel = task.labels?.includes(filter.label);
        if (filter.state === LabelState.SHOW_ONLY) return hasLabel;
        if (filter.state === LabelState.SHOW_OTHERS) return !hasLabel;
        return true;
      });
    }

    return true;
  });

  const completedCount = tasks.filter((task) => task.completed).length;

  const clearAllFilters = () => {
    setLabelFilters([]);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field && field !== "priority") {
      // Only toggle direction if it's not priority
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      // Force "asc" for priority (which means highest priority first),
      // otherwise use "asc" as default
      setSortDirection(field === "priority" ? "asc" : "asc");
    }
  };

  const getSortedTasks = (tasks: Task[]): Task[] => {
    return [...tasks].sort((a, b) => {
      const multiplier = sortDirection === "asc" ? 1 : -1;

      switch (sortField) {
        case "priority":
          // For priority, always sort by lowest number first (highest priority)
          return a.priority - b.priority;
        case "dueDate":
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return multiplier * (a.dueDate.getTime() - b.dueDate.getTime());
        case "createdAt":
          return multiplier * (a.createdAt.getTime() - b.createdAt.getTime());
        case "updatedAt": {
          const aLatest =
            a.updates[a.updates.length - 1]?.updatedAt || a.createdAt;
          const bLatest =
            b.updates[b.updates.length - 1]?.updatedAt || b.createdAt;
          return multiplier * (aLatest.getTime() - bLatest.getTime());
        }
        case "title":
          return multiplier * a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });
  };

  // Add sort buttons to the UI
  const SortButton = ({
    field,
    label,
  }: {
    field: SortField;
    label: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
        sortField === field
          ? "bg-blue-500 text-white"
          : "bg-gray-700 text-gray-300 hover:bg-gray-600"
      }`}
    >
      {label}
      {sortField === field && field !== "priority" && (
        <span className="ml-1">{sortDirection === "asc" ? "↑" : "↓"}</span>
      )}
    </button>
  );

  // Modify the existing filtered tasks to include sorting
  const sortedAndFilteredTasks = getSortedTasks(filteredTasks);

  const handleListComplete = (listId: string, itemId: string) => {
    setLists((prevLists) =>
      prevLists.map((list) =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map((item) =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              ),
            }
          : list
      )
    );
  };

  const handleListDelete = (listId: string) => {
    setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
  };

  const handleListUpdate = (updatedList: List) => {
    setLists((prevLists) =>
      prevLists.map((list) => (list.id === updatedList.id ? updatedList : list))
    );
  };

  const handleListLabelClick = (label: string) => {
    setSelectedLabel(selectedLabel === label ? undefined : label);
  };

  const filteredLists = lists.filter((list) => {
    if (!selectedLabel) return true;
    return list.labels?.includes(selectedLabel);
  });

  const sortedLists = [...filteredLists].sort((a, b) => {
    const multiplier = sortDirection === "asc" ? 1 : -1;
    return multiplier * (a.createdAt.getTime() - b.createdAt.getTime());
  });

  return (
    <div className="flex flex-col h-screen">
      <div className="sticky top-0 z-10 bg-gray-900 border-b border-gray-800">
        {/* Header Section */}
        <div
          className={`flex items-center justify-between ${
            isHeaderMinimized ? "py-1" : "p-4"
          } transition-all duration-200`}
        >
          <div
            className={`flex-1 transition-all duration-200 ${
              isHeaderMinimized ? "h-6 overflow-hidden opacity-0" : ""
            }`}
          >
            <Header
              onAddTask={() => setIsAddTaskPanelOpen(true)}
              totalTasks={tasks.length}
              onScrollToTop={scrollToTop}
              onScrollToBottom={scrollToBottom}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
          <button
            onClick={() => setIsHeaderMinimized(!isHeaderMinimized)}
            className="ml-4 p-1 text-gray-400 hover:text-gray-300 transition-colors"
            aria-label={isHeaderMinimized ? "Expand header" : "Minimize header"}
          >
            <MinimizeIcon isMinimized={isHeaderMinimized} className="w-5 h-5" />
          </button>
        </div>

        {/* Sort Section */}
        <div className="border-t border-gray-800 ">
          <div
            className={`flex items-center justify-between ${
              isSortMinimized ? "py-1" : "p-4"
            } transition-all duration-200`}
          >
            <div
              className={`flex-1 transition-all duration-200 max-w-4xl mx-auto ${
                isSortMinimized ? "h-6 overflow-hidden opacity-0" : ""
              }`}
            >
              <div className="flex gap-2">
                <span className="text-sm text-gray-400 mr-2">Sort by:</span>
                <SortButton field="priority" label="Priority" />
                <SortButton field="dueDate" label="Due Date" />
                <SortButton field="createdAt" label="Created" />
                <SortButton field="updatedAt" label="Updated" />
                <SortButton field="title" label="Title" />
              </div>
            </div>
            <button
              onClick={() => setIsSortMinimized(!isSortMinimized)}
              className="ml-4 p-1 text-gray-400 hover:text-gray-300 transition-colors"
              aria-label={
                isSortMinimized
                  ? "Expand sort options"
                  : "Minimize sort options"
              }
            >
              <MinimizeIcon isMinimized={isSortMinimized} className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div ref={scrollContainerRef} className="h-full overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col gap-6">
              <ViewToggle view={view} onViewChange={setView} />
              <div className="flex flex-wrap gap-2">
                <LabelPill
                  label="Show all"
                  onClick={clearAllFilters}
                  state={
                    labelFilters.length === 0
                      ? LabelState.SHOW_ONLY
                      : LabelState.SHOW_ALL
                  }
                  count={tasks.length}
                />
                <LabelPill
                  label="Completed"
                  onClick={handleCompletedClick}
                  state={getCompletedState()}
                  count={completedCount}
                />
                <LabelPill
                  label="Due date"
                  onClick={handleDueDateClick}
                  state={getDueDateState()}
                  count={tasksWithDueDate}
                />
                {allLabels.map((label) => (
                  <LabelPill
                    key={label}
                    label={label}
                    onClick={() => handleLabelClick(label)}
                    state={getLabelState(label)}
                    count={labelCounts[label]}
                  />
                ))}
              </div>
            </div>
            <div className="space-y-6">
              {view === "lists" ? (
                sortedLists.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="text-lg font-medium mb-2">No lists found</p>
                    <p className="text-sm text-center">
                      {selectedLabel
                        ? "No lists with this label"
                        : "Add your first list to get started"}
                    </p>
                  </div>
                ) : (
                  sortedLists.map((list) => (
                    <ListCard
                      key={list.id}
                      list={list}
                      onComplete={handleListComplete}
                      onDelete={handleListDelete}
                      onUpdate={handleListUpdate}
                      onLabelClick={handleListLabelClick}
                      selectedLabel={selectedLabel}
                    />
                  ))
                )
              ) : sortedAndFilteredTasks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <p className="text-lg font-medium mb-2">No tasks found</p>
                  <p className="text-sm text-center">
                    {view === "archive" ? (
                      "No archived tasks yet"
                    ) : getLabelState(
                        labelFilters.find(
                          (f) => f.state === LabelState.SHOW_ONLY
                        )?.label || ""
                      ) === LabelState.SHOW_ONLY ? (
                      "No tasks with this label"
                    ) : searchQuery ? (
                      <>
                        No tasks match your search.{" "}
                        <button
                          onClick={() => setSearchQuery("")}
                          className="text-blue-400 hover:text-blue-300 underline"
                        >
                          Clear your search
                        </button>
                      </>
                    ) : (
                      "Add your first task to get started"
                    )}
                  </p>
                </div>
              ) : (
                sortedAndFilteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onPriorityChange={handlePriorityChange}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                    onArchive={handleArchive}
                    onUpdate={handleUpdate}
                    totalTasks={tasks.length}
                    isAnimating={animatingTaskId === task.id}
                    isCollapsed={isCollapsed && animatingTaskId === task.id}
                    onHeightChange={handleTaskHeight}
                    onLabelClick={handleLabelClick}
                    selectedLabel={
                      labelFilters.find((f) => f.state === LabelState.SHOW_ONLY)
                        ?.label
                    }
                    disablePriorityControls={sortField !== "priority"}
                  />
                ))
              )}
              {animatingTaskHeight !== null && isCollapsed && (
                <div
                  className="w-full bg-transparent"
                  style={{ height: `${animatingTaskHeight}px` }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <AddTaskPanel
        isOpen={isAddTaskPanelOpen}
        onClose={() => setIsAddTaskPanelOpen(false)}
        onAddTask={handleAddTask}
        totalTasks={tasks.length}
      />
    </div>
  );
};

export default Body;
