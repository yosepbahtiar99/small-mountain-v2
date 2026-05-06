import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { ShoppingBag, ExternalLink, Coffee } from 'lucide-react';
import api from '../../../shared/lib/axios';
import Pagination from '../../../shared/components/Pagination';

const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');

export default function MerchPage() {
  const { t } = useTranslation();
  const [merch, setMerch] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Fits 4-column grid perfectly (2 full rows)

  useEffect(() => {
    const fetchMerch = async () => {
      try {
        const res = await api.get('/api/merch');
        setMerch(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMerch();
  }, []);

  // Client-side pagination
  const totalPages = Math.ceil(merch.length / itemsPerPage);
  const currentData = merch.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto px-8 space-y-24 pb-40">
      <header className="space-y-6">
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-primary">
           <div className="h-px w-12 bg-primary/30" />
           The Shop
        </div>
        <h1 className="text-7xl md:text-8xl font-black text-warm-text leading-none tracking-tighter">{t('merch_store')}</h1>
        <p className="text-stone-500 max-w-lg text-xl font-medium leading-relaxed">Little pieces of our mountain for your home. Crafted with love and coffee.</p>
      </header>

      <div className="space-y-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {currentData.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="group glass-warm p-8 rounded-[4rem] border border-stone-200/50 flex flex-col hover:shadow-2xl transition-all duration-500"
            >
              <div className="aspect-square bg-stone-100 rounded-[2.5rem] overflow-hidden mb-8 relative">
                 {item.thumbnail ? (
                   <img src={`${BASE_URL}/${item.thumbnail}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[10%] group-hover:grayscale-0" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-stone-200">
                      <ShoppingBag size={48} />
                   </div>
                 )}
                 <div className="absolute inset-0 bg-warm-bg/5 group-hover:bg-transparent transition-all" />
                 <div className="absolute top-4 right-4 bg-warm-bg/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                    <Coffee size={16} className="text-primary" />
                 </div>
              </div>
              
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                 <div className="space-y-2">
                    <h3 className="text-2xl font-black text-warm-text group-hover:text-primary transition-colors leading-tight line-clamp-2">{item.name}</h3>
                    <p className="text-primary font-black text-xl">Rp {item.price.toLocaleString()}</p>
                 </div>
                 
                 <a 
                   href={item.shopeeLink} 
                   target="_blank" 
                   rel="noreferrer"
                   className="w-full bg-warm-text text-warm-bg font-black text-[10px] uppercase tracking-widest py-4 rounded-full flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-xl shadow-warm-text/5 cursor-pointer"
                 >
                   {t('visit_store')} <ExternalLink size={14} />
                 </a>
              </div>
            </motion.div>
          ))}
          
          {merch.length === 0 && (
            <div className="col-span-full py-40 text-center space-y-6">
               <ShoppingBag size={64} className="mx-auto text-stone-200" />
               <p className="text-stone-400 font-bold uppercase tracking-[0.3em] text-xs">The shelves are empty... check back later.</p>
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
