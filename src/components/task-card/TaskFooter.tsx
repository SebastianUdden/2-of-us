import { Task } from "../../types/Task";

interface TaskFooterProps {
  task: Task;
}

const TaskFooter = ({ task }: TaskFooterProps) => {
  return (
    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
      <span>Skapad: {new Date(task.createdAt).toLocaleDateString()}</span>
    </div>
  );
};

export default TaskFooter;
