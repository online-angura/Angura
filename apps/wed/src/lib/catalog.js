import { products as initialProducts } from '@/data/products';

export const useCatalog = ({ persist: _persist = false } = {}) => [initialProducts, () => {}, false];
