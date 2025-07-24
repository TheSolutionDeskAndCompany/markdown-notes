import { useState, useEffect } from 'react';
import { FiSun, FiMoon, FiSave, FiPlus, FiTrash2, FiEdit2, FiX, FiMaximize2, FiMinimize2 } from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { v4 as uuidv4 } from 'uuid';

// First-time user welcome content
const WELCOME_NOTE = {
  id: 'welcome-note',
  title: 'Welcome to Markdown Notes',
  content: `# 👋 Welcome to Markdown Notes!

This is a simple, beautiful markdown note-taking app that works offline.

## Quick Start Guide

1. **Create a new note** using the button in the top-right or press \`Ctrl+N\`
2. **Write markdown** in the left panel
3. **See the preview** update in real-time on the right
4. **Your notes are automatically saved** in your browser

## Markdown Cheat Sheet

### Text Formatting
- **Bold**: \`**bold**\`
- *Italic*: \`*italic*\`
- ~~Strikethrough~~: \`~~strikethrough~~\`

### Headers
\`\`\`
# H1
## H2
### H3
\`\`\`

### Lists
- Unordered item
- Another item

1. Ordered item
2. Another item

### Links & Images
[Link](https://example.com)

![Image](https://via.placeholder.com/150)

### Code
\`\`\`javascript
function hello() {
  console.log('Hello, world!');
}
\`\`\`

## Need Help?

- Click the "Keyboard Shortcuts" link in the footer
- Press \`F1\` anytime to see this guide again

Happy note-taking! 🎉`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default note content
const DEFAULT_NOTE = {
  id: uuidv4(),
  title: 'Untitled Note',
  content: '# Welcome to Markdown Notes\n\nStart writing your markdown here...\n\n## Features\n- Live preview\n- Multiple notes\n- Dark mode\n- Keyboard shortcuts\n\n```javascript\n// Example code block\nfunction helloWorld() {\n  console.log("Hello, world!");\n}\n```',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

function App() {
  const [notes, setNotes] = useState([]);
  const [activeNoteId, setActiveNoteId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
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
  const toggleFullscreen = () => {
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
  };
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
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
    <div className={`flex flex-col h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200`}>
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Markdown Notes</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={createNewNote}
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                New Note
              </button>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Toggle dark mode"
              >
                {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
              </button>
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-full text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                aria-label="Toggle fullscreen"
              >
                {isFullscreen ? <FiMinimize2 className="h-5 w-5" /> : <FiMaximize2 className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="relative">
              <input
                type="text"
                placeholder="Search notes..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filteredNotes.length > 0 ? (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotes.map((note) => (
                  <li key={note.id}>
                    <button
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${activeNoteId === note.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''}`}
                      onClick={() => setActiveNoteId(note.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {note.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatDate(note.updatedAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => deleteNote(note.id, e)}
                          className="ml-2 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                          aria-label="Delete note"
                        >
                          <FiTrash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                {searchQuery ? 'No matching notes found' : 'No notes yet'}
              </div>
            )}
          </div>
        </div>
        
        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeNote && (
            <>
              {/* Note header */}
              <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    {isEditingTitle ? (
                      <div className="flex items-center">
                        <input
                          type="text"
                          className="text-xl font-semibold bg-transparent border-b border-blue-500 focus:outline-none focus:ring-0 w-full text-gray-900 dark:text-white"
                          value={activeNote.title}
                          onChange={(e) => {
                            const updatedNotes = notes.map(note => {
                              if (note.id === activeNoteId) {
                                return { ...note, title: e.target.value };
                              }
                              return note;
                            });
                            setNotes(updatedNotes);
                          }}
                          onBlur={() => updateNoteTitle(activeNote.title)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              updateNoteTitle(activeNote.title);
                            } else if (e.key === 'Escape') {
                              setIsEditingTitle(false);
                            }
                          }}
                          autoFocus
                        />
                        <button
                          onClick={() => setIsEditingTitle(false)}
                          className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                          <FiX className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center group">
                        <h2 
                          className="text-xl font-semibold text-gray-900 dark:text-white cursor-text"
                          onClick={() => setIsEditingTitle(true)}
                        >
                          {activeNote.title}
                        </h2>
                        <button
                          onClick={() => setIsEditingTitle(true)}
                          className="ml-2 p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                          aria-label="Edit title"
                        >
                          <FiEdit2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      Last updated: {formatDate(activeNote.updatedAt)}
                    </p>
                  </div>
                  <div className="ml-4 flex items-center">
                    <button
                      onClick={() => {
                        // Export as Markdown
                        const blob = new Blob([activeNote.content], { type: 'text/markdown' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${activeNote.title.replace(/\s+/g, '_').toLowerCase()}.md`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 text-sm leading-4 font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      title="Export as Markdown"
                    >
                      <FiSave className="mr-2 h-4 w-4" />
                      Export
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Editor and Preview */}
              <div className="flex-1 flex overflow-hidden">
                {/* Editor */}
                <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">EDITOR</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {activeNote.content.length} characters • {activeNote.content.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <div className="flex-1 overflow-auto">
                    <textarea
                      className="w-full h-full p-4 font-mono text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-800 focus:outline-none resize-none"
                      value={activeNote.content}
                      onChange={(e) => handleNoteChange(e.target.value)}
                      placeholder="Start writing your markdown here..."
                      spellCheck="false"
                    />
                  </div>
                </div>
                
                {/* Preview */}
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">PREVIEW</span>
                  </div>
                  <div className="flex-1 overflow-auto p-4 markdown">
                    {renderMarkdown()}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Footer */}
      <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {notes.length} note{notes.length !== 1 ? 's' : ''} • {new Date().getFullYear()} Markdown Notes
          </p>
          <div className="flex items-center space-x-2">
            <a
              href="#"
              className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Show keyboard shortcuts modal
                alert('Keyboard Shortcuts:\n\n' +
                  '• Ctrl+N: New Note\n' +
                  '• Ctrl+S: Save (auto-saves)\n' +
                  '• Ctrl+D: Toggle Dark Mode\n' +
                  '• F11: Toggle Fullscreen');
              }}
            >
              Keyboard Shortcuts
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
