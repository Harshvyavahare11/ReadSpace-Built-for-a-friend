import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Toast } from './components/common/Toast';
import { QuickLogModal } from './components/common/QuickLogModal';
import { AddBookModal } from './components/common/AddBookModal';
import { BookDetailModal } from './components/common/BookDetailModal';

import { DashboardView } from './components/dashboard/DashboardView';
import { LibraryView } from './components/library/LibraryView';
import { ReadingTrackerView } from './components/tracker/ReadingTrackerView';
import { ReadingGoalsView } from './components/goals/ReadingGoalsView';
import { NotesView } from './components/notes/NotesView';
import { PhysicalBookMode } from './components/physical/PhysicalBookMode';
import { DiscoverView } from './components/discover/DiscoverView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout = () => {
  const { activeTab } = useApp();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedBookForDetailModal, setSelectedBookForDetailModal] = useState(null);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView onOpenBookDetails={(b) => setSelectedBookForDetailModal(b)} />;
      case 'library':
        return <LibraryView onOpenBookDetails={(b) => setSelectedBookForDetailModal(b)} />;
      case 'tracker':
        return <ReadingTrackerView onOpenBookDetails={(b) => setSelectedBookForDetailModal(b)} />;
      case 'goals':
        return <ReadingGoalsView />;
      case 'notes':
        return <NotesView />;
      case 'physical':
        return <PhysicalBookMode />;
      case 'discover':
        return <DiscoverView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenBookDetails={(b) => setSelectedBookForDetailModal(b)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF9F4] dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 flex flex-col">
      {/* Top Navbar */}
      <Navbar onOpenMobileMenu={() => setIsMobileNavOpen(true)} />

      {/* Main Content Area */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <Sidebar 
          isMobileOpen={isMobileNavOpen} 
          onCloseMobile={() => setIsMobileNavOpen(false)} 
        />

        {/* Dynamic View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Modals & Overlay Components */}
      <QuickLogModal />
      <AddBookModal />
      <BookDetailModal 
        book={selectedBookForDetailModal} 
        onClose={() => setSelectedBookForDetailModal(null)} 
      />
      <Toast />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
