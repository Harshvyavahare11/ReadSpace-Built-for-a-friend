import React from 'react';
import { 
  BookOpen, 
  Flame, 
  Target, 
  CheckCircle, 
  Clock, 
  Plus, 
  ArrowRight, 
  TrendingUp, 
  Calendar,
  Sparkles,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCard } from '../common/BookCard';

export const DashboardView = ({ onOpenBookDetails }) => {
  const { 
    books, 
    readingLogs, 
    profile, 
    totalBooksRead, 
    currentlyReadingBooks, 
    totalPagesReadThisYear, 
    streakDays, 
    pagesReadToday,
    setIsQuickLogOpen,
    setSelectedBookIdForModal,
    setActiveTab,
    setIsAddBookOpen
  } = useApp();

  const primaryCurrentBook = currentlyReadingBooks[0] || books[0];

  const annualGoal = profile.annualBookGoal || 20;
  const annualPercentage = Math.min(100, Math.round((totalBooksRead / annualGoal) * 100));

  const dailyGoal = profile.dailyPageGoal || 30;
  const dailyPercentage = Math.min(100, Math.round((pagesReadToday / dailyGoal) * 100));

  // Upcoming deadlines (books with targetFinishDate that are not completed)
  const upcomingDeadlines = books
    .filter(b => b.targetFinishDate && b.status !== 'Completed')
    .sort((a, b) => new Date(a.targetFinishDate) - new Date(b.targetFinishDate))
    .slice(0, 3);

  // Recent activity logs (last 5 entries)
  const recentLogs = readingLogs.slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Welcome Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-emerald-200 text-xs font-semibold mb-3 border border-white/10">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Daily Reading Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif mb-2 tracking-tight">
            Welcome back, {profile.name.split(' ')[0]} 👋
          </h1>
          <p className="text-stone-200 text-xs sm:text-sm leading-relaxed mb-6 font-serif italic">
            "A reader lives a thousand lives before he dies... The man who never reads lives only one."
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setIsQuickLogOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-stone-100 transition-colors flex items-center gap-2 shadow-md"
            >
              <Plus className="w-4 h-4 text-emerald-700" /> Quick Log Reading
            </button>
            <button
              onClick={() => setActiveTab('physical')}
              className="px-4 py-2.5 rounded-xl bg-emerald-700/60 hover:bg-emerald-700/80 text-white font-semibold text-xs border border-white/20 transition-colors flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Start Physical Session
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-600 dark:text-amber-400">
            <Flame className="w-6 h-6 fill-amber-500" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">{streakDays} Days</div>
            <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">Reading Streak</div>
          </div>
        </div>

        {/* Books Read */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">{totalBooksRead}</div>
            <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">Books Completed</div>
          </div>
        </div>

        {/* Pages Read */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">{totalPagesReadThisYear}</div>
            <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">Pages Logged</div>
          </div>
        </div>

        {/* Daily Goal */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-400">
            <Target className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 font-serif">{dailyPercentage}%</div>
            <div className="text-xs text-stone-500 dark:text-slate-400 font-medium">{pagesReadToday}/{dailyGoal} p. Today</div>
          </div>
        </div>
      </div>

      {/* 3. Main Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Currently Reading Hero & Active Books */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Active Reading Showcase */}
          {primaryCurrentBook ? (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" /> Currently Reading Focus
                </span>
                <button
                  onClick={() => setActiveTab('library')}
                  className="text-xs font-medium text-stone-500 hover:text-emerald-700 dark:text-slate-400 flex items-center gap-1"
                >
                  View All ({currentlyReadingBooks.length}) <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div 
                  onClick={() => onOpenBookDetails(primaryCurrentBook)}
                  className="relative w-32 h-48 shrink-0 rounded-xl overflow-hidden book-spine-effect book-shadow book-shadow-hover cursor-pointer"
                >
                  <img src={primaryCurrentBook.coverUrl} alt={primaryCurrentBook.title} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 min-w-0 w-full">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400">
                    {primaryCurrentBook.genre}
                  </span>
                  <h3 
                    onClick={() => onOpenBookDetails(primaryCurrentBook)}
                    className="text-xl font-bold font-serif text-slate-900 dark:text-slate-100 mt-1 cursor-pointer hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors"
                  >
                    {primaryCurrentBook.title}
                  </h3>
                  <p className="text-sm text-stone-600 dark:text-slate-400 mb-4">
                    by {primaryCurrentBook.author}
                  </p>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="text-stone-600 dark:text-slate-400">Page {primaryCurrentBook.currentPage} of {primaryCurrentBook.totalPages}</span>
                      <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                        {Math.round((primaryCurrentBook.currentPage / primaryCurrentBook.totalPages) * 100)}% Complete
                      </span>
                    </div>
                    <div className="w-full bg-stone-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${(primaryCurrentBook.currentPage / primaryCurrentBook.totalPages) * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Quick Action Button */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        setSelectedBookIdForModal(primaryCurrentBook.id);
                        setIsQuickLogOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Log Progress
                    </button>
                    <button
                      onClick={() => onOpenBookDetails(primaryCurrentBook)}
                      className="px-3 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 font-medium text-xs hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Book Details & Notes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 text-center">
              <BookOpen className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">No Active Book Selected</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto mb-4">Start reading a book from your wishlist or discover a new title!</p>
              <button
                onClick={() => setIsAddBookOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs"
              >
                + Add Book to Shelf
              </button>
            </div>
          )}

          {/* Currently Reading Books Grid */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100">
                On Your Reading Desk ({currentlyReadingBooks.length})
              </h3>
              <button
                onClick={() => setActiveTab('library')}
                className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:underline"
              >
                Go to Library
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {currentlyReadingBooks.map(book => (
                <BookCard 
                  key={book.id} 
                  book={book} 
                  onOpenDetails={onOpenBookDetails} 
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Annual Challenge, Deadlines, & Activity */}
        <div className="space-y-6">
          
          {/* Annual Book Challenge Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">2026 Reading Goal</h3>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                {totalBooksRead} / {annualGoal} Books
              </span>
            </div>

            {/* Circular / Bar Progress */}
            <div className="space-y-2 mb-4">
              <div className="w-full bg-stone-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-amber-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${annualPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-stone-500">
                <span>{annualPercentage}% Completed</span>
                <span>{annualGoal - totalBooksRead} books remaining</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 dark:text-slate-400 bg-stone-50 dark:bg-slate-800/40 p-3 rounded-xl">
              🎯 {totalBooksRead >= annualGoal ? "You've crushed your reading goal for this year!" : `Read ${Math.max(1, Math.ceil((annualGoal - totalBooksRead) / 3))} book(s) per month to stay on track.`}
            </p>
          </div>

          {/* Upcoming Finish Deadlines */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">Target Finish Dates</h3>
              </div>
            </div>

            {upcomingDeadlines.length === 0 ? (
              <p className="text-xs text-stone-400 text-center py-4">No upcoming finish deadlines set.</p>
            ) : (
              <div className="space-y-3">
                {upcomingDeadlines.map(book => (
                  <div key={book.id} className="flex items-center gap-3 p-2.5 rounded-xl bg-stone-50 dark:bg-slate-800/50">
                    <img src={book.coverUrl} alt="" className="w-8 h-11 object-cover rounded shadow-xs" />
                    <div className="min-w-0 flex-1 text-xs">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate font-serif">{book.title}</div>
                      <div className="text-stone-500">Target: {book.targetFinishDate}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                      {Math.max(0, book.totalPages - book.currentPage)} p. left
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reading Logs */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">Recent Logs</h3>
              </div>
            </div>

            <div className="space-y-3">
              {recentLogs.map((log) => {
                const logBook = books.find(b => b.id === log.bookId);
                return (
                  <div key={log.id} className="flex items-center justify-between text-xs py-2 border-b border-stone-100 dark:border-slate-800 last:border-0">
                    <div className="min-w-0 pr-2">
                      <div className="font-bold text-slate-900 dark:text-slate-100 truncate font-serif">
                        {logBook ? logBook.title : 'Book'}
                      </div>
                      <div className="text-stone-400">{log.date}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">+{log.pagesRead} pages</span>
                      {log.durationMinutes > 0 && (
                        <div className="text-[10px] text-stone-400">{log.durationMinutes} min</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
