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
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days > 0) {
      setTimeRemaining(`${days}d`);
    } else if (days === 0) {
      setTimeRemaining("Today");
    } else {
      setTimeRemaining(`${Math.abs(days)}d ago`);
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
    const newDate = e.target.value ? new Date(e.target.value) : undefined;
    onDueDateChange(newDate);
    setShowDatePicker(false);
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => setShowDatePicker(!showDatePicker)}
        className={`text-sm px-2 py-1 rounded-md transition-colors ${
          isOverdue
            ? "bg-red-500/20 text-red-400 hover:bg-red-500/30"
            : dueDate
            ? "bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
            : "bg-gray-700 text-gray-400 hover:bg-gray-600"
        }`}
      >
        {dueDate ? timeRemaining : "Set due date"}
      </button>
      {showDatePicker && (
        <input
          type="date"
          value={selectedDate}
          onChange={handleDateChange}
          className="bg-gray-700 text-white text-sm rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}
    </div>
  );
};

export default TaskDueDate;
