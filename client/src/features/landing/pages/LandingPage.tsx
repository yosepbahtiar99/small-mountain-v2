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
    <div className="relative -mt-36">
      {/* Hero Section - Full Bleed Dark Indigo */}
      <div className="bg-primary relative overflow-hidden pt-36 pb-36 text-white w-screen left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] isolate">
        {/* Atmospheric mist specific to hero */}
        <div className="absolute top-0 right-0 w-2/3 h-2/3 bg-blue-600/20 blur-[120px] rounded-full -translate-y-1/3 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-indigo-500/10 blur-[100px] rounded-full translate-y-1/3 -translate-x-1/4 pointer-events-none" />
        
        {/* Bottom Linear Gradient Fade to Warm Background */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-b from-transparent to-warm-bg pointer-events-none z-10" />

        <section className="max-w-7xl mx-auto px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10 z-50"
            >
              <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md">
                <Mountain size={14} />
                Mountain Storytelling
              </div>
              <h1 className="text-5xl sm:text-7xl md:text-9xl font-black tracking-tight leading-[0.85] text-white">
                SMALL <br />
                <span className="text-white">Mountain<sup className="text-[0.4em] ml-0.5 relative -top-[1.2em] opacity-80 font-bold">™</sup></span> <br />
              </h1>
              <p className="text-blue-100/70 text-xl max-w-sm leading-relaxed font-medium">
                {t('studio_tagline')}
              </p>
              <div className="flex gap-6 pt-4">
                <Link to="/games" className="bg-white text-primary px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:bg-stone-100 transition-all shadow-2xl shadow-black/10 border border-white/50">
                  EXPLORE PROJECTS
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[4rem] bg-[#FAF7F2] border border-white/10 overflow-hidden shadow-2xl relative group isolation-isolate">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[4rem] z-0">
                  <div className="w-96 h-96 rounded-full bg-primary/10 blur-3xl absolute -top-12 -left-12 animate-pulse" />
                  <img
                    src="/logo.png"
                    id="hero-logo-img"
                    className="w-full h-full object-cover relative z-10 opacity-100 mix-blend-multiply"
                    alt="Small Mountain Emblem"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = document.getElementById('hero-fallback-mountain');
                      if (fallback) fallback.style.display = 'block';
                    }}
                  />
                  <div id="hero-fallback-mountain" className="hidden w-full h-full relative z-10">
                    <Mountain size={420} className="text-primary/10 absolute -bottom-16 -left-20" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      </div>

      {/* Content Wrapper for remaining sections */}
      <div className="space-y-40 mt-24 relative z-20">

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
              <div className="relative p-8 md:p-16 h-full flex flex-col justify-end space-y-8">
                <div className="flex items-center gap-3">
                  <div className="h-px w-10 bg-primary" />
                  <span className="text-primary text-[10px] font-black uppercase tracking-widest">
                    {featuredGame.status}
                  </span>
                </div>
                <h3 className="text-4xl md:text-6xl font-black text-warm-text leading-none tracking-tighter">{featuredGame.title}</h3>
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
              <h3 className="text-4xl font-black text-warm-text leading-tight">SMALL MOUNTAIN<sup className="text-[0.5em] ml-0.5 relative -top-[1em] opacity-80 font-bold">™</sup></h3>
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
    </div>
  );
}
