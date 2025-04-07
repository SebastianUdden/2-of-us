import { useCallback, useEffect, useState } from "react";

import { Timestamp } from "firebase/firestore";

interface TaskDueDateProps {
  dueDate?: Date | string | Timestamp;
  onDueDateChange: (date: Date | undefined) => void;
}

const TaskDueDate = ({ dueDate, onDueDateChange }: TaskDueDateProps) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [timeRemaining, setTimeRemaining] = useState<string>("");
  const [days, setDays] = useState<number>(0);

  const convertToDate = useCallback(
    (
      date: Date | string | Timestamp | { seconds: number } | undefined
    ): Date | undefined => {
      if (!date) return undefined;
      try {
        if (date instanceof Date) {
          if (isNaN(date.getTime())) return undefined;
          return date;
        }
        if (date instanceof Timestamp) {
          const jsDate = date.toDate();
          if (isNaN(jsDate.getTime())) return undefined;
          return jsDate;
        }
        if (typeof date === "object" && "seconds" in date) {
          const jsDate = new Date(date.seconds * 1000);
          if (isNaN(jsDate.getTime())) return undefined;
          return jsDate;
        }
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) return undefined;
        return parsedDate;
      } catch (error) {
        console.error("Error converting date:", error);
        return undefined;
      }
    },
    []
  );

  const formatDateForInput = useCallback((date: Date): string => {
    try {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "";
    }
  }, []);

  const updateTimeRemaining = useCallback(() => {
    if (!dueDate) return;

    const now = new Date();
    const dueDateObj = convertToDate(dueDate);
    if (!dueDateObj) return;

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
  }, [dueDate, convertToDate]);

  useEffect(() => {
    if (dueDate) {
      const dueDateObj = convertToDate(dueDate);
      if (dueDateObj) {
        setSelectedDate(formatDateForInput(dueDateObj));
        updateTimeRemaining();
      } else {
        setSelectedDate("");
        setTimeRemaining("");
        setDays(0);
      }
    } else {
      setSelectedDate("");
      setTimeRemaining("");
      setDays(0);
    }
  }, [dueDate, updateTimeRemaining, convertToDate, formatDateForInput]);

  useEffect(() => {
    if (dueDate) {
      const interval = setInterval(updateTimeRemaining, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [dueDate, updateTimeRemaining]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const date = e.target.value ? new Date(e.target.value) : undefined;
    if (date && !isNaN(date.getTime())) {
      setSelectedDate(e.target.value);
      onDueDateChange(date);
    } else {
      setSelectedDate("");
      onDueDateChange(undefined);
    }
    setShowDatePicker(false);
  };

  const handleButtonClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    if (e.type === "keydown" && (e as React.KeyboardEvent).key === "Enter") {
      e.preventDefault();
      return;
    }
    setShowDatePicker(!showDatePicker);
  };

  return (
    <div className="relative">
      <button
        onClick={handleButtonClick}
        onKeyDown={handleButtonClick}
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
