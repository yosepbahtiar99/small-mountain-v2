import { useState, useEffect } from 'react';
import api from '../../../shared/lib/axios';
import { Trash2, CheckCircle, Clock } from 'lucide-react';
import DataTable, { type IColumn } from '../../../shared/components/DataTable';

export default function FeedbackManager() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/feedback');
      setFeedbacks(res.data.data);
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedback();
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.put(`/api/feedback/${id}/read`);
      fetchFeedback();
    } catch (err) {
      console.error('Failed to mark feedback as read:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this feedback?')) {
      try {
        await api.delete(`/api/feedback/${id}`);
        fetchFeedback();
      } catch (err) {
        console.error('Failed to delete feedback:', err);
      }
    }
  };

  // Client-side pagination logic
  const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
  const currentData = feedbacks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const columns: IColumn<any>[] = [
    {
      header: 'Sender',
      render: (f: any) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border font-bold text-xs transition-colors ${
            f.isRead 
              ? 'bg-stone-100 border-stone-200 text-stone-400' 
              : 'bg-primary/5 border-primary/10 text-primary'
          }`}>
            {f.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className={`font-bold leading-tight ${f.isRead ? 'text-stone-400' : 'text-warm-text'}`}>{f.name}</div>
            <div className="text-[11px] text-stone-400 font-medium mt-0.5">{f.email}</div>
          </div>
        </div>
      )
    },
    {
      header: 'Message',
      render: (f: any) => (
        <p className={`line-clamp-2 max-w-sm xl:max-w-md ${f.isRead ? 'text-stone-400 font-medium' : 'text-stone-600 font-semibold'}`}>
          {f.message}
        </p>
      )
    },
    {
      header: 'Received At',
      render: (f: any) => (
        <div className="flex items-center gap-1.5 text-xs text-stone-400 font-semibold">
          <Clock size={12} />
          {new Date(f.createdAt).toLocaleDateString()}
        </div>
      )
    },
    {
      header: 'Status',
      render: (f: any) => (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
          f.isRead 
            ? 'bg-stone-50 text-stone-400 border border-stone-100' 
            : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
        }`}>
          <span className={`w-1 h-1 rounded-full ${f.isRead ? 'bg-stone-300' : 'bg-emerald-500'}`} />
          {f.isRead ? 'Read' : 'New'}
        </span>
      )
    },
    {
      header: '',
      className: 'text-right',
      render: (f: any) => (
        <div className="flex gap-1 justify-end">
          {!f.isRead && (
            <button 
              onClick={() => handleMarkAsRead(f.id)} 
              className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-600 transition-colors cursor-pointer" 
              title="Mark as Read"
            >
              <CheckCircle size={16} />
            </button>
          )}
          <button 
            onClick={() => handleDelete(f.id)} 
            className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors cursor-pointer"
            title="Delete Feedback"
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-black text-warm-text tracking-tight">User Feedback</h2>
        <span className="text-xs font-black uppercase tracking-wider text-stone-400 bg-stone-100/50 px-4 py-2 rounded-xl border border-stone-200/40">
          Total: {feedbacks.length} Items
        </span>
      </div>
      
      <DataTable
        data={currentData}
        columns={columns}
        isLoading={loading}
        emptyMessage="No feedback received yet."
        pagination={{
          currentPage,
          totalPages,
          onPageChange: (page) => setCurrentPage(page),
        }}
      />
    </div>
  );
}
