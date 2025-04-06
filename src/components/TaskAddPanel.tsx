import { useEffect, useRef, useState } from "react";

import { List } from "../types/List";
import { Size } from "./task-card/SizeLabel";
import { SubTask } from "../types/SubTask";
import { Task } from "../types/Task";
import TaskDueDate from "./task-card/TaskDueDate";
import { generateInitials } from "../utils/user";
import { generateUUID } from "../utils/uuid";
import { useAuth } from "../context/AuthContext";

const AVAILABLE_LABELS = [
  "arbete",
  "privat",
  "familj",
  "planering",
  "kommunication",
  "dagliga",
  "handla",
  "nöje",
  "projekt",
];

interface AddTaskPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: Task) => void;
  totalTasks: number;
  parentTaskId?: string;
  parentTaskTitle?: string;
  isListMode?: boolean;
  onToggleMode?: () => void;
  onAddList?: (list: List) => void;
  onTitleChange?: (title: string) => void;
  subtasks?: SubTask[];
}

const TaskAddPanel = ({
  onClose,
  onAddTask,
  onTitleChange,
  totalTasks,
  parentTaskId,
  subtasks,
}: AddTaskPanelProps) => {
  const { user } = useAuth();
  const titleRef = useRef<HTMLInputElement>(null);
  const [editedLabel, setEditedLabel] = useState("");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const labelInputRef = useRef<HTMLInputElement>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedSize, setEditedSize] = useState<Size>("S");
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(
    undefined
  );

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  const handleLocalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEditedTitle("");
    titleRef.current?.focus();
    handleAddTask();
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddTask();
    onClose();
  };

  const handleAddTask = () => {
    const trimmedTitle = editedTitle.trim();
    if (!trimmedTitle) return;

    const newTask: Task = {
      id: generateUUID(),
      title: trimmedTitle,
      description: editedDescription.trim(),
      completed: false,
      archived: false,
      priority: totalTasks + 1,
      size: editedSize,
      labels: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
      subtasks: [],
      dueDate: editedDueDate,
      username: user?.displayName || undefined,
      initials: generateInitials(user?.displayName),
    };

    if (parentTaskId) {
      // Adding a subtask
      const subtask: SubTask = {
        id: generateUUID(),
        title: editedTitle,
        completed: false,
      };
      newTask.subtasks = [subtask];
      newTask.parentTaskId = parentTaskId;
    }

    onAddTask(newTask);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {subtasks && subtasks.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nuvarande deluppgifter
          </label>
          <div className="mt-1">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() => {}}
                />
                {subtask.title}
              </div>
            ))}
          </div>
        </div>
      )}
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
          onChange={(e) => {
            setEditedTitle(e.target.value);
            onTitleChange?.(e.target.value);
          }}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
          placeholder="Ex. Handla mat"
        />
      </div>

      {/* Description */}
      {!parentTaskId && (
        <>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              Beskrivning
            </label>
            <textarea
              id="description"
              rows={4}
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
              placeholder="Ex. Köp ingredienser för lasagne"
            />
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
              onChange={(e) => setEditedSize(e.target.value as Size)}
              className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
            >
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Förfallodatum
            </label>
            <div className="mt-1">
              <TaskDueDate
                dueDate={editedDueDate}
                onDueDateChange={(date) => setEditedDueDate(date)}
              />
            </div>
          </div>

          {/* Labels */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Etiketter
            </label>
            <div className="flex gap-2 justify-between mb-2">
              <input
                ref={labelInputRef}
                type="text"
                placeholder="Skapa etikett"
                className="block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
                onChange={(e) => setEditedLabel(e.target.value)}
              />
              <button
                className="rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                onClick={() => {
                  if (editedLabel.trim()) {
                    setSelectedLabels([...selectedLabels, editedLabel]);
                    setEditedLabel("");
                  } else {
                    labelInputRef.current?.focus();
                  }
                }}
              >
                +
              </button>
            </div>
            <div className="mt-1 flex flex-wrap gap-2">
              {selectedLabels.map((label) => (
                <button
                  key={label}
                  className="rounded-md bg-blue-700 px-2 py-1 text-sm font-medium text-white hover:bg-blue-600"
                  onClick={() =>
                    setSelectedLabels(selectedLabels.filter((l) => l !== label))
                  }
                >
                  {label}
                </button>
              ))}
            </div>
            <hr className="my-4 border-gray-700" />
            <div className="mt-1 flex flex-wrap gap-2">
              {AVAILABLE_LABELS.filter(
                (label) => !selectedLabels.includes(label)
              ).map((label) => (
                <button
                  key={label}
                  className="rounded-md bg-gray-700 px-2 py-1 text-sm font-medium text-gray-300 hover:bg-gray-600"
                  onClick={() => {
                    setSelectedLabels([...selectedLabels, label]);
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Submit Button */}
      <div className="flex justify-end gap-2">
        {parentTaskId && (
          <button
            onClick={handleLocalSubmit}
            className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Lägg till
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Spara och stäng
        </button>
      </div>
    </form>
  );
};

export default TaskAddPanel;
