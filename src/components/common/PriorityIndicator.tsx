interface PriorityIndicatorProps {
  priority: number;
}

export const PriorityIndicator = ({ priority }: PriorityIndicatorProps) => {
  return (
    <div
      className="w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium text-white shadow-sm"
      style={{
        backgroundColor:
          priority <= 3
            ? "rgba(255, 107, 107, 0.7)"
            : priority <= 6
            ? "rgba(255, 165, 0, 0.7)"
            : priority <= 10
            ? "rgba(77, 150, 255, 0.7)"
            : "rgba(58, 124, 165, 0.7)",
      }}
    >
      {priority}
    </div>
  );
};
