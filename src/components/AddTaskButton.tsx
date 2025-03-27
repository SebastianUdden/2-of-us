import AddTaskPanel from "./AddTaskPanel";
import { Task } from "../types/Task";
import { useState } from "react";

interface AddTaskButtonProps {
  onAddTask: (task: Task) => void;
  totalTasks: number;
}

const AddTaskButton = ({ onAddTask, totalTasks }: AddTaskButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-2 rounded-md flex items-center gap-2 transition-colors"
        aria-label="Add Task"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        <span className="hidden sm:inline">Add Task</span>
      </button>
      <AddTaskPanel
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAddTask={onAddTask}
        totalTasks={totalTasks}
      />
    </>
  );
};

export default AddTaskButton;
