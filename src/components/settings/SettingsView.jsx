import React, { useState } from 'react';
import { 
  Settings, 
  User, 
  Moon, 
  Sun, 
  RotateCcw, 
  Download, 
  Upload, 
  Save, 
  CheckCircle,
  Shield,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView = () => {
  const { profile, updateProfile, theme, toggleTheme, resetData, books, readingLogs, showToast } = useApp();

  const [profileForm, setProfileForm] = useState({
    name: profile.name,
    email: profile.email,
    bio: profile.bio,
    avatarUrl: profile.avatarUrl,
    dailyPageGoal: profile.dailyPageGoal || 30,
    annualBookGoal: profile.annualBookGoal || 20
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfile(profileForm);
  };

  const handleExportData = () => {
    const data = {
      profile,
      books,
      readingLogs,
      exportedAt: new Date().toISOString()
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `readspace_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    showToast('Exported ReadSpace library backup!', 'success');
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
          Account & App Settings
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1">
          Customize your reader profile, appearance preferences, and local data backups.
        </p>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <User className="w-5 h-5 text-emerald-700" /> Reader Profile
        </h3>

        <div className="flex flex-col sm:flex-row items-center gap-6 pb-4 border-b border-stone-100 dark:border-slate-800">
          <img src={profileForm.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-2 border-emerald-700 shadow-md" />
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={profileForm.avatarUrl}
              onChange={(e) => setProfileForm({ ...profileForm, avatarUrl: e.target.value })}
              className="w-full px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Display Name</label>
            <input
              type="text"
              value={profileForm.name}
              onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Email Address</label>
            <input
              type="email"
              value={profileForm.email}
              onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Bio / Reader Statement</label>
          <textarea
            rows="2"
            value={profileForm.bio}
            onChange={(e) => setProfileForm({ ...profileForm, bio: e.target.value })}
            className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-sm transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" /> Update Profile Settings
          </button>
        </div>
      </form>

      {/* Theme Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
            {theme === 'light' ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-indigo-400" />}
            Color Aesthetic Mode
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Current mode: <strong className="capitalize">{theme}</strong> (Warm Off-White Library vs Deep Dark Aesthetic)
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="px-4 py-2.5 rounded-xl bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
        >
          Switch to {theme === 'light' ? 'Dark Mode 🌙' : 'Warm Light Mode ☀️'}
        </button>
      </div>

      {/* Data Backup & Reset Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Shield className="w-5 h-5 text-emerald-700" /> LocalStorage Data Control
        </h3>
        <p className="text-xs text-stone-500">
          All your reading progress, notes, and goals are persisted locally in your browser’s LocalStorage.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={handleExportData}
            className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Export Data Backup (JSON)
          </button>

          <button
            onClick={resetData}
            className="px-4 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50 font-semibold text-xs hover:bg-rose-100 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" /> Reset to Sample Data
          </button>
        </div>
      </div>
    </div>
  );
};
