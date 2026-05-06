import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Plus, Pencil, Trash2, Save, X, ExternalLink, Upload } from 'lucide-react';
import { useAppStore } from '../../../shared/store/useAppStore';

export default function MerchManager() {
  const [merch, setMerch] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', price: 0, shopeeLink: '' });
  const [file, setFile] = useState<File | null>(null);
  const { addNotification } = useAppStore();

  const fetchMerch = async () => {
    try {
      const res = await api.get('/api/merch');
      setMerch(res.data.data);
    } catch (err: any) {
      console.error(err);
      addNotification('Failed to fetch merchandise!', 'error');
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
            className="bg-orange-500 hover:bg-orange-600 active:scale-95 text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] transition-all"
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
              className="bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all"
            >
              <Save size={16} /> Save Product
            </button>
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); resetForm(); }} 
              className="bg-stone-200/50 hover:bg-stone-200/80 text-stone-700 text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-2xl active:scale-95 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        /* List Cards Area */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {merch.map((item) => (
            <div 
              key={item.id} 
              className="bg-white border border-stone-200 p-5 rounded-[2rem] shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 flex flex-col justify-between"
            >
              <div className="flex gap-4">
                {/* Image Showcase */}
                <div className="w-24 h-24 bg-stone-100 rounded-2xl overflow-hidden border border-stone-200/60 flex-shrink-0 flex items-center justify-center">
                  {item.thumbnail ? (
                    <img src={`http://localhost:5000/${item.thumbnail}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">No Image</span>
                  )}
                </div>
                
                {/* Meta details */}
                <div className="space-y-1.5 flex-1">
                  <h4 className="font-bold text-stone-800 text-lg leading-snug line-clamp-2">{item.name}</h4>
                  <p className="text-orange-500 font-black text-sm">Rp {item.price.toLocaleString()}</p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="flex justify-between items-center mt-5 pt-4 border-t border-stone-100">
                <a 
                  href={item.shopeeLink} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-stone-400 hover:text-orange-500 transition-colors"
                >
                  Shopee <ExternalLink size={12} />
                </a>
                <div className="flex gap-1">
                  <button 
                    onClick={() => handleEdit(item)} 
                    className="p-2.5 hover:bg-stone-100 active:scale-90 text-stone-500 hover:text-primary transition-all rounded-xl"
                  >
                    <Pencil size={15} />
                  </button>
                  <button 
                    onClick={() => handleDelete(item.id)} 
                    className="p-2.5 hover:bg-red-50 active:scale-90 text-stone-400 hover:text-red-500 transition-all rounded-xl"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {merch.length === 0 && (
            <p className="text-center text-stone-500 py-16 col-span-full font-bold uppercase tracking-wider text-sm border-2 border-dashed border-stone-200 rounded-[2.5rem]">
              No products in store yet.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
