import { DeleteButton } from "../common/DeleteButton";
import { PriorityIndicator } from "../common/PriorityIndicator";
import { TitleEditForm } from "../common/TitleEditForm";

interface ListHeaderProps {
  title: string;
  isEditing: boolean;
  editedTitle: string;
  onTitleChange: (value: string) => void;
  onEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onCloneToTask: () => void;
  onDelete: () => void;
  priority: number;
}

const ListHeader = ({
  title,
  isEditing,
  editedTitle,
  onTitleChange,
  onEdit,
  onSubmit,
  onCancel,
  onCloneToTask,
  onDelete,
  priority,
}: ListHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {isEditing ? (
          <TitleEditForm
            value={editedTitle}
            onChange={onTitleChange}
            onSubmit={onSubmit}
            onCancel={onCancel}
            placeholder="Enter list title..."
          />
        ) : (
          <div className="flex items-center gap-2">
            <PriorityIndicator priority={priority} />
            <h3 className="text-lg font-medium text-gray-200" onClick={onEdit}>
              {title}
            </h3>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onCloneToTask}
          className="p-1.5 text-gray-400 hover:text-gray-200"
          aria-label="Clone to task"
        >
          Clone to Task
        </button>
        <DeleteButton onClick={onDelete} />
      </div>
    </div>
  );
};

export default ListHeader;
