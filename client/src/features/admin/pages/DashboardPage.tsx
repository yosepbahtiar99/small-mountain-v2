import { useState } from 'react';
import { Gamepad2, FileText, MessageSquare, ShoppingBag, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuthStore } from '../../../shared/store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
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
    <div className="min-h-screen flex bg-[#0f172a]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 bg-white/2 p-6 hidden md:flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-primary">Studio Admin</h2>
        
        <nav className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === tab.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-white/5'
              }`}
            >
              <tab.icon size={20} />
              {tab.name}
            </button>
          ))}
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all mt-auto"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold capitalize">{activeTab}</h1>
          <div className="md:hidden">
             {/* Mobile menu toggle could go here */}
          </div>
        </header>

        <div className="glass p-8 rounded-3xl min-h-[500px]">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm">Total Games</p>
                <p className="text-3xl font-bold mt-1">0</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm">New Feedback</p>
                <p className="text-3xl font-bold mt-1 text-emerald-400">0</p>
              </div>
              <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                <p className="text-slate-400 text-sm">Active Devlogs</p>
                <p className="text-3xl font-bold mt-1">0</p>
              </div>
            </div>
          )}

          {activeTab === 'games' && <GameManager />}
          
          {['blogs', 'feedback', 'merch'].includes(activeTab) && (
            <div className="text-center py-20 text-slate-500">
              <p>Module for {activeTab} is being integrated...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
