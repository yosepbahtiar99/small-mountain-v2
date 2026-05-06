import { Gamepad2, FileText, MessageSquare, ShoppingBag, LogOut, LayoutDashboard, Mountain, ChevronRight } from 'lucide-react';
import { useAuthStore } from '../../../shared/store/useAuthStore';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import GameManager from '../components/GameManager';
import BlogManager from '../components/BlogManager';
import FeedbackManager from '../components/FeedbackManager';
import MerchManager from '../components/MerchManager';

export default function DashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  const setActiveTab = (tabId: string) => {
    setSearchParams({ tab: tabId });
  };

  const logout = useAuthStore(state => state.logout);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutDashboard },
    { id: 'games', name: 'Games', icon: Gamepad2 },
    { id: 'blogs', name: 'Devlogs', icon: FileText },
    { id: 'feedback', name: 'Feedback', icon: MessageSquare },
    { id: 'merch', name: 'Merch', icon: ShoppingBag },
  ];

  return (
    <div className="h-screen flex overflow-hidden bg-warm-bg text-warm-text font-sans">
      <div className="grain-overlay" />
      
      {/* Sidebar */}
      <aside className="w-80 border-r border-stone-200 bg-white/30 backdrop-blur-xl p-10 hidden md:flex flex-col relative z-20 h-full">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/10">
            <Mountain size={20} className="text-primary" />
          </div>
          <h2 className="text-xl font-black tracking-tight text-warm-text">Studio Admin</h2>
        </div>
        
        <nav className="flex-1 space-y-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                  : 'text-stone-400 hover:bg-stone-100 hover:text-warm-text'
              }`}
            >
              <div className="flex items-center gap-4">
                <tab.icon size={20} />
                <span className="font-bold text-sm tracking-tight">{tab.name}</span>
              </div>
              <ChevronRight size={14} className={`transition-transform ${activeTab === tab.id ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-10 border-t border-stone-200">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-red-500 font-bold text-sm hover:bg-red-50 rounded-2xl transition-all group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
              <LogOut size={16} />
            </div>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-12 overflow-y-auto relative z-10 h-full">
        <header className="flex justify-between items-center mb-16">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-primary">
               Admin <ChevronRight size={10} /> {activeTab}
            </div>
            <h1 className="text-5xl font-black tracking-tight text-warm-text capitalize">{activeTab}</h1>
          </div>
          
          <div className="flex items-center gap-6">
             <div className="text-right hidden sm:block">
                <p className="text-xs font-black text-warm-text uppercase tracking-widest">Master Admin</p>
                <p className="text-[10px] text-stone-400 font-bold uppercase tracking-widest">Altitude 8,848M</p>
             </div>
             <div className="w-12 h-12 rounded-2xl bg-stone-200 border border-stone-300" />
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-warm p-12 rounded-[3.5rem] min-h-[600px] border border-stone-200/50 shadow-sm"
          >
            {activeTab === 'overview' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="bg-white/50 p-10 rounded-[2.5rem] border border-stone-200/50 shadow-inner group hover:shadow-xl transition-all duration-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6">Total Games</p>
                    <div className="flex items-end justify-between">
                       <p className="text-6xl font-black text-warm-text leading-none">0</p>
                       <Gamepad2 className="text-primary/10" size={48} />
                    </div>
                  </div>
                  <div className="bg-white/50 p-10 rounded-[2.5rem] border border-stone-200/50 shadow-inner group hover:shadow-xl transition-all duration-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6">New Feedback</p>
                    <div className="flex items-end justify-between">
                       <p className="text-6xl font-black text-emerald-600 leading-none">0</p>
                       <MessageSquare className="text-emerald-100" size={48} />
                    </div>
                  </div>
                  <div className="bg-white/50 p-10 rounded-[2.5rem] border border-stone-200/50 shadow-inner group hover:shadow-xl transition-all duration-500">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 mb-6">Active Devlogs</p>
                    <div className="flex items-end justify-between">
                       <p className="text-6xl font-black text-warm-text leading-none">0</p>
                       <FileText className="text-primary/10" size={48} />
                    </div>
                  </div>
                </div>

                <div className="bg-primary/5 rounded-[3rem] p-12 border border-primary/10 flex flex-col md:flex-row items-center gap-10">
                   <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg">
                      <Mountain size={40} className="text-primary" />
                   </div>
                   <div className="flex-1 space-y-2 text-center md:text-left">
                      <h3 className="text-2xl font-black text-warm-text tracking-tight">Ready to build something new?</h3>
                      <p className="text-stone-500 font-medium">Keep crafting those quiet stories. The mountain is waiting.</p>
                   </div>
                   <button 
                    onClick={() => setActiveTab('blogs')}
                    className="bg-primary text-white px-10 py-5 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20"
                   >
                      WRITE DEVLOG
                   </button>
                </div>
              </div>
            )}

            {activeTab === 'games' && <GameManager />}
            {activeTab === 'blogs' && <BlogManager />}
            {activeTab === 'feedback' && <FeedbackManager />}
            {activeTab === 'merch' && <MerchManager />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
