import { useAppStore } from '../store/useAppStore';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, removeNotification } = useAppStore();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="text-emerald-500" size={18} />;
      case 'error':
        return <AlertCircle className="text-rose-500" size={18} />;
      default:
        return <Info className="text-amber-500" size={18} />;
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20';
      case 'error':
        return 'border-rose-500/20';
      default:
        return 'border-amber-500/20';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((notif) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85, transition: { duration: 0.2 } }}
            layout
            className={`pointer-events-auto flex items-start gap-3 p-4 bg-[#1E2522]/90 backdrop-blur-md rounded-2xl border ${getBorderColor(notif.type)} shadow-2xl`}
          >
            <div className="mt-0.5">{getIcon(notif.type)}</div>
            <div className="flex-1 text-xs font-bold uppercase tracking-wider text-[#F3F1EC]/90 leading-relaxed">
              {notif.message}
            </div>
            <button
              onClick={() => removeNotification(notif.id)}
              className="text-[#F3F1EC]/40 hover:text-[#F3F1EC] transition-colors"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
