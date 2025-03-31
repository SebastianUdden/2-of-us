import { useEffect, useRef, useState } from "react";

import { List } from "../types/List";
import { Task } from "../types/Task";
import { generateUUID } from "../utils/uuid";

const AVAILABLE_LABELS = [
  "work",
  "personal",
  "family",
  "planning",
  "communication",
  "daily",
  "shopping",
  "entertainment",
  "project",
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
}

const AddTaskPanel = ({
  isOpen,
  onClose,
  onAddTask,
  totalTasks,
  parentTaskId,
  parentTaskTitle,
  isListMode = false,
  onToggleMode,
  onAddList,
}: AddTaskPanelProps) => {
  const [listItem, setListItem] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: 1,
    labels: [] as string[],
    size: "S",
    items: [] as string[],
  });
  const titleInputRef = useRef<HTMLInputElement>(null);
  const listItemInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // Reset form and set default position to the bottom
      setFormData((prev) => ({
        ...prev,
        title: "",
        description: "",
        priority: totalTasks + 1,
        labels: [],
        size: "S",
        items: [],
      }));
      // Focus the title input when panel opens
      setTimeout(() => titleInputRef.current?.focus(), 100);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen, totalTasks]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (isListMode) {
      const newList: List = {
        id: generateUUID(),
        title: formData.title.trim(),
        description: formData.description.trim(),
        items: formData.items.map((item) => ({
          id: generateUUID(),
          content: item,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        author: "Sebastian",
        createdAt: new Date(),
        updatedAt: new Date(),
        type: "ordered",
        priority: 1,
      };
      onAddList?.(newList);
      onClose();
      return;
    }

    const newTask: Task = {
      id: generateUUID(),
      title: formData.title.trim(),
      description: formData.description.trim(),
      completed: false,
      archived: false,
      priority: formData.priority,
      size: formData.size,
      labels: formData.labels,
      author: "Sebastian",
      createdAt: new Date(),
      updatedAt: new Date(),
      updates: [],
      subtasks: [],
      dueDate: undefined,
    };

    if (parentTaskId) {
      // Adding a subtask
      const subtask: Task = {
        id: generateUUID(),
        title: formData.title,
        description: formData.description,
        completed: false,
        archived: false,
        priority: formData.priority,
        labels: formData.labels,
        author: "Sebastian",
        createdAt: new Date(),
        updatedAt: new Date(),
        updates: [],
        subtasks: [],
        dueDate: undefined,
      };
      newTask.subtasks = [subtask];
      newTask.parentTaskId = parentTaskId;
    }

    onAddTask(newTask);
    onClose();
  };

  const toggleLabel = (label: string) => {
    setFormData((prev) => ({
      ...prev,
      labels: prev.labels.includes(label)
        ? prev.labels.filter((l) => l !== label)
        : [...prev.labels, label],
    }));
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl mx-4 transform transition-all ${
          isOpen ? "scale-100" : "scale-95"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">
            {isListMode
              ? "Skapa lista"
              : parentTaskId
              ? `Lägg till deluppgift till "${parentTaskTitle}"`
              : "Lägg till uppgift"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 flex flex-col">
          <div className="space-y-4 p-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Titel
              </label>
              <input
                ref={titleInputRef}
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={
                  parentTaskId
                    ? "Skriv en deluppgift"
                    : isListMode
                    ? "Namnge listan"
                    : "Skriv en uppgift"
                }
              />
            </div>

            {!parentTaskId && (
              <>
                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Beskrivning
                  </label>
                  <textarea
                    id="description"
                    required
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={4}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Skriv en beskrivning"
                  />
                </div>
                {isListMode ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Listans innehåll
                    </label>
                    <div className="flex items-center gap-2">
                      {formData.items.length > 0 && (
                        <ul className="flex flex-col gap-2 w-full ml-2 my-2 mb-4">
                          {formData.items.map((item) => (
                            <li
                              key={item}
                              className="flex items-center justify-between group bg-gray-500 rounded-md p-2"
                            >
                              <span className="text-gray-300">{item}</span>
                              <button
                                onClick={() => {
                                  setFormData({
                                    ...formData,
                                    items: formData.items.filter(
                                      (i) => i !== item
                                    ),
                                  });
                                }}
                                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-400 transition-opacity"
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
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                    <input
                      ref={listItemInputRef}
                      type="text"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Skriv en beskrivning"
                      value={listItem}
                      onChange={(e) => setListItem(e.target.value)}
                    />
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => {
                        if (
                          listItem.trim() &&
                          !formData.items.includes(listItem.trim())
                        ) {
                          setFormData({
                            ...formData,
                            items: [...formData.items, listItem.trim()],
                          });
                          setListItem("");
                          listItemInputRef.current?.focus();
                        }
                      }}
                      disabled={
                        !listItem.trim() ||
                        formData.items.includes(listItem.trim())
                      }
                    >
                      Lägg till
                    </button>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Storlek
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          formData.size === "S"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setFormData({ ...formData, size: "S" })}
                      >
                        S
                      </button>
                      <button
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          formData.size === "M"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setFormData({ ...formData, size: "M" })}
                      >
                        M
                      </button>
                      <button
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          formData.size === "L"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setFormData({ ...formData, size: "L" })}
                      >
                        L
                      </button>
                      <button
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          formData.size === "XL"
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                        onClick={() => setFormData({ ...formData, size: "XL" })}
                      >
                        XL
                      </button>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Etiketter
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {AVAILABLE_LABELS.map((label) => (
                      <button
                        key={label}
                        type="button"
                        onClick={() => toggleLabel(label)}
                        className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                          formData.labels.includes(label)
                            ? "bg-blue-500 text-white"
                            : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="flex justify-between items-center p-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-blue-400 hover:text-blue-300"
            >
              {isListMode ? "Byt till uppgift" : "Byt till lista"}
            </button>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                Avbryt
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isListMode ? "Skapa lista" : "Lägg till uppgift"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTaskPanel;
