import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Plus, Pencil, Trash2, Save, X, ExternalLink } from 'lucide-react';

export default function MerchManager() {
  const [merch, setMerch] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ id: '', name: '', price: 0, shopeeLink: '' });
  const [file, setFile] = useState<File | null>(null);

  const fetchMerch = async () => {
    const res = await api.get('/api/merch');
    setMerch(res.data.data);
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
      } else {
        await api.post('/api/merch', data);
      }
      setIsEditing(false);
      resetForm();
      fetchMerch();
    } catch (err) {
      console.error(err);
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
    if (confirm('Delete this item?')) {
      await api.delete(`/api/merch/${id}`);
      fetchMerch();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Merchandise Store</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl flex items-center gap-2">
            <Plus size={18} /> Add Product
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-white/5 p-6 rounded-2xl border border-white/5 space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Product Name</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Price (IDR)</label>
              <input 
                type="number"
                className="w-full bg-white/5 border border-white/10 rounded-lg p-3"
                value={formData.price}
                onChange={(e) => setFormData({...formData, price: parseInt(e.target.value)})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Thumbnail</label>
              <input type="file" className="w-full text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm text-slate-400">Shopee Link</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3"
              value={formData.shopeeLink}
              onChange={(e) => setFormData({...formData, shopeeLink: e.target.value})}
              required
              placeholder="https://shopee.co.id/..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="bg-orange-500 px-6 py-2 rounded-lg flex items-center gap-2">
              <Save size={18} /> Save Product
            </button>
            <button type="button" onClick={() => { setIsEditing(false); resetForm(); }} className="bg-white/10 px-6 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {merch.map((item) => (
            <div key={item.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex gap-4">
              <div className="w-24 h-24 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0">
                {item.thumbnail ? <img src={`http://localhost:5000/${item.thumbnail}`} className="w-full h-full object-cover" /> : 'No Img'}
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold">{item.name}</h4>
                  <p className="text-orange-400 text-sm font-semibold">Rp {item.price.toLocaleString()}</p>
                </div>
                <div className="flex gap-2">
                  <a href={item.shopeeLink} target="_blank" className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><ExternalLink size={16} /></a>
                  <button onClick={() => handleEdit(item)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><Pencil size={16} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 size={16} /></button>
                </div>
              </div>
            </div>
          ))}
          {merch.length === 0 && <p className="text-center text-slate-600 py-10 col-span-2">No products in store yet.</p>}
        </div>
      )}
    </div>
  );
}
