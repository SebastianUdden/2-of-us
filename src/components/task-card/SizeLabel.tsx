import { TaskSize } from "../../types/Task";

const getSizeOpacity = (size: TaskSize): number => {
  switch (size) {
    case "S":
      return 0.1;
    case "M":
      return 0.3;
    case "L":
      return 0.5;
    case "XL":
      return 1;
    default:
      return 0.5;
  }
};

export const SizeLabel = ({ size }: { size: TaskSize }) => {
  const opacity = getSizeOpacity(size);
  return (
    <div
      className="border border-gray-900 shadow-lg w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-magenta-500"
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
    >
      {size}
    </div>
  );
};
