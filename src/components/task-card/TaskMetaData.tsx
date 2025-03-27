import { Task } from "../../types/Task";

interface TaskMetaDataProps {
  task: Task;
}

const TaskMetaData = ({ task }: TaskMetaDataProps) => {
  return (
    <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
      <span>{new Date(task.createdAt).toLocaleDateString()}</span>
    </div>
  );
};

export default TaskMetaData;
