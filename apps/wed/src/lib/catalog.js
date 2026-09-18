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

export const useCatalog = ({ persist = true } = {}) => {
  const [catalog, setCatalog] = useState(persist ? readCatalog : initialProducts);
  const [storageError, setStorageError] = useState(false);

  useEffect(() => {
    if (!persist) return undefined;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(catalog));
      setStorageError(false);
    } catch {
      setStorageError(true);
    }
  }, [catalog, persist]);

  useEffect(() => {
    if (!persist) return undefined;
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) setCatalog(readCatalog());
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [persist]);

  return [catalog, setCatalog, storageError];
};

export const resetCatalog = () => {
  window.localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};
