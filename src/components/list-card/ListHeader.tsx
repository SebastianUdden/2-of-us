import { TrashIcon } from "../icons/TrashIcon";

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
}: ListHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={onSubmit} className="flex-1 flex gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter list title..."
            />
            <button
              type="button"
              onClick={onCancel}
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
          <h3 className="text-lg font-medium text-gray-200" onClick={onEdit}>
            {title}
          </h3>
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
        <button
          onClick={onDelete}
          className="p-1.5 text-red-400 hover:text-red-300"
          aria-label="Delete list"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default ListHeader;
