import { useEffect, useState } from 'react';
import { products as initialProducts } from '@/data/products';

const STORAGE_KEY = 'angura-catalog-v1';

const readCatalog = () => {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialProducts;
  } catch {
    return initialProducts;
  }
};

export const useCatalog = () => {
  const [catalog, setCatalog] = useState(readCatalog);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [catalog]);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) setCatalog(readCatalog());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return [catalog, setCatalog, storageError];
};

export const resetCatalog = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};
