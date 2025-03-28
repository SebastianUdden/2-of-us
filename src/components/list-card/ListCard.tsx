import { useEffect, useRef, useState } from "react";

import { ANIMATION } from "../task-card/constants";
import DeleteConfirmDialog from "../task-card/DeleteConfirmDialog";
import { List } from "../../types/List";
import ListDescription from "./ListDescription";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import ListMetadata from "./ListMetadata";
import { Task } from "../../types/Task";
import TaskArrows from "../task-card/TaskArrows";

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
  onHeightChange?: (height: number) => void;
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
  onHeightChange,
}: ListCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [editedDescription, setEditedDescription] = useState(
    list.description || ""
  );

  useEffect(() => {
    if (!isAnimating && cardRef.current && onHeightChange) {
      onHeightChange(cardRef.current.offsetHeight);
    }
  }, [isAnimating, onHeightChange]);

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

  const handleItemContentChange = (itemId: string, value: string) => {
    const updatedItems = list.items.map((item) =>
      item.id === itemId ? { ...item, content: value } : item
    );
    onUpdate({ ...list, items: updatedItems });
  };

  const handleAddItem = () => {
    const newItem = {
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

  const handleCloneToTask = () => {
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

  const completedCount = list.items.filter((item) => item.completed).length;
  const totalCount = list.items.length;

  return (
    <>
      <div
        ref={cardRef}
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
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4  border-b border-gray-700 pb-4 mb-4">
          <div className="flex-1 space-y-2">
            <ListHeader
              title={list.title}
              isEditing={isEditing}
              editedTitle={editedTitle}
              onTitleChange={setEditedTitle}
              onEdit={() => setIsEditing(true)}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              onCloneToTask={handleCloneToTask}
              onDelete={handleDelete}
            />
            <ListMetadata
              labels={list.labels}
              selectedLabel={selectedLabel}
              onLabelClick={onLabelClick}
              createdAt={list.createdAt}
              updatedAt={list.updatedAt}
            />
            <ListDescription
              description={list.description || ""}
              isEditing={isEditing}
              editedDescription={editedDescription}
              onDescriptionChange={setEditedDescription}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
            />
          </div>
          {onPriorityChange && (
            <div className="flex items-start pt-2">
              <TaskArrows
                taskId={list.id}
                priority={list.priority}
                totalTasks={totalLists}
                onPriorityChange={(_, newPosition) =>
                  onPriorityChange(list.id, newPosition)
                }
              />
            </div>
          )}
        </div>

        <ListItems
          type={list.type}
          items={list.items}
          completedCount={completedCount}
          totalCount={totalCount}
          onItemComplete={handleItemComplete}
          onItemContentChange={handleItemContentChange}
          onItemDelete={handleDeleteItem}
          onAddItem={handleAddItem}
        />
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
