import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Plus, Pencil, Trash2, Save, X, Upload } from 'lucide-react';
import { useAppStore } from '../../../shared/store/useAppStore';

export default function GameManager() {
  const [games, setGames] = useState<any[]>([]);
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

  const fetchGames = async () => {
    try {
      const res = await api.get('/api/games');
      setGames(res.data.data);
    } catch (err) {
      console.error(err);
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
    if (confirm('Are you sure?')) {
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Games</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-primary/20"
          >
            <Plus size={18} /> Add New Game
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-stone-50/50 p-10 rounded-[2.5rem] border border-stone-200 space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
                <option value="Development" className="bg-white text-stone-800">Development</option>
                <option value="Released" className="bg-white text-stone-800">Released</option>
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
            <button type="submit" className="bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-primary/10">
              <Save size={18} /> Save Game
            </button>
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); resetForm(); }}
              className="bg-stone-200/50 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-700 dark:text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all"
            >
              <X size={18} /> Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {games.map((game) => (
            <div key={game.id} className="bg-white/50 p-6 rounded-[2rem] border border-stone-200 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-4">
                {game.thumbnail && (
                  <img src={`http://localhost:5000/${game.thumbnail}`} className="w-12 h-12 object-cover rounded-lg" />
                )}
                <div>
                  <h4 className="font-bold">{game.title}</h4>
                  <p className="text-xs text-slate-500">{game.status}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(game)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400">
                  <Pencil size={18} />
                </button>
                <button onClick={() => handleDelete(game.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
          {games.length === 0 && <p className="text-center text-slate-600 py-10">No games found. Add your first project!</p>}
        </div>
      )}
    </div>
  );
}
