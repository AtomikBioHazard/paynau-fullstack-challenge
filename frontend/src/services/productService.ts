import { apiFetch } from './api';
import type { Product, ProductInput, ApiResponse } from '../../../shared/types';
export const getProducts = (page = 1, signal?: AbortSignal): Promise<ApiResponse<Product[]>> => apiFetch(`/products?page=${page}`, {}, signal);
export const createProduct = (input: ProductInput, signal?: AbortSignal): Promise<ApiResponse<Product>> => apiFetch('/products', { method: 'POST', body: JSON.stringify(input) }, signal);
export const updateProduct = (id: number, input: Partial<ProductInput>, signal?: AbortSignal): Promise<ApiResponse<Product>> => apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(input) }, signal);
export const deleteProduct = (id: number, signal?: AbortSignal): Promise<ApiResponse<void>> => apiFetch(`/products/${id}`, { method: 'DELETE' }, signal);
