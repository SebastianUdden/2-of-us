interface ChevronButtonProps {
  isExpanded: boolean;
  onClick: () => void;
  className?: string;
}

export const ChevronButton = ({
  isExpanded,
  onClick,
  className = "",
}: ChevronButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`p-1 text-gray-400 hover:text-gray-300 transition-colors ${className}`}
    >
      <svg
        className={`w-5 h-5 transform transition-transform ${
          isExpanded ? "rotate-180" : ""
        }`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </button>
  );
};
