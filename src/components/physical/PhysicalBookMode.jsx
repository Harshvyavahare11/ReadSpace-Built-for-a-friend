import React, { useState, useEffect } from 'react';
import { 
  BookMarked, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  Bookmark, 
  Clock, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const PhysicalBookMode = () => {
  const { books, updateBook, logProgress, showToast } = useApp();

  const activeBooks = books.filter(b => b.status === 'Currently Reading' || b.status === 'Want to Read');
  const [selectedBookId, setSelectedBookId] = useState(activeBooks[0]?.id || books[0]?.id || '');
  
  const currentBook = books.find(b => b.id === selectedBookId) || books[0];

  // Timer state
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);

  // Manual Page Logging
  const [startPage, setStartPage] = useState(currentBook ? currentBook.currentPage : 0);
  const [endPage, setEndPage] = useState(currentBook ? currentBook.currentPage + 15 : 15);
  const [quickNote, setQuickNote] = useState('');

  useEffect(() => {
    if (currentBook) {
      setStartPage(currentBook.currentPage);
      setEndPage(currentBook.currentPage + 15);
    }
  }, [selectedBookId]);

  useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  const formatTimer = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFinishSession = (e) => {
    e.preventDefault();
    if (!currentBook) return;

    const pagesRead = Math.max(0, endPage - startPage);
    const durationMinutes = Math.max(1, Math.round(seconds / 60));

    logProgress(currentBook.id, pagesRead, durationMinutes);

    // Reset timer
    setIsActive(false);
    setSeconds(0);
    showToast(`Physical session logged: ${pagesRead} pages in ${durationMinutes} mins!`, 'success');
  };

  if (!currentBook) {
    return (
      <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800">
        <BookMarked className="w-12 h-12 text-stone-300 mx-auto mb-3" />
        <h3 className="font-serif font-bold text-lg text-slate-800">No Physical Book Selected</h3>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 text-xs font-bold mb-2">
          <BookMarked className="w-4 h-4" /> Distraction-Free Physical Reader Mode
        </div>
        <h1 className="text-3xl font-bold font-serif text-slate-900 dark:text-slate-100">
          Physical Book Session Timer
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1">
          Set aside your digital screen, open your physical paper book, and track your offline reading session.
        </p>
      </div>

      {/* Book Selector */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">Book in Hand:</span>
        <select
          value={selectedBookId}
          onChange={(e) => setSelectedBookId(e.target.value)}
          className="flex-1 max-w-md px-3.5 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs font-bold"
        >
          {books.map(b => (
            <option key={b.id} value={b.id}>
              {b.title} ({b.currentPage}/{b.totalPages} p.)
            </option>
          ))}
        </select>
      </div>

      {/* Main Stopwatch Timer Hero Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-b from-stone-900 via-slate-900 to-slate-950 text-white shadow-2xl text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#2E5A44_1px,transparent_1px)] [background-size:20px_20px]" />

        <div className="relative z-10 space-y-6">
          <div className="flex items-center justify-center gap-3">
            <img src={currentBook.coverUrl} alt="" className="w-12 h-16 object-cover rounded-lg book-shadow" />
            <div className="text-left">
              <h2 className="text-xl font-bold font-serif">{currentBook.title}</h2>
              <p className="text-xs text-stone-400">by {currentBook.author}</p>
            </div>
          </div>

          {/* Large Digital Clock */}
          <div className="py-4">
            <div className="text-6xl sm:text-7xl font-mono font-bold tracking-widest text-emerald-400 drop-shadow-md">
              {formatTimer(seconds)}
            </div>
            <div className="text-xs text-stone-400 mt-2 font-medium">
              {isActive ? '🟢 Reading Session in Progress...' : 'Session Paused'}
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex justify-center items-center gap-4">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-6 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg transition-transform active:scale-95 ${
                isActive 
                  ? 'bg-amber-600 hover:bg-amber-700 text-white' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
              {isActive ? 'Pause Timer' : 'Start Reading Session'}
            </button>

            <button
              onClick={() => { setIsActive(false); setSeconds(0); }}
              className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Reset Timer"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Manual Bookmark Sync & Session Logger Form */}
      <form onSubmit={handleFinishSession} className="p-6 md:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm space-y-6">
        <div>
          <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-500" /> Log Session & Physical Bookmark
          </h3>
          <p className="text-xs text-stone-500 mt-1">
            Specify starting page and ending page to record your offline reading velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">
              Started At Page
            </label>
            <input
              type="number"
              min="0"
              value={startPage}
              onChange={(e) => setStartPage(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">
              Ended At Page (Physical Ribbon Location)
            </label>
            <input
              type="number"
              min="0"
              value={endPage}
              onChange={(e) => setEndPage(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm font-bold text-emerald-700 dark:text-emerald-400"
            />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/80 dark:border-slate-800 flex items-center justify-between text-xs">
          <span className="text-stone-600 dark:text-slate-300">Total Pages Read in this Session:</span>
          <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
            +{Math.max(0, endPage - startPage)} pages
          </span>
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-4 h-4" /> Save Physical Reading Progress
        </button>
      </form>
    </div>
  );
};
