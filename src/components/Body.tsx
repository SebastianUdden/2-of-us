import { LabelFilter, LabelState } from "../types/LabelState";
import { mockLists, mockTasks } from "../data/mock";
import { useCallback, useEffect, useState } from "react";

import { ANIMATION } from "./task-card/constants";
import AddTaskPanel from "./AddTaskPanel";
import Header from "./Header";
import { LabelPill } from "./LabelPill";
import { List } from "../types/List";
import ListCard from "./list-card/ListCard";
import { MinimizeIcon } from "./icons/MinimizeIcon";
import { ScrollButtons } from "./ScrollButtons";
import Tabs from "./Tabs";
import { Task } from "../types/Task";
import TaskCard from "./task-card/TaskCard";
import { generateUUID } from "../utils/uuid";
import { useLabelsAndCounts } from "../data/hooks";

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
  const [selectedLabel, setSelectedLabel] = useState<string | undefined>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingTaskMove, setPendingTaskMove] = useState<{
    taskId: string;
    newPosition: number;
  } | null>(null);
  const [pendingListMove, setPendingListMove] = useState<{
    listId: string;
    newPosition: number;
  } | null>(null);
  const [sortField, setSortField] = useState<keyof Task>("priority");
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

  const { labels, counts } = useLabelsAndCounts(tasks, lists, tab, searchQuery);

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

  const filteredTasks = tasks.filter((task) => {
    // First filter by view (todos/archive)
    if (tab === "todos" && task.archived) return false;
    if (tab === "archive" && !task.archived) return false;

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

  const clearAllFilters = () => {
    setLabelFilters([]);
  };

  const handleSort = (field: keyof Task) => {
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
    field: keyof Task;
    label: string;
  }) => (
    <button
      onClick={() => handleSort(field)}
      className={`px-2 py-1 text-xs sm:text-sm rounded-md transition-colors ${
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
    setSelectedLabel(selectedLabel === label ? undefined : label);
  };

  const filteredLists = lists.filter((list) => {
    // Apply search filter
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        list.title.toLowerCase().includes(searchLower) ||
        (list.description?.toLowerCase() || "").includes(searchLower) ||
        list.author.toLowerCase().includes(searchLower) ||
        list.items.some((item) =>
          item.content.toLowerCase().includes(searchLower)
        );
      if (!matchesSearch) return false;
    }

    // Apply label filters
    if (labelFilters.length > 0) {
      return labelFilters.every((filter) => {
        if (filter.label === "completed") {
          const isCompleted = list.items.every((item) => item.completed);
          if (filter.state === LabelState.SHOW_ONLY) return isCompleted;
          if (filter.state === LabelState.SHOW_OTHERS) return !isCompleted;
          return true;
        }
        const hasLabel = list.labels?.includes(filter.label);
        if (filter.state === LabelState.SHOW_ONLY) return hasLabel;
        if (filter.state === LabelState.SHOW_OTHERS) return !hasLabel;
        return true;
      });
    }

    // Apply selected label filter
    if (selectedLabel) {
      return list.labels?.includes(selectedLabel);
    }

    return true;
  });

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

  // Handle the actual list move after collapse animation
  const handleListMove = useCallback(() => {
    if (!pendingListMove) return;

    const { listId, newPosition } = pendingListMove;
    setLists((prevLists) => {
      const listIndex = prevLists.findIndex((list) => list.id === listId);
      const newLists = [...prevLists];
      const [movedList] = newLists.splice(listIndex, 1);
      newLists.splice(newPosition - 1, 0, movedList);

      // Sort lists and update priorities
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

        {/* Sort Section */}
        <div className="border-t border-gray-800">
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
              <div className="flex gap-2 overflow-x-auto pb-2 max-w-[calc(100vw-2rem)] items-center">
                <span className="text-xs sm:text-sm text-gray-400 mr-2 whitespace-nowrap">
                  Sortera efter:
                </span>
                <SortButton field="priority" label="Prioritet" />
                <SortButton field="dueDate" label="Förfallodatum" />
                <SortButton field="updatedAt" label="Uppdaterad" />
                <SortButton field="title" label="Titel" />
                <ScrollButtons
                  onScrollToBottom={scrollToBottom}
                  onScrollToTop={scrollToTop}
                />
              </div>
            </div>
            <button
              onClick={() => {
                setIsSortMinimized(!isSortMinimized);
                if (!isSortMinimized) {
                  setIsHeaderVisible(false);
                }
              }}
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
                <div className="flex flex-wrap gap-2 w-full">
                  <div className="flex flex-row w-full justify-between">
                    <button
                      onClick={() =>
                        setIsCategoriesExpanded(!isCategoriesExpanded)
                      }
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors mb-2"
                    >
                      <span className="text-xs sm:text-sm">
                        Filterkategorier
                      </span>
                      <MinimizeIcon
                        isMinimized={!isCategoriesExpanded}
                        className="w-4 h-4"
                      />
                    </button>
                    <button
                      onClick={() => {
                        setIsAllExpandedMode(!isAllExpandedMode);
                        setIsAllExpanded(!isAllExpanded);
                        if (isAllExpanded) {
                          setExpandedTaskId(null);
                          setExpandedListId(null);
                        } else {
                          // Expand all tasks and lists
                          const allTaskIds = tasks.map((task) => task.id);
                          const allListIds = lists.map((list) => list.id);
                          setExpandedTaskId(allTaskIds[0] || null);
                          setExpandedListId(allListIds[0] || null);
                        }
                      }}
                      className="flex items-center gap-2 text-gray-400 hover:text-gray-300 transition-colors mb-2 ml-4"
                    >
                      <span className="text-xs sm:text-sm whitespace-nowrap">
                        {isAllExpanded ? "Minimera alla" : "Expandera alla"}
                      </span>
                      <MinimizeIcon
                        isMinimized={isAllExpanded}
                        className="w-4 h-4"
                      />
                    </button>
                  </div>
                  <div
                    className={`flex flex-wrap gap-2 transition-all duration-200 ${
                      isCategoriesExpanded
                        ? "opacity-100 max-h-[500px]"
                        : "opacity-0 max-h-0 overflow-hidden"
                    }`}
                  >
                    {completedCount > 0 && (
                      <LabelPill
                        label="Avklarade"
                        onClick={handleCompletedClick}
                        state={getCompletedState()}
                        count={completedCount}
                      />
                    )}
                    {tasksWithDueDate > 0 && (
                      <LabelPill
                        label="Förfallodatum"
                        onClick={handleDueDateClick}
                        state={getDueDateState()}
                        count={tasksWithDueDate}
                      />
                    )}
                    {Array.from(labels)
                      .filter((label) => counts[label] > 0)
                      .map((label) => (
                        <LabelPill
                          key={label}
                          label={label}
                          onClick={() => handleLabelClick(label)}
                          state={getLabelState(label)}
                          count={counts[label]}
                        />
                      ))}
                    <LabelPill
                      label="Rensa filter"
                      onClick={clearAllFilters}
                      state={
                        labelFilters.length === 0
                          ? LabelState.SHOW_ONLY
                          : LabelState.SHOW_ALL
                      }
                      count={tasks.length}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                {tab === "lists" ? (
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
                        selectedLabel={selectedLabel || ""}
                        onCloneToTask={() => handleListCloneToTask(list)}
                        onPriorityChange={handleListPriorityChange}
                        totalLists={sortedLists.length}
                        isAnimating={animatingListId === list.id}
                        isCollapsed={isCollapsed}
                        onHeightChange={handleListHeight}
                        showPriorityControls={sortField === "priority"}
                        expandedListId={
                          isAllExpandedMode ? list.id : expandedListId
                        }
                        setExpandedListId={setExpandedListId}
                      />
                    ))
                  )
                ) : sortedAndFilteredTasks.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                    <p className="text-lg font-medium mb-2">No tasks found</p>
                    <p className="text-sm text-center">
                      {selectedLabel
                        ? "No tasks with this label"
                        : "Add your first task to get started"}
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
                      isAnimating={task.id === animatingTaskId}
                      isCollapsed={isCollapsed}
                      onHeightChange={handleTaskHeight}
                      onLabelClick={handleLabelClick}
                      selectedLabel={selectedLabel || ""}
                      onAddSubtask={handleAddSubtask}
                      expandedTaskId={
                        isAllExpandedMode ? task.id : expandedTaskId
                      }
                      setExpandedTaskId={setExpandedTaskId}
                      showPriorityControls={sortField === "priority"}
                      currentSortField={sortField}
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
