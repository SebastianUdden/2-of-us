import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useStoragePersistence } from "../data/hooks/useStoragePersistence";

type StorageType = "local" | "cloud";

interface StorageContextType {
  storageType: StorageType;
  setStorageType: (type: StorageType) => void;
}

const StorageContext = createContext<StorageContextType | undefined>(undefined);

export const StorageProvider = ({ children }: { children: ReactNode }) => {
  const [storageType, setStorageType] = useState<StorageType>("local");
  const { loadStorageType, saveStorageType } = useStoragePersistence();

  useEffect(() => {
    const loadInitialStorageType = async () => {
      const savedType = await loadStorageType();
      setStorageType(savedType);
    };
    loadInitialStorageType();
  }, [loadStorageType]);

  const handleSetStorageType = async (type: StorageType) => {
    setStorageType(type);
    await saveStorageType(type);
  };

  return (
    <StorageContext.Provider
      value={{ storageType, setStorageType: handleSetStorageType }}
    >
      {children}
    </StorageContext.Provider>
  );
};

export const useStorage = () => {
  const context = useContext(StorageContext);
  if (context === undefined) {
    throw new Error("useStorage must be used within a StorageProvider");
  }
  return context;
};
