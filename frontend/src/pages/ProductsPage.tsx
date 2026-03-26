import { useState, useRef } from 'react';
import { useProducts } from '@/hooks/useProducts';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';
import Pagination from '@/components/Pagination';
import type { Product } from '@shared/types';

const INITIAL_PRODUCT = { name: '', description: '', price: '', stock: '' };

export default function ProductsPage() {
  const { products, loading, error, pagination, fetchProducts, createProduct, updateProduct, deleteProduct } = useProducts();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState(INITIAL_PRODUCT);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const openCreate = () => { 
    setEditingProduct(null); 
    setFormData(INITIAL_PRODUCT); 
    setFormError(''); 
    setIsModalOpen(true); 
  };
  
  const openEdit = (product: Product) => { 
    setEditingProduct(product); 
    setFormData({ 
      name: product.name, 
      description: product.description || '', 
      price: String(product.price), 
      stock: String(product.stock) 
    }); 
    setFormError(''); 
    setIsModalOpen(true); 
  };
  
  const closeModal = () => setIsModalOpen(false);

  const validate = (): string | null => { 
    if (!formData.name.trim()) return 'Name is required'; 
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) return 'Price must be greater than 0'; 
    const stock = parseInt(formData.stock);
    if (isNaN(stock) || stock < 0) return 'Stock cannot be negative'; 
    return null; 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationError = validate();
    if (validationError) { setFormError(validationError); return; }
    setIsSubmitting(true);
    setFormError('');
    abortControllerRef.current = new AbortController();
    const input = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock)
    };
    const success = editingProduct 
      ? await updateProduct(editingProduct.id, input) 
      : await createProduct(input);
    if (!success) { setFormError('Error saving product'); setIsSubmitting(false); return; }
    closeModal();
    setIsSubmitting(false);
  };

  const handleDelete = async (id: number) => { 
    if (!confirm('Delete this product?')) return; 
    await deleteProduct(id); 
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Products</h1>
          <p className="text-slate-500 mt-1">Manage your product inventory</p>
        </div>
        <button 
          onClick={openCreate} 
          className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 transition-all shadow-lg shadow-teal-500/30 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Product
        </button>
      </div>
      
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-slate-900/5 overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-slate-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Price</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{p.name}</div>
                  {p.description && <div className="text-sm text-slate-500">{p.description}</div>}
                </td>
                <td className="px-6 py-4 text-slate-700 font-medium">${p.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    p.stock === 0 ? 'bg-red-100 text-red-700' : 
                    p.stock < 10 ? 'bg-amber-100 text-amber-700' : 
                    'bg-emerald-100 text-emerald-700'
                  }`}>
                    {p.stock} units
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => openEdit(p)} 
                      className="px-3 py-1.5 text-sm font-medium text-teal-600 hover:text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      Delete
                    </button>
                  </div>
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
              onPageChange={fetchProducts} 
            />
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl border border-gray-100">
            <div className="px-6 py-5 border-b border-gray-100">
              <h2 className="text-xl font-bold text-slate-800">{editingProduct ? 'Edit Product' : 'New Product'}</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {formError && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm">{formError}</div>
              )}
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Name *</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  placeholder="Product name"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                <input 
                  type="text" 
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all"
                  placeholder="Product description"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Price *</label>
                  <input 
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Stock *</label>
                  <input 
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="px-5 py-2.5 text-slate-600 font-medium hover:text-slate-800 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-teal-500 to-cyan-600 text-white font-semibold rounded-xl hover:from-teal-600 hover:to-cyan-700 disabled:opacity-50 transition-all shadow-lg shadow-teal-500/30"
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
