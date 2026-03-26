import { apiFetch } from './api';
import type { OrderWithItems, OrderInput, ApiResponse } from '@shared/types';
export const getOrders = (page = 1, signal?: AbortSignal): Promise<ApiResponse<OrderWithItems[]>> => apiFetch(`/orders?page=${page}`, {}, signal);
export const createOrder = (input: OrderInput, signal?: AbortSignal): Promise<ApiResponse<OrderWithItems>> => apiFetch('/orders', { method: 'POST', body: JSON.stringify(input) }, signal);
