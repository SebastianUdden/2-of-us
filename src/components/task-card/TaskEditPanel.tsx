import { useEffect, useRef, useState } from "react";

import { Task } from "../../types/Task";
import TaskDueDate from "./TaskDueDate";
import { generateInitials } from "../../utils/user";
import { useAuth } from "../../context/AuthContext";

interface TaskEditPanelProps {
  task?: Task;
  onUpdate: (updatedTask: Task) => void;
  onClose: () => void;
  isEditing: boolean;
  focusDescription?: boolean;
}

const TaskEditPanel = ({
  task,
  onUpdate,
  onClose,
  focusDescription,
}: TaskEditPanelProps) => {
  const { user } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [editedTitle, setEditedTitle] = useState(task?.title || "");
  const [editedDescription, setEditedDescription] = useState(
    task?.description || ""
  );
  const [editedSize, setEditedSize] = useState(task?.size || "");

  useEffect(() => {
    if (focusDescription) {
      descriptionRef.current?.focus();
    } else {
      titleRef.current?.focus();
    }
  }, [focusDescription]);

  if (!task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      editedTitle !== task?.title ||
      editedDescription !== task?.description ||
      editedSize !== task?.size
    ) {
      onUpdate({
        ...task,
        title: editedTitle,
        description: editedDescription,
        size: editedSize,
        username: user?.displayName || undefined,
        initials: generateInitials(user?.displayName),
      });
    }
    onClose();
  };

  const handleDueDateChange = (date: Date | undefined) => {
    onUpdate({
      ...task,
      dueDate: date,
      username: user?.displayName || undefined,
      initials: generateInitials(user?.displayName),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6" ref={formRef}>
      {/* Title */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Titel
        </label>
        <input
          ref={titleRef}
          type="text"
          id="title"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Beskrivning
        </label>
        <textarea
          ref={descriptionRef}
          id="description"
          rows={4}
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        />
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Förfallodatum
        </label>
        <div className="mt-1">
          <TaskDueDate
            dueDate={task.dueDate}
            onDueDateChange={handleDueDateChange}
          />
        </div>
      </div>

      {/* Size */}
      <div>
        <label
          htmlFor="size"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Storlek
        </label>
        <select
          id="size"
          value={editedSize}
          onChange={(e) => setEditedSize(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        >
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
        </select>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Spara
        </button>
      </div>
    </form>
  );
};

export default TaskEditPanel;
