import Card from "../common/Card";
import DeleteConfirmDialog from "../task-card/DeleteConfirmDialog";
import { List } from "../../types/List";
import ListDescription from "./ListDescription";
import ListHeader from "./ListHeader";
import ListItems from "./ListItems";
import ListMetadata from "./ListMetadata";
import TaskArrows from "../task-card/TaskArrows";
import { useState } from "react";

interface ListCardProps {
  list: List;
  onComplete: (listId: string, itemId: string) => void;
  onDelete: (listId: string) => void;
  onUpdate: (updatedList: List) => void;
  onLabelClick: (label: string) => void;
  selectedLabel: string;
  onCloneToTask: (list: List) => void;
  onPriorityChange: (listId: string, newPosition: number) => void;
  totalLists: number;
  isAnimating: boolean;
  isCollapsed: boolean;
  onHeightChange: (height: number) => void;
  showPriorityControls: boolean;
  expandedListId: string | null;
  setExpandedListId: (id: string | null) => void;
  onTabChange?: (tab: "todos" | "archive" | "lists") => void;
  expandAll: boolean;
}

const ListCard = ({
  list,
  onComplete,
  onDelete,
  onUpdate,
  onLabelClick,
  selectedLabel,
  onCloneToTask,
  onPriorityChange,
  totalLists,
  isAnimating,
  isCollapsed,
  onHeightChange,
  showPriorityControls,
  expandedListId,
  setExpandedListId,
  onTabChange,
  expandAll,
}: ListCardProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(list.title);
  const [editedDescription, setEditedDescription] = useState(
    list.description || ""
  );
  const [isPriorityControlsVisible, setIsPriorityControlsVisible] =
    useState(false);

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

  const handleCloneToTask = () => {
    onCloneToTask(list);
    onTabChange?.("todos");
  };

  return (
    <>
      <Card
        id={`list-${list.id}`}
        type="list"
        isAnimating={isAnimating}
        isCollapsed={isCollapsed}
        onHeightChange={onHeightChange}
        expandedId={expandedListId}
        className="w-[90%]"
        expandAll={expandAll}
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
                onCloneToTask={handleCloneToTask}
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
      </Card>
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
