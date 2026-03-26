import { useState, useEffect, useCallback } from 'react';
import * as orderService from '@/services/orderService';
import type { OrderWithItems, OrderInput } from '../../../shared/types';

export function useOrders() {
  const [orders, setOrders] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{ page: number; limit: number; total: number; totalPages: number } | null>(null);

  const fetchOrders = useCallback(async (page = 1) => {
    setLoading(true);
    const result = await orderService.getOrders(page);
    if (result.success && result.data) {
      setOrders(result.data);
      setPagination(result.pagination || null);
      setError(null);
    } else {
      setError(result.error || 'Failed to fetch orders');
    }
    setLoading(false);
  }, []);

  const createOrder = async (input: OrderInput): Promise<{ success: boolean; error?: string }> => {
    const result = await orderService.createOrder(input);
    if (result.success) fetchOrders(pagination?.page || 1);
    return { success: result.success, error: result.error };
  };

  useEffect(() => { fetchOrders(); }, [fetchOrders]);
  return { orders, loading, error, pagination, fetchOrders, createOrder };
}
