export const generateInitials = (
  displayName: string | null | undefined
): string | undefined => {
  if (!displayName) return undefined;
  return displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};
