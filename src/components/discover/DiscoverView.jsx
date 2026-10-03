import React, { useState } from 'react';
import { 
  Compass, 
  Search, 
  Plus, 
  Star, 
  Check, 
  BookOpen, 
  Sparkles,
  X 
} from 'lucide-react';
import { DISCOVER_CATALOG } from '../../data/sampleBooks';
import { useApp } from '../../context/AppContext';

export const DiscoverView = () => {
  const { addBook, books } = useApp();

  const [selectedGenre, setSelectedGenre] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [previewBook, setPreviewBook] = useState(null);
  const [addStatusChoice, setAddStatusChoice] = useState('Want to Read');

  const genres = ['All', 'Fiction', 'Self-Help', 'Fantasy', 'History', 'Mystery', 'Biography'];

  const filteredCatalog = DISCOVER_CATALOG.filter(b => {
    if (selectedGenre !== 'All' && b.genre !== selectedGenre) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = b.title.toLowerCase().includes(q);
      const authorMatch = b.author.toLowerCase().includes(q);
      if (!titleMatch && !authorMatch) return false;
    }
    return true;
  });

  const isBookInLibrary = (title) => {
    return books.some(b => b.title.toLowerCase() === title.toLowerCase());
  };

  const handleAddBookToLibrary = (item, status) => {
    addBook({
      title: item.title,
      author: item.author,
      coverUrl: item.coverUrl,
      status: status || 'Want to Read',
      genre: item.genre,
      currentPage: 0,
      totalPages: item.totalPages,
      rating: Math.round(item.rating),
      format: 'Paperback',
      description: item.description
    });
    setPreviewBook(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-xs font-bold mb-2">
          <Compass className="w-3.5 h-3.5" /> Curated Reading Discovery
        </div>
        <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
          Discover Next Great Reads
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1">
          Explore top-rated classics, modern bestsellers, and inspiring literature to expand your shelf.
        </p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search discover catalog..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Genre Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {genres.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedGenre === g
                  ? 'bg-emerald-800 text-white dark:bg-emerald-600'
                  : 'bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400 hover:bg-stone-200'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Discover Catalog Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredCatalog.map(book => {
          const added = isBookInLibrary(book.title);
          return (
            <div 
              key={book.id}
              className="group rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 p-4 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative w-full aspect-[2/3] mb-4 rounded-2xl overflow-hidden book-spine-effect book-shadow book-shadow-hover">
                  <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <span className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-black/70 backdrop-blur-md text-white">
                    {book.genre}
                  </span>
                </div>

                <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                  {book.title}
                </h3>
                <p className="text-xs text-stone-500 dark:text-slate-400 mb-2">by {book.author}</p>
                <p className="text-xs text-stone-600 dark:text-slate-300 line-clamp-2 mb-4">
                  {book.description}
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-400" /> {book.rating}
                </div>

                {added ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                    <Check className="w-4 h-4" /> In Library
                  </span>
                ) : (
                  <button
                    onClick={() => setPreviewBook(book)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold text-xs transition-colors flex items-center gap-1 shadow-sm"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Book
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Book Preview Modal */}
      {previewBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 shadow-2xl space-y-4">
            <button 
              onClick={() => setPreviewBook(null)}
              className="absolute top-4 right-4 p-1 text-stone-400 hover:text-stone-600"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex gap-4">
              <img src={previewBook.coverUrl} alt="" className="w-24 h-36 object-cover rounded-xl book-shadow" />
              <div>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">{previewBook.genre}</span>
                <h3 className="font-serif font-bold text-lg text-slate-900 dark:text-slate-100 mt-1">{previewBook.title}</h3>
                <p className="text-xs text-stone-500">by {previewBook.author}</p>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold mt-2">
                  <Star className="w-4 h-4 fill-amber-400" /> {previewBook.rating} ({previewBook.totalPages} pages)
                </div>
              </div>
            </div>

            <p className="text-xs text-stone-700 dark:text-slate-300 leading-relaxed bg-stone-50 dark:bg-slate-800/40 p-3 rounded-xl">
              {previewBook.description}
            </p>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Select Target Shelf</label>
              <select
                value={addStatusChoice}
                onChange={(e) => setAddStatusChoice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 text-xs"
              >
                <option value="Want to Read">Want to Read (Wishlist)</option>
                <option value="Currently Reading">Currently Reading</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button
              onClick={() => handleAddBookToLibrary(previewBook, addStatusChoice)}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Confirm Add to Library
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
