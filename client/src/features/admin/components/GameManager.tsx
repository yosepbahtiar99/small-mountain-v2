import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Plus, Pencil, Trash2, Save, Upload } from 'lucide-react';
import { useAppStore } from '../../../shared/store/useAppStore';
import DataTable, { type IColumn } from '../../../shared/components/DataTable';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

export default function GameManager() {
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    status: 'Development',
    progress: '{"script": 0, "art": 0, "music": 0}',
    playLink: ''
  });
  const [file, setFile] = useState<File | null>(null);
  const { addNotification } = useAppStore();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchGames = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/games');
      setGames(res.data.data);
    } catch (err) {
      console.error(err);
      addNotification('Failed to fetch games!', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('status', formData.status);
    data.append('progress', formData.progress);
    data.append('playLink', formData.playLink);
    if (file) data.append('thumbnail', file);

    try {
      if (formData.id) {
        await api.put(`/api/games/${formData.id}`, data);
        addNotification('Game updated successfully!', 'success');
      } else {
        await api.post('/api/games', data);
        addNotification('Game created successfully!', 'success');
      }
      setIsEditing(false);
      resetForm();
      fetchGames();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to save game!';
      addNotification(errMsg, 'error');
    }
  };

  const resetForm = () => {
    setFormData({ id: '', title: '', description: '', status: 'Development', progress: '{"script": 0, "art": 0, "music": 0}', playLink: '' });
    setFile(null);
  };

  const handleEdit = (game: any) => {
    setFormData({
      id: game.id,
      title: game.title,
      description: game.description,
      status: game.status,
      progress: JSON.stringify(game.progress),
      playLink: game.playLink || ''
    });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this game?')) {
      try {
        await api.delete(`/api/games/${id}`);
        addNotification('Game deleted successfully!', 'success');
        fetchGames();
      } catch (err) {
        console.error(err);
        addNotification('Failed to delete game!', 'error');
      }
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(games.length / itemsPerPage);
  const currentData = games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const columns: IColumn<any>[] = [
    {
      header: 'Game',
      render: (game: any) => (
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-stone-100 rounded-xl overflow-hidden border border-stone-200/60 flex-shrink-0 flex items-center justify-center">
            {game.thumbnail ? (
              <img src={`${BASE_URL}/${game.thumbnail}`} className="w-full h-full object-cover" />
            ) : (
              <span className="text-[9px] text-stone-400 font-bold uppercase tracking-wider">No Image</span>
            )}
          </div>
          <span className="font-bold text-stone-800 text-sm leading-snug line-clamp-2">{game.title}</span>
        </div>
      )
    },
    {
      header: 'Status',
      render: (game: any) => {
        const isReleased = game.status === 'Released';
        return (
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
            isReleased 
              ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
              : 'bg-orange-50 text-orange-600 border border-orange-100'
          }`}>
            <span className={`w-1 h-1 rounded-full ${isReleased ? 'bg-emerald-500' : 'bg-orange-500'}`} />
            {game.status}
          </span>
        );
      }
    },
    {
      header: 'Description',
      render: (game: any) => (
        <p className="text-stone-400 font-medium text-xs max-w-xs xl:max-w-md line-clamp-2 leading-relaxed">
          {game.description || 'No description provided.'}
        </p>
      )
    },
    {
      header: '',
      className: 'text-right',
      render: (game: any) => (
        <div className="flex gap-1 justify-end">
          <button 
            onClick={() => handleEdit(game)} 
            className="p-2 hover:bg-stone-100 rounded-lg text-stone-500 hover:text-primary transition-all cursor-pointer"
            title="Edit Game"
          >
            <Pencil size={15} />
          </button>
          <button 
            onClick={() => handleDelete(game.id)} 
            className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-500 transition-all cursor-pointer"
            title="Delete Game"
          >
            <Trash2 size={15} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center pb-4 border-b border-stone-200">
        <div>
          <h2 className="text-3xl font-black text-stone-800 tracking-tight">Manage Games</h2>
          <p className="text-stone-500 text-xs font-bold uppercase tracking-widest mt-1">Add and edit catalog projects</p>
        </div>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-primary/20 cursor-pointer"
          >
            <Plus size={16} /> Add New Game
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-stone-50/50 p-10 rounded-[2.5rem] border border-stone-200 space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-stone-500">Game Title</label>
              <input 
                className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Enter game title..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-stone-500">Status</label>
              <select 
                className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium cursor-pointer shadow-sm"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Development" className="bg-white text-stone-800 font-bold">Development</option>
                <option value="Released" className="bg-white text-stone-800 font-bold">Released</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-stone-500">Description</label>
            <textarea 
              className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-3 h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Tell us about the game..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-stone-500">Progress JSON (e.g. {"{\"script\": 70}"})</label>
            <input 
              className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm"
              value={formData.progress}
              onChange={(e) => setFormData({...formData, progress: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider text-stone-500">Thumbnail Image</label>
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-stone-200 hover:border-primary bg-white hover:bg-stone-50/50 rounded-2xl cursor-pointer transition-all duration-300 shadow-sm group">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 text-stone-400 group-hover:text-primary transition-colors mb-2" />
                <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">
                  {file ? file.name : 'Click to upload thumbnail'}
                </p>
                <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wider mt-1">PNG, JPG, WEBP up to 5MB</p>
              </div>
              <input 
                type="file" 
                className="hidden" 
                onChange={(e) => setFile(e.target.files?.[0] || null)} 
                accept="image/*"
              />
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all shadow-md shadow-primary/10 cursor-pointer">
              <Save size={18} /> Save Game
            </button>
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); resetForm(); }}
              className="bg-stone-200/50 hover:bg-stone-200 text-stone-700 font-bold px-6 py-3.5 rounded-2xl flex items-center gap-2 transition-all cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <DataTable
          data={currentData}
          columns={columns}
          isLoading={loading}
          emptyMessage="No games found. Add your first project!"
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
