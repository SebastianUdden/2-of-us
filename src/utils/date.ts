import { Timestamp } from "firebase/firestore";

export const parseDate = (
  date:
    | Date
    | string
    | Timestamp
    | { seconds: number; nanoseconds: number }
    | undefined
): Date | undefined => {
  if (!date) return undefined;
  if (date instanceof Date) return date;
  try {
    // Handle Firestore Timestamp
    if (date instanceof Timestamp) {
      return date.toDate();
    }
    // Handle Firestore Timestamp-like object
    if (
      typeof date === "object" &&
      "seconds" in date &&
      "nanoseconds" in date
    ) {
      return new Date(date.seconds * 1000 + date.nanoseconds / 1000000);
    }
    // Handle ISO string
    if (typeof date === "string") {
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return undefined;
  } catch (error) {
    console.error("Error parsing date:", error);
    return undefined;
  }
};

export const formatDate = (
  date:
    | Date
    | string
    | Timestamp
    | { seconds: number; nanoseconds: number }
    | undefined
): string => {
  const parsedDate = parseDate(date);
  if (!parsedDate) return "Invalid date";
  return parsedDate.toLocaleDateString();
};
