import { useEffect, useRef, useState } from "react";

import LabelInput from "./common/LabelInput";
import { List } from "../types/List";
import { Size } from "./task-card/SizeLabel";
import SizeSelect from "./common/SizeSelect";
import { SubTask } from "../types/SubTask";
import { Task } from "../types/Task";
import TaskDueDate from "./task-card/TaskDueDate";
import TaskFormInput from "./common/TaskFormInput";
import { generateInitials } from "../utils/user";
import { generateUUID } from "../utils/uuid";
import { useAuth } from "../context/AuthContext";

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
  subtasks?: SubTask[];
}

const TaskAddPanel = ({
  onClose,
  onAddTask,
  totalTasks,
  parentTaskId,
  subtasks,
}: AddTaskPanelProps) => {
  const { user } = useAuth();
  const titleRef = useRef<HTMLInputElement>(null);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedDescription, setEditedDescription] = useState("");
  const [editedSize, setEditedSize] = useState<Size>("S");
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
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
      labels: selectedLabels,
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

      <TaskFormInput
        id="title"
        label="Titel"
        value={editedTitle}
        onChange={(value) => {
          setEditedTitle(value);
        }}
        placeholder="Ex. Handla mat"
        ref={
          titleRef as React.RefObject<HTMLInputElement | HTMLTextAreaElement>
        }
        autoFocus
      />

      {!parentTaskId && (
        <>
          <TaskFormInput
            id="description"
            label="Beskrivning"
            value={editedDescription}
            onChange={setEditedDescription}
            placeholder="Ex. Köp ingredienser för lasagne"
            type="textarea"
          />

          <SizeSelect
            value={editedSize}
            onChange={(value) => setEditedSize(value as Size)}
          />

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

          <LabelInput
            selectedLabels={selectedLabels}
            onLabelsChange={setSelectedLabels}
          />
        </>
      )}

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
