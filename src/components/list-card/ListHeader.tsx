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
              Avbryt
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Spara
            </button>
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-sm"
              style={{
                backgroundColor:
                  priority <= 3
                    ? "rgba(255, 107, 107, 0.7)"
                    : priority <= 6
                    ? "rgba(255, 165, 0, 0.7)"
                    : priority <= 10
                    ? "rgba(77, 150, 255, 0.7)"
                    : "rgba(58, 124, 165, 0.7)",
              }}
            >
              {priority}
            </div>
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
