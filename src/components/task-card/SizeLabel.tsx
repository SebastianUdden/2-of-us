type Size = "S" | "M" | "L" | "XL";

const getSizeOpacity = (size: Size): number => {
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

export const SizeLabel = ({ size }: { size: Size }) => {
  const opacity = getSizeOpacity(size);
  return (
    <div
      className="border border-gray-900 shadow-lg w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-magenta-500 -mx-0.5"
      style={{ backgroundColor: `rgba(0, 0, 0, ${opacity})` }}
    >
      {size}
    </div>
  );
};
