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
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
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
  expandedTaskId,
  setExpandedTaskId,
}: TaskHeaderProps) => {
  return (
    <div className="flex items-start w-full justify-between">
      <div className="flex-1">
        {isEditing ? (
          <form onSubmit={onSubmit} className="flex-1 flex gap-2 mr-4">
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter task title..."
            />
          </form>
        ) : (
          <div className="flex items-center gap-2">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-sm"
              style={{
                backgroundColor:
                  task.priority <= 3
                    ? "rgba(255, 107, 107, 0.7)"
                    : task.priority <= 6
                    ? "rgba(255, 165, 0, 0.7)"
                    : task.priority <= 10
                    ? "rgba(77, 150, 255, 0.7)"
                    : "rgba(58, 124, 165, 0.7)",
              }}
            >
              {task.priority}
            </div>
            <h3
              className={`text-lg font-medium ${
                task.completed ? "line-through text-gray-400" : "text-gray-200"
              }`}
              onClick={() => {
                setIsEditing(true);
                setEditedTitle(task.title);
                setExpandedTaskId(task.id);
              }}
            >
              {task.title}
            </h3>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          className="w-4 h-4 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800"
        />
        <button
          onClick={() => onDelete(task.id)}
          className="p-1 text-gray-400 hover:text-red-400 transition-colors"
        >
          <TrashIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => onArchive(task.id)}
          className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <ArchiveIcon className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
            setIsEditing(false);
          }}
          className="p-1 text-gray-400 hover:text-gray-300 transition-colors"
        >
          <svg
            className={`w-4 h-4 transform transition-transform ${
              expandedTaskId === task.id ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
