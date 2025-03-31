import { useEffect, useRef, useState } from "react";

import Card from "../common/Card";
import DeleteConfirmDialog from "./DeleteConfirmDialog";
import { EditIcon } from "../common/EditIcon";
import { LabelPill } from "../LabelPill";
import { LabelState } from "../../types/LabelState";
import { ProgressBar } from "../common/ProgressBar";
import { SizeLabel } from "./SizeLabel";
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
  onUpdate: (updatedTask: Task) => void;
  totalTasks: number;
  isAnimating: boolean;
  isCollapsed: boolean;
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
  showPriorityControls: boolean;
  currentSortField: string;
  onHeightChange: (height: number | null) => void;
  onLabelClick: (label: string) => void;
  selectedLabel: string;
  onAddSubtask: (taskId: string) => void;
  animatingTaskId: string | null;
  animatingTaskHeight: number | null;
  expandAll: boolean;
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
  onAddSubtask,
  expandedTaskId,
  setExpandedTaskId,
  showPriorityControls,
  expandAll,
}: TaskCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [showSubtasks, setShowSubtasks] = useState(expandedTaskId === task.id);
  const [isPriorityControlsVisible, setIsPriorityControlsVisible] =
    useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current) {
      onHeightChange(cardRef.current.offsetHeight);
    }
  }, [onHeightChange]);

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

    // Check if all subtasks are now completed
    const allCompleted = updatedSubtasks.every((subtask) => subtask.completed);
    if (allCompleted) {
      // Wait 1 second before hiding subtasks
      setTimeout(() => {
        setShowSubtasks(false);
      }, 1000);
    }
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
        isAnimating={isAnimating}
        isCollapsed={isCollapsed}
        onHeightChange={onHeightChange}
        expandedId={expandedTaskId}
        className={`${task.completed ? "opacity-50" : ""}`}
        expandAll={expandAll}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col h-full justify-between flex-1 pr-2">
            <div className="flex items-start justify-between w-full">
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
                expandedTaskId={expandedTaskId}
                setExpandedTaskId={setExpandedTaskId}
                setIsPriorityControlsVisible={setIsPriorityControlsVisible}
              />
            </div>
            <div className="flex items-center gap-2 mt-2">
              <TaskDueDate
                dueDate={task.dueDate}
                onDueDateChange={handleDueDateChange}
              />
              {task.size && <SizeLabel size={task.size} />}
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
            {expandedTaskId === task.id && (
              <>
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="mt-2 space-y-2">
                    <textarea
                      value={editedDescription}
                      onChange={(e) => setEditedDescription(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
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
                  <div
                    className="group flex items-start gap-1"
                    onClick={() => setIsEditing(true)}
                  >
                    <p className="text-gray-200 text-sm mt-2">
                      {task.description}
                    </p>
                    <EditIcon className="mt-2" />
                  </div>
                )}
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
                  onClick={() => onAddSubtask(task.id)}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                >
                  <span>+</span>
                  <span>Lägg till deluppgift</span>
                </button>
              )}
              {task.subtasks && task.subtasks.length > 0 && (
                <button
                  onClick={toggleSubtasks}
                  className="text-sm text-gray-400 hover:text-gray-300"
                >
                  {showSubtasks ? "Göm deluppgifter" : "Visa deluppgifter"}
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
                          {completedSubtasks} av {totalSubtasks} underuppgifter
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
