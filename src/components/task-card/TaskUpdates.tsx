import { Task } from "../../types/Task";
import { useState } from "react";

interface TaskUpdatesProps {
  task: Task;
}

const TaskUpdates = ({ task }: TaskUpdatesProps) => {
  const [showAllUpdates, setShowAllUpdates] = useState(false);
  const latestUpdate = task.updates[task.updates.length - 1];

  if (task.updates.length === 0) return null;

  return (
    <div className="pt-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300 mr-1">
            Latest update:
          </span>
          {task.updates.length > 1 && (
            <button
              onClick={() => setShowAllUpdates(!showAllUpdates)}
              className="text-sm text-blue-400 hover:text-blue-300 font-medium"
            >
              {showAllUpdates
                ? "Show less"
                : `Show ${task.updates.length - 1} more`}
            </button>
          )}
        </div>
        <div className="flex items-start gap-2">
          <span className="text-sm font-semibold text-blue-400">
            {latestUpdate.username || latestUpdate.initials || "Unknown"}
          </span>
          <span className="text-sm text-gray-400">
            ({latestUpdate.updatedAt.toLocaleDateString()})
          </span>
        </div>
      </div>
      {showAllUpdates && (
        <div className="mt-2 space-y-1">
          {task.updates.slice(0, -1).map((update, index) => (
            <div key={index} className="text-sm text-gray-400 border-gray-700">
              {update.username || update.initials || "Unknown"} -{" "}
              {update.updatedAt.toLocaleDateString()}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskUpdates;
