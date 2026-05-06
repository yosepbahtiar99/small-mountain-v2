import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Plus, Pencil, Trash2, Save, ExternalLink, Upload } from 'lucide-react';
import { useAppStore } from '../../../shared/store/useAppStore';
import DataTable, { type IColumn } from '../../../shared/components/DataTable';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function MerchManager() {
  const [merch, setMerch] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', price: 0, shopeeLink: '' });
  const [file, setFile] = useState<File | null>(null);
  const { addNotification } = useAppStore();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchMerch = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/merch');
      setMerch(res.data.data);
    } catch (err: any) {
      console.error(err);
      addNotification('Failed to fetch merchandise!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMerch();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', formData.price.toString());
    data.append('shopeeLink', formData.shopeeLink);
    if (file) data.append('thumbnail', file);

    try {
      if (formData.id) {
        await api.put(`/api/merch/${formData.id}`, data);
        addNotification('Product updated successfully!', 'success');
      } else {
        await api.post('/api/merch', data);
        addNotification('Product created successfully!', 'success');
      }
      setIsEditing(false);
      resetForm();
      fetchMerch();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to save product!';
      addNotification(errMsg, 'error');
    }
  };

  const resetForm = () => {
    setFormData({ id: '', name: '', price: 0, shopeeLink: '' });
    setFile(null);
  };

  const handleEdit = (item: any) => {
    setFormData({ id: item.id, name: item.name, price: item.price, shopeeLink: item.shopeeLink });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/api/merch/${id}`);
        addNotification('Product deleted successfully!', 'success');
        fetchMerch();
      } catch (err: any) {
        console.error(err);
        const errMsg = err.response?.data?.message || 'Failed to delete product!';
        addNotification(errMsg, 'error');
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(merch.length / itemsPerPage);
  const currentData = merch.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: IColumn<any>[] = [
    {
      header: 'Product',
      render: (item: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden border border-stone-200/60 flex-shrink-0 flex items-center justify-center">
            {item.thumbnail ? (
              <img src={`${BASE_URL}/${item.thumbnail}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">No Image</span>
            )}
          </div>
          <span className="font-bold text-stone-800 text-sm leading-snug line-clamp-2">{item.name}</span>
        </div>
      )
    },
    {
      header: 'Price',
      render: (item: any) => (
        <span className="text-orange-500 font-black text-sm">Rp {item.price.toLocaleString()}</span>
      )
    },
    {
      header: 'Store',
      render: (item: any) => (
        <a 
          href={item.shopeeLink} 
          target="_blank" 
          rel="noreferrer" 
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold bg-orange-50 text-orange-600 hover:bg-orange-100 transition-colors"
        >
          Shopee <ExternalLink size={12} />
        </a>
      )
    },
    {
      header: '',
      className: 'text-right',
      render: (item: any) => (
        <div className="flex gap-1 justify-end">
          <button 
            onClick={() => handleEdit(item)} 
            className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-primary transition-all cursor-pointer"
            title="Edit Product"
          >
            <Pencil size={15} />
          </button>
          <button 
            onClick={() => handleDelete(item.id)} 
            className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-500 transition-all cursor-pointer"
            title="Delete Product"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">Merchandise Store</h2>
          <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-1">Manage physical products and Shopee listings</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)} 
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] transition-all cursor-pointer"
          >
            <Plus size={16} /> Add Product
          </button>
        )}
      </div>

      {isEditing ? (
        /* Form Area */
        <form onSubmit={handleSubmit} className="bg-stone-50/50 p-10 rounded-[2.5rem] border border-stone-200 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-stone-500">Product Name</label>
            <input 
              className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="Enter product name..."
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-stone-500">Price (IDR)</label>
              <input 
                type="number"
                className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm"
                value={formData.price || ''}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value) || 0})}
                placeholder="e.g. 150000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-stone-500">Shopee Link</label>
              <input 
                className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm"
                value={formData.shopeeLink}
                onChange={(e) => setFormData({...formData, shopeeLink: e.target.value})}
                placeholder="https://shopee.co.id/..."
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-stone-500">Product Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-200 hover:border-orange-500 bg-white hover:bg-stone-50/50 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload size={24} className="text-stone-400 group-hover:text-orange-500 transition-colors mb-2" />
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider group-hover:text-stone-700 transition-colors px-4 text-center line-clamp-1">
                  {file ? file.name : 'Upload Thumbnail'}
                </p>
                <p className="text-[10px] text-stone-400 mt-1 uppercase font-bold tracking-widest">PNG, JPG, WEBP up to 5MB</p>
              </div>
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            <button 
              type="submit" 
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
            >
              <Save size={16} /> Save Product
            </button>
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); resetForm(); }} 
              className="bg-stone-200/50 hover:bg-stone-200/80 text-stone-700 text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-2xl active:scale-95 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* List Cards Area */
        <DataTable
          data={currentData}
          columns={columns}
          isLoading={loading}
          emptyMessage="No products in store yet."
          pagination={{
            currentPage,
            totalPages,
            onPageChange: (page) => setCurrentPage(page),
          }}
        />
      )}
    </div>
  );
}
