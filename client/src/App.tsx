import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Info, MessageSquare, ShoppingBag, Send, Globe, ChevronRight } from 'lucide-react';
import api from './shared/lib/axios';

const BASE_URL = 'http://localhost:5000';

function App() {
  const { t, i18n } = useTranslation();
  const [games, setGames] = useState<any[]>([]);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [merch, setMerch] = useState<any[]>([]);
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gamesRes, blogsRes, merchRes] = await Promise.all([
          api.get('/api/games'),
          api.get('/api/blogs'),
          api.get('/api/merch')
        ]);
        setGames(gamesRes.data.data);
        setBlogs(blogsRes.data.data);
        setMerch(merchRes.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'en' ? 'id' : 'en');
  };

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

  const featuredGame = games.find(g => g.status === 'Development') || games[0];
  const releasedGames = games.filter(g => g.status === 'Released');

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8 pb-20">
      {/* Nav / Lang Toggle */}
      <nav className="flex justify-end">
        <button 
          onClick={toggleLanguage}
          className="glass px-4 py-2 rounded-full flex items-center gap-2 text-xs font-bold hover:bg-white/10 transition-all uppercase tracking-widest"
        >
          <Globe size={14} />
          {i18n.language}
        </button>
      </nav>

      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass p-10 rounded-[2.5rem] flex flex-col md:flex-row items-center gap-10 border-white/10 shadow-2xl shadow-primary/10"
      >
        <div className="w-40 h-40 bg-gradient-to-br from-primary to-secondary rounded-[2rem] flex items-center justify-center shadow-2xl shadow-primary/30 rotate-3 hover:rotate-0 transition-transform duration-500">
          <Gamepad2 size={80} className="text-white" />
        </div>
        <div className="text-center md:text-left space-y-4">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white">
            {t('studio_name')}
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
            {t('studio_tagline')}
          </p>
        </div>
      </motion.header>

      {/* Main Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-min">
        
        {/* Featured Game */}
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="glass p-8 rounded-[2rem] md:col-span-8 flex flex-col justify-between overflow-hidden relative group min-h-[400px]"
        >
          {featuredGame && (
            <>
              <div className="absolute inset-0 opacity-20 group-hover:opacity-30 transition-opacity">
                 {featuredGame.thumbnail && <img src={`${BASE_URL}/${featuredGame.thumbnail}`} className="w-full h-full object-cover blur-sm" />}
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex justify-between items-start">
                  <span className="bg-primary/20 text-primary px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/30">
                    {t('under_development')}
                  </span>
                  <div className="flex gap-1">
                    {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary/40" />)}
                  </div>
                </div>
                <h2 className="text-4xl font-black text-white">{featuredGame.title}</h2>
                <p className="text-slate-300 line-clamp-3 text-lg leading-relaxed">{featuredGame.description}</p>
                
                {/* Progress Bars */}
                <div className="grid grid-cols-2 gap-6 mt-8">
                  {Object.entries(featuredGame.progress || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest text-slate-500">
                        <span>{key}</span>
                        <span>{value}%</span>
                      </div>
                      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${value}%` }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-primary to-secondary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </motion.div>

        {/* Released Games */}
        <div className="glass p-8 rounded-[2rem] md:col-span-4 space-y-6 flex flex-col">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Gamepad2 className="text-secondary" />
            {t('released_games')}
          </h3>
          <div className="space-y-4 flex-1">
            {releasedGames.map((game) => (
              <div key={game.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white group-hover:text-primary transition-colors">{game.title}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mt-1">Short VN • 2024</p>
                  </div>
                  <ChevronRight size={18} className="text-slate-600 group-hover:text-white transition-all group-hover:translate-x-1" />
                </div>
              </div>
            ))}
            {releasedGames.length === 0 && <p className="text-slate-600 text-sm py-10 text-center italic">No games released yet.</p>}
          </div>
        </div>

        {/* Devlogs / Blogs */}
        <div className="glass p-8 rounded-[2rem] md:col-span-6 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <Info className="text-blue-400" />
            {t('devlogs')}
          </h3>
          <div className="grid gap-4">
            {blogs.slice(0, 3).map((blog) => (
              <div key={blog.id} className="group p-4 bg-white/5 rounded-2xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer">
                <p className="text-[10px] text-primary font-bold uppercase tracking-widest mb-1">{blog.category}</p>
                <h4 className="font-bold text-lg mb-2">{blog.title}</h4>
                <div className="flex items-center text-xs text-slate-500 gap-2">
                   <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                   <span className="w-1 h-1 rounded-full bg-slate-700" />
                   <span className="group-hover:text-primary transition-colors flex items-center gap-1">
                     {t('read_more')} <ChevronRight size={12} />
                   </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Merch Store */}
        <div className="glass p-8 rounded-[2rem] md:col-span-6 space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <ShoppingBag className="text-orange-400" />
            {t('merch_store')}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {merch.map((item) => (
              <div key={item.id} className="bg-white/5 p-4 rounded-2xl border border-white/5 text-center group hover:scale-105 transition-all">
                <div className="aspect-square bg-slate-800 rounded-xl mb-3 overflow-hidden">
                   {item.thumbnail ? (
                     <img src={`${BASE_URL}/${item.thumbnail}`} className="w-full h-full object-cover" />
                   ) : (
                     <div className="w-full h-full flex items-center justify-center text-slate-700"><ShoppingBag size={40} /></div>
                   )}
                </div>
                <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                <p className="text-orange-400 text-xs font-bold mt-1">Rp {item.price.toLocaleString()}</p>
              </div>
            ))}
            {merch.length === 0 && <p className="col-span-2 text-slate-600 text-sm py-10 text-center italic">Merch coming soon.</p>}
          </div>
          <button className="w-full bg-orange-500/10 text-orange-400 font-bold py-4 rounded-2xl hover:bg-orange-500/20 transition-all border border-orange-500/10">
            {t('visit_store')}
          </button>
        </div>

        {/* Feedback Section */}
        <div className="glass p-10 rounded-[2.5rem] md:col-span-12 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-3xl font-black flex items-center justify-center gap-3">
              <MessageSquare className="text-emerald-400" />
              {t('feedback')}
            </h3>
            <p className="text-slate-400">Your thoughts help us create better experiences.</p>
          </div>
          
          <form onSubmit={handleFeedback} className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <input 
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Name"
              value={feedback.name}
              onChange={(e) => setFeedback({...feedback, name: e.target.value})}
              required
            />
            <input 
              className="bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder="Email"
              type="email"
              value={feedback.email}
              onChange={(e) => setFeedback({...feedback, email: e.target.value})}
              required
            />
            <textarea 
              className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 h-32 focus:ring-2 focus:ring-primary/50 outline-none"
              placeholder={t('feedback_placeholder')}
              value={feedback.message}
              onChange={(e) => setFeedback({...feedback, message: e.target.value})}
              required
            />
            <div className="md:col-span-2 flex justify-center pt-4">
              <AnimatePresence mode="wait">
                {isSent ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-emerald-500 text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-2"
                  >
                    Sent Successfully!
                  </motion.div>
                ) : (
                  <button 
                    type="submit"
                    className="bg-primary hover:bg-primary/80 text-white px-12 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all shadow-xl shadow-primary/20"
                  >
                    <Send size={20} />
                    {t('send')}
                  </button>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>

      <footer className="text-center py-10 border-t border-white/5">
        <p className="text-slate-500 text-sm font-medium tracking-widest uppercase">
          © 2026 {t('studio_name')}. Built with Antigravity Architecture.
        </p>
      </footer>
    </div>
  );
}

export default App;
