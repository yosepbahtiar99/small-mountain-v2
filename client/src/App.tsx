import { useState } from 'react';
import { Gamepad2, Info, MessageSquare, ShoppingBag, Send } from 'lucide-react';

function App() {
  const [feedback, setFeedback] = useState('');

  return (
    <div className="min-h-screen w-full max-w-7xl mx-auto p-4 md:p-8 space-y-8">
      {/* Header / Studio Display */}
      <header className="glass p-8 rounded-3xl flex flex-col md:flex-row items-center gap-8 animate-in fade-in slide-in-from-top-4 duration-1000">
        <div className="w-32 h-32 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
          <Gamepad2 size={64} className="text-white" />
        </div>
        <div className="text-center md:text-left">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Dika Studio
          </h1>
          <p className="text-slate-400 mt-2 max-w-xl">
            Creating immersive visual stories and simple interactive experiences. 
            Currently crafting a heart-touching Visual Novel.
          </p>
        </div>
      </header>

      {/* Bento Grid Features */}
      <div className="bento-grid">
        {/* Featured Game - WIP */}
        <div className="glass p-6 rounded-3xl col-span-4 md:col-span-2 row-span-2 group hover:scale-[1.01] transition-transform">
          <div className="flex justify-between items-start mb-4">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              Under Development
            </span>
            <Info size={20} className="text-slate-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Project: Echoes of Memory</h2>
          <p className="text-slate-400 mb-6">
            A visual novel about a photographer who discovers they can see memories trapped in old polaroids. 
            (Status: Scriptwriting stage)
          </p>
          <div className="aspect-video bg-slate-800 rounded-2xl flex items-center justify-center border border-white/5 overflow-hidden">
            <span className="text-slate-500">Preview Image Placeholder</span>
          </div>
        </div>

        {/* Released Games List */}
        <div className="glass p-6 rounded-3xl col-span-4 md:col-span-2">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <Gamepad2 size={24} className="text-secondary" />
            Released Games
          </h3>
          <ul className="space-y-4">
            <li className="flex items-center justify-between p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors">
              <div>
                <p className="font-semibold">Midnight Tea</p>
                <p className="text-xs text-slate-500">Short VN - 2024</p>
              </div>
              <button className="text-sm bg-white/10 px-4 py-2 rounded-lg hover:bg-white/20">Play</button>
            </li>
          </ul>
        </div>

        {/* Merch Display */}
        <div className="glass p-6 rounded-3xl col-span-4 md:col-span-2">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <ShoppingBag size={24} className="text-orange-400" />
            Merch Store
          </h3>
          <div className="flex gap-4">
            <div className="flex-1 p-3 bg-white/5 rounded-xl text-center border border-white/5">
              <div className="aspect-square bg-slate-800 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-[10px]">T-Shirt</span>
              </div>
              <p className="text-xs font-medium">Studio Tee</p>
              <p className="text-[10px] text-orange-400">Rp 120k</p>
            </div>
            <div className="flex-1 p-3 bg-white/5 rounded-xl text-center border border-white/5">
              <div className="aspect-square bg-slate-800 rounded-lg mb-2 flex items-center justify-center">
                <span className="text-[10px]">Sticker Pack</span>
              </div>
              <p className="text-xs font-medium">Character Pack</p>
              <p className="text-[10px] text-orange-400">Rp 25k</p>
            </div>
          </div>
          <button className="w-full mt-4 text-xs bg-orange-500/20 text-orange-400 py-2 rounded-lg hover:bg-orange-500/30 transition-colors">
            Visit Shopee Store
          </button>
        </div>

        {/* Feedback Section */}
        <div className="glass p-6 rounded-3xl col-span-4">
          <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
            <MessageSquare size={24} className="text-emerald-400" />
            Leave Feedback
          </h3>
          <div className="flex gap-4">
            <input 
              type="text" 
              placeholder="What do you think about our games?" 
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
            />
            <button className="bg-primary hover:bg-primary/80 text-white p-4 rounded-xl transition-all flex items-center justify-center">
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center text-slate-500 text-sm py-8">
        © 2026 Dika Studio. Built with React & Scalable Architecture.
      </footer>
    </div>
  );
}

export default App;
