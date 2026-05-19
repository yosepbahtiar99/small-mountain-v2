import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Calendar, User, PenTool } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import api from '../../../shared/lib/axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/api/blogs/${slug}`);
        setBlog(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) return <div className="min-h-[50vh] flex items-center justify-center text-primary font-black uppercase tracking-widest animate-pulse font-serif italic">Inking the page...</div>;
  if (!blog) return <div className="text-center py-40 text-stone-500 font-serif italic">This story seems to be missing.</div>;

  return (
    <article className="max-w-4xl mx-auto px-8 pb-40 space-y-16">
      <Link to="/devlogs" className="inline-flex items-center gap-3 text-stone-400 hover:text-primary transition-all font-black text-[10px] uppercase tracking-[0.2em] group">
        <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Journal
      </Link>

      <header className="space-y-10">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
           <PenTool size={14} />
           <span className="italic">{blog.category}</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-warm-text leading-[0.95] tracking-tighter">{blog.title}</h1>
        
        <div className="flex flex-wrap items-center gap-10 py-8 border-y border-stone-200 text-stone-400 text-[10px] font-black uppercase tracking-[0.2em]">
           <div className="flex items-center gap-2">
              <Calendar size={14} />
              {new Date(blog.createdAt).toLocaleDateString()}
           </div>
           <div className="flex items-center gap-2">
              <User size={14} />
              Small Mountain Studio
           </div>
        </div>
      </header>

      {blog.thumbnail && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="aspect-video rounded-[4rem] overflow-hidden border border-stone-200/50 shadow-sm"
        >
          <img src={`${BASE_URL}/${blog.thumbnail}`} className="w-full h-full object-cover grayscale-[20%]" />
        </motion.div>
      )}

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="prose prose-stone max-w-none prose-xl prose-headings:font-serif prose-headings:font-black prose-headings:italic prose-headings:tracking-tight prose-p:text-stone-600 prose-p:leading-[1.8] prose-p:font-medium"
      >
        <ReactMarkdown>
          {blog.content
            ? blog.content
                .replace(/<br\s*\/?>\s*\r?\n/gi, '\n') // Replace <br> right before newline with simple newline
                .replace(/<br\s*\/?>/gi, '  \n')     // Replace any other <br> with Markdown double space line break
            : ''}
        </ReactMarkdown>
      </motion.div>
      
      <footer className="pt-20 border-t border-stone-200 text-center space-y-6">
         <p className="font-medium text-stone-400 text-lg">Thanks for reading our quiet story.</p>
         <Link to="/devlogs" className="inline-block bg-warm-text text-warm-bg px-10 py-4 rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-primary transition-all">
            Return to Journal
         </Link>
      </footer>
    </article>
  );
}
