import { useState, useEffect, useCallback } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { NoteProvider } from './context/NoteContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header/Header';
import NoteList from './components/NoteList/NoteList';
import NoteEditor from './components/NoteEditor/NoteEditor';
import MarkdownPreview from './components/MarkdownPreview/MarkdownPreview';
import Footer from './components/Footer/Footer';
import './App.css';

// Error boundary fallback component
function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div role="alert" className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-md max-w-2xl mx-auto my-8">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
            Something went wrong
          </h3>
          <div className="mt-2 text-sm text-red-700 dark:text-red-300">
            <p>{error.message}</p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 dark:text-red-100 dark:bg-red-900/50 dark:hover:bg-red-800/50"
              onClick={resetErrorBoundary}
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App component
function AppContent() {
  const { activeNote, isFullscreen, toggleFullscreen } = useTheme();
  const { isLoading, error } = useNotes();

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle fullscreen: F11
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleFullscreen]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 dark:text-red-400">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <NoteList />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeNote ? (
            <div className="flex-1 flex overflow-hidden">
              <NoteEditor />
              <MarkdownPreview />
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
              <p>No note selected</p>
            </div>
          )}
        </div>
      </div>
      
      <Footer />
      
      {/* Fullscreen toggle button (positioned absolutely) */}
      <button
        onClick={toggleFullscreen}
        className="fixed bottom-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-50"
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <FiMinimize2 className="w-5 h-5" />
        ) : (
          <FiMaximize2 className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

// Main App component with providers
function App() {
  
  // Load notes and theme from localStorage on initial render
  useEffect(() => {
    const savedNotes = localStorage.getItem('markdown-notes');
    const savedTheme = localStorage.getItem('markdown-notes-theme');
    const hasUsedAppBefore = localStorage.getItem('markdown-notes-first-visit') !== null;
    
    if (savedNotes) {
      const parsedNotes = JSON.parse(savedNotes);
      setNotes(parsedNotes);
      if (parsedNotes.length > 0) {
        setActiveNoteId(parsedNotes[0].id);
      }
    } else {
      // For first-time users, show the welcome note
      const welcomeNote = { ...WELCOME_NOTE };
      const firstNote = { ...DEFAULT_NOTE };
      setNotes([welcomeNote, firstNote]);
      setActiveNoteId(welcomeNote.id);
      saveNotes([welcomeNote, firstNote]);
      localStorage.setItem('markdown-notes-first-visit', 'true');
    }
    
    // Set theme
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);
  
  // Save notes to localStorage whenever they change
  const saveNotes = (notesToSave) => {
    localStorage.setItem('markdown-notes', JSON.stringify(notesToSave));
  };
  
  // Theme management
  const themes = [
    { id: 'blue', name: 'Ocean', color: 'bg-blue-600' },
    { id: 'purple', name: 'Purple Haze', color: 'bg-purple-600' },
    { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
    { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
  ];

  // Toggle theme dropdown
  const toggleThemeDropdown = () => {
    setShowThemeDropdown(!showThemeDropdown);
  };

  // Change theme
  const changeTheme = (themeId) => {
    setCurrentTheme(themeId);
    setShowThemeDropdown(false);
    localStorage.setItem('markdown-notes-color-theme', themeId);
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('markdown-notes-theme', newDarkMode ? 'dark' : 'light');
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('markdown-notes-color-theme');
    if (savedTheme) {
      setCurrentTheme(savedTheme);
    }
  }, []);

  // Get current theme
  const getTheme = () => {
    return themes.find(t => t.id === currentTheme) || themes[0];
  };
  
  // Get current theme color
  const theme = getTheme();
  
  // Get active note
  const activeNote = notes.find(note => note.id === activeNoteId) || notes[0];
  
  // Handle note content change
  const handleNoteChange = (content) => {
    if (!activeNote) return;
    
    const updatedNotes = notes.map(note => {
      if (note.id === activeNoteId) {
        return {
          ...note,
          content,
          updatedAt: new Date().toISOString(),
          title: content.split('\n')[0]?.replace(/^#\s*/, '') || 'Untitled Note',
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };
  
  // Create a new note
  const createNewNote = () => {
    const newNote = {
      ...DEFAULT_NOTE,
      id: uuidv4(),
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing here...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    const updatedNotes = [newNote, ...notes];
    setNotes(updatedNotes);
    setActiveNoteId(newNote.id);
    saveNotes(updatedNotes);
    setIsEditingTitle(true);
  };
  
  // Delete a note
  const deleteNote = (id, e) => {
    e.stopPropagation();
    const updatedNotes = notes.filter(note => note.id !== id);
    
    if (updatedNotes.length === 0) {
      const newNote = { ...DEFAULT_NOTE, id: uuidv4() };
      updatedNotes.push(newNote);
      setActiveNoteId(newNote.id);
    } else if (activeNoteId === id) {
      setActiveNoteId(updatedNotes[0].id);
    }
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
  };
  
  // Update note title
  const updateNoteTitle = (newTitle) => {
    if (!activeNote) return;
    
    const updatedNotes = notes.map(note => {
      if (note.id === activeNoteId) {
        return {
          ...note,
          title: newTitle || 'Untitled Note',
          updatedAt: new Date().toISOString(),
        };
      }
      return note;
    });
    
    setNotes(updatedNotes);
    saveNotes(updatedNotes);
    setIsEditingTitle(false);
  };
  
  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle fullscreen with F11
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Toggle sidebar with Ctrl+B or Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      
      // Toggle preview with Ctrl+P or Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsPreviewMode(prev => !prev);
      }
      
      // Toggle editor with Ctrl+E or Cmd+E
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setIsEditorMode(prev => !prev);
      }
      
      // Show help: F1
      if (e.key === 'F1') {
        e.preventDefault();
        setActiveNoteId(notes.find(note => note.id === 'welcome-note') ? 'welcome-note' : notes[0]?.id);
        return;
      }
      
      // Save: Ctrl+S or Cmd+S
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        // Show save confirmation
        const saveBtn = document.querySelector('[aria-label="Save note"]');
        if (saveBtn) {
          saveBtn.classList.add('animate-ping');
          setTimeout(() => saveBtn.classList.remove('animate-ping'), 1000);
        }
      }
      
      // New note: Ctrl+N or Cmd+N
      if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
        createNewNote();
      }
      
      // Toggle dark mode: Ctrl+D or Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        toggleDarkMode();
      }
      
      // Toggle fullscreen: F11
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Search notes: Ctrl+K or Cmd+K
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('input[placeholder="Search notes..."]');
        if (searchInput) searchInput.focus();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [notes, activeNoteId, isDarkMode]);
  
  // Render markdown with syntax highlighting
  const renderMarkdown = () => {
    return (
      <ReactMarkdown
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                language={match[1]}
                style={isDarkMode ? atomDark : githubGist}
                customStyle={{
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                  borderRadius: '0.5rem',
                  padding: '1rem',
                  margin: '1rem 0',
                }}
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {activeNote?.content || ''}
      </ReactMarkdown>
    );
  };
  
  // Theme styles for syntax highlighting
  const githubGist = {
    'pre[class*="language-"]': {
      backgroundColor: '#f6f8fa',
      color: '#24292e',
    },
    'code[class*="language-"]': {
      color: '#24292e',
    },
    '.token.comment': {
      color: '#6a737d',
    },
    '.token.keyword': {
      color: '#d73a49',
    },
    '.token.string': {
      color: '#032f62',
    },
    '.token.function': {
      color: '#6f42c1',
    },
  };
  
  const atomDark = {
    'pre[class*="language-"]': {
      backgroundColor: '#1e293b',
      color: '#f8fafc',
    },
    'code[class*="language-"]': {
      color: '#f8fafc',
    },
    '.token.comment': {
      color: '#64748b',
    },
    '.token.keyword': {
      color: '#f472b6',
    },
    '.token.string': {
      color: '#7dd3fc',
    },
    '.token.function': {
      color: '#a78bfa',
    },
  };
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider>
        <NoteProvider>
          <AppContent />
        </NoteProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Export the App component as default
export default function AppWrapper() {
  return (
    <ErrorBoundary 
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
    >
      <ThemeProvider>
        <NoteProvider>
          <App />
        </NoteProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

// Main App component with all the UI logic
function App() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [isEditorMode, setIsEditorMode] = useState(true);

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  // Handle fullscreen change
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Toggle fullscreen with F11
      if (e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      }
      
      // Toggle sidebar with Ctrl+B or Cmd+B
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setIsSidebarOpen(prev => !prev);
      }
      
      // Toggle preview with Ctrl+P or Cmd+P
      if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        setIsPreviewMode(prev => !prev);
      }
      
      // Toggle editor with Ctrl+E or Cmd+E
      if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        setIsEditorMode(prev => !prev);
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [toggleFullscreen]);

  return (
    <div className={`flex flex-col min-h-screen bg-white dark:bg-gray-900 ${isFullscreen ? 'fixed inset-0' : ''}`}>
      <Header />
      <main className="flex-1 flex overflow-hidden">
        {isSidebarOpen && <NoteList />}
        <div className="flex-1 flex overflow-hidden">
          {isEditorMode && (
            <div className={isPreviewMode ? 'w-1/2' : 'w-full'}>
              <NoteEditor />
            </div>
          )}
          {isPreviewMode && (
            <div className={isEditorMode ? 'w-1/2' : 'w-full'}>
              <MarkdownPreview />
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
