import { useEffect, useRef, useState } from "react";

import { AVAILABLE_ASSIGNEES } from "../../data/mock-users";
import LabelInput from "../common/LabelInput";
import SizeSelect from "../common/SizeSelect";
import { Task } from "../../types/Task";
import TaskDueDate from "./TaskDueDate";
import TaskFormInput from "../common/TaskFormInput";
import { Timestamp } from "firebase/firestore";

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
    task?.dueDate instanceof Timestamp ? task.dueDate.toDate() : task?.dueDate
  );
  const [editedAssignee, setEditedAssignee] = useState<string | undefined>(
    task?.assignee
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
    const currentDueDate = task?.dueDate;
    const currentDueDateTime =
      currentDueDate instanceof Timestamp
        ? currentDueDate.toDate().getTime()
        : currentDueDate instanceof Date
        ? currentDueDate.getTime()
        : 0;
    const editedDueDateTime = editedDueDate?.getTime() || 0;

    if (
      editedTitle !== task?.title ||
      editedDescription !== task?.description ||
      editedSize !== task?.size ||
      JSON.stringify(selectedLabels) !== JSON.stringify(task?.labels) ||
      editedDueDateTime !== currentDueDateTime ||
      editedAssignee !== task?.assignee
    ) {
      onUpdate({
        ...task,
        title: editedTitle,
        description: editedDescription,
        size: editedSize,
        labels: selectedLabels,
        dueDate: editedDueDate,
        assignee: editedAssignee,
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
        <div className="mt-1" onClick={(e) => e.stopPropagation()}>
          <TaskDueDate
            dueDate={editedDueDate}
            onDueDateChange={handleDueDateChange}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tilldelad
        </label>
        <select
          value={editedAssignee || ""}
          onChange={(e) => setEditedAssignee(e.target.value || undefined)}
          className="mt-1 block w-full rounded-md border-gray-700 bg-gray-800 text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2"
        >
          <option value="">Ingen</option>
          {AVAILABLE_ASSIGNEES.map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
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
