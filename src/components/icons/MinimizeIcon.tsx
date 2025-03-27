interface MinimizeIconProps {
  className?: string;
  isMinimized: boolean;
}

export const MinimizeIcon = ({
  className = "",
  isMinimized,
}: MinimizeIconProps) => {
  return (
    <svg
      className={`transform transition-transform ${
        isMinimized ? "rotate-180" : ""
      } ${className}`}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
};
