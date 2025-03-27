import {
  DownArrow,
  DownArrowWithLine,
  UpArrow,
  UpArrowWithLine,
} from "../icons/TaskIcons";

interface TaskArrowsProps {
  taskId: string;
  priority: number;
  totalTasks: number;
  onPriorityChange: (taskId: string, newPosition: number) => void;
  disabled?: boolean;
}

const TaskArrows = ({
  taskId,
  priority,
  totalTasks,
  onPriorityChange,
  disabled = false,
}: TaskArrowsProps) => {
  const moveUp = () => onPriorityChange(taskId, priority - 1);
  const moveDown = () => onPriorityChange(taskId, priority + 1);
  const moveToTop = () => onPriorityChange(taskId, 1);
  const moveToBottom = () => onPriorityChange(taskId, totalTasks);

  return (
    <div className="flex flex-col gap-1 border-l border-l-gray-700 pl-2">
      <button
        onClick={moveToTop}
        disabled={disabled || priority === 1}
        className="p-1.5 rounded hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Move to top"
      >
        <UpArrowWithLine className="w-5 h-5 text-blue-500" />
      </button>
      <button
        onClick={moveUp}
        disabled={disabled || priority === 1}
        className="p-1.5 rounded hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Move up"
      >
        <UpArrow className="w-5 h-5 text-blue-500" />
      </button>
      <button
        onClick={moveDown}
        disabled={disabled || priority === totalTasks}
        className="p-1.5 rounded hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Move down"
      >
        <DownArrow className="w-5 h-5 text-blue-500" />
      </button>
      <button
        onClick={moveToBottom}
        disabled={disabled || priority === totalTasks}
        className="p-1.5 rounded hover:bg-gray-700/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Move to bottom"
      >
        <DownArrowWithLine className="w-5 h-5 text-blue-500" />
      </button>
    </div>
  );
};

export default TaskArrows;
