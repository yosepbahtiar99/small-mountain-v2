import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ChevronRight, Send, Sparkles, Mountain } from 'lucide-react';
import api from '../../../shared/lib/axios';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function LandingPage() {
  const { t } = useTranslation();
  const [featuredGame, setFeaturedGame] = useState<any>(null);
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await api.get('/api/games');
        const game = res.data.data.find((g: any) => g.status === 'Development') || res.data.data[0];
        setFeaturedGame(game);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFeatured();
  }, []);

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

  return (
    <div className="space-y-40">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-10"
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em]">
              <Mountain size={14} />
              Mountain Storytelling
            </div>
            <h1 className="text-7xl md:text-9xl font-black tracking-tight leading-[0.85] text-warm-text">
              SMALL <br/>
              <span className="text-primary">Mountain.</span> <br/>
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
             <div className="aspect-[4/5] rounded-[4rem] bg-stone-100/50 border border-stone-200 overflow-hidden shadow-inner relative group">
                <div className="absolute inset-0 bg-warm-bg/30 group-hover:bg-transparent transition-all duration-1000" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-80 h-80 rounded-full bg-primary/5 blur-3xl" />
                   <Mountain size={140} className="text-primary/10 relative z-10 group-hover:scale-110 transition-transform duration-1000" />
                </div>
                {/* Floating Altitude */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }} 
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute bottom-16 right-12 glass-warm px-8 py-6 rounded-3xl border border-stone-200/50 shadow-lg"
                >
                  <p className="text-[10px] uppercase font-black tracking-widest text-primary mb-2">Atmosphere</p>
                  <p className="text-sm font-serif italic text-warm-text">Quiet. Warm. Blue.</p>
                </motion.div>
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
          {featuredGame && (
            <motion.div 
              whileHover={{ y: -8 }}
              className="md:col-span-8 glass-warm rounded-[4rem] border border-stone-200/50 overflow-hidden group relative min-h-[600px] shadow-sm"
            >
              <div className="absolute inset-0 opacity-80 group-hover:scale-105 transition-all duration-1000">
                {featuredGame.thumbnail ? (
                  <img src={`${BASE_URL}/${featuredGame.thumbnail}`} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-stone-50" />
                )}
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-warm-bg via-warm-bg/40 to-transparent" />
              <div className="relative p-16 h-full flex flex-col justify-end space-y-8">
                <div className="flex items-center gap-3">
                   <div className="h-px w-10 bg-primary" />
                   <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                      {featuredGame.status}
                   </span>
                </div>
                <h3 className="text-6xl font-black text-warm-text leading-none tracking-tighter">{featuredGame.title}</h3>
                <p className="text-stone-600 max-w-lg text-lg font-medium leading-relaxed">{featuredGame.description}</p>
                <div className="flex gap-12 pt-4">
                   {Object.entries(featuredGame.progress || {}).map(([key, val]: [string, any]) => (
                     <div key={key} className="space-y-3">
                        <p className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-400">{key}</p>
                        <p className="text-2xl text-warm-text">{val}%</p>
                     </div>
                   ))}
                </div>
              </div>
            </motion.div>
          )}

          <div className="md:col-span-4 glass-warm rounded-[4rem] border border-stone-200/50 p-12 flex flex-col justify-between group bg-stone-50/30">
             <div className="space-y-8">
                <Sparkles size={48} className="text-primary/30" />
                <h3 className="text-4xl font-black text-warm-text leading-tight">SMALL MOUNTAIN</h3>
                <p className="text-stone-500 font-medium leading-relaxed text-lg">We find our best ideas when the sky turns blue and the mountain goes quiet.</p>
             </div>
             <div className="space-y-4">
                <div className="h-px w-full bg-stone-200" />
                <p className="text-[10px] text-stone-400 uppercase font-black tracking-widest">Indie Heart</p>
             </div>
          </div>
        </div>
      </section>

      {/* Feedback Section */}
      <section className="max-w-4xl mx-auto px-8 text-center space-y-16 pb-40">
        <div className="space-y-4">
          <h2 className="text-6xl font-black text-warm-text">{t('feedback')}</h2>
          <p className="text-stone-500 text-xl font-medium">Have something to say? We're listening.</p>
        </div>

        <form onSubmit={handleFeedback} className="glass-warm p-16 rounded-[4rem] border border-stone-200/50 space-y-8 text-left shadow-lg">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-2">Name</label>
                 <input 
                    className="w-full bg-stone-100/50 border border-stone-200 rounded-3xl px-8 py-5 focus:ring-2 focus:ring-primary/10 outline-none transition-all font-medium"
                    placeholder="Your name"
                    value={feedback.name}
                    onChange={(e) => setFeedback({...feedback, name: e.target.value})}
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
                    onChange={(e) => setFeedback({...feedback, email: e.target.value})}
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
                 onChange={(e) => setFeedback({...feedback, message: e.target.value})}
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
      </section>
    </div>
  );
}
