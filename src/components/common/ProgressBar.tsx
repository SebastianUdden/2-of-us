import React from "react";

interface ProgressBarProps {
  completed: number;
  total: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  completed,
  total,
  className = "",
}) => {
  const percentage = total > 0 ? (completed / total) * 100 : 0;

  return (
    <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
      <div
        className="bg-blue-500 h-2 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};
