import { useState, useEffect, useCallback } from 'react';
import * as productService from '@/services/productService';
import type { Product, ProductInput } from '@shared/types';
export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);
  const fetchProducts = useCallback(async (page = 1) => {
    setLoading(true);
    const result = await productService.getProducts(page);
    if (!result.success || !result.data) { setError(result.error || 'Failed to fetch products'); setLoading(false); return; }
    setProducts(result.data);
    setPagination(result.pagination || null);
    setError(null);
    setLoading(false);
  }, []);
  const createProduct = async (input: ProductInput): Promise<boolean> => {
    const result = await productService.createProduct(input);
    if (result.success) fetchProducts(pagination?.page || 1);
    return result.success;
  };
  const updateProduct = async (id: number, input: Partial<ProductInput>): Promise<boolean> => {
    const result = await productService.updateProduct(id, input);
    if (result.success) fetchProducts(pagination?.page || 1);
    return result.success;
  };
  const deleteProduct = async (id: number): Promise<boolean> => {
    const result = await productService.deleteProduct(id);
    if (result.success) fetchProducts(pagination?.page || 1);
    return result.success;
  };
  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  return { products, loading, error, pagination, fetchProducts, createProduct, updateProduct, deleteProduct };
}
