import { useCallback, useEffect, useState } from "react";

interface TaskDueDateProps {
  dueDate?: Date | string;
  onDueDateChange: (date: Date | undefined) => void;
}

const TaskDueDate = ({ dueDate, onDueDateChange }: TaskDueDateProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [days, setDays] = useState<number>(0);

  const updateTimeRemaining = useCallback(() => {
    if (!dueDate) return;

    const now = new Date();
    // Convert dueDate to Date if it's a string
    const dueDateObj =
      typeof dueDate === "string" ? new Date(dueDate) : dueDate;
    // Set both dates to start of day for accurate day comparison
    const dueDateStart = new Date(
      dueDateObj.getFullYear(),
      dueDateObj.getMonth(),
      dueDateObj.getDate()
    );
    const nowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const diff = dueDateStart.getTime() - nowStart.getTime();
    const daysDiff = Math.floor(diff / (1000 * 60 * 60 * 24));
    setDays(daysDiff);

    if (daysDiff > 0) {
      setTimeRemaining(`${daysDiff} ${daysDiff === 1 ? "dag" : "dagar"}`);
    } else if (daysDiff < 0) {
      setTimeRemaining(
        `${Math.abs(daysDiff)} ${
          Math.abs(daysDiff) === 1 ? "dag" : "dagar"
        } försenad`
      );
    } else {
      setTimeRemaining("Förfaller idag");
    }
  }, [dueDate]);

  useEffect(() => {
    if (dueDate) {
      const dueDateObj =
        typeof dueDate === "string" ? new Date(dueDate) : dueDate;
      setSelectedDate(dueDateObj.toISOString().split("T")[0]);
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
          days < 0
            ? "bg-red-500/20 text-red-400"
            : days === 0
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-blue-500/20 text-blue-400"
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
