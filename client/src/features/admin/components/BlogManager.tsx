import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Plus, Pencil, Trash2, Save, X, Eye, Upload, HelpCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAppStore } from '../../../shared/store/useAppStore';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [formData, setFormData] = useState({ id: '', title: '', content: '', category: 'Devlog' });
  const [file, setFile] = useState<File | null>(null);
  const { addNotification } = useAppStore();

  const fetchBlogs = async () => {
    try {
      const res = await api.get('/api/blogs');
      setBlogs(res.data.data);
    } catch (err) {
      console.error(err);
    }
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
        addNotification('Devlog updated successfully!', 'success');
      } else {
        await api.post('/api/blogs', data);
        addNotification('Devlog created successfully!', 'success');
      }
      setIsEditing(false);
      resetForm();
      fetchBlogs();
    } catch (err: any) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to save devlog!';
      addNotification(errMsg, 'error');
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
      try {
        await api.delete(`/api/blogs/${id}`);
        addNotification('Devlog deleted successfully!', 'success');
        fetchBlogs();
      } catch (err) {
        console.error(err);
        addNotification('Failed to delete devlog!', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Manage Devlogs</h2>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] transition-all text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-md shadow-primary/20">
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
              className="text-xs bg-stone-200/50 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-700 dark:text-white px-3.5 py-1.5 rounded-lg flex items-center gap-2 transition-all font-bold"
            >
              <Eye size={14} /> {isPreview ? 'Editor' : 'Preview'}
            </button>
          </div>

          {!isPreview ? (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-stone-500">Title</label>
                <input 
                  className="w-full bg-white border border-stone-200 text-stone-800 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="Enter a captivating title..."
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <label className="text-xs font-black uppercase tracking-wider text-stone-500">Content (Markdown)</label>
                  <div className="relative group cursor-pointer">
                    <HelpCircle size={14} className="text-stone-400 hover:text-primary transition-colors" />
                    <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 w-64 bg-[#1E2522] text-[#F3F1EC] p-4 rounded-xl border border-stone-700 shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none duration-300 z-50 transform translate-y-1 group-hover:translate-y-0">
                      <h4 className="text-xs font-black uppercase tracking-widest text-[#B8845F] mb-2 font-black">Markdown Guide</h4>
                      <ul className="text-[10px] space-y-1.5 font-semibold text-stone-300">
                        <li className="flex justify-between border-b border-white/5 pb-1"><span># Header 1</span><span className="text-stone-500">Main Heading</span></li>
                        <li className="flex justify-between border-b border-white/5 pb-1"><span>## Header 2</span><span className="text-stone-500">Sub Heading</span></li>
                        <li className="flex justify-between border-b border-white/5 pb-1"><span>**bold**</span><span className="text-stone-500">Bold text</span></li>
                        <li className="flex justify-between border-b border-white/5 pb-1"><span>*italic*</span><span className="text-stone-500">Italic text</span></li>
                        <li className="flex justify-between border-b border-white/5 pb-1"><span>[Text](URL)</span><span className="text-stone-500">Hyperlink</span></li>
                        <li className="flex justify-between border-b border-white/5 pb-1"><span>![Alt](URL)</span><span className="text-stone-500">Embed Image</span></li>
                        <li className="flex justify-between border-b border-white/5 pb-1"><span>- item</span><span className="text-stone-500">Bullet list</span></li>
                        <li className="flex justify-between"><span>&gt; quote</span><span className="text-stone-500">Blockquote</span></li>
                      </ul>
                    </div>
                  </div>
                </div>
                <textarea 
                  className="w-full bg-white border border-stone-200 text-stone-800 rounded-2xl p-4 h-64 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-medium shadow-sm"
                  value={formData.content}
                  onChange={(e) => setFormData({...formData, content: e.target.value})}
                  placeholder="# Your Story Starts Here..."
                  required
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
            </div>
          ) : (
            <div className="prose prose-invert max-w-none bg-white/5 p-6 rounded-xl border border-white/5 min-h-[400px]">
              <ReactMarkdown>{formData.content || '*No content to preview*'}</ReactMarkdown>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-white/5">
            <button type="submit" className="bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] text-white font-bold px-6 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-md shadow-primary/10">
              <Save size={18} /> Save Post
            </button>
            <button type="button" onClick={() => { setIsEditing(false); resetForm(); }} className="bg-stone-200/50 hover:bg-stone-200 dark:bg-white/10 dark:hover:bg-white/20 text-stone-700 dark:text-white font-bold px-6 py-2.5 rounded-xl transition-all">
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
