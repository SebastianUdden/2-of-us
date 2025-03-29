import { useEffect, useRef, useState } from "react";

import { ANIMATION } from "../task-card/constants";
import DeleteConfirmDialog from "../task-card/DeleteConfirmDialog";
import { List } from "../../types/List";
import ListDescription from "./ListDescription";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import ListMetadata from "./ListMetadata";
import TaskArrows from "../task-card/TaskArrows";

interface ListCardProps {
  list: List;
  onComplete: (listId: string, itemId: string) => void;
  onDelete: (listId: string) => void;
  onUpdate: (updatedList: List) => void;
  onLabelClick: (label: string) => void;
  selectedLabel?: string;
  onPriorityChange?: (listId: string, newPosition: number) => void;
  totalLists: number;
  isAnimating?: boolean;
  isCollapsed?: boolean;
  onHeightChange?: (height: number) => void;
  showPriorityControls: boolean;
  expandedListId: string | null;
  setExpandedListId: (id: string | null) => void;
}

const ListCard = ({
  list,
  onComplete,
  onDelete,
  onUpdate,
  onLabelClick,
  selectedLabel,
  onPriorityChange,
  totalLists,
  isAnimating = false,
  isCollapsed = false,
  onHeightChange,
  showPriorityControls,
  expandedListId,
  setExpandedListId,
}: ListCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [editedDescription, setEditedDescription] = useState(
    list.description || ""
  );
  const [isPriorityControlsVisible, setIsPriorityControlsVisible] =
    useState(false);

  useEffect(() => {
    if (!isAnimating && cardRef.current && onHeightChange) {
      onHeightChange(cardRef.current.offsetHeight);
    }
  }, [isAnimating, onHeightChange]);

  const handleItemComplete = (itemId: string) => {
    onComplete(list.id, itemId);
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

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = list.items.filter((item) => item.id !== itemId);
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
        <div className="flex items-start justify-between">
          <div className="flex flex-col h-full justify-between flex-1 pr-2">
            <div className="flex items-start justify-between w-full">
              <ListHeader
                list={list}
                onDelete={() => setShowDeleteConfirm(true)}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                editedTitle={editedTitle}
                setEditedTitle={setEditedTitle}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                expandedListId={expandedListId}
                setExpandedListId={setExpandedListId}
                setIsPriorityControlsVisible={setIsPriorityControlsVisible}
              />
            </div>
            {expandedListId === list.id && (
              <>
                <ListDescription
                  description={list.description || ""}
                  isEditing={isEditing}
                  editedDescription={editedDescription}
                  setEditedDescription={setEditedDescription}
                  onSubmit={handleSubmit}
                  onCancel={handleCancel}
                />
                <ListItems
                  type={list.type}
                  items={list.items}
                  completedCount={
                    list.items.filter((item) => item.completed).length
                  }
                  totalCount={list.items.length}
                  onItemComplete={handleItemComplete}
                  onItemContentChange={handleItemContentChange}
                  onItemDelete={handleDeleteItem}
                  onAddItem={handleAddItem}
                />
                <ListMetadata
                  labels={list.labels}
                  selectedLabel={selectedLabel}
                  onLabelClick={onLabelClick}
                  createdAt={list.createdAt}
                  updatedAt={list.updatedAt}
                />
              </>
            )}
          </div>
          {isPriorityControlsVisible && onPriorityChange && (
            <TaskArrows
              taskId={list.id}
              priority={list.priority}
              totalTasks={totalLists}
              onPriorityChange={onPriorityChange}
            />
          )}
        </div>
        {expandedListId === list.id && (
          <div className="flex justify-between items-end mt-4 border-t border-gray-700">
            {showPriorityControls && (
              <div className="flex flex-col items-end gap-2 mt-2">
                {!isPriorityControlsVisible ? (
                  <button
                    onClick={() => setIsPriorityControlsVisible(true)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Omprioritera
                  </button>
                ) : (
                  <button
                    onClick={() => setIsPriorityControlsVisible(false)}
                    className="text-sm text-blue-400 hover:text-blue-300"
                  >
                    Stäng
                  </button>
                )}
              </div>
            )}
          </div>
        )}
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
