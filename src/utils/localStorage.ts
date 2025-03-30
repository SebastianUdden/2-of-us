/**
 * Utility functions for handling localStorage operations with type safety and error handling
 */

type StorageValue = string | number | object | null;

/**
 * Saves data to localStorage with the given label
 * @param label - The key to store the data under
 * @param value - The value to store (string, number, or object)
 * @returns boolean indicating success
 */
export const saveToLocalStorage = (
  label: string,
  value: StorageValue
): boolean => {
  try {
    if (value === null) {
      localStorage.removeItem(label);
      return true;
    }

    const serializedValue =
      typeof value === "object" ? JSON.stringify(value) : String(value);

    localStorage.setItem(label, serializedValue);
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage: ${error}`);
    return false;
  }
};

/**
 * Retrieves data from localStorage with the given label
 * @param label - The key to retrieve the data from
 * @param defaultValue - Optional default value if the key doesn't exist
 * @returns The stored value or null if not found/error
 */
export const getFromLocalStorage = <T extends StorageValue>(
  label: string,
  defaultValue?: T
): T | null => {
  try {
    const item = localStorage.getItem(label);

    if (item === null) {
      return defaultValue ?? null;
    }

    // Try to parse as JSON first (for objects)
    try {
      return JSON.parse(item) as T;
    } catch {
      // If JSON parsing fails, return as string
      return item as T;
    }
  } catch (error) {
    console.error(`Error reading from localStorage: ${error}`);
    return defaultValue ?? null;
  }
};
