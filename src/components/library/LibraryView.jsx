import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus, 
  BookOpen, 
  CheckCircle, 
  Clock, 
  Bookmark, 
  ArrowUpDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { BookCard } from '../common/BookCard';

export const LibraryView = ({ onOpenBookDetails }) => {
  const { books, setIsAddBookOpen } = useApp();

  const [activeStatusTab, setActiveStatusTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedFormat, setSelectedFormat] = useState('All');
  const [sortBy, setSortBy] = useState('recentlyAdded');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const genres = ['All', 'Fiction', 'Non-Fiction', 'Sci-Fi', 'Fantasy', 'Self-Help', 'Biography', 'History', 'Mystery'];
  const formats = ['All', 'Paperback', 'Hardcover', 'E-Book', 'Audiobook'];

  // Filter books
  const filteredBooks = books.filter(book => {
    // Status filter
    if (activeStatusTab !== 'All' && book.status !== activeStatusTab) return false;

    // Genre filter
    if (selectedGenre !== 'All' && book.genre !== selectedGenre) return false;

    // Format filter
    if (selectedFormat !== 'All' && book.format !== selectedFormat) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = book.title.toLowerCase().includes(q);
      const authorMatch = book.author.toLowerCase().includes(q);
      const isbnMatch = book.isbn ? book.isbn.includes(q) : false;
      if (!titleMatch && !authorMatch && !isbnMatch) return false;
    }

    return true;
  });

  // Sort books
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'author') return a.author.localeCompare(b.author);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    if (sortBy === 'progress') {
      const percA = a.totalPages > 0 ? (a.currentPage / a.totalPages) : 0;
      const percB = b.totalPages > 0 ? (b.currentPage / b.totalPages) : 0;
      return percB - percA;
    }
    return 0; // Default order
  });

  const getStatusCount = (status) => {
    if (status === 'All') return books.length;
    return books.filter(b => b.status === status).length;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Banner & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            My Book Library
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1">
            Organize, track progress, and manage your personal reading collection.
          </p>
        </div>

        <button
          onClick={() => setIsAddBookOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Book to Shelf
        </button>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex border-b border-stone-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {[
          { id: 'All', label: 'All Books' },
          { id: 'Currently Reading', label: 'Currently Reading' },
          { id: 'Want to Read', label: 'Want to Read' },
          { id: 'Completed', label: 'Completed' },
          { id: 'On Hold', label: 'On Hold' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveStatusTab(tab.id)}
            className={`px-4 py-3 font-semibold text-xs whitespace-nowrap border-b-2 transition-all flex items-center gap-2 ${
              activeStatusTab === tab.id
                ? 'border-emerald-700 text-emerald-900 dark:text-emerald-400 dark:border-emerald-400'
                : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-slate-400'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeStatusTab === tab.id
                ? 'bg-emerald-800 text-white dark:bg-emerald-600'
                : 'bg-stone-200/80 dark:bg-slate-800 text-stone-600 dark:text-slate-400'
            }`}>
              {getStatusCount(tab.id)}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar: Search, Filters, Sorting & View Toggle */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, author, or ISBN..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          {/* Genre */}
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Genres</option>
            {genres.filter(g => g !== 'All').map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          {/* Format */}
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="All">All Formats</option>
            {formats.filter(f => f !== 'All').map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="recentlyAdded">Sort: Recently Added</option>
            <option value="title">Sort: Title (A-Z)</option>
            <option value="author">Sort: Author (A-Z)</option>
            <option value="rating">Sort: Highest Rating</option>
            <option value="progress">Sort: Highest Progress</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-slate-800 border border-stone-200 dark:border-slate-700">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-slate-900 text-emerald-700 shadow-xs' : 'text-stone-400'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-slate-900 text-emerald-700 shadow-xs' : 'text-stone-400'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* Book List / Grid */}
      {sortedBooks.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-stone-300 dark:text-slate-700 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-200 mb-1">No Books Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto mb-4">
            No titles match your selected filters or search query. Try clearing filters or adding a new book.
          </p>
          <div className="flex justify-center gap-3">
            <button
              onClick={() => {
                setActiveStatusTab('All');
                setSearchQuery('');
                setSelectedGenre('All');
                setSelectedFormat('All');
              }}
              className="px-4 py-2 rounded-xl border border-stone-200 dark:border-slate-700 text-stone-700 dark:text-slate-300 font-semibold text-xs"
            >
              Reset Filters
            </button>
            <button
              onClick={() => setIsAddBookOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-semibold text-xs"
            >
              + Add New Book
            </button>
          </div>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" : "space-y-3"}>
          {sortedBooks.map(book => (
            <BookCard 
              key={book.id} 
              book={book} 
              viewMode={viewMode} 
              onOpenDetails={onOpenBookDetails} 
            />
          ))}
        </div>
      )}
    </div>
  );
};
