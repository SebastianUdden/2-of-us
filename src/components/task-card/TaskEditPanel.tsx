import { useEffect, useRef, useState } from "react";

import LabelInput from "../common/LabelInput";
import SizeSelect from "../common/SizeSelect";
import { Task } from "../../types/Task";
import TaskDueDate from "./TaskDueDate";
import TaskFormInput from "../common/TaskFormInput";

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
  const formRef = useRef<HTMLFormElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const [editedTitle, setEditedTitle] = useState(task?.title || "");
  const [editedDescription, setEditedDescription] = useState(
    task?.description || ""
  );
  const [editedSize, setEditedSize] = useState(task?.size || "");
  const [selectedLabels, setSelectedLabels] = useState<string[]>(
    task?.labels || []
  );
  const [editedDueDate, setEditedDueDate] = useState<Date | undefined>(
    task?.dueDate
  );

  useEffect(() => {
    if (focusDescription) {
      descriptionRef.current?.focus();
    } else {
      titleRef.current?.focus();
    }
  }, [focusDescription]);

  if (!task) return null;

  const handleDueDateChange = (date: Date | undefined) => {
    setEditedDueDate(date);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      editedTitle !== task?.title ||
      editedDescription !== task?.description ||
      editedSize !== task?.size ||
      JSON.stringify(selectedLabels) !== JSON.stringify(task?.labels) ||
      editedDueDate?.getTime() !== task?.dueDate?.getTime()
    ) {
      onUpdate({
        ...task,
        title: editedTitle,
        description: editedDescription,
        size: editedSize,
        labels: selectedLabels,
        dueDate: editedDueDate,
      });
    }
    onClose();
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
      <TaskFormInput
        id="title"
        label="Titel"
        value={editedTitle}
        onChange={setEditedTitle}
        placeholder="Ex. Handla mat"
        ref={titleRef as React.RefObject<HTMLInputElement>}
        autoFocus={!focusDescription}
      />

      <TaskFormInput
        id="description"
        label="Beskrivning"
        value={editedDescription}
        onChange={setEditedDescription}
        placeholder="Ex. Köp ingredienser för lasagne"
        type="textarea"
        ref={descriptionRef as React.RefObject<HTMLTextAreaElement>}
        autoFocus={focusDescription}
      />

      <SizeSelect value={editedSize} onChange={setEditedSize} />

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Förfallodatum
        </label>
        <div className="mt-1">
          <TaskDueDate
            dueDate={editedDueDate}
            onDueDateChange={handleDueDateChange}
          />
        </div>
      </div>

      <LabelInput
        selectedLabels={selectedLabels}
        onLabelsChange={setSelectedLabels}
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
        >
          Avbryt
        </button>
        <button
          type="submit"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Spara och stäng
        </button>
      </div>
    </form>
  );
};

export default TaskEditPanel;
