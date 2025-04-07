import { Size, SizeLabel } from "./SizeLabel";
import { useEffect, useState } from "react";

import Card from "../common/Card";
import { EditIcon } from "../common/EditIcon";
import { LabelPill } from "../LabelPill";
import { LabelState } from "../../types/LabelState";
import { MinimizeIcon } from "../icons/MinimizeIcon";
import { ProgressBar } from "../common/ProgressBar";
import { Task } from "../../types/Task";
import TaskArrows from "./TaskArrows";
import TaskDueDate from "./TaskDueDate";
import TaskFooter from "./TaskFooter";
import { TaskHeader } from "./TaskHeader";
import TaskUpdates from "./TaskUpdates";
import { UserAvatar } from "../common/UserAvatar";

interface TaskCardProps {
  task: Task;
  onPriorityChange: (taskId: string, newPosition: number) => void;
  onComplete: (taskId: string, allCompleted?: boolean) => void;
  onDelete: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  onUpdate: (updatedTask: Task) => void;
  totalTasks: number;
  isCollapsed: boolean;
  showPriorityControls: boolean;
  currentSortField: string;
  onLabelClick: (label: string) => void;
  selectedLabel: string;
  onAddSubtask: (taskId: string, taskTitle: string) => void;
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
  showSubTasksId: string | null;
  setShowSubTasksId: (id: string | null) => void;
  expandAll: boolean;
  setIsEditing: (isEditing: boolean) => void;
}

