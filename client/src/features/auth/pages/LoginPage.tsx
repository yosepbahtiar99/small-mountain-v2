import { useState } from 'react';
import { useAuthStore } from '../../../shared/store/useAuthStore';
import api from '../../../shared/lib/axios';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Loader2, Mountain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', { username, password });
      login(response.data.data);
      navigate('/admin');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="grain-overlay" />
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[60%] h-[50%] bg-primary/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-stone-200/40 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-warm max-w-md w-full p-12 rounded-[3.5rem] space-y-10 relative z-10 border border-white/50 shadow-2xl shadow-primary/5"
      >
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-primary/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 border border-primary/10">
            <Mountain className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl font-black text-warm-text tracking-tight">Admin Portal</h1>
          <p className="text-stone-500 font-medium text-sm">Quietly managing the peaks.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-50 border border-red-100 text-red-500 p-4 rounded-2xl text-xs font-bold text-center uppercase tracking-widest"
            >
              {error}
            </motion.div>
          )}

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-2">Username</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input
                type="text"
                required
                className="w-full bg-stone-50/50 border border-stone-200 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-medium"
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-400 ml-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-stone-300" size={18} />
              <input
                type="password"
                required
                className="w-full bg-stone-50/50 border border-stone-200 rounded-2xl py-4 pl-14 pr-6 focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-warm-text hover:bg-primary text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-primary/10 flex items-center justify-center gap-3 text-xs uppercase tracking-[0.2em]"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Enter Cabin'}
          </button>
        </form>

        <div className="text-center pt-4">
           <Link to="/" className="text-[10px] font-black uppercase tracking-widest text-stone-300 hover:text-primary transition-colors">
              Return to Peak
           </Link>
        </div>
      </motion.div>
    </div>
  );
}
