import { Tooltip } from "./Tooltip";

interface UserAvatarProps {
  initials?: string;
  username?: string;
  className?: string;
}

export const UserAvatar = ({
  initials,
  username,
  className = "",
}: UserAvatarProps) => {
  if (!initials) return null;

  return (
    <Tooltip content={username || ""}>
      <div
        className={`flex shadow-md border border-teal-600 items-center justify-center w-7 h-7 rounded-full bg-teal-800 text-white text-xs font-medium ${className}`}
      >
        {initials}
      </div>
    </Tooltip>
  );
};
