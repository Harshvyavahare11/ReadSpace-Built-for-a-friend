import React, { useState } from 'react';
import { 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle, 
  Flame, 
  Plus, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ReadingTrackerView = ({ onOpenBookDetails }) => {
  const { 
    books, 
    readingLogs, 
    logProgress, 
    setSelectedBookIdForModal, 
    setIsQuickLogOpen 
  } = useApp();

  const activeBooks = books.filter(b => b.status === 'Currently Reading');
  const [selectedBookId, setSelectedBookId] = useState(activeBooks[0]?.id || books[0]?.id || '');
  const [logPageInput, setLogPageInput] = useState(20);
  const [logDurationInput, setLogDurationInput] = useState(30);

  const currentBook = books.find(b => b.id === selectedBookId) || activeBooks[0] || books[0];

  if (!currentBook) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
        <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-200">No Currently Reading Books</h3>
        <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">Add books to your "Currently Reading" shelf to track page velocity!</p>
      </div>
    );
  }

  const percentage = currentBook.totalPages > 0 
    ? Math.min(100, Math.round((currentBook.currentPage / currentBook.totalPages) * 100)) 
    : 0;

  const remainingPages = Math.max(0, currentBook.totalPages - currentBook.currentPage);

  // Velocity calculations
  const bookLogs = readingLogs.filter(l => l.bookId === currentBook.id);
  const totalLoggedPages = bookLogs.reduce((acc, l) => acc + l.pagesRead, 0);
  const totalLoggedMinutes = bookLogs.reduce((acc, l) => acc + (l.durationMinutes || 0), 0);
  const avgPagesPerSession = bookLogs.length > 0 ? Math.round(totalLoggedPages / bookLogs.length) : 25;
  
  // Pace recommendation to meet target finish date
  let daysToFinish = null;
  let recommendedDailyPages = null;
  if (currentBook.targetFinishDate && remainingPages > 0) {
    const today = new Date();
    const target = new Date(currentBook.targetFinishDate);
    const diffTime = target - today;
    daysToFinish = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    recommendedDailyPages = Math.ceil(remainingPages / daysToFinish);
  }

  const handleInlineLogSubmit = (e) => {
    e.preventDefault();
    if (!currentBook || !logPageInput) return;
    logProgress(currentBook.id, logPageInput, logDurationInput);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
          Reading Tracker & Velocity Planner
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1">
          Monitor your reading speed, remaining pages, finish estimates, and session logs.
        </p>
      </div>

      {/* Select Active Book Switcher */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
        <span className="text-xs font-semibold text-stone-500 shrink-0">Select Book:</span>
        {books.map(b => (
          <button
            key={b.id}
            onClick={() => setSelectedBookId(b.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 border ${
              b.id === currentBook.id
                ? 'bg-emerald-800 text-white border-emerald-800 dark:bg-emerald-600 dark:border-emerald-600 shadow-sm'
                : 'bg-white dark:bg-slate-900 border-stone-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-stone-300'
            }`}
          >
            <img src={b.coverUrl} alt="" className="w-4 h-6 object-cover rounded" />
            <span className="truncate max-w-[140px]">{b.title}</span>
          </button>
        ))}
      </div>

      {/* Selected Book Interactive Tracker Hero Card */}
      <div className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Book Cover & Quick Meta */}
          <div className="lg:col-span-4 flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="relative w-40 h-60 rounded-2xl overflow-hidden book-spine-effect book-shadow mb-4">
              <img src={currentBook.coverUrl} alt={currentBook.title} className="w-full h-full object-cover" />
            </div>
            
            <h2 className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100 leading-tight">
              {currentBook.title}
            </h2>
            <p className="text-sm text-stone-600 dark:text-slate-400 mt-0.5">by {currentBook.author}</p>
            <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              {currentBook.status}
            </span>
          </div>

          {/* Right: Detailed Metric Cards & Calculator */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Progress Bar & Percentage */}
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Current Page Progress
                </span>
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                  {currentBook.currentPage} / {currentBook.totalPages} pages ({percentage}%)
                </span>
              </div>

              <div className="w-full bg-stone-200 dark:bg-slate-700 rounded-full h-3.5 overflow-hidden mb-3">
                <div 
                  className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="flex justify-between text-xs text-stone-500">
                <span>Start Date: {currentBook.startDate || 'Not set'}</span>
                <span>Remaining: {remainingPages} pages</span>
              </div>
            </div>

            {/* Metric Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200/60 dark:border-slate-800">
                <div className="text-stone-400 text-xs mb-1">Target Finish Date</div>
                <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {currentBook.targetFinishDate ? currentBook.targetFinishDate : 'Not specified'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200/60 dark:border-slate-800">
                <div className="text-stone-400 text-xs mb-1">Recommended Pace</div>
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {recommendedDailyPages ? `${recommendedDailyPages} pages / day` : 'Set finish date'}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/40 border border-stone-200/60 dark:border-slate-800 col-span-2 sm:col-span-1">
                <div className="text-stone-400 text-xs mb-1">Avg Session Speed</div>
                <div className="text-sm font-bold text-blue-700 dark:text-blue-400">
                  ~{avgPagesPerSession} p. per session
                </div>
              </div>
            </div>

            {/* Fast Page Logger Form */}
            <form onSubmit={handleInlineLogSubmit} className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 space-y-4">
              <div className="flex items-center gap-2 text-emerald-900 dark:text-emerald-300 font-bold text-sm">
                <Plus className="w-4 h-4" /> Fast Reading Progress Logger
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">
                    Pages Read Today
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={logPageInput}
                    onChange={(e) => setLogPageInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={logDurationInput}
                    onChange={(e) => setLogDurationInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-colors flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" /> Save Reading Session Log
              </button>
            </form>

          </div>
        </div>
      </div>

      {/* Reading Session Log History for this Book */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm">
        <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mb-4">
          Session History for "{currentBook.title}"
        </h3>

        {bookLogs.length === 0 ? (
          <p className="text-xs text-stone-400 py-4 text-center">No reading logs recorded for this book yet.</p>
        ) : (
          <div className="divide-y divide-stone-100 dark:divide-slate-800">
            {bookLogs.map(log => (
              <div key={log.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{log.date}</span>
                  <span className="text-stone-400 ml-2">({log.durationMinutes ? `${log.durationMinutes} minutes` : 'Session'})</span>
                </div>
                <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-md">
                  +{log.pagesRead} pages
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
