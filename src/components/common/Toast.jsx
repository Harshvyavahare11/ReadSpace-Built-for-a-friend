import React from 'react';
import { CheckCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isInfo = toast.type === 'info';

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 transition-all duration-300 animate-bounce-short">
      {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
      {isInfo && <Info className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />}
      {!isSuccess && !isInfo && <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />}
      
      <span className="text-sm font-medium pr-2">{toast.message}</span>
    </div>
  );
};
