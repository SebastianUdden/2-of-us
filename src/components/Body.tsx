import { LabelFilter, LabelState } from "../types/LabelState";
import { mockLists, mockTasks } from "../data/mock";
import { useCallback, useEffect, useState } from "react";

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
import { useFilteredLists } from "../data/hooks/useFilteredItems";
import { useFilteredTasks } from "../data/hooks/useFilteredItems";
import { useLabelsAndCounts } from "../data/hooks/useLabelsAndCounts";

const Body = () => {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [lists, setLists] = useState<List[]>(mockLists);
  const [tab, setTab] = useState<"todos" | "archive" | "lists">("todos");
  const [animatingTaskId, setAnimatingTaskId] = useState<string | null>(null);
  const [animatingTaskHeight, setAnimatingTaskHeight] = useState<number | null>(
    null
  );
  const [animatingListId, setAnimatingListId] = useState<string | null>(null);
  const [animatingListHeight, setAnimatingListHeight] = useState<number | null>(
    null
  );
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingTaskMove, setPendingTaskMove] = useState<{
    taskId: string;
    newPosition: number;
  } | null>(null);
  const [pendingListMove, setPendingListMove] = useState<{
    listId: string;
    newPosition: number;
  } | null>(null);
  const [sortField, setSortField] = useState<
    "dueDate" | "createdAt" | "title" | "updatedAt" | "priority"
  >("priority");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [isSortMinimized, setIsSortMinimized] = useState(false);
  const [labelFilters, setLabelFilters] = useState<LabelFilter[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddTaskPanelOpen, setIsAddTaskPanelOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<string | undefined>();
  const [parentTaskTitle, setParentTaskTitle] = useState<string | undefined>();
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState(false);
  const [expandedListId, setExpandedListId] = useState<string | null>(null);
  const [isAllExpanded, setIsAllExpanded] = useState(false);
  const [isAllExpandedMode, setIsAllExpandedMode] = useState(false);

  const { labels: labelsAndCountsLabels, counts: labelsAndCountsCounts } =
    useLabelsAndCounts(tasks, lists, tab, searchQuery);

  // Calculate tasks with due date count based on search query
  const tasksWithDueDate = tasks.filter((task) => {
    const matchesSearch = searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.author.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch && task.dueDate;
  }).length;

  // Calculate completed tasks count based on search query
  const completedCount = tasks.filter((task) => {
    const matchesSearch = searchQuery
      ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.author.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    return matchesSearch && task.completed;
  }).length;

  const sortTasks = useCallback((tasks: Task[]): Task[] => {
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
  }, []); // Empty dependency array since it doesn't depend on any external values

  const handleAddTask = (newTask: Task) => {
    if (parentTaskId) {
      // Add as subtask
      setTasks((prevTasks) => {
        return prevTasks.map((task) => {
          if (task.id === parentTaskId) {
            return {
              ...task,
              subtasks: [...task.subtasks, newTask],
            };
          }
          return task;
        });
      });
      // Automatically expand the parent task
      setExpandedTaskId(parentTaskId);
    } else {
      // Add as main task
      setTasks((prevTasks) => {
        const updatedTasks = [...prevTasks, newTask];
        return sortTasks(updatedTasks);
      });
    }
    setIsAddTaskPanelOpen(false);
    setParentTaskId(undefined);
    setParentTaskTitle(undefined);
  };

  const handleAddSubtask = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setParentTaskId(taskId);
      setParentTaskTitle(task.title);
      setIsAddTaskPanelOpen(true);
    }
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
  const handleTaskMove = useCallback(() => {
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

    // Wait for expand animation and then scroll to the task
    setTimeout(() => {
      setAnimatingTaskId(null);
      setPendingTaskMove(null);
      setAnimatingTaskHeight(null);

      // Scroll to the task
    }, ANIMATION.DURATION);
    setTimeout(() => {
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 10);
  }, [pendingTaskMove, sortTasks]);

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

  const handleLabelClick = (label: string) => {
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

  const clearAllFilters = () => {
    setLabelFilters([]);
  };

  const handleSort = (
    field: "dueDate" | "createdAt" | "title" | "updatedAt" | "priority"
  ) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
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

  // Modify the existing filtered tasks to include sorting
  const sortedAndFilteredTasks = getSortedTasks(filteredTasks);

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

  const sortedLists = [...filteredLists].sort((a, b) => {
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
      id: `task-${Date.now()}`,
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
  };

  const sortLists = useCallback((lists: List[]): List[] => {
    // First sort by completion status (completed lists go to bottom)
    const sortedByCompletion = [...lists].sort((a, b) => {
      const aCompleted = a.items.every((item) => item.completed);
      const bCompleted = b.items.every((item) => item.completed);
      if (aCompleted !== bCompleted) {
        return aCompleted ? 1 : -1;
      }
      return 0;
    });

    // Then sort by priority within each group (completed/uncompleted)
    return sortedByCompletion.map((list, index) => ({
      ...list,
      priority: index + 1,
    }));
  }, []);

  const handleListPriorityChange = (listId: string, newPosition: number) => {
    setAnimatingListId(listId);
    setPendingListMove({ listId, newPosition });
    setIsCollapsed(true);
  };

  const handleListHeight = (height: number) => {
    setAnimatingListHeight(height);
  };

  // Fix the handleListMove function
  const handleListMove = useCallback(() => {
    if (!pendingListMove) return;
    const { listId, newPosition } = pendingListMove;

    setLists((prevLists) => {
      const listIndex = prevLists.findIndex((list) => list.id === listId);
      const newLists = [...prevLists];
      const [movedList] = newLists.splice(listIndex, 1);
      newLists.splice(newPosition - 1, 0, movedList);
      return sortLists(newLists);
    });

    // Start expand animation
    setIsCollapsed(false);

    // Wait for expand animation and then scroll to the list
    setTimeout(() => {
      setAnimatingListId(null);
      setPendingListMove(null);
      setAnimatingListHeight(null);

      // Scroll to the list with offset based on the list's height
      const listElement = document.getElementById(`list-${listId}`);
      if (listElement && animatingListHeight) {
        const offset = animatingListHeight / 2;
        const elementPosition = listElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      } else if (listElement) {
        listElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, ANIMATION.DURATION);
  }, [pendingListMove, sortLists, animatingListHeight]);

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
              onAddTask={() => setIsAddTaskPanelOpen(true)}
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
                    onHeightChange={(height) => handleListHeight(height || 0)}
                    expandedListId={isAllExpandedMode ? "all" : expandedListId}
                    setExpandedListId={setExpandedListId}
                    showPriorityControls={sortField === "priority"}
                    animatingListId={animatingListId}
                    animatingListHeight={animatingListHeight}
                  />
                ) : (
                  <TaskSection
                    tasks={sortedAndFilteredTasks}
                    selectedLabel={selectedLabel}
                    onPriorityChange={handlePriorityChange}
                    onComplete={handleComplete}
                    onDelete={handleDelete}
                    onArchive={handleArchive}
                    onUpdate={handleUpdate}
                    isCollapsed={isCollapsed}
                    onHeightChange={handleTaskHeight}
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
      <AddTaskPanel
        isOpen={isAddTaskPanelOpen}
        onClose={() => {
          setIsAddTaskPanelOpen(false);
          setParentTaskId(undefined);
          setParentTaskTitle(undefined);
        }}
        onAddTask={handleAddTask}
        totalTasks={tasks.length}
        parentTaskId={parentTaskId}
        parentTaskTitle={parentTaskTitle}
      />
    </div>
  );
};

export default Body;
