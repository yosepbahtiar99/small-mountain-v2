import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';

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

  const fetchGames = async () => {
    const res = await api.get('/api/games');
    setGames(res.data.data);
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
      } else {
        await api.post('/api/games', data);
      }
      setIsEditing(false);
      resetForm();
      fetchGames();
    } catch (err) {
      console.error(err);
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
      await api.delete(`/api/games/${id}`);
      fetchGames();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Games</h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all"
          >
            <Plus size={18} /> Add New Game
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-stone-50/50 p-10 rounded-[2.5rem] border border-stone-200 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Game Title</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-slate-400">Status</label>
              <select 
                className="w-full bg-slate-800 border border-white/10 rounded-lg p-2 focus:outline-none focus:ring-1 focus:ring-primary"
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Development">Development</option>
                <option value="Released">Released</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Description</label>
            <textarea 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2 h-24 focus:outline-none focus:ring-1 focus:ring-primary"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Progress JSON (e.g. {"{\"script\": 70}"})</label>
            <input 
              className="w-full bg-white/5 border border-white/10 rounded-lg p-2"
              value={formData.progress}
              onChange={(e) => setFormData({...formData, progress: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-400">Thumbnail Image</label>
            <input 
              type="file"
              className="w-full text-sm text-slate-400"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button type="submit" className="bg-primary px-6 py-2 rounded-lg flex items-center gap-2">
              <Save size={18} /> Save Game
            </button>
            <button 
              type="button" 
              onClick={() => { setIsEditing(false); resetForm(); }}
              className="bg-white/10 px-6 py-2 rounded-lg flex items-center gap-2"
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
