import React, { useState } from 'react';
import { 
  Target, 
  Award, 
  Flame, 
  Calendar, 
  CheckCircle, 
  Pencil, 
  Bell, 
  BookOpen, 
  TrendingUp,
  Sparkles 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReadingGoalsView = () => {
  const { 
    profile, 
    updateProfile, 
    totalBooksRead, 
    pagesReadToday, 
    streakDays, 
    readingLogs, 
    books 
  } = useApp();

  const [isEditingGoals, setIsEditingGoals] = useState(false);
  const [dailyGoalInput, setDailyGoalInput] = useState(profile.dailyPageGoal || 30);
  const [annualGoalInput, setAnnualGoalInput] = useState(profile.annualBookGoal || 20);

  const [calcBookId, setCalcBookId] = useState(books[0]?.id || '');
  const [calcTargetDate, setCalcTargetDate] = useState('2026-10-31');

  const selectedCalcBook = books.find(b => b.id === calcBookId) || books[0];

  const annualPercentage = Math.min(100, Math.round((totalBooksRead / (profile.annualBookGoal || 20)) * 100));
  const dailyPercentage = Math.min(100, Math.round((pagesReadToday / (profile.dailyPageGoal || 30)) * 100));

  const handleSaveGoals = (e) => {
    e.preventDefault();
    updateProfile({
      dailyPageGoal: Number(dailyGoalInput),
      annualBookGoal: Number(annualGoalInput)
    });
    setIsEditingGoals(false);
  };

  // Calculator logic
  let calculatedDailyPace = 0;
  let remainingCalcPages = 0;
  if (selectedCalcBook) {
    remainingCalcPages = Math.max(0, selectedCalcBook.totalPages - selectedCalcBook.currentPage);
    const today = new Date();
    const target = new Date(calcTargetDate);
    const diffTime = target - today;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    calculatedDailyPace = Math.ceil(remainingCalcPages / diffDays);
  }

  // Heatmap generation for last 14 days
  const last14Days = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateStr = d.toISOString().split('T')[0];
    const logForDay = readingLogs.filter(l => l.date === dateStr);
    const pages = logForDay.reduce((sum, l) => sum + l.pagesRead, 0);
    return {
      date: dateStr,
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      pages
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            Reading Goals & Pace Planner
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1">
            Establish healthy reading habits, calculate optimal pace, and track yearly milestones.
          </p>
        </div>

        <button
          onClick={() => setIsEditingGoals(!isEditingGoals)}
          className="px-4 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 font-semibold text-xs hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
        >
          <Pencil className="w-3.5 h-3.5" /> {isEditingGoals ? 'Close Editor' : 'Edit Target Goals'}
        </button>
      </div>

      {/* Edit Goals Form Modal / Card */}
      {isEditingGoals && (
        <form onSubmit={handleSaveGoals} className="p-6 rounded-3xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-4 animate-in fade-in">
          <h3 className="font-serif font-bold text-base text-emerald-900 dark:text-emerald-300 flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-700" /> Customize Your Targets
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Daily Page Goal (Pages/Day)
              </label>
              <input
                type="number"
                min="5"
                max="500"
                value={dailyGoalInput}
                onChange={(e) => setDailyGoalInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">
                Annual Book Target (Books/Year)
              </label>
              <input
                type="number"
                min="1"
                max="100"
                value={annualGoalInput}
                onChange={(e) => setAnnualGoalInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingGoals(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-xs font-semibold text-stone-600 dark:text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs"
            >
              Save New Goals
            </button>
          </div>
        </form>
      )}

      {/* Goal Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Annual Book Goal */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-amber-500" />
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">2026 Book Challenge</h3>
                <p className="text-xs text-stone-500">Yearly reading commitment</p>
              </div>
            </div>
            <span className="text-2xl font-bold font-serif text-amber-600 dark:text-amber-400">
              {totalBooksRead} / {profile.annualBookGoal || 20}
            </span>
          </div>

          <div className="w-full bg-stone-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden mb-4">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${annualPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-stone-500">
            <span>{annualPercentage}% Achieved</span>
            <span>{Math.max(0, (profile.annualBookGoal || 20) - totalBooksRead)} books to goal</span>
          </div>
        </div>

        {/* Card 2: Daily Page Target */}
        <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Target className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">Daily Page Target</h3>
                <p className="text-xs text-stone-500">Everyday reading goal</p>
              </div>
            </div>
            <span className="text-2xl font-bold font-serif text-emerald-700 dark:text-emerald-400">
              {pagesReadToday} / {profile.dailyPageGoal || 30} p.
            </span>
          </div>

          <div className="w-full bg-stone-100 dark:bg-slate-800 rounded-full h-4 overflow-hidden mb-4">
            <div 
              className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${dailyPercentage}%` }}
            />
          </div>

          <div className="flex justify-between text-xs text-stone-500">
            <span>{dailyPercentage >= 100 ? '🎉 Daily Goal Completed!' : `${Math.max(0, (profile.dailyPageGoal || 30) - pagesReadToday)} pages remaining today`}</span>
            <span className="flex items-center gap-1 font-bold text-amber-600"><Flame className="w-3.5 h-3.5 fill-amber-500" /> {streakDays}d Streak</span>
          </div>
        </div>

      </div>

      {/* Target Pace Recommendation Calculator */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-700" /> Automatic Pace Recommendation Engine
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Pick a book and set a target finish date. ReadSpace calculates how many pages you must read per day to finish right on schedule!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">
              Select Book to Calculate
            </label>
            <select
              value={calcBookId}
              onChange={(e) => setCalcBookId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
            >
              {books.map(b => (
                <option key={b.id} value={b.id}>
                  {b.title} ({Math.max(0, b.totalPages - b.currentPage)} p. left)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">
              Target Completion Date
            </label>
            <input
              type="date"
              value={calcTargetDate}
              onChange={(e) => setCalcTargetDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
            />
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-col justify-center text-center">
            <span className="text-[11px] font-semibold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">Recommended Pace</span>
            <span className="text-2xl font-bold font-serif text-emerald-900 dark:text-emerald-300">
              {calculatedDailyPace} pages / day
            </span>
          </div>
        </div>
      </div>

      {/* Reading Habit Heatmap (Last 14 Days) */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-2">
          14-Day Reading Habit Consistency
        </h3>
        <p className="text-xs text-stone-500 mb-4">Each bar represents logged reading activity for that day.</p>

        <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
          {last14Days.map((d, i) => {
            const isTargetMet = d.pages >= (profile.dailyPageGoal || 30);
            return (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <div 
                  className={`w-full h-16 rounded-lg transition-all flex items-end justify-center pb-1 text-[10px] font-bold ${
                    d.pages === 0
                      ? 'bg-stone-100 dark:bg-slate-800 text-stone-400'
                      : isTargetMet
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : 'bg-emerald-200 dark:bg-emerald-900 text-emerald-900 dark:text-emerald-200'
                  }`}
                  title={`${d.date}: ${d.pages} pages read`}
                >
                  {d.pages > 0 ? `${d.pages}p` : ''}
                </div>
                <span className="text-[10px] font-semibold text-stone-400">{d.dayName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
