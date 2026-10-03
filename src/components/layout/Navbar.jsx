import React from 'react';
import { BookOpen, Flame, Sun, Moon, Plus, Target, Menu, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Navbar = ({ onOpenMobileMenu }) => {
  const { 
    theme, 
    toggleTheme, 
    streakDays, 
    pagesReadToday, 
    profile, 
    setIsQuickLogOpen,
    setIsAddBookOpen,
    setActiveTab
  } = useApp();

  const dailyGoal = profile.dailyPageGoal || 30;
  const goalPercent = Math.min(100, Math.round((pagesReadToday / dailyGoal) * 100));

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-50/90 dark:bg-slate-900/90 border-b border-stone-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenMobileMenu}
            className="md:hidden p-2 rounded-xl text-stone-600 dark:text-slate-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div 
            onClick={() => setActiveTab('dashboard')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-emerald-800 dark:bg-emerald-600 flex items-center justify-center text-white shadow-md shadow-emerald-900/20 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-slate-900 dark:text-slate-100 group-hover:text-emerald-800 dark:group-hover:text-emerald-400 transition-colors">
                ReadSpace
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-emerald-700 dark:text-emerald-400 uppercase ml-2 bg-emerald-100 dark:bg-emerald-950/80 px-1.5 py-0.5 rounded">
                Personal Library
              </span>
            </div>
          </div>
        </div>

        {/* Center: Search / Quick Nav Shortcut */}
        <div className="hidden md:flex items-center gap-2 bg-stone-200/60 dark:bg-slate-800/80 px-3 py-1.5 rounded-full border border-stone-200 dark:border-slate-700 text-stone-500 dark:text-slate-400 text-xs w-64 cursor-pointer hover:border-stone-300 dark:hover:border-slate-600 transition-colors"
          onClick={() => setActiveTab('library')}
        >
          <Search className="w-4 h-4 text-stone-400" />
          <span>Search library or press /...</span>
        </div>

        {/* Right: Stats Badges, Actions, Theme & Profile */}
        <div className="flex items-center gap-3">
          {/* Daily Goal Badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 dark:bg-slate-800/90 border border-stone-200 dark:border-slate-700 text-xs font-medium">
            <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-700 dark:text-slate-300 font-semibold">{pagesReadToday}/{dailyGoal} p.</span>
            <div className="w-12 bg-stone-200 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${goalPercent}%` }}
              />
            </div>
          </div>

          {/* Streak Counter */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-200/70 dark:border-amber-800/50 text-xs font-bold text-amber-800 dark:text-amber-300 shadow-xs">
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakDays}d Streak</span>
          </div>

          {/* Quick Log Button */}
          <button
            onClick={() => setIsQuickLogOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" /> Log Reading
          </button>

          {/* Add Book Icon */}
          <button
            onClick={() => setIsAddBookOpen(true)}
            title="Add New Book"
            className="p-2 rounded-xl text-stone-700 dark:text-slate-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Warm Light Mode'}
            className="p-2 rounded-xl text-stone-700 dark:text-slate-300 hover:bg-stone-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </button>

          {/* User Profile Avatar */}
          <div 
            onClick={() => setActiveTab('settings')}
            className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-emerald-700/30 cursor-pointer hover:scale-105 transition-transform"
          >
            <img 
              src={profile.avatarUrl} 
              alt={profile.name} 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
