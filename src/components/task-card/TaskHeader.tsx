import { ArchiveIcon } from "../icons/ArchiveIcon";
import { ChevronButton } from "../common/ChevronButton";
import { DeleteButton } from "../common/DeleteButton";
import { EditIcon } from "../common/EditIcon";
import { PriorityIndicator } from "../common/PriorityIndicator";
import { Task } from "../../types/Task";

interface TaskHeaderProps {
  task: Task;
  onComplete: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onArchive: (taskId: string) => void;
  setIsEditing: (isEditing: boolean) => void;
  expandedTaskId: string | null;
  setExpandedTaskId: (id: string | null) => void;
  setIsPriorityControlsVisible: (visible: boolean) => void;
}

export const TaskHeader = ({
  task,
  onComplete,
  onDelete,
  onArchive,
  setIsEditing,
  expandedTaskId,
  setExpandedTaskId,
  setIsPriorityControlsVisible,
}: TaskHeaderProps) => {
  return (
    <div className="flex items-start w-full justify-between">
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <PriorityIndicator priority={task.priority} />
          <div
            className="group flex items-center gap-1"
            onClick={() => {
              setIsEditing(true);
              setExpandedTaskId(task.id);
            }}
          >
            <h3
              className={`text-lg font-medium ${
                task.completed ? "line-through text-gray-400" : "text-gray-200"
              }`}
            >
              {task.title}
            </h3>
            <EditIcon />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          className="w-5 h-5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-gray-800 cursor-pointer"
        />
        <button
          onClick={() => onArchive(task.id)}
          className="p-1 text-gray-400 hover:text-gray-300 transition-colors -mr-2"
        >
          <ArchiveIcon className="w-7 h-7" />
        </button>
        <DeleteButton onClick={() => onDelete(task.id)} />
        <ChevronButton
          isExpanded={expandedTaskId === task.id}
          onClick={() => {
            setExpandedTaskId(expandedTaskId === task.id ? null : task.id);
            setIsEditing(false);
            setIsPriorityControlsVisible(false);
          }}
        />
      </div>
    </div>
  );
};
