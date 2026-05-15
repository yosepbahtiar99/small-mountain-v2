import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Sparkles, Mountain, FileText, Calendar } from 'lucide-react';
import api from '../../../shared/lib/axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function LandingPage() {
  const { t } = useTranslation();
  const [featuredGames, setFeaturedGames] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [recentBlogs, setRecentBlogs] = useState<any[]>([]);
  // const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [stats, setStats] = useState({ totalGames: 0, totalBlogs: 0 });
  // const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gameRes, blogRes] = await Promise.all([
          api.get('/api/games'),
          api.get('/api/blogs')
        ]);
        
        const allGames = gameRes.data.data || [];
        const allBlogs = blogRes.data.data || [];

        // Sort descending to ensure we ALWAYS get newest first
        const chronologicalGames = [...allGames].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        // Logika Pintar: 1 Paling baru dari Development & 1 Paling baru dari Released
        const newestDev = chronologicalGames.find((g: any) => g.status === 'Development');
        const newestRel = chronologicalGames.find((g: any) => g.status === 'Released');

        const displaySlideArray = [newestDev, newestRel].filter(Boolean);
        setFeaturedGames(displaySlideArray);
        
        // Take latest 2 blogs
        setRecentBlogs(allBlogs.slice(0, 2));

        // Store Statistics
        setStats({
          totalGames: allGames.length,
          totalBlogs: allBlogs.length
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  // Auto-Slideshow timer logic: 5 Seconds
  useEffect(() => {
    if (featuredGames.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredGames.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [featuredGames]);

  const activeGame = featuredGames[currentIndex];

  /*
  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/api/feedback', feedback);
      setIsSent(true);
      setFeedback({ name: '', email: '', message: '' });
      setTimeout(() => setIsSent(false), 3000);
    } catch (err) {
      console.error(err);
    }
  };
  */

  return (
    <div className="space-y-40">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10 z-50"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Mountain size={14} />
              Mountain Storytelling
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tight leading-[0.85] text-warm-text">
              SMALL <br />
              <span className="text-primary">Mountain<sup className="text-[0.4em] ml-0.5 relative -top-[1.2em] opacity-80 font-bold">™</sup></span> <br />
            </h1>
            <p className="text-stone-500 text-xl max-w-sm leading-relaxed font-medium">
              {t('studio_tagline')}
            </p>
            <div className="flex gap-6 pt-4">
              <Link to="/games" className="bg-warm-text text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-primary transition-all shadow-2xl shadow-primary/20">
                EXPLORE PROJECTS
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[4rem] bg-stone-100/40 border border-stone-200 overflow-hidden shadow-inner relative group isolation-isolate">
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[4rem] z-0">
                <div className="w-96 h-96 rounded-full bg-primary/10 blur-3xl absolute -top-12 -left-12 animate-pulse" />
                <img
                  src="/logo.png"
                  id="hero-logo-img"
                  className="w-full h-full object-cover relative z-10 mix-blend-multiply opacity-100"
                  alt="Small Mountain Emblem"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    const fallback = document.getElementById('hero-fallback-mountain');
                    if (fallback) fallback.style.display = 'block';
                  }}
                />
                <div id="hero-fallback-mountain" className="hidden w-full h-full relative z-10">
                  <Mountain size={420} className="text-primary/15 absolute -bottom-16 -left-20" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Game Section */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-black text-warm-text tracking-tight">{t('featured_game')}</h2>
            <p className="text-stone-500 font-medium max-w-sm">Stories crafted in the twilight hours.</p>
          </div>
          <Link to="/games" className="text-primary font-black text-xs uppercase tracking-[0.2em] border-b-2 border-primary/20 pb-2 hover:border-primary transition-all">
            See All Library <ChevronRight size={14} className="inline ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8 relative h-full min-h-[600px]">
            <AnimatePresence mode="wait">
              {activeGame && (
                <motion.div
                  key={activeGame.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  whileHover={{ y: -8 }}
                  className="absolute inset-0 glass-warm rounded-[4rem] border border-stone-200/50 overflow-hidden group shadow-sm h-full"
                >
                  <div className="absolute inset-0 opacity-80 group-hover:scale-105 transition-all duration-1000">
                    {activeGame.thumbnail ? (
                      <img src={`${BASE_URL}/${activeGame.thumbnail}`} alt={activeGame.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-stone-50" />
                    )}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-warm-bg via-warm-bg/40 to-transparent" />
                  
                  <div className="relative p-8 md:p-16 h-full flex flex-col justify-end space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="h-px w-10 bg-primary" />
                      <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                        {activeGame.status}
                      </span>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-black text-warm-text leading-none tracking-tighter">{activeGame.title}</h3>
                    <p className="text-stone-600 max-w-lg text-lg font-medium leading-relaxed line-clamp-3">{activeGame.description}</p>
                    
                    <div className="flex gap-12 pt-4">
                      {Object.entries(activeGame.progress || {}).map(([key, val]: [string, any]) => (
                        <div key={key} className="space-y-3">
                          <p className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-400">{key}</p>
                          <p className="text-2xl text-warm-text">{val}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Dots Indicators */}
            {featuredGames.length > 1 && (
              <div className="absolute bottom-10 right-12 z-30 flex gap-2 bg-white/50 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 shadow-sm">
                {featuredGames.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === idx 
                        ? 'bg-primary w-6' 
                        : 'bg-primary/20 hover:bg-primary/40'
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="md:col-span-4 flex flex-col gap-6">
            <div className="flex-1 glass-warm rounded-[3.5rem] border border-stone-200/50 p-10 flex flex-col justify-between group bg-stone-50/30 relative overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-primary/60">
                  <Sparkles size={12} /> Activity Radar
                </div>
                <h3 className="text-2xl font-black text-warm-text leading-tight tracking-tight">Studio Vitality</h3>
              </div>

              <div className="space-y-6 relative z-10 mt-8">
                {/* Stat 1 */}
                <div className="flex justify-between items-end border-b border-stone-200/60 pb-4">
                   <div className="space-y-1">
                     <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">Projects Created</p>
                     <p className="text-sm text-stone-600 font-medium">Games Library</p>
                   </div>
                   <div className="text-4xl font-black text-warm-text leading-none">{stats.totalGames}</div>
                </div>

                {/* Stat 2 */}
                <div className="flex justify-between items-end border-b border-stone-200/60 pb-4">
                   <div className="space-y-1">
                     <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">Journal Entries</p>
                     <p className="text-sm text-stone-600 font-medium">Written Devlogs</p>
                   </div>
                   <div className="text-4xl font-black text-warm-text leading-none">{stats.totalBlogs}</div>
                </div>

                {/* Stat 3 */}
                <div className="flex justify-between items-end pb-2">
                   <div className="space-y-1">
                     <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">Established</p>
                     <p className="text-sm text-stone-600 font-medium">Since</p>
                   </div>
                   <div className="text-4xl font-black text-primary leading-none">2026</div>
                </div>
              </div>
            </div>

            <div className="h-32 bg-primary rounded-[2.5rem] flex items-center justify-center relative overflow-hidden shadow-lg group cursor-default">
               <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-all duration-700" />
               <div className="text-center relative z-10">
                 <p className="text-[9px] text-blue-100/60 uppercase font-black tracking-[0.3em] mb-1">Studio Status</p>
                 <h4 className="text-white font-black text-xl tracking-wide uppercase">Active & Building</h4>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Devlogs Section */}
      {recentBlogs.length > 0 && (
        <section className="max-w-7xl mx-auto px-8 pb-40">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-16">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
                <FileText size={12} />
                The Journal
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-warm-text tracking-tight">Latest Updates</h2>
            </div>
            <Link to="/devlogs" className="text-primary font-black text-xs uppercase tracking-[0.2em] border-b-2 border-primary/20 pb-2 hover:border-primary transition-all">
              Read All Devlogs <ChevronRight size={14} className="inline ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {recentBlogs.map((blog) => (
              <Link key={blog.id} to={`/devlogs/${blog.slug}`} className="group block">
                <motion.div 
                  whileHover={{ y: -12 }}
                  className="space-y-8"
                >
                  <div className="aspect-[16/9] rounded-[3rem] overflow-hidden border border-stone-200/50 relative bg-stone-50 shadow-sm group-hover:shadow-2xl transition-all duration-700">
                     {blog.thumbnail ? (
                       <img 
                        src={`${BASE_URL}/${blog.thumbnail}`} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000 grayscale-[20%] group-hover:grayscale-0" 
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-stone-300 bg-stone-100">
                         <FileText size={48} />
                       </div>
                     )}
                  </div>
                  <div className="space-y-4 px-4">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary">
                      <span className="italic">{blog.category}</span>
                      <div className="h-1 w-1 rounded-full bg-primary/30" />
                      <div className="flex items-center gap-2 text-stone-400">
                        <Calendar size={12} />
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-warm-text group-hover:text-primary transition-colors leading-tight tracking-tight">
                      {blog.title}
                    </h3>
                    <p className="text-stone-500 font-medium text-lg leading-relaxed line-clamp-2">
                      {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 150)}...
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Feedback Section */}
      {/* <section className="max-w-4xl mx-auto px-8 text-center space-y-16 pb-40">
        <div className="space-y-4">
          <h2 className="text-4xl md:text-6xl font-black text-warm-text">{t('feedback')}</h2>
          <p className="text-stone-500 text-xl font-medium">Have something to say? We're listening.</p>
        </div>

        <form onSubmit={handleFeedback} className="glass-warm p-8 md:p-16 rounded-[2.5rem] md:rounded-[4rem] border border-stone-200/50 space-y-8 text-left shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-2">Name</label>
              <input
                className="w-full bg-stone-100/50 border border-stone-200 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-primary/10 outline-none transition-all font-medium"
                placeholder="Your name"
                value={feedback.name}
                onChange={(e) => setFeedback({ ...feedback, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-2">Email</label>
              <input
                className="w-full bg-stone-100/50 border border-stone-200 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-primary/10 outline-none transition-all font-medium"
                placeholder="Your email"
                type="email"
                value={feedback.email}
                onChange={(e) => setFeedback({ ...feedback, email: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-2">Message</label>
            <textarea
              className="w-full bg-stone-100/50 border border-stone-200 rounded-[2rem] px-8 py-6 h-48 focus:ring-2 focus:ring-primary/10 outline-none transition-all resize-none font-medium leading-relaxed"
              placeholder={t('feedback_placeholder')}
              value={feedback.message}
              onChange={(e) => setFeedback({ ...feedback, message: e.target.value })}
              required
            />
          </div>
          <div className="flex justify-center pt-8">
            {isSent ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-primary font-black text-xs uppercase tracking-widest flex items-center gap-2"
              >
                Message Received.
              </motion.div>
            ) : (
              <button type="submit" className="bg-warm-text hover:bg-primary text-white px-14 py-5 rounded-full font-black text-xs uppercase tracking-widest flex items-center gap-4 transition-all shadow-xl shadow-warm-text/5 cursor-pointer">
                <Send size={18} /> {t('send')}
              </button>
            )}
          </div>
        </form>
      </section> */}
    </div>
  );
}
