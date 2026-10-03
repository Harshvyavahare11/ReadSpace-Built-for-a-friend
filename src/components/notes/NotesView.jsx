import React, { useState } from 'react';
import { 
  Quote, 
  Lightbulb, 
  Bookmark, 
  MessageSquare, 
  Search, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  BookOpen 
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const NotesView = () => {
  const { books, addNote, deleteNote, showToast } = useApp();

  const [selectedTypeFilter, setSelectedTypeFilter] = useState('All');
  const [selectedBookFilter, setSelectedBookFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedNoteId, setCopiedNoteId] = useState(null);

  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [newNoteForm, setNewNoteForm] = useState({
    bookId: books[0]?.id || '',
    pageNumber: 0,
    type: 'Quote',
    content: '',
    tags: ''
  });

  // Extract all notes with book metadata
  const allNotes = [];
  books.forEach(b => {
    if (b.notes && Array.isArray(b.notes)) {
      b.notes.forEach(n => {
        allNotes.push({
          ...n,
          bookId: b.id,
          bookTitle: b.title,
          bookAuthor: b.author,
          bookCover: b.coverUrl
        });
      });
    }
  });

  // Filter notes
  const filteredNotes = allNotes.filter(n => {
    if (selectedTypeFilter !== 'All' && n.type !== selectedTypeFilter) return false;
    if (selectedBookFilter !== 'All' && n.bookId !== selectedBookFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const contentMatch = n.content.toLowerCase().includes(q);
      const bookMatch = n.bookTitle.toLowerCase().includes(q);
      const tagMatch = n.tags ? n.tags.some(t => t.toLowerCase().includes(q)) : false;
      if (!contentMatch && !bookMatch && !tagMatch) return false;
    }
    return true;
  });

  const handleCopyQuote = (content, id) => {
    navigator.clipboard.writeText(`"${content}"`);
    setCopiedNoteId(id);
    showToast('Quote copied to clipboard!', 'info');
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  const handleAddNoteSubmit = (e) => {
    e.preventDefault();
    if (!newNoteForm.bookId || !newNoteForm.content) return;
    addNote(newNoteForm.bookId, newNoteForm);
    setIsAddNoteOpen(false);
    setNewNoteForm({
      bookId: books[0]?.id || '',
      pageNumber: 0,
      type: 'Quote',
      content: '',
      tags: ''
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100">
            My Notes, Quotes & Reflections
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 dark:text-slate-400 mt-1">
            Personal takeaways, favorite passages, and page bookmarks saved across your library.
          </p>
        </div>

        <button
          onClick={() => setIsAddNoteOpen(!isAddNoteOpen)}
          className="px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 dark:bg-emerald-600 text-white font-semibold text-xs transition-colors shadow-sm flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Note or Quote
        </button>
      </div>

      {/* Add Note Form */}
      {isAddNoteOpen && (
        <form onSubmit={handleAddNoteSubmit} className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 shadow-md space-y-4 animate-in fade-in">
          <h3 className="font-serif font-bold text-base text-slate-900 dark:text-slate-100">Save Passages & Takeaways</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Book</label>
              <select
                value={newNoteForm.bookId}
                onChange={(e) => setNewNoteForm({ ...newNoteForm, bookId: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
              >
                {books.map(b => (
                  <option key={b.id} value={b.id}>{b.title}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Note Type</label>
              <select
                value={newNoteForm.type}
                onChange={(e) => setNewNoteForm({ ...newNoteForm, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
              >
                <option value="Quote">Quote</option>
                <option value="Takeaway">Takeaway</option>
                <option value="Reflection">Reflection</option>
                <option value="Bookmark">Bookmark</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Page Number</label>
              <input
                type="number"
                min="0"
                value={newNoteForm.pageNumber}
                onChange={(e) => setNewNoteForm({ ...newNoteForm, pageNumber: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Content / Passage</label>
            <textarea
              rows="3"
              required
              value={newNoteForm.content}
              onChange={(e) => setNewNoteForm({ ...newNoteForm, content: e.target.value })}
              placeholder="Write quote or reflection..."
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-600 dark:text-slate-400 mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={newNoteForm.tags}
              onChange={(e) => setNewNoteForm({ ...newNoteForm, tags: e.target.value })}
              placeholder="e.g. Mindset, Favorite Quote, Chapter 4"
              className="w-full px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsAddNoteOpen(false)}
              className="px-4 py-2 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-700 text-white font-bold text-xs"
            >
              Save Note
            </button>
          </div>
        </form>
      )}

      {/* Toolbar: Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-xs">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search quotes, takeaways, or tags..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Note Type */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
          >
            <option value="All">All Note Types</option>
            <option value="Quote">Quotes</option>
            <option value="Takeaway">Takeaways</option>
            <option value="Reflection">Reflections</option>
            <option value="Bookmark">Bookmarks</option>
          </select>

          {/* Book Filter */}
          <select
            value={selectedBookFilter}
            onChange={(e) => setSelectedBookFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-xs"
          >
            <option value="All">All Books ({books.length})</option>
            {books.map(b => (
              <option key={b.id} value={b.id}>{b.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800">
          <Quote className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <h3 className="font-serif font-bold text-lg text-slate-800 dark:text-slate-200">No Passages Found</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1 mb-4">No notes or quotes match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredNotes.map((note) => (
            <div 
              key={note.id}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-stone-200/80 dark:border-slate-800 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      note.type === 'Quote' 
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' 
                        : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    }`}>
                      {note.type}
                    </span>
                    {note.pageNumber > 0 && (
                      <span className="text-xs text-stone-400 font-medium">Page {note.pageNumber}</span>
                    )}
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      onClick={() => handleCopyQuote(note.content, note.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                      title="Copy Quote"
                    >
                      {copiedNoteId === note.id ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteNote(note.bookId, note.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-500 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <p className={`text-base leading-relaxed mb-4 ${
                  note.type === 'Quote' 
                    ? 'font-serif italic text-slate-800 dark:text-slate-200 border-l-3 border-amber-400 pl-4 py-1' 
                    : 'text-slate-700 dark:text-slate-300'
                }`}>
                  "{note.content}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 dark:border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <img src={note.bookCover} alt="" className="w-6 h-8 object-cover rounded shadow-xs" />
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate font-serif">{note.bookTitle}</div>
                    <div className="text-[10px] text-stone-400 truncate">by {note.bookAuthor}</div>
                  </div>
                </div>

                {note.tags && note.tags.length > 0 && (
                  <div className="flex gap-1">
                    {note.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
