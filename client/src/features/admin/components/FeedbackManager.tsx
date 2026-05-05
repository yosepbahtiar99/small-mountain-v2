import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Trash2, Mail, CheckCircle, Clock } from 'lucide-react';

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);

  const fetchFeedback = async () => {
    const res = await api.get('/api/feedback');
    setFeedbacks(res.data.data);
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    await api.put(`/api/feedback/${id}/read`);
    fetchFeedback();
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this feedback?')) {
      await api.delete(`/api/feedback/${id}`);
      fetchFeedback();
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">User Feedback</h2>
      
      <div className="grid gap-4">
        {feedbacks.map((f) => (
          <div key={f.id} className={`p-6 rounded-2xl border transition-all ${f.isRead ? 'bg-white/2 border-white/5 opacity-60' : 'bg-white/5 border-primary/20 shadow-lg shadow-primary/5'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${f.isRead ? 'bg-slate-800' : 'bg-primary/20'}`}>
                  <Mail size={18} className={f.isRead ? 'text-slate-500' : 'text-primary'} />
                </div>
                <div>
                  <h4 className="font-bold">{f.name}</h4>
                  <p className="text-xs text-slate-400">{f.email}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!f.isRead && (
                  <button onClick={() => handleMarkAsRead(f.id)} className="p-2 hover:bg-emerald-500/10 rounded-lg text-emerald-400" title="Mark as Read">
                    <CheckCircle size={18} />
                  </button>
                )}
                <button onClick={() => handleDelete(f.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed">{f.message}</p>
            <div className="mt-4 flex items-center gap-1 text-[10px] text-slate-500 uppercase tracking-widest">
              <Clock size={10} />
              {new Date(f.createdAt).toLocaleString()}
            </div>
          </div>
        ))}
        {feedbacks.length === 0 && <p className="text-center text-slate-600 py-10">No feedback received yet.</p>}
      </div>
    </div>
  );
}
