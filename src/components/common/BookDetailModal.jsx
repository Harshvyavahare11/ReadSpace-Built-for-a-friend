import React, { useState } from 'react';
import { X, BookOpen, Star, Plus, Trash2, Calendar, Bookmark, Quote, Lightbulb, MessageSquare, CheckCircle, Edit3 } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const BookDetailModal = ({ book, onClose }) => {
  const { updateBook, deleteBook, addNote, deleteNote, setSelectedBookIdForModal, setIsQuickLogOpen } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteForm, setNoteForm] = useState({
    pageNumber: book?.currentPage || 0,
    type: 'Quote',
    content: '',
    tags: ''
  });


  if (!book) return null;

  const percentage = book.totalPages > 0 
    ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100)) 
    : 0;

  const remainingPages = Math.max(0, book.totalPages - book.currentPage);

  // Calculate Pace recommendation if target finish date exists
  let recommendedPace = null;
  if (book.targetFinishDate && remainingPages > 0) {
    const today = new Date();
    const target = new Date(book.targetFinishDate);
    const diffTime = target - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      recommendedPace = Math.ceil(remainingPages / diffDays);
    }
  }

  const handleSaveNote = (e) => {
    e.preventDefault();
    if (!noteForm.content) return;
    addNote(book.id, noteForm);
    setIsAddingNote(false);
    setNoteForm({ pageNumber: book.currentPage, type: 'Quote', content: '', tags: '' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-800 p-6 md:p-8 shadow-2xl">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-stone-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Hero Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-6">
          <div className="relative w-36 h-52 shrink-0 mx-auto md:mx-0 rounded-xl overflow-hidden book-spine-effect book-shadow">
            <img src={book.coverUrl} alt={book.title} className="w-full h-full object-cover" />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                  {book.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400">
                  {book.genre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 dark:bg-slate-800 text-stone-600 dark:text-slate-400">
                  {book.format}
                </span>
              </div>

              <h2 className="text-2xl font-bold font-serif text-slate-900 dark:text-slate-100 leading-tight">
                {book.title}
              </h2>
              <p className="text-base text-stone-600 dark:text-slate-400 font-medium mt-1">
                by {book.author}
              </p>
              
              {/* Star Rating */}
              <div className="flex items-center gap-1 my-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => updateBook(book.id, { rating: star })}
                    className="hover:scale-125 transition-transform"
                  >
                    <Star 
                      className={`w-5 h-5 ${star <= book.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-slate-700'}`} 
                    />
                  </button>
                ))}
                <span className="text-xs text-stone-400 ml-2">Click to rate</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-100 dark:border-slate-800">
              <button
                onClick={() => {
                  onClose();
                  setSelectedBookIdForModal(book.id);
                  setIsQuickLogOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Plus className="w-4 h-4" /> Log Reading Progress
              </button>
              
              <button
                onClick={() => {
                  deleteBook(book.id);
                  onClose();
                }}
                className="px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Remove
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-colors ${activeTab === 'overview' ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-slate-400'}`}
          >
            Overview & Pace
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2.5 font-semibold text-sm border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'notes' ? 'border-emerald-700 text-emerald-800 dark:text-emerald-400 dark:border-emerald-400' : 'border-transparent text-stone-500 hover:text-stone-800 dark:text-slate-400'}`}
          >
            Notes & Quotes ({book.notes ? book.notes.length : 0})
          </button>
        </div>

        {/* Tab 1: Overview & Pace */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Progress Box */}
            <div className="p-5 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-stone-200/80 dark:border-slate-800">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                  Reading Progress
                </span>
                <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                  {book.currentPage} / {book.totalPages} pages ({percentage}%)
                </span>
              </div>
              <div className="w-full bg-stone-200 dark:bg-slate-700 rounded-full h-3 overflow-hidden mb-4">
                <div 
                  className="bg-emerald-600 dark:bg-emerald-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs pt-2">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-100 dark:border-slate-800">
                  <div className="text-stone-400 mb-1">Remaining Pages</div>
                  <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{remainingPages} p.</div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-100 dark:border-slate-800">
                  <div className="text-stone-400 mb-1">Target Finish Date</div>
                  <div className="text-sm font-bold text-slate-800 dark:text-slate-100">
                    {book.targetFinishDate ? book.targetFinishDate : 'Not set'}
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-stone-100 dark:border-slate-800 col-span-2 md:col-span-1">
                  <div className="text-stone-400 mb-1">Recommended Pace</div>
                  <div className="text-sm font-bold text-emerald-700 dark:text-emerald-400">
                    {recommendedPace ? `${recommendedPace} pages/day` : 'Set target date'}
                  </div>
                </div>
              </div>
            </div>

            {/* Physical Bookmark Sync */}
            <div className="p-5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/60 text-amber-800 dark:text-amber-300 shrink-0">
                  <Bookmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 dark:text-amber-200">Physical Ribbon Bookmark</h4>
                  <p className="text-xs text-amber-700 dark:text-amber-400">Currently saved at page {book.physicalBookmarkPage || book.currentPage}</p>
                </div>
              </div>
              <button
                onClick={() => updateBook(book.id, { physicalBookmarkPage: book.currentPage })}
                className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold shrink-0 transition-colors"
              >
                Sync with Current Page
              </button>
            </div>

            {/* Synopsis */}
            {book.description && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400 mb-2">
                  Synopsis & Overview
                </h4>
                <p className="text-sm text-stone-700 dark:text-slate-300 leading-relaxed bg-stone-50 dark:bg-slate-800/40 p-4 rounded-xl border border-stone-100 dark:border-slate-800">
                  {book.description}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Notes & Quotes */}
        {activeTab === 'notes' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-slate-400">
                Book Journal ({book.notes ? book.notes.length : 0})
              </h4>
              <button
                onClick={() => setIsAddingNote(!isAddingNote)}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" /> Add Note / Quote
              </button>
            </div>

            {/* Add Note Form */}
            {isAddingNote && (
              <form onSubmit={handleSaveNote} className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800 border border-stone-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">Page Number</label>
                    <input 
                      type="number" 
                      value={noteForm.pageNumber}
                      onChange={(e) => setNoteForm({ ...noteForm, pageNumber: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-500 mb-1">Note Type</label>
                    <select
                      value={noteForm.type}
                      onChange={(e) => setNoteForm({ ...noteForm, type: e.target.value })}
                      className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                    >
                      <option value="Quote">Quote</option>
                      <option value="Takeaway">Takeaway</option>
                      <option value="Reflection">Reflection</option>
                      <option value="Bookmark">Bookmark</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">Content / Note</label>
                  <textarea
                    rows="3"
                    required
                    value={noteForm.content}
                    onChange={(e) => setNoteForm({ ...noteForm, content: e.target.value })}
                    placeholder="Write quote or reflection..."
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-500 mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    value={noteForm.tags}
                    onChange={(e) => setNoteForm({ ...noteForm, tags: e.target.value })}
                    placeholder="e.g. Mindset, Favorite Quote"
                    className="w-full px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-stone-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setIsAddingNote(false)}
                    className="px-3 py-1.5 rounded-lg border text-xs text-stone-600 hover:bg-stone-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white font-semibold text-xs"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            )}

            {/* List of Notes */}
            {(!book.notes || book.notes.length === 0) ? (
              <div className="text-center py-8 text-stone-400 dark:text-slate-500 text-sm">
                No notes or quotes recorded yet. Click above to add your first reflection!
              </div>
            ) : (
              <div className="space-y-3">
                {book.notes.map((note) => (
                  <div 
                    key={note.id}
                    className="p-4 rounded-xl bg-stone-50 dark:bg-slate-800/50 border border-stone-200/70 dark:border-slate-800 relative group"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${note.type === 'Quote' ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'}`}>
                          {note.type}
                        </span>
                        {note.pageNumber > 0 && (
                          <span className="text-xs text-stone-400 font-medium">Page {note.pageNumber}</span>
                        )}
                      </div>
                      <button
                        onClick={() => deleteNote(book.id, note.id)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className={`text-sm ${note.type === 'Quote' ? 'font-serif italic text-slate-800 dark:text-slate-200 border-l-2 border-amber-400 pl-3 py-1' : 'text-slate-700 dark:text-slate-300'}`}>
                      "{note.content}"
                    </p>

                    {note.tags && note.tags.length > 0 && (
                      <div className="flex gap-1.5 mt-2.5">
                        {note.tags.map((tag, idx) => (
                          <span key={idx} className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200/70 dark:bg-slate-700 text-stone-600 dark:text-slate-300 font-medium">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
