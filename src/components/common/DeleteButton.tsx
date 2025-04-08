import { TrashIcon } from "../icons/TrashIcon";

interface DeleteButtonProps {
  onClick: () => void;
  className?: string;
}

export const DeleteButton = ({
  onClick,
  className = "",
}: DeleteButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`p-1 text-red-400 hover:text-red-300 ${className}`}
      aria-label="Delete"
    >
      <TrashIcon className="w-5 h-5" />
    </button>
  );
};
