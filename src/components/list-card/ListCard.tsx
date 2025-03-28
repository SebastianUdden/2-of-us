import { List, ListItem } from "../../types/List";

import { ANIMATION } from "../task-card/constants";
import DeleteConfirmDialog from "../task-card/DeleteConfirmDialog";
import { LabelPill } from "../LabelPill";
import { LabelState } from "../../types/LabelState";
import { Task } from "../../types/Task";
import TaskArrows from "../task-card/TaskArrows";
import { TrashIcon } from "../icons/TrashIcon";
import { useState } from "react";

interface ListCardProps {
  list: List;
  onComplete: (listId: string, itemId: string) => void;
  onDelete: (listId: string) => void;
  onUpdate: (updatedList: List) => void;
  onLabelClick: (label: string) => void;
  selectedLabel?: string;
  onConvertToTask?: (task: Task) => void;
  onPriorityChange?: (listId: string, newPosition: number) => void;
  totalLists: number;
  isAnimating?: boolean;
  isCollapsed?: boolean;
}

const ListCard = ({
  list,
  onComplete,
  onDelete,
  onUpdate,
  onLabelClick,
  selectedLabel,
  onConvertToTask,
  onPriorityChange,
  totalLists,
  isAnimating = false,
  isCollapsed = false,
}: ListCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [editedDescription, setEditedDescription] = useState(
    list.description || ""
  );

  const handleItemComplete = (itemId: string) => {
    onComplete(list.id, itemId);
  };

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = () => {
    onDelete(list.id);
    setShowDeleteConfirm(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedTitle !== list.title || editedDescription !== list.description) {
      onUpdate({
        ...list,
        title: editedTitle,
        description: editedDescription,
      });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(list.title);
    setEditedDescription(list.description || "");
    setIsEditing(false);
  };

  const handleItemContentChange = (
    itemId: string,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, content: e.target.value } : item
    );
    onUpdate({ ...list, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem: ListItem = {
      id: `${list.id}-${list.items.length + 1}`,
      content: "",
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    onUpdate({ ...list, items: [...list.items, newItem] });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = list.items.filter((item) => item.id !== itemId);
    onUpdate({ ...list, items: updatedItems });
  };

  const handleConvertToTask = () => {
    if (!onConvertToTask) return;

    const task: Task = {
      id: crypto.randomUUID(),
      title: list.title,
      description: list.description || "",
      author: list.author,
      createdAt: new Date(),
      updatedAt: new Date(),
      completed: false,
      priority: 1,
      labels: list.labels || [],
      archived: false,
      updates: [],
      subtasks: list.items.map((item) => ({
        id: crypto.randomUUID(),
        title: item.content,
        completed: item.completed,
      })),
    };

    onConvertToTask(task);
  };

  const handlePriorityChange = (newPosition: number) => {
    if (onPriorityChange) {
      onPriorityChange(list.id, newPosition);
    }
  };

  const completedCount = list.items.filter((item) => item.completed).length;
  const totalCount = list.items.length;

  return (
    <>
      <div
        id={`list-${list.id}`}
        className={`
          border border-gray-700 rounded-lg w-[90%] 
          transition-all duration-${ANIMATION.DURATION} ${ANIMATION.EASING}
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
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                {isEditing ? (
                  <form onSubmit={handleSubmit} className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter list title..."
                    />
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                  </form>
                ) : (
                  <h3
                    className="text-lg font-medium text-gray-200"
                    onClick={() => setIsEditing(true)}
                  >
                    {list.title}
                  </h3>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleConvertToTask}
                  className="p-1.5 text-gray-400 hover:text-gray-200"
                  aria-label="Convert to task"
                >
                  Clone to Task
                </button>
                <button
                  onClick={handleDelete}
                  className="p-1.5 text-red-400 hover:text-red-300"
                  aria-label="Delete list"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
                {onPriorityChange && (
                  <TaskArrows
                    taskId={list.id}
                    priority={list.priority}
                    totalTasks={totalLists}
                    onPriorityChange={(_, newPosition) =>
                      handlePriorityChange(newPosition)
                    }
                  />
                )}
              </div>
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
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Save
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-200 text-sm mt-2">{list.description}</p>
            )}
            <div className="flex items-center gap-2 mt-2">
              {list.labels?.map((label) => (
                <LabelPill
                  key={label}
                  label={label}
                  onClick={() => onLabelClick(label)}
                  state={
                    selectedLabel === label
                      ? LabelState.SHOW_ONLY
                      : LabelState.SHOW_ALL
                  }
                />
              ))}
            </div>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <span>
                Created: {new Date(list.createdAt).toLocaleDateString()}
              </span>
              <span>
                Updated: {new Date(list.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-400">
              Items ({completedCount}/{totalCount})
            </h3>
            <button
              onClick={handleAddItem}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              + Add Item
            </button>
          </div>
          {list.type === "ordered" ? (
            <ol className="list-decimal list-inside space-y-2">
              {list.items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleItemComplete(item.id)}
                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => handleItemContentChange(item.id, e)}
                    className={`flex-1 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 ${
                      item.completed ? "line-through text-gray-400" : ""
                    }`}
                    placeholder={`Item ${index + 1}`}
                  />
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ol>
          ) : (
            <ul className="list-disc list-inside space-y-2">
              {list.items.map((item, index) => (
                <li
                  key={item.id}
                  className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-md transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={item.completed}
                    onChange={() => handleItemComplete(item.id)}
                    className="rounded border-gray-600 text-blue-500 focus:ring-blue-500 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={item.content}
                    onChange={(e) => handleItemContentChange(item.id, e)}
                    className={`flex-1 bg-transparent text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 ${
                      item.completed ? "line-through text-gray-400" : ""
                    }`}
                    placeholder={`Item ${index + 1}`}
                  />
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        taskTitle={list.title}
      />
    </>
  );
};

export default ListCard;
