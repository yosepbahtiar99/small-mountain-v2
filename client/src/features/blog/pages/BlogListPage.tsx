import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Calendar, ChevronRight, PenTool } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../shared/lib/axios';
import Pagination from '../../../shared/components/Pagination';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Fits list layout perfectly
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await api.get('/api/blogs');
        setBlogs(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchBlogs();
  }, []);

  // Client-side pagination
  const totalPages = Math.ceil(blogs.length / itemsPerPage);
  const currentData = blogs.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-24 pb-40">
      <header className="space-y-6">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
           <div className="h-px w-12 bg-primary/30" />
           The Journal
        </div>
        <h1 className="text-7xl md:text-8xl font-black text-warm-text leading-none tracking-tighter">Devlogs</h1>
        <p className="text-stone-500 max-w-lg text-xl font-medium leading-relaxed">Scribbles and thoughts from the mountain trail. Our journey, unedited.</p>
      </header>

      <div className="space-y-16 max-w-5xl">
        <div className="grid grid-cols-1 gap-12">
          {currentData.map((blog, i) => (
            <motion.div 
              key={blog.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => navigate(`/devlogs/${blog.slug}`)}
              className="group relative flex flex-col md:flex-row gap-12 items-start cursor-pointer"
            >
              <div className="w-full md:w-80 aspect-[4/3] rounded-[3rem] bg-stone-100 overflow-hidden flex-shrink-0 border border-stone-200/50 shadow-sm group-hover:shadow-xl transition-all duration-700">
                 {blog.thumbnail ? (
                   <img src={`${BASE_URL}/${blog.thumbnail}`} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale-[30%] group-hover:grayscale-0" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-stone-200">
                      <PenTool size={64} />
                   </div>
                 )}
              </div>
              
              <div className="flex-1 space-y-6 py-4">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary">
                       <span className="italic">{blog.category}</span>
                       <div className="h-1 w-1 rounded-full bg-primary/30" />
                       <div className="flex items-center gap-2 text-stone-400">
                          <Calendar size={12} />
                          {new Date(blog.createdAt).toLocaleDateString()}
                       </div>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-warm-text group-hover:text-primary transition-colors leading-tight tracking-tight">{blog.title}</h2>
                    <p className="text-stone-500 font-medium text-lg leading-relaxed line-clamp-3">{blog.content.substring(0, 200)}...</p>
                 </div>
                 
                 <button className="flex items-center gap-3 text-warm-text font-black text-[10px] uppercase tracking-[0.2em] group-hover:text-primary transition-all pt-2 cursor-pointer">
                    Read Journal <ChevronRight size={14} />
                 </button>
              </div>
            </motion.div>
          ))}
          
          {blogs.length === 0 && (
            <div className="py-40 text-center space-y-6">
               <FileText size={64} className="mx-auto text-stone-200" />
               <p className="text-stone-400 font-bold uppercase tracking-[0.3em] text-xs">The ink has run dry... check back later.</p>
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <Pagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
              window.scrollTo({ top: 300, behavior: 'smooth' });
            }}
          />
        )}
      </div>
    </div>
  );
}
