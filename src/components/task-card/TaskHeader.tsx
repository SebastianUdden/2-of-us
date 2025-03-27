import { ArchiveIcon } from "../icons/ArchiveIcon";
import { Task } from "../../types/Task";
import { TrashIcon } from "../icons/TrashIcon";

interface TaskHeaderProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  isEditing: boolean;
  setIsEditing: (isEditing: boolean) => void;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
}

export const TaskHeader = ({
  task,
  onComplete,
  onDelete,
  onArchive,
  isEditing,
  setIsEditing,
  editedTitle,
  setEditedTitle,
  onSubmit,
  onCancel,
}: TaskHeaderProps) => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={onSubmit} className="flex-1 flex gap-2">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
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
          <h3
            className={`text-lg font-medium ${
              task.completed ? "line-through text-gray-400" : "text-gray-200"
            }`}
            onClick={() => setIsEditing(true)}
          >
            {task.title}
          </h3>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          className="w-5 h-5 rounded border-gray-300 text-blue-500 focus:ring-blue-500"
        />
        <button
          onClick={() => onArchive(task.id)}
          className="p-1.5 text-gray-400 hover:text-gray-200"
          aria-label="Archive task"
        >
          <ArchiveIcon className="w-7 h-7" />
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="-ml-2 p-1.5 text-red-400 hover:text-red-300"
          aria-label="Delete task"
        >
          <TrashIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
