import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe, Gamepad2, FileText, ShoppingBag, Home, Mountain } from 'lucide-react';

export default function MainLayout() {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  const toggleLanguage = () => {
    const newLng = i18n.language === 'en' ? 'id' : 'en';
    i18n.changeLanguage(newLng);
    localStorage.setItem('lng', newLng);
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: Home },
    { path: '/games', name: t('released_games'), icon: Gamepad2 },
    { path: '/devlogs', name: t('devlogs'), icon: FileText },
    { path: '/merch', name: t('merch_store'), icon: ShoppingBag },
  ];

  return (
    <div className="min-h-screen bg-warm-bg text-warm-text font-sans selection:bg-primary/10">
      {/* Grain Effect */}
      <div className="grain-overlay" />
      
      {/* Twilight Mist */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-stone-200/40 blur-[120px] rounded-full" />
      </div>

      {/* Floating Navbar */}
      <nav className="fixed top-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-fit px-4">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-warm px-2 py-2 rounded-full border border-stone-200/50 flex items-center gap-1 md:gap-4 shadow-xl backdrop-blur-xl"
        >
          <Link to="/" className="text-primary font-black text-xl tracking-tighter ml-4 mr-2 hidden md:block"><Mountain size={16} /></Link>
          
          <div className="flex items-center gap-1 md:gap-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
                  location.pathname === link.path ? 'text-primary' : 'text-stone-500 hover:text-warm-text'
                }`}
              >
                {location.pathname === link.path && (
                  <motion.div 
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-primary/5 rounded-full border border-primary/10"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <link.icon size={14} />
                <span className="hidden sm:inline">{link.name}</span>
              </Link>
            ))}
          </div>

          <div className="h-4 w-px bg-stone-200 mx-2 hidden md:block" />

          <button 
            onClick={toggleLanguage}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 transition-all text-stone-500 hover:text-warm-text mr-1"
            title="Toggle Language"
          >
            <Globe size={18} />
          </button>
        </motion.div>
      </nav>

      <main className="pt-36 pb-20 relative z-10">
        <Outlet />
      </main>

      <footer className="py-24 border-t border-stone-200 relative z-10 text-center bg-stone-50/50">
        <div className="max-w-7xl mx-auto px-8">
           <div className="flex justify-center mb-6">
              <Mountain size={40} className="text-primary/10" />
           </div>
           <h2 className="text-3xl font-black text-warm-text mb-2 tracking-tight">Small Mountain<sup className="text-[0.5em] ml-0.5 relative -top-[1em] opacity-80 font-bold">™</sup></h2>
           <p className="text-stone-500 text-sm max-w-sm mx-auto mb-10 font-medium leading-relaxed">
             Twilight stories from the highest peaks.
           </p>
           <div className="flex justify-center gap-12 mb-16">
              <div className="text-stone-400 hover:text-primary font-black text-[10px] tracking-widest cursor-pointer transition-all">INSTAGRAM</div>
              <div className="text-stone-400 hover:text-primary font-black text-[10px] tracking-widest cursor-pointer transition-all">TWITTER</div>
              <div className="text-stone-400 hover:text-primary font-black text-[10px] tracking-widest cursor-pointer transition-all">YOUTUBE</div>
           </div>
           <p className="text-[10px] text-stone-300 uppercase tracking-[0.4em] font-bold">
             © 2026 {t('studio_name')}. BEYOND THE SUMMIT.
           </p>
        </div>
      </footer>
    </div>
  );
}
