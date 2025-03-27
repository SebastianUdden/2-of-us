import { useCallback, useEffect, useState } from "react";

interface TaskDueDateProps {
  dueDate?: Date;
  isOverdue?: boolean;
  onDueDateChange: (date: Date | undefined) => void;
}

const TaskDueDate = ({
  dueDate,
  isOverdue,
  onDueDateChange,
}: TaskDueDateProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");

  const updateTimeRemaining = useCallback(() => {
    if (!dueDate) return;

    const now = new Date();
    const diff = dueDate.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) {
      setTimeRemaining(`${days}d ${hours}h`);
    } else if (hours > 0) {
      setTimeRemaining(`${hours}h ${minutes}m`);
    } else {
      setTimeRemaining(`${minutes}m`);
    }
  }, [dueDate]);

  useEffect(() => {
    if (dueDate) {
      setSelectedDate(dueDate.toISOString().split("T")[0]);
      updateTimeRemaining();
    }
  }, [dueDate, updateTimeRemaining]);

  useEffect(() => {
    if (dueDate) {
      const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [dueDate, updateTimeRemaining]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value ? new Date(e.target.value) : undefined;
    setSelectedDate(e.target.value);
    onDueDateChange(date);
    setShowDatePicker(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
        className={`text-sm px-2 py-1 rounded ${
          isOverdue
            ? "bg-red-500/20 text-red-400"
            : dueDate
            ? "bg-blue-500/20 text-blue-400"
            : "bg-gray-700 text-gray-400"
        }`}
      >
        {dueDate ? timeRemaining : "Set due date"}
      </button>

      {showDatePicker && (
        <div className="absolute z-10 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2">
          <input
            type="datetime-local"
            value={selectedDate}
            onChange={handleDateChange}
            className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}
    </div>
  );
};

export default TaskDueDate;
