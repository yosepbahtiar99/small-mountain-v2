import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Gamepad2, ChevronRight, Play } from 'lucide-react';
import api from '../../../shared/lib/axios';
import Pagination from '../../../shared/components/Pagination';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/api$/, '');

export default function GamesPage() {
  const { t } = useTranslation();
  const [games, setGames] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // Fits 3-column grid perfectly

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await api.get('/api/games');
        setGames(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchGames();
  }, []);

  // Client-side pagination
  const totalPages = Math.ceil(games.length / itemsPerPage);
  const currentData = games.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-24 pb-40">
      <header className="space-y-6">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
           <div className="h-px w-12 bg-primary/30" />
           The Collection
        </div>
        <h1 className="text-5xl sm:text-7xl md:text-8xl font-black text-warm-text leading-none tracking-tighter">Library</h1>
        <p className="text-stone-500 max-w-lg text-xl font-medium leading-relaxed">Every world we've built, every story we've told. All in one quiet place.</p>
      </header>

      <div className="space-y-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {currentData.map((game, i) => (
            <motion.div 
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group glass-warm rounded-[2.5rem] md:rounded-[3.5rem] border border-stone-200/50 overflow-hidden flex flex-col hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-[16/11] bg-stone-100 relative overflow-hidden">
                 {game.thumbnail && (
                   <img 
                     src={`${BASE_URL}/${game.thumbnail}`} 
                     className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 grayscale-[20%] group-hover:grayscale-0" 
                   />
                 )}
                 <div className="absolute inset-0 bg-warm-bg/10 group-hover:bg-transparent transition-all" />
                 <div className="absolute top-6 left-6">
                    <span className="px-5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest bg-warm-text text-warm-bg shadow-lg">
                      {game.status}
                    </span>
                 </div>
              </div>
              
              <div className="p-6 md:p-10 flex-1 flex flex-col justify-between space-y-8">
                 <div className="space-y-4">
                    <h3 className="text-2xl md:text-3xl font-black text-warm-text group-hover:text-primary transition-colors leading-tight line-clamp-2">{game.title}</h3>
                    <p className="text-stone-500 text-base font-medium line-clamp-3 leading-relaxed">{game.description}</p>
                 </div>
                 
                 <div className="flex items-center justify-between pt-6 border-t border-stone-100">
                    {game.playLink ? (
                      <a 
                        href={game.playLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="bg-primary text-warm-bg px-8 py-3 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-warm-text transition-all shadow-lg shadow-primary/10 cursor-pointer"
                      >
                        <Play size={12} fill="currentColor" /> {t('play_now')}
                      </a>
                    ) : (
                      <div className="text-[10px] text-stone-400 uppercase font-black tracking-widest italic">
                         Slowly Crafting...
                      </div>
                    )}
                    <button className="w-12 h-12 rounded-full border border-stone-200 flex items-center justify-center text-stone-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
                      <ChevronRight size={20} />
                    </button>
                 </div>
              </div>
            </motion.div>
          ))}
          
          {games.length === 0 && (
            <div className="col-span-full py-40 text-center space-y-6">
               <Gamepad2 size={64} className="mx-auto text-stone-200" />
               <p className="text-stone-400 font-bold uppercase tracking-[0.3em] text-xs">No entries found in the journal...</p>
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
