import { Task } from "../../types/Task";
import { formatDate } from "../../utils/date";

interface TaskFooterProps {
  task: Task;
}

const TaskFooter = ({ task }: TaskFooterProps) => {
  return (
    <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
      <span>Skapad: {formatDate(task.createdAt)}</span>
    </div>
  );
};

export default TaskFooter;
