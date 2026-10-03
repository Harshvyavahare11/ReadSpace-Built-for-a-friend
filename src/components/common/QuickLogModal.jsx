import React, { useState, useEffect } from 'react';
import { X, BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const QuickLogModal = () => {
  const { 
    books, 
    selectedBookIdForModal, 
    isQuickLogOpen, 
    setIsQuickLogOpen, 
    logProgress,
    setSelectedBookIdForModal
  } = useApp();

  const activeBooks = books.filter(b => b.status === 'Currently Reading' || b.status === 'Want to Read');
  
  const [selectedBookId, setSelectedBookId] = useState('');
  const [pagesRead, setPagesRead] = useState(15);
  const [duration, setDuration] = useState(25);

  useEffect(() => {
    if (selectedBookIdForModal) {
      setSelectedBookId(selectedBookIdForModal);
    } else if (activeBooks.length > 0) {
      setSelectedBookId(activeBooks[0].id);
    }
  }, [selectedBookIdForModal, isQuickLogOpen]);

  if (!isQuickLogOpen) return null;

  const currentBook = books.find(b => b.id === selectedBookId);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedBookId || !pagesRead) return;
    
    logProgress(selectedBookId, pagesRead, duration);
    setIsQuickLogOpen(false);
    setSelectedBookIdForModal(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-400">
            <BookOpen className="w-5 h-5" />
            <h2 className="text-lg font-bold font-serif text-slate-900 dark:text-slate-100">Log Daily Reading</h2>
          </div>
          <button 
            onClick={() => { setIsQuickLogOpen(false); setSelectedBookIdForModal(null); }}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Select Book */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-slate-400 mb-2">
              Select Book
            </label>
            <select
              value={selectedBookId}
              onChange={(e) => setSelectedBookId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {books.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} ({book.currentPage}/{book.totalPages} p.)
                </option>
              ))}
            </select>
          </div>

          {currentBook && (
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-800 flex items-center gap-3">
              <img src={currentBook.coverUrl} alt={currentBook.title} className="w-10 h-14 object-cover rounded book-shadow" />
              <div className="min-w-0 flex-1 text-xs">
                <div className="font-bold text-slate-900 dark:text-slate-100 truncate font-serif">{currentBook.title}</div>
                <div className="text-stone-500 dark:text-slate-400">Current page: {currentBook.currentPage} / {currentBook.totalPages}</div>
                <div className="w-full bg-stone-200 dark:bg-slate-700 rounded-full h-1.5 mt-1 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full" 
                    style={{ width: `${Math.min(100, Math.round((currentBook.currentPage / currentBook.totalPages) * 100))}%` }} 
                  />
                </div>
              </div>
            </div>
          )}

          {/* Pages Read Input / Slider */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-slate-400">
                Pages Read Today
              </label>
              <span className="text-base font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
                +{pagesRead} pages
              </span>
            </div>
            
            <input 
              type="range" 
              min="1" 
              max="150" 
              value={pagesRead} 
              onChange={(e) => setPagesRead(Number(e.target.value))}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            
            <div className="flex items-center gap-2 mt-3">
              <input
                type="number"
                min="1"
                max="1000"
                value={pagesRead}
                onChange={(e) => setPagesRead(Number(e.target.value))}
                className="w-24 px-3 py-1.5 rounded-lg bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-1.5 flex-1">
                {[10, 20, 35, 50].map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setPagesRead(val)}
                    className="px-2.5 py-1 text-xs font-medium rounded-lg bg-stone-100 dark:bg-slate-800 hover:bg-stone-200 dark:hover:bg-slate-700 text-stone-700 dark:text-slate-300 transition-colors"
                  >
                    +{val}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Reading Time Duration */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 dark:text-slate-400 mb-2">
              Time Spent (Minutes)
            </label>
            <div className="relative">
              <Clock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input 
                type="number"
                min="0"
                max="300"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="e.g. 30 min"
              />
            </div>
          </div>

          {/* Submit Action */}
          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => { setIsQuickLogOpen(false); setSelectedBookIdForModal(null); }}
              className="w-1/2 py-2.5 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 font-medium text-sm hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="w-1/2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" /> Save Log
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
