import React from 'react';
import { 
  LayoutDashboard, 
  Library, 
  TrendingUp, 
  Target, 
  Quote, 
  BookMarked, 
  Compass, 
  Settings, 
  X, 
  PlusCircle,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { activeTab, setActiveTab, setIsAddBookOpen, books } = useApp();

  const currentlyReadingCount = books.filter(b => b.status === 'Currently Reading').length;
  const wantToReadCount = books.filter(b => b.status === 'Want to Read').length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'library', label: 'My Library', icon: Library, badge: books.length },
    { id: 'tracker', label: 'Reading Tracker', icon: TrendingUp, badge: currentlyReadingCount },
    { id: 'goals', label: 'Reading Goals', icon: Target },
    { id: 'notes', label: 'Notes & Quotes', icon: Quote },
    { id: 'physical', label: 'Physical Book Mode', icon: BookMarked },
    { id: 'discover', label: 'Discover Books', icon: Compass },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleSelectTab = (id) => {
    setActiveTab(id);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full justify-between p-4">
      <div className="space-y-6">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between pb-4 border-b border-stone-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <span className="font-display font-bold text-lg text-slate-900 dark:text-slate-100">ReadSpace</span>
          </div>
          <button onClick={onCloseMobile} className="p-1 rounded-lg text-stone-400 hover:text-stone-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => { setIsAddBookOpen(true); if (onCloseMobile) onCloseMobile(); }}
          className="w-full py-2.5 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <PlusCircle className="w-4 h-4" /> Add Book to Library
        </button>

        {/* Main Navigation links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  isActive
                    ? 'bg-emerald-100/80 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 font-bold border border-emerald-200/80 dark:border-emerald-800/60 shadow-2xs'
                    : 'text-stone-600 dark:text-slate-400 hover:bg-stone-200/50 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-700 dark:text-emerald-400' : 'text-stone-400 dark:text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-emerald-800 text-white' : 'bg-stone-200 dark:bg-slate-800 text-stone-600 dark:text-slate-400'}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Library Summary Footer Card */}
      <div className="p-3.5 rounded-2xl bg-stone-200/50 dark:bg-slate-800/50 border border-stone-200 dark:border-slate-800/80 text-xs">
        <div className="font-semibold text-slate-800 dark:text-slate-200 mb-1">Personal Shelf</div>
        <div className="flex justify-between text-stone-500 dark:text-slate-400 text-[11px] mb-2">
          <span>Reading: {currentlyReadingCount}</span>
          <span>Wishlist: {wantToReadCount}</span>
        </div>
        <div className="w-full bg-stone-300 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div 
            className="bg-emerald-600 h-full rounded-full" 
            style={{ width: `${books.length > 0 ? (currentlyReadingCount / books.length) * 100 : 0}%` }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:block w-64 shrink-0 border-r border-stone-200/80 dark:border-slate-800 min-h-[calc(100vh-4rem)] bg-stone-50/50 dark:bg-slate-900/50">
        {navContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onCloseMobile} />
          <div className="relative w-72 bg-white dark:bg-slate-900 h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};
