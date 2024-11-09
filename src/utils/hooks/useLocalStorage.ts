import { useState, useEffect } from 'react';
import path from 'path';
import fs from 'fs/promises';

interface UseLocalStorageOptions {
  key: string;
  initialValue: any;
  storagePath: string;
}

function useLocalStorage<T>(options: UseLocalStorageOptions): [T, (value: T) => void, () => Promise<T>, (value: T) => Promise<void>] {
  const { key, initialValue, storagePath } = options;
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load the data from the file on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const filePath = path.join(storagePath, key);
        const data = await fs.readFile(filePath, 'utf-8');
        setStoredValue(JSON.parse(data));
      } catch (error) {
        console.error(error);
        setStoredValue(initialValue);
      }
    };

    loadData();
  }, [key, initialValue, storagePath]);

  // Save the data whenever it changes
  useEffect(() => {
    const saveData = async () => {
      try {
        const filePath = path.join(storagePath, key);
        await fs.writeFile(filePath, JSON.stringify(storedValue), 'utf-8');
      } catch (error) {
        console.error(error);
      }
    };

    saveData();
  }, [key, storedValue, storagePath]);

  const importMindmap = async () => {
    try {
      const filePath = path.join(storagePath, key);
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  };

  const exportMindmap = async (mindmap: T) => {
    try {
      const filePath = path.join(storagePath, key);
      await fs.writeFile(filePath, JSON.stringify(mindmap), 'utf-8');
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setStoredValue, importMindmap, exportMindmap];
}

export default useLocalStorage;
