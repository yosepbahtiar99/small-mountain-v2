import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Plus, Pencil, Trash2, Save, X, Eye } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({ id: '', title: '', content: '', category: 'Devlog' });
  const [file, setFile] = useState<File | null>(null);

  const fetchBlogs = async () => {
    const res = await api.get('/api/blogs');
    setBlogs(res.data.data);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);
    data.append('category', formData.category);
    if (file) data.append('thumbnail', file);

    try {
      if (formData.id) {
        await api.put(`/api/blogs/${formData.id}`, data);
      } else {
        await api.post('/api/blogs', data);
      }
      setIsEditing(false);
      resetForm();
      fetchBlogs();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({ id: '', title: '', content: '', category: 'Devlog' });
    setFile(null);
  };

  const handleEdit = (blog: any) => {
    setFormData({ id: blog.id, title: blog.title, content: blog.content, category: blog.category });
    setIsEditing(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this devlog?')) {
      await api.delete(`/api/blogs/${id}`);
      fetchBlogs();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Devlogs</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-primary px-4 py-2 rounded-xl flex items-center gap-2">
            <Plus size={18} /> New Devlog
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSubmit} className="bg-stone-50/50 p-10 rounded-[2.5rem] border border-stone-200 space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">{formData.id ? 'Edit' : 'New'} Devlog</h3>
            <button 
              type="button" 
              onClick={() => setIsPreview(!isPreview)}
              className="text-xs bg-white/10 px-3 py-1 rounded-lg flex items-center gap-2"
            >
              <Eye size={14} /> {isPreview ? 'Editor' : 'Preview'}
            </button>
          </div>

          {!isPreview ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Title</label>
                <input 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Content (Markdown)</label>
                <textarea 
                  className="w-full bg-white/5 border border-white/10 rounded-lg p-3 h-64 font-mono text-sm"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="# Your Story Starts Here..."
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-400">Thumbnail</label>
                <input type="file" className="w-full text-sm" onChange={(e) => setFile(e.target.files?.[0] || null)} />
              </div>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none bg-white/5 p-6 rounded-xl border border-white/5 min-h-[400px]">
              <ReactMarkdown>{formData.content || '*No content to preview*'}</ReactMarkdown>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="submit" className="bg-primary px-6 py-2 rounded-lg flex items-center gap-2">
              <Save size={18} /> Save Post
            </button>
            <button type="button" onClick={() => { setIsEditing(false); resetForm(); }} className="bg-white/10 px-6 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="grid gap-4">
          {blogs.map((blog) => (
            <div key={blog.id} className="bg-white/5 p-4 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/[0.07] transition-colors">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 bg-slate-800 rounded flex items-center justify-center text-xs text-slate-500 overflow-hidden">
                   {blog.thumbnail ? <img src={`http://localhost:5000/${blog.thumbnail}`} className="w-full h-full object-cover" /> : 'No Img'}
                 </div>
                 <div>
                   <h4 className="font-semibold">{blog.title}</h4>
                   <p className="text-xs text-slate-500">{new Date(blog.createdAt).toLocaleDateString()}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(blog)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><Pencil size={18} /></button>
                <button onClick={() => handleDelete(blog.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && <p className="text-center text-slate-600 py-10">No devlogs yet. Share your progress!</p>}
        </div>
      )}
    </div>
  );
}
