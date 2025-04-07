import { useRef, useState } from "react";

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

interface LabelInputProps {
  selectedLabels: string[];
  onLabelsChange: (labels: string[]) => void;
}

const LabelInput = ({ selectedLabels, onLabelsChange }: LabelInputProps) => {
  const labelInputRef = useRef<HTMLInputElement>(null);
  const [editedLabel, setEditedLabel] = useState("");

  const handleLabelKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedLabel = editedLabel.trim().toLowerCase();
      if (trimmedLabel && !selectedLabels.includes(trimmedLabel)) {
        onLabelsChange([...selectedLabels, trimmedLabel]);
        setEditedLabel("");
      }
    } else if (e.key === "Backspace" && editedLabel === "") {
      onLabelsChange(selectedLabels.slice(0, -1));
    }
  };

  const handleLabelClick = (label: string) => {
    if (selectedLabels.includes(label)) {
      onLabelsChange(selectedLabels.filter((l) => l !== label));
    } else {
      onLabelsChange([...selectedLabels, label]);
    }
  };

  return (
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
          value={editedLabel}
          onChange={(e) => setEditedLabel(e.target.value)}
          onKeyDown={handleLabelKeyDown}
        />
        <button
          className="rounded-md bg-blue-600 px-4 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={() => {
            if (editedLabel.trim()) {
              onLabelsChange([...selectedLabels, editedLabel.trim()]);
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
            onClick={() => handleLabelClick(label)}
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
            onClick={() => handleLabelClick(label)}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LabelInput;
