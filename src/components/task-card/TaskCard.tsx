import { useEffect, useRef, useState } from "react";

import { ANIMATION } from "./constants";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { LabelPill } from "../LabelPill";
import { LabelState } from "../../types/LabelState";
import { Task } from "../../types/Task";
import TaskArrows from "./TaskArrows";
import TaskDueDate from "./TaskDueDate";
import TaskFooter from "./TaskFooter";
import { TaskHeader } from "./TaskHeader";
import TaskUpdates from "./TaskUpdates";

interface TaskCardProps {
  task: Task;
  onPriorityChange: (taskId: string, newPosition: number) => void;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  onUpdate: (task: Task) => void;
  totalTasks: number;
  isAnimating?: boolean;
  isCollapsed?: boolean;
  onHeightChange?: (height: number) => void;
  onLabelClick?: (label: string) => void;
  selectedLabel?: string;
  disablePriorityControls?: boolean;
  onAddSubtask?: (parentTaskId: string) => void;
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
}

const TaskCard = ({
  task,
  onPriorityChange,
  onComplete,
  onDelete,
  onArchive,
  onUpdate,
  totalTasks,
  isAnimating = false,
  isCollapsed = false,
  onHeightChange,
  onLabelClick,
  selectedLabel,
  disablePriorityControls = false,
  onAddSubtask,
  expandedTaskId,
  setExpandedTaskId,
}: TaskCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [showSubtasks, setShowSubtasks] = useState(expandedTaskId === task.id);

  useEffect(() => {
    setShowSubtasks(expandedTaskId === task.id);
  }, [expandedTaskId, task.id]);

  useEffect(() => {
    if (!isAnimating && cardRef.current && onHeightChange) {
      onHeightChange(cardRef.current.offsetHeight);
    }
  }, [isAnimating, onHeightChange]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle !== task.title || editedDescription !== task.description) {
      onUpdate({
        ...task,
        title: editedTitle,
        description: editedDescription,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(task.title);
    setEditedDescription(task.description);
    setIsEditing(false);
  };

  const handleDueDateChange = (date: Date | undefined) => {
    onUpdate({
      ...task,
      dueDate: date,
    });
  };

  const handleSubtaskComplete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.map((subtask) =>
      subtask.id === subtaskId
        ? { ...subtask, completed: !subtask.completed }
        : subtask
    );
    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  const handleSubtaskDelete = (subtaskId: string) => {
    const updatedSubtasks = task.subtasks.filter(
      (subtask) => subtask.id !== subtaskId
    );
    onUpdate({
      ...task,
      subtasks: updatedSubtasks,
    });
  };

  const toggleSubtasks = () => {
    setShowSubtasks(!showSubtasks);
    setExpandedTaskId(showSubtasks ? null : task.id);
  };

  return (
    <>
      <div
        ref={cardRef}
        id={`task-${task.id}`}
        className={`
          border border-gray-700 rounded-lg w-[90%] 
          transition-all duration-${ANIMATION.DURATION} ${ANIMATION.EASING}
          ${task.completed ? "opacity-75" : ""}
          ${isAnimating ? "bg-gray-700" : "bg-gray-800"}
          ${
            isAnimating
              ? isCollapsed
                ? "animate-collapse"
                : "animate-fade-in"
              : ""
          }
          ${isCollapsed ? "opacity-0" : "opacity-100"}
          mx-auto my-4 px-4 py-4
          origin-top
          overflow-hidden
          w-full
        `}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col h-full justify-between flex-1 pr-2">
            <TaskHeader
              task={task}
              onComplete={onComplete}
              onDelete={() => setShowDeleteConfirm(true)}
              onArchive={onArchive}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              editedTitle={editedTitle}
              setEditedTitle={setEditedTitle}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
            <div className="flex items-center gap-2 mt-2">
              <TaskDueDate
                dueDate={task.dueDate}
                onDueDateChange={handleDueDateChange}
              />
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
            </div>
            {isEditing ? (
              <form onSubmit={handleSubmit} className="mt-2 space-y-2">
                <textarea
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Add a description..."
                />
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                  >
                    Avbryt
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Spara
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-200 text-sm mt-2">{task.description}</p>
            )}
            <TaskFooter task={task} />
          </div>
          <TaskArrows
            taskId={task.id}
            priority={task.priority}
            totalTasks={totalTasks}
            onPriorityChange={onPriorityChange}
            disabled={disablePriorityControls}
          />
        </div>
        <div className="flex justify-between items-end mt-4 border-t border-gray-700">
          <TaskUpdates task={task} />
          <div className="flex flex-col items-start gap-1">
            <span className="text-sm text-gray-400">Prioritet</span>
            <select
              value={task.priority}
              onChange={(e) =>
                onPriorityChange(task.id, Number(e.target.value))
              }
              className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {Array.from({ length: totalTasks }, (_, i) => i + 1).map(
                (position) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        {/* Subtasks Section */}
        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mt-4 border-t border-gray-700 pt-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-300">
                Subtasks (
                {task.subtasks.filter((subtask) => subtask.completed).length}/
                {task.subtasks.length})
              </h3>
              <button
                onClick={toggleSubtasks}
                className="text-sm text-gray-400 hover:text-gray-300"
              >
                {showSubtasks ? "Hide" : "Show"}
              </button>
            </div>
            {showSubtasks && (
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

        {/* Add Subtask Button */}
        {onAddSubtask && (
          <button
            onClick={() => onAddSubtask(task.id)}
            className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>+</span>
            <span>Add Subtask</span>
          </button>
        )}
      </div>
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          setShowDeleteConfirm(false);
          onDelete(task.id);
        }}
        taskTitle={task.title}
      />
    </>
  );
};
export default TaskCard;
