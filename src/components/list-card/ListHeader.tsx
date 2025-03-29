import { ChevronButton } from "../common/ChevronButton";
import { CloneIcon } from "../common/CloneIcon";
import { DeleteButton } from "../common/DeleteButton";
import { EditIcon } from "../common/EditIcon";
import { List } from "../../types/List";
import { PriorityIndicator } from "../common/PriorityIndicator";
import { TitleEditForm } from "../common/TitleEditForm";
import { TrashIcon } from "../common/TrashIcon";

interface ListHeaderProps {
  list: List;
  onDelete: () => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  expandedListId: string | null;
  setExpandedListId: (id: string | null) => void;
  setIsPriorityControlsVisible: (visible: boolean) => void;
  onCloneToTask: () => void;
}

const ListHeader = ({
  list,
  onDelete,
  isEditing,
  setIsEditing,
  editedTitle,
  setEditedTitle,
  onSubmit,
  onCancel,
  expandedListId,
  setExpandedListId,
  setIsPriorityControlsVisible,
  onCloneToTask,
}: ListHeaderProps) => {
  return (
    <div className="flex items-start w-full justify-between">
      <div className="flex-1">
        {isEditing ? (
          <TitleEditForm
            value={editedTitle}
            onChange={setEditedTitle}
            onSubmit={onSubmit}
            onCancel={onCancel}
            placeholder="Enter list title..."
          />
        ) : (
          <div className="flex items-center gap-2">
            <PriorityIndicator priority={list.priority} />
            <div
              className="group flex items-center gap-1"
              onClick={() => {
                setIsEditing(true);
                setEditedTitle(list.title);
                setExpandedListId(list.id);
              }}
            >
              <h3 className="text-lg font-medium text-gray-200">
                {list.title}
              </h3>
              <EditIcon />
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onCloneToTask}
          className="text-gray-400 hover:text-gray-300 transition-colors"
          title="Clone to task"
        >
          <CloneIcon className="w-4 h-4" />
        </button>
        <DeleteButton onClick={onDelete} />
        <ChevronButton
          isExpanded={expandedListId === list.id}
          onClick={() => {
            setExpandedListId(expandedListId === list.id ? null : list.id);
            setIsEditing(false);
            setIsPriorityControlsVisible(false);
          }}
        />
      </div>
    </div>
  );
};

export default ListHeader;
