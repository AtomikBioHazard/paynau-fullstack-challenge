import { useState, useRef, useCallback } from 'react';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Pagination from '@/components/Pagination';
import type { Product, OrderInput } from '../../../shared/types';
interface SelectedItem { product: Product; quantity: number; }
export default function OrdersPage() {
  const { orders, loading: ordersLoading, pagination, fetchOrders, createOrder } = useOrders();
  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Map<number, SelectedItem>>(new Map());
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const openCreate = () => { setSelectedItems(new Map()); setFormError(''); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const updateQuantity = useCallback((product: Product, quantity: number) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      if (quantity <= 0) next.delete(product.id);
      else if (quantity <= product.stock) next.set(product.id, { product, quantity });
      return next;
    });
  }, []);
  const calculateTotal = (): number => { let total = 0; selectedItems.forEach((item) => total += item.product.price * item.quantity); return total; };
  const validateOrder = (): string | null => { if (selectedItems.size === 0) return 'Select at least one product'; for (const [, item] of selectedItems) if (item.quantity > item.product.stock) return `Insufficient stock for "${item.product.name}"`; return null; };
  const handleSubmit = () => {
    const error = validateOrder();
    if (error) { setFormError(error); return; }
    if (isSubmitting) return;
    setIsSubmitting(true);
    setFormError('');
    if (submitTimeoutRef.current) clearTimeout(submitTimeoutRef.current);
    submitTimeoutRef.current = setTimeout(async () => {
      const input: OrderInput = { items: Array.from(selectedItems.values()).map((item) => ({ product_id: item.product.id, quantity: item.quantity })) };
      const result = await createOrder(input);
      if (result.success) { fetchProducts(); closeModal(); }
      else setFormError(result.error || 'Error creating order');
      setIsSubmitting(false);
    }, 300);
  };
  if (ordersLoading) return <LoadingSpinner />;
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Orders</h1><button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ New Order</button></div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Items</th></tr></thead><tbody className="divide-y">{orders.map((order) => <tr key={order.id}><td className="px-6 py-4">#{order.id}</td><td className="px-6 py-4">{new Date(order.created_at).toLocaleString()}</td><td className="px-6 py-4">${order.total.toFixed(2)}</td><td className="px-6 py-4">{order.items?.length || 0} items</td></tr>)}</tbody></table>
        {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchOrders} />}
      </div>
      {isModalOpen && !productsLoading && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"><h2 className="text-xl font-bold mb-4">New Order</h2>{formError && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{formError}</div>}<div className="mb-4"><h3 className="text-sm font-medium text-gray-700 mb-2">Products:</h3><div className="space-y-2 max-h-96 overflow-y-auto">{products.map((product) => { const item = selectedItems.get(product.id); const currentQty = item?.quantity || 0; const isAvailable = product.stock > 0; return (<div key={product.id} className={`flex items-center justify-between p-3 border rounded ${!isAvailable ? 'bg-gray-100 opacity-60' : 'bg-white'}`}><div className="flex-1"><div className="font-medium">{product.name}</div><div className="text-sm text-gray-500">${product.price.toFixed(2)} - Stock: {product.stock}</div></div><div className="flex items-center space-x-2"><button onClick={() => updateQuantity(product, currentQty - 1)} disabled={currentQty === 0} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center">-</button><span className="w-8 text-center">{currentQty}</span><button onClick={() => updateQuantity(product, currentQty + 1)} disabled={!isAvailable || currentQty >= product.stock} className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 flex items-center justify-center">+</button></div></div>); })}</div></div>
          <div className="border-t pt-4"><div className="flex justify-between text-lg font-bold mb-4"><span>Total:</span><span>${calculateTotal().toFixed(2)}</span></div><div className="flex justify-end space-x-3"><button onClick={closeModal} className="px-4 py-2 text-gray-700">Cancel</button><button onClick={handleSubmit} disabled={isSubmitting || selectedItems.size === 0} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{isSubmitting ? 'Creating...' : 'Create Order'}</button></div></div>
        </div></div>}
    </div>
  );
}
