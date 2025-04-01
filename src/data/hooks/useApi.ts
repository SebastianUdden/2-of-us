import {
  BaseEntity,
  EntityData,
  clear,
  create,
  getAll,
  getById,
  remove,
  update,
} from "../../utils/api";
import { useCallback, useState } from "react";

interface UseApiOptions<T extends BaseEntity> {
  generic?: T;
  collectionName: string;
  onError?: (error: Error) => void;
}

interface UseApiState<T extends BaseEntity> {
  items: T[];
  loading: boolean;
  error: Error | null;
}

interface UseApiActions<T extends BaseEntity> {
  createItem: (item: EntityData<T>) => Promise<T | null>;
  getItems: () => Promise<void>;
  getItem: (id: string) => Promise<T | null>;
  updateItem: (
    id: string,
    updates: Partial<EntityData<T>>
  ) => Promise<T | null>;
  removeItem: (id: string) => Promise<boolean>;
  clearItems: () => Promise<boolean>;
}

/**
 * Custom hook for managing data using the localStorage API
 * @param options - Configuration options including collection name and error handler
 * @returns State and actions for managing the data
 */
export function useApi<T extends BaseEntity>({
  collectionName,
  onError,
}: UseApiOptions<T>): UseApiState<T> & UseApiActions<T> {
  const [state, setState] = useState<UseApiState<T>>({
    items: [],
    loading: false,
    error: null,
  });

  const handleError = useCallback(
    (error: Error) => {
      setState((prev) => ({ ...prev, error }));
      onError?.(error);
    },
    [onError]
  );

  const createItem = useCallback(
    async (item: EntityData<T>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const newItem = await create<T>(collectionName, item);
        setState((prev) => ({
          ...prev,
          items: [...prev.items, newItem],
        }));
        return newItem;
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error("Failed to create item")
        );
        return null;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [collectionName, handleError]
  );

  const getItems = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const items = await getAll<T>(collectionName);
      setState((prev) => ({ ...prev, items }));
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error("Failed to fetch items")
      );
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [collectionName, handleError]);

  const getItem = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const item = await getById<T>(collectionName, id);
        return item;
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error("Failed to fetch item")
        );
        return null;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [collectionName, handleError]
  );

  const updateItem = useCallback(
    async (id: string, updates: Partial<EntityData<T>>) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const updatedItem = await update<T>(collectionName, id, updates);
        if (updatedItem) {
          setState((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
              item.id === id ? updatedItem : item
            ),
          }));
        }
        return updatedItem;
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error("Failed to update item")
        );
        return null;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [collectionName, handleError]
  );

  const removeItem = useCallback(
    async (id: string) => {
      setState((prev) => ({ ...prev, loading: true, error: null }));
      try {
        const success = await remove(collectionName, id);
        if (success) {
          setState((prev) => ({
            ...prev,
            items: prev.items.filter((item) => item.id !== id),
          }));
        }
        return success;
      } catch (error) {
        handleError(
          error instanceof Error ? error : new Error("Failed to remove item")
        );
        return false;
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [collectionName, handleError]
  );

  const clearItems = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }));
    try {
      const success = await clear(collectionName);
      if (success) {
        setState((prev) => ({ ...prev, items: [] }));
      }
      return success;
    } catch (error) {
      handleError(
        error instanceof Error ? error : new Error("Failed to clear items")
      );
      return false;
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [collectionName, handleError]);

  return {
    ...state,
    createItem,
    getItems,
    getItem,
    updateItem,
    removeItem,
    clearItems,
  };
}
