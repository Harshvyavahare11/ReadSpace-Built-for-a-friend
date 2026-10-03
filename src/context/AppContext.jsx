import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { INITIAL_BOOKS, INITIAL_READING_LOGS, INITIAL_PROFILE } from '../data/sampleBooks';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // LocalStorage helper initialization
  const [books, setBooks] = useState(() => {
    const saved = localStorage.getItem('readspace_books');
    return saved ? JSON.parse(saved) : INITIAL_BOOKS;
  });

  const [readingLogs, setReadingLogs] = useState(() => {
    const saved = localStorage.getItem('readspace_logs');
    return saved ? JSON.parse(saved) : INITIAL_READING_LOGS;
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('readspace_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('readspace_theme') || 'light';
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedBookIdForModal, setSelectedBookIdForModal] = useState(null);
  const [isQuickLogOpen, setIsQuickLogOpen] = useState(false);
  const [isAddBookOpen, setIsAddBookOpen] = useState(false);
  
  // Toast notifications state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('readspace_books', JSON.stringify(books));
  }, [books]);

  useEffect(() => {
    localStorage.setItem('readspace_logs', JSON.stringify(readingLogs));
  }, [readingLogs]);

  useEffect(() => {
    localStorage.setItem('readspace_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('readspace_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // CRUD Operations for Books
  const addBook = (newBook) => {
    const bookToAdd = {
      id: 'b_' + Date.now(),
      title: newBook.title || 'Untitled',
      author: newBook.author || 'Unknown Author',
      coverUrl: newBook.coverUrl || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=600',
      status: newBook.status || 'Want to Read',
      genre: newBook.genre || 'Fiction',
      currentPage: Number(newBook.currentPage) || 0,
      totalPages: Number(newBook.totalPages) || 300,
      rating: Number(newBook.rating) || 0,
      startDate: newBook.startDate || (newBook.status === 'Currently Reading' ? new Date().toISOString().split('T')[0] : null),
      targetFinishDate: newBook.targetFinishDate || null,
      completedDate: newBook.status === 'Completed' ? new Date().toISOString().split('T')[0] : null,
      isbn: newBook.isbn || '',
      format: newBook.format || 'Paperback',
      description: newBook.description || '',
      physicalBookmarkPage: newBook.currentPage || 0,
      notes: newBook.notes || []
    };

    setBooks(prev => [bookToAdd, ...prev]);
    showToast(`Added "${bookToAdd.title}" to your library!`, 'success');
  };

  const updateBook = (bookId, updatedFields) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        const updated = { ...b, ...updatedFields };
        
        // Auto-check completion
        if (updated.currentPage >= updated.totalPages && updated.totalPages > 0) {
          if (updated.status !== 'Completed') {
            updated.status = 'Completed';
            updated.completedDate = new Date().toISOString().split('T')[0];
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
            showToast(`🎉 Congratulations! You finished "${updated.title}"!`, 'success');
          }
        }
        return updated;
      }
      return b;
    }));
  };

  const deleteBook = (bookId) => {
    const book = books.find(b => b.id === bookId);
    setBooks(prev => prev.filter(b => b.id !== bookId));
    showToast(`Removed "${book ? book.title : 'Book'}" from library.`, 'info');
  };

  // Log Daily Progress
  const logProgress = (bookId, pagesRead, durationMinutes = 0) => {
    const targetBook = books.find(b => b.id === bookId);
    if (!targetBook) return;

    const pages = Number(pagesRead);
    const newPage = Math.min(targetBook.totalPages, targetBook.currentPage + pages);
    
    // Update book page
    updateBook(bookId, {
      currentPage: newPage,
      physicalBookmarkPage: newPage,
      status: targetBook.status === 'Want to Read' ? 'Currently Reading' : targetBook.status,
      startDate: targetBook.startDate || new Date().toISOString().split('T')[0]
    });

    // Add reading log entry
    const newLog = {
      id: 'l_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      pagesRead: pages,
      durationMinutes: Number(durationMinutes) || 0,
      bookId
    };

    setReadingLogs(prev => [newLog, ...prev]);

    showToast(`Logged ${pages} pages for "${targetBook.title}"!`, 'success');
  };

  // Notes Management
  const addNote = (bookId, noteData) => {
    const newNote = {
      id: 'n_' + Date.now(),
      date: new Date().toISOString().split('T')[0],
      pageNumber: Number(noteData.pageNumber) || 0,
      type: noteData.type || 'Reflection',
      content: noteData.content,
      tags: noteData.tags ? noteData.tags.split(',').map(t => t.trim()) : []
    };

    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          notes: [newNote, ...(b.notes || [])]
        };
      }
      return b;
    }));

    showToast('Saved note to book!', 'success');
  };

  const deleteNote = (bookId, noteId) => {
    setBooks(prev => prev.map(b => {
      if (b.id === bookId) {
        return {
          ...b,
          notes: (b.notes || []).filter(n => n.id !== noteId)
        };
      }
      return b;
    }));
    showToast('Note deleted.', 'info');
  };

  const updateProfile = (newProfileData) => {
    setProfile(prev => ({ ...prev, ...newProfileData }));
    showToast('Profile settings updated successfully!', 'success');
  };

  const resetData = () => {
    setBooks(INITIAL_BOOKS);
    setReadingLogs(INITIAL_READING_LOGS);
    setProfile(INITIAL_PROFILE);
    showToast('Reset all data to default sample collection.', 'info');
  };

  // Helper Stats Calculations
  const totalBooksRead = books.filter(b => b.status === 'Completed').length;
  const currentlyReadingBooks = books.filter(b => b.status === 'Currently Reading');
  const totalPagesReadThisYear = readingLogs.reduce((acc, log) => acc + log.pagesRead, 0);

  // Calculate Streak
  const calculateStreak = () => {
    if (readingLogs.length === 0) return 0;
    const logDates = [...new Set(readingLogs.map(l => l.date))].sort().reverse();
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayStr = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    let streak = 0;
    let checkDate = new Date();

    // If active today or yesterday
    if (logDates.includes(todayStr) || logDates.includes(yesterdayStr)) {
      if (logDates.includes(todayStr)) {
        checkDate = new Date();
      } else {
        checkDate = new Date(Date.now() - 86400000);
      }

      while (true) {
        const dateStr = checkDate.toISOString().split('T')[0];
        if (logDates.includes(dateStr)) {
          streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    return streak;
  };

  const streakDays = calculateStreak();

  // Calculate Today's pages read
  const todayStr = new Date().toISOString().split('T')[0];
  const pagesReadToday = readingLogs
    .filter(l => l.date === todayStr)
    .reduce((sum, l) => sum + l.pagesRead, 0);

  return (
    <AppContext.Provider value={{
      books,
      readingLogs,
      profile,
      theme,
      activeTab,
      setActiveTab,
      toggleTheme,
      addBook,
      updateBook,
      deleteBook,
      logProgress,
      addNote,
      deleteNote,
      updateProfile,
      resetData,
      totalBooksRead,
      currentlyReadingBooks,
      totalPagesReadThisYear,
      streakDays,
      pagesReadToday,
      toast,
      showToast,
      isQuickLogOpen,
      setIsQuickLogOpen,
      isAddBookOpen,
      setIsAddBookOpen,
      selectedBookIdForModal,
      setSelectedBookIdForModal
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
