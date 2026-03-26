import { useState, useRef, useCallback } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import Pagination from '@/components/Pagination';
import type { Product, OrderInput } from '@shared/types';

interface SelectedItem {
  product: Product;
  quantity: number;
}

export default function OrdersPage() {
  const { orders, loading: ordersLoading, pagination, fetchOrders, createOrder } = useOrders();
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Map<number, SelectedItem>>(new Map());
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openCreate = () => {
    setSelectedItems(new Map());
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  const updateQuantity = useCallback((product: Product, quantity: number) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      if (quantity <= 0) next.delete(product.id);
      else if (quantity <= product.stock) next.set(product.id, { product, quantity });
      return next;
    });
  }, []);

  const calculateTotal = (): number => {
    let total = 0;
    selectedItems.forEach((item) => {
      total += item.product.price * item.quantity;
    });
    return total;
  };

  const validateOrder = (): string | null => {
    if (selectedItems.size === 0) return 'Select at least one product';
    for (const [, item] of selectedItems) {
      if (item.quantity > item.product.stock) return `Insufficient stock for "${item.product.name}"`;
    }
    return null;
  };

  const handleSubmit = () => {
    const error = validateOrder();
    if (error) {
      setFormError(error);
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormError('');
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    submitTimeoutRef.current = setTimeout(async () => {
      const input: OrderInput = {
        items: Array.from(selectedItems.values()).map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
      };
      const result = await createOrder(input);
      if (result.success) {
        fetchProducts();
        closeModal();
      } else {
        setFormError(result.error || 'Error creating order');
      }
      setIsSubmitting(false);
    }, 300);
  };

  if (ordersLoading) return <LoadingSpinner />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Orders</h1>
          <p className="text-slate-500 mt-1">Manage customer orders</p>
        </div>
        <button 
          onClick={openCreate} 
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Order
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-slate-900/5 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Total</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Items</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <span className="font-medium text-slate-800">#{order.id}</span>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(order.created_at + 'Z').toLocaleString(undefined, { timeZoneName: 'short' })}
                </td>
                <td className="px-6 py-4">
                  <span className="font-semibold text-slate-800">${order.total.toFixed(2)}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                    {order.items?.length || 0} items
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {pagination && (
          <div className="px-6 py-4 border-t border-gray-100 bg-slate-50/50">
            <Pagination 
              page={pagination.page} 
              totalPages={pagination.totalPages} 
              onPageChange={fetchOrders} 
            />
          </div>
        )}
      </div>

      {isModalOpen && !productsLoading && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">Create New Order</h2>
            </div>

            <div className="p-6">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm mb-4">{formError}</div>
              )}

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {products.map((product) => {
                  const item = selectedItems.get(product.id);
                  const currentQty = item?.quantity || 0;
                  const isAvailable = product.stock > 0;

                  return (
                    <div
                      key={product.id}
                      className={`flex items-center justify-between p-4 rounded-xl border ${
                        !isAvailable ? 'bg-slate-50 border-slate-200 opacity-60' : 'bg-white border-gray-200'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="font-medium text-slate-800">{product.name}</div>
                        <div className="text-sm text-slate-500">
                          ${product.price.toFixed(2)} • Stock: {product.stock}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(product, currentQty - 1)}
                          disabled={currentQty === 0}
                          className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-slate-700 font-semibold transition-colors"
                        >
                          -
                        </button>

                        <span className="w-10 text-center font-semibold text-slate-800">{currentQty}</span>

                        <button
                          onClick={() => updateQuantity(product, currentQty + 1)}
                          disabled={!isAvailable || currentQty >= product.stock}
                          className="w-10 h-10 rounded-xl bg-teal-100 hover:bg-teal-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center text-teal-700 font-semibold transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-100 mt-6 pt-6">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-slate-600 font-medium">Total:</span>
                  <span className="text-2xl font-bold text-slate-800">${calculateTotal().toFixed(2)}</span>
                </div>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={closeModal}
                    className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting || selectedItems.size === 0}
                    className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 transition-all shadow-lg shadow-teal-500/30"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Order'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
