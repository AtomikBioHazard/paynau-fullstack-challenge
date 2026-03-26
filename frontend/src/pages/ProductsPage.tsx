import { useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Pagination from '@/components/Pagination';
import type { Product, ProductInput } from '../../../shared/types';
const INITIAL_PRODUCT: ProductInput = { name: '', description: '', price: 0, stock: 0 };
export default function ProductsPage() {
  const { products, loading, error, pagination, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState<ProductInput>(INITIAL_PRODUCT);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);
  const openCreate = () => { setEditingProduct(null); setFormData(INITIAL_PRODUCT); setFormError(''); setIsModalOpen(true); };
  const openEdit = (product: Product) => { setEditingProduct(product); setFormData({ name: product.name, description: product.description || '', price: product.price, stock: product.stock }); setFormError(''); setIsModalOpen(true); };
  const closeModal = () => setIsModalOpen(false);
  const validate = (): string | null => { if (!formData.name.trim()) return 'Name is required'; if (formData.price <= 0) return 'Price must be greater than 0'; if (formData.stock < 0) return 'Stock cannot be negative'; return null; };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setFormError(validationError); return; }
    setIsSubmitting(true);
    setFormError('');
    abortControllerRef.current = new AbortController();
    const success = editingProduct ? await updateProduct(editingProduct.id, formData) : await createProduct(formData);
    if (success) closeModal();
    else setFormError('Error saving product');
    setIsSubmitting(false);
  };
  const handleDelete = async (id: number) => { if (!confirm('Delete this product?')) return; await deleteProduct(id); };
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  return (
    <div>
      <div className="flex justify-between items-center mb-6"><h1 className="text-2xl font-bold">Products</h1><button onClick={openCreate} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">+ New Product</button></div>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full"><thead className="bg-gray-50"><tr><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th><th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th></tr></thead><tbody className="divide-y">{products.map((p) => <tr key={p.id}><td className="px-6 py-4">{p.name}</td><td className="px-6 py-4">${p.price.toFixed(2)}</td><td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${p.stock === 0 ? 'bg-red-100 text-red-800' : p.stock < 10 ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{p.stock}</span></td><td className="px-6 py-4 space-x-2"><button onClick={() => openEdit(p)} className="text-blue-600 hover:text-blue-900">Edit</button><button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button></td></tr>)}</tbody></table>
        {pagination && <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={fetchProducts} />}
      </div>
      {isModalOpen && <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white rounded-lg p-6 w-full max-w-md"><h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit' : 'New'} Product</h2>{formError && <div className="bg-red-50 text-red-700 p-3 rounded mb-4 text-sm">{formError}</div>}<form onSubmit={handleSubmit} className="space-y-4"><div><label className="block text-sm font-medium">Name *</label><input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full rounded border-gray-300" required/></div><div><label className="block text-sm font-medium">Description</label><input type="text" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="mt-1 block w-full rounded border-gray-300"/></div><div><label className="block text-sm font-medium">Price *</label><input type="number" step="0.01" min="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })} className="mt-1 block w-full rounded border-gray-300" required/></div><div><label className="block text-sm font-medium">Stock *</label><input type="number" min="0" value={formData.stock} onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })} className="mt-1 block w-full rounded border-gray-300" required/></div><div className="flex justify-end space-x-3 pt-4"><button type="button" onClick={closeModal} className="px-4 py-2 text-gray-700">Cancel</button><button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50">{isSubmitting ? 'Saving...' : 'Save'}</button></div></form></div></div>}
    </div>
  );
}
