import React, { useState } from 'react';
import { Star, MoreVertical, BookOpen, CheckCircle, Clock, Bookmark, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BookCard = ({ book, viewMode = 'grid', onOpenDetails }) => {
  const { updateBook, deleteBook, setSelectedBookIdForModal, setIsQuickLogOpen } = useApp();
  const [showMenu, setShowMenu] = useState(false);

  const percentage = book.totalPages > 0 
    ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100)) 
    : 0;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Currently Reading':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50"><BookOpen className="w-3 h-3" /> Reading</span>;
      case 'Completed':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50"><CheckCircle className="w-3 h-3" /> Completed</span>;
      case 'Want to Read':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-800/50"><Clock className="w-3 h-3" /> Wishlist</span>;
      case 'On Hold':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700"><Bookmark className="w-3 h-3" /> On Hold</span>;
      default:
        return null;
    }
  };

  const handleQuickLogClick = (e) => {
    e.stopPropagation();
    setSelectedBookIdForModal(book.id);
    setIsQuickLogOpen(true);
  };

  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onOpenDetails && onOpenDetails(book)}
        className="group relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 shadow-sm hover:shadow-md transition-all cursor-pointer"
      >
        <div className="flex items-center gap-4 min-w-0 w-full sm:w-auto">
          <div className="relative w-14 h-20 shrink-0 rounded-md overflow-hidden book-spine-effect book-shadow">
            <img 
              src={book.coverUrl} 
              alt={book.title} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" 
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              {getStatusBadge(book.status)}
              <span className="text-xs font-medium px-2 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400">
                {book.genre}
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate font-serif">
              {book.title}
            </h3>
            <p className="text-sm text-stone-600 dark:text-slate-400 truncate">
              by {book.author}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100 dark:border-slate-800">
          <div className="w-36 text-right">
            <div className="flex justify-between text-xs text-stone-600 dark:text-slate-400 mb-1">
              <span>{book.currentPage} / {book.totalPages} p.</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{percentage}%</span>
            </div>
            <div className="w-full bg-stone-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {book.status === 'Currently Reading' && (
              <button 
                onClick={handleQuickLogClick}
                className="px-3 py-1.5 text-xs font-medium text-white bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" /> Log
              </button>
            )}

            <div className="relative">
              <button
                onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
              
              {showMenu && (
                <div 
                  onClick={(e) => e.stopPropagation()}
                  className="absolute right-0 top-8 z-30 w-48 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-stone-200 dark:border-slate-800 py-1 text-sm text-slate-700 dark:text-slate-200 animate-in fade-in zoom-in-95 duration-150"
                >
                  <button
                    onClick={() => { setShowMenu(false); onOpenDetails && onOpenDetails(book); }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <BookOpen className="w-4 h-4 text-emerald-600" /> View Details & Notes
                  </button>
                  <button
                    onClick={() => { setShowMenu(false); handleQuickLogClick(new Event('click')); }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4 text-blue-600" /> Log Progress
                  </button>
                  <button
                    onClick={() => {
                      setShowMenu(false);
                      const nextStatus = book.status === 'Currently Reading' ? 'Completed' : 'Currently Reading';
                      updateBook(book.id, { status: nextStatus });
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-50 dark:hover:bg-slate-800 flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4 text-amber-600" /> Switch Status
                  </button>
                  <div className="my-1 border-t border-stone-100 dark:border-slate-800" />
                  <button
                    onClick={() => { setShowMenu(false); deleteBook(book.id); }}
                    className="w-full text-left px-4 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" /> Remove Book
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div 
      onClick={() => onOpenDetails && onOpenDetails(book)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800/80 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 p-4 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden"
    >
      <div>
        {/* Header Ribbon & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          {getStatusBadge(book.status)}
          
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setShowMenu(!showMenu); }}
              className="p-1 rounded-lg text-stone-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
            >
              <MoreVertical className="w-4 h-4" />
            </button>
            
            {showMenu && (
              <div 
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 top-7 z-30 w-44 rounded-xl bg-white dark:bg-slate-900 shadow-xl border border-stone-200 dark:border-slate-800 py-1 text-xs text-slate-700 dark:text-slate-200"
              >
                <button
                  onClick={() => { setShowMenu(false); onOpenDetails && onOpenDetails(book); }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Book Details
                </button>
                <button
                  onClick={() => { setShowMenu(false); handleQuickLogClick(new Event('click')); }}
                  className="w-full text-left px-3 py-2 hover:bg-stone-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <PlusCircle className="w-3.5 h-3.5 text-blue-600" /> Log Pages
                </button>
                <div className="my-1 border-t border-stone-100 dark:border-slate-800" />
                <button
                  onClick={() => { setShowMenu(false); deleteBook(book.id); }}
                  className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Book Cover Image with spine effect */}
        <div className="relative w-full aspect-[2/3] mb-4 rounded-xl overflow-hidden book-spine-effect book-shadow book-shadow-hover bg-stone-100 dark:bg-slate-800 flex items-center justify-center">
          <img 
            src={book.coverUrl} 
            alt={book.title} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600';
            }}
          />
          {/* Subtle Overlay Badge for Genre */}
          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide uppercase bg-black/60 backdrop-blur-md text-white">
            {book.genre}
          </span>
        </div>

        {/* Title and Author */}
        <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-stone-500 dark:text-slate-400 mt-0.5 mb-3 truncate">
          by {book.author}
        </p>
      </div>

      {/* Progress Footer */}
      <div>
        <div className="flex items-center justify-between text-xs text-stone-500 dark:text-slate-400 mb-1.5 font-medium">
          <span>{book.currentPage} / {book.totalPages} p.</span>
          <span className="text-emerald-700 dark:text-emerald-400 font-bold">{percentage}%</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-stone-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden mb-3">
          <div 
            className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Rating or Quick Action */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-slate-800/80">
          <div className="flex items-center gap-0.5 text-amber-500">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star} 
                className={`w-3.5 h-3.5 ${star <= book.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-slate-700'}`} 
              />
            ))}
          </div>

          <button
            onClick={handleQuickLogClick}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline flex items-center gap-1"
          >
            + Quick Log
          </button>
        </div>
      </div>
    </div>
  );
};
