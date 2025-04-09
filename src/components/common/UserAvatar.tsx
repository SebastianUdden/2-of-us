import { AVAILABLE_ASSIGNEES } from "../../data/mock-users";
import { Tooltip } from "./Tooltip";

interface UserAvatarProps {
  initials?: string;
  username?: string;
  className?: string;
  onAssigneeChange?: (newAssignee: string) => void;
}

export const UserAvatar = ({
  initials,
  username,
  className = "",
  onAssigneeChange,
}: UserAvatarProps) => {
  const handleClick = () => {
    if (onAssigneeChange) {
      const currentIndex = AVAILABLE_ASSIGNEES.indexOf(
        (initials as (typeof AVAILABLE_ASSIGNEES)[number]) || ""
      );
      const nextIndex = (currentIndex + 1) % AVAILABLE_ASSIGNEES.length;
      onAssigneeChange(AVAILABLE_ASSIGNEES[nextIndex]);
    }
  };

  if (!initials) return null;

  return (
    <Tooltip content={username || ""}>
      <div
        className={`flex shadow-md border border-teal-600 items-center justify-center w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-medium ${className} ${
          onAssigneeChange ? "cursor-pointer hover:bg-teal-700" : ""
        }`}
        onClick={handleClick}
      >
        {initials}
      </div>
    </Tooltip>
  );
};