const TaskCard = ({
  task,
  onPriorityChange,
  onComplete,
  onDelete,
  onArchive,
  onUpdate,
  totalTasks,
  isCollapsed = false,
  onLabelClick,
  selectedLabel,
  onAddSubtask,
  expandedTaskId,
  setIsEditing,
  setExpandedTaskId,
  showSubTasksId,
  setShowSubTasksId,
  showPriorityControls,
  expandAll,
}: TaskCardProps) => {
  const [isPriorityControlsVisible, setIsPriorityControlsVisible] =
    useState(false);

  useEffect(() => {
    if (task.id !== expandedTaskId) {
      setIsPriorityControlsVisible(false);
    }
  }, [expandedTaskId, task.id]);

  const handleDueDateChange = (date: Date | undefined) => {
    onUpdate({
      ...task,
      dueDate: date,
    });
  };

  const handleSubtaskComplete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? {
            id: subtask.id,
            title: subtask.title,
            completed: !subtask.completed,
          }
        : {
            id: subtask.id,
            title: subtask.title,
            completed: subtask.completed,
          }
    );

    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
    });

    // Check if all subtasks are now completed
    const allCompleted =
      updatedSubtasks.length > 0 &&
      updatedSubtasks.every((subtask) => subtask.completed);
    if (allCompleted) {
      // Wait 1 second before hiding subtasks
      setTimeout(() => {
        setShowSubTasksId(null);
        onComplete(task.id, allCompleted);
        if (expandedTaskId === task.id) {
          setTimeout(() => {
            setExpandedTaskId(null);
          }, 500);
        }
      }, 500);
    } else if (task.completed) {
      onComplete(task.id);
    }
  };

  const handleSubtaskDelete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks
      .filter((subtask) => subtask.id !== subtaskId)
      .map((subtask) => ({
        id: subtask.id,
        title: subtask.title,
        completed: subtask.completed,
      }));

    const allCompleted =
      updatedSubtasks.length > 0 &&
      updatedSubtasks.every((subtask) => subtask.completed);
    if (allCompleted) {
      // Wait 1 second before hiding subtasks
      setTimeout(() => {
        if (showSubTasksId === task.id) {
          setShowSubTasksId(null);
        }
        onComplete(task.id, allCompleted);
        if (expandedTaskId === task.id) {
          setTimeout(() => {
            setExpandedTaskId(null);
          }, 500);
        }
      }, 500);
    }

    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  // Calculate subtask progress
  const completedSubtasks = task.subtasks.filter(
    (subtask) => subtask.completed
  ).length;
  const totalSubtasks = task.subtasks.length;

  return (
    <>
      <Card
        id={`task-${task.id}`}
        type="task"
        isCollapsed={isCollapsed}
        expandedId={expandedTaskId}
        className={`${task.completed ? "opacity-50" : ""}`}
        expandAll={expandAll}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col h-full justify-between flex-1 pr-2">
            <div className="flex items-start justify-between w-full">
              <TaskHeader
                task={task}
                onComplete={(taskId) => {
                  const allComplete =
                    task.subtasks.length === 0 ||
                    task.subtasks.every((s) => s.completed);
                  onComplete(taskId, allComplete);
                  if (
                    expandedTaskId === task.id &&
                    !task.completed &&
                    allComplete
                  ) {
                    setTimeout(() => {
                      setExpandedTaskId(null);
                    }, 500);
                  }
                }}
                onDelete={() => onDelete(task.id)}
                onArchive={onArchive}
                setIsEditing={setIsEditing}
                expandedTaskId={expandedTaskId}
                setExpandedTaskId={setExpandedTaskId}
                setIsPriorityControlsVisible={setIsPriorityControlsVisible}
                expandAll={expandAll}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TaskDueDate
                dueDate={task.dueDate}
                onDueDateChange={handleDueDateChange}
              />
              {task.size && <SizeLabel size={task.size as Size} />}
              {task.labels && task.labels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {task.labels.map((label) => (
                    <LabelPill
                      key={label}
                      label={label}
                      onClick={() => onLabelClick?.(label)}
                      state={
                        selectedLabel === label
                          ? LabelState.SHOW_ONLY
                          : LabelState.SHOW_ALL
                      }
                    />
                  ))}
                </div>
              )}
              <div className="ml-auto">
                <UserAvatar initials={task.initials} username={task.username} />
              </div>
            </div>
            {expandedTaskId === task.id && (
              <>
                <div
                  className="group flex items-start gap-1"
                  onClick={() => setIsEditing(true)}
                >
                  <p className="text-gray-200 text-sm mt-2">
                    {task.description}
                  </p>
                  <EditIcon className="mt-2" />
                </div>
                <TaskFooter task={task} />
              </>
            )}
          </div>
          {isPriorityControlsVisible && (
            <TaskArrows
              taskId={task.id}
              priority={task.priority}
              totalTasks={totalTasks}
              onPriorityChange={onPriorityChange}
            />
          )}
        </div>
        {expandedTaskId === task.id && (
          <>
            <div className="flex justify-between items-end mt-4 border-t border-gray-700">
              <TaskUpdates task={task} />
            </div>
            <div className="flex justify-between">
              {onAddSubtask && (
                <button
                  onClick={() => onAddSubtask(task.id, task.title)}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>+</span>
                  <span>Lägg till deluppgift</span>
                </button>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <button
                  onClick={() =>
                    showSubTasksId === task.id
                      ? setShowSubTasksId(null)
                      : setShowSubTasksId(task.id)
                  }
                  className="flex text-sm text-gray-400 hover:text-gray-300 items-center -mb-3"
                >
                  {showSubTasksId === task.id
                    ? "Göm deluppgifter"
                    : "Visa deluppgifter"}
                  <MinimizeIcon
                    isMinimized={showSubTasksId === task.id}
                    className="w-4 h-4 ml-2"
                  />
                </button>
              )}
            </div>
            {/* Subtasks Section */}
            {task.subtasks && task.subtasks.length > 0 && (
              <div className="mt-1 border-t border-gray-700 pt-2">
                <div className="flex items-center justify-between">
                  {task.subtasks.length > 0 && (
                    <div className="w-full">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">
                          {completedSubtasks} av {totalSubtasks} deluppgifter
                        </span>
                        <span className="text-sm text-gray-400">
                          {Math.round(
                            (completedSubtasks / totalSubtasks) * 100
                          )}
                          %
                        </span>
                      </div>
                      <ProgressBar
                        completed={completedSubtasks}
                        total={totalSubtasks}
                        className="mb-2"
                      />
                    </div>
                  )}
                </div>
                {showSubTasksId === task.id && (
                  <div className="space-y-2">
                    {task.subtasks.map((subtask) => (
                      <div
                        key={subtask.id}
                        onClick={() => handleSubtaskComplete(subtask.id)}
                        className="flex items-center gap-2 p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600 transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={subtask.completed}
                          onChange={() => handleSubtaskComplete(subtask.id)}
                          className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <span
                          className={`flex-1 text-sm ${
                            subtask.completed
                              ? "text-gray-400 line-through"
                              : "text-gray-200"
                          }`}
                        >
                          {subtask.title}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSubtaskDelete(subtask.id);
                          }}
                          className="text-gray-400 hover:text-gray-300"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {showPriorityControls && (
              <div className="flex flex-col items-start gap-2 mt-2">
                {!isPriorityControlsVisible ? (
                  <button
                    onClick={() => setIsPriorityControlsVisible(true)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Omprioritera
                  </button>
                ) : (
                  <div className="flex flex-col items-start gap-1">
                    <button
                      onClick={() => setIsPriorityControlsVisible(false)}
                      className="text-sm text-gray-400 hover:text-gray-300"
                    >
                      Färdigprioriterat
                    </button>
                    <div className="flex items-center gap-1">
                      <select
                        value={task.priority}
                        onChange={(e) =>
                          onPriorityChange(task.id, Number(e.target.value))
                        }
                        className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {Array.from(
                          { length: totalTasks },
                          (_, i) => i + 1
                        ).map((position) => (
                          <option key={position} value={position}>
                            {position}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default TaskCard;
