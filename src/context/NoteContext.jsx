import { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

// First-time user welcome content
const WELCOME_NOTE = {
  id: 'welcome-note',
  title: 'Welcome to Markdown Notes',
  content: `# 🌟 Welcome to Markdown Notes!

A beautiful, distraction-free markdown editor with live preview. Perfect for notes, documentation, and more!

## 🚀 Quick Start

1. **Create a new note** - Click the + button or press \`Ctrl+N\`
2. **Write markdown** - Use the left panel for editing
3. **See live preview** - Watch your markdown render in real-time
4. **Auto-save** - Your work is automatically saved in your browser

## ✨ Features

- **Dark/Light mode** - Toggle with \`Ctrl+D\`
- **Keyboard shortcuts** - Work faster (press \`?\` to see them all)
- **Multiple notes** - Create, edit, and organize with ease
- **Offline support** - Works even without internet
- **Export notes** - Save your work as Markdown files

## 📝 Markdown Cheat Sheet

### Text Formatting
\`**Bold**\` → **Bold**  
\`*Italic*\` → *Italic*  
\`~~Strikethrough~~\` → ~~Strikethrough~~  
\`\`code\`\` → \`code\`

### Headers
\`# Big Header\`  
\`## Medium Header\`  
\`### Small Header\`

### Lists
\`- Item 1\`  
\`- Item 2\`  
\`  - Subitem\`

\`1. First\`  
\`2. Second\`

### Links & Images
\`[Link Text](https://example.com)\'  
\`![Alt Text](image.jpg)\`

### Code Blocks
\`\`\`javascript
function hello() {
  console.log('Hello!');
}
\`\`\`

## 🔗 Helpful Resources

- [Markdown Guide](https://www.markdownguide.org/) - Complete markdown reference
- [GitHub Markdown](https://guides.github.com/features/mastering-markdown/) - GitHub-flavored markdown
- [Markdown Table Generator](https://www.tablesgenerator.com/markdown_tables) - For creating tables

## 🎨 Customize Your Experience

- Try different color themes from the palette icon
- Toggle fullscreen mode with \`F11\`
- Press \`F1\` anytime to see this guide again

Happy writing! ✍️`,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Default note content
const DEFAULT_NOTE = {
  id: '',
  title: 'Untitled Note',
  content: '# Untitled Note\n\nStart writing here...',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

// Action types
const ACTIONS = {
  SET_NOTES: 'SET_NOTES',
  ADD_NOTE: 'ADD_NOTE',
  UPDATE_NOTE: 'UPDATE_NOTE',
  DELETE_NOTE: 'DELETE_NOTE',
  SET_ACTIVE_NOTE: 'SET_ACTIVE_NOTE',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_IS_LOADING: 'SET_IS_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Initial state
const initialState = {
  notes: [],
  activeNoteId: null,
  searchQuery: '',
  isLoading: true,
  error: null,
};

// Reducer function
function notesReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_NOTES:
      return { ...state, notes: action.payload, isLoading: false };
    case ACTIONS.ADD_NOTE:
      return { ...state, notes: [action.payload, ...state.notes] };
    case ACTIONS.UPDATE_NOTE:
      return {
        ...state,
        notes: state.notes.map(note => 
          note.id === action.payload.id ? { ...note, ...action.payload } : note
        ),
      };
    case ACTIONS.DELETE_NOTE:
      return {
        ...state,
        notes: state.notes.filter(note => note.id !== action.payload),
      };
    case ACTIONS.SET_ACTIVE_NOTE:
      return { ...state, activeNoteId: action.payload };
    case ACTIONS.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case ACTIONS.SET_IS_LOADING:
      return { ...state, isLoading: action.payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    default:
      return state;
  }
}

// Create context
const NoteContext = createContext();

// Provider component
export function NoteProvider({ children }) {
  const [state, dispatch] = useReducer(notesReducer, initialState);
  const { notes, activeNoteId, searchQuery } = state;

  // Load notes from localStorage on initial render
  useEffect(() => {
    try {
      const savedNotes = localStorage.getItem('markdown-notes');
      const hasUsedAppBefore = localStorage.getItem('markdown-notes-first-visit') !== null;
      
      if (savedNotes) {
        const parsedNotes = JSON.parse(savedNotes);
        dispatch({ type: ACTIONS.SET_NOTES, payload: parsedNotes });
        if (parsedNotes.length > 0) {
          dispatch({ type: ACTIONS.SET_ACTIVE_NOTE, payload: parsedNotes[0].id });
        }
      } else {
        // For first-time users, show the welcome note
        const welcomeNote = { ...WELCOME_NOTE };
        const firstNote = { 
          ...DEFAULT_NOTE, 
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        const initialNotes = [welcomeNote, firstNote];
        dispatch({ type: ACTIONS.SET_NOTES, payload: initialNotes });
        dispatch({ type: ACTIONS.SET_ACTIVE_NOTE, payload: welcomeNote.id });
        localStorage.setItem('markdown-notes', JSON.stringify(initialNotes));
        localStorage.setItem('markdown-notes-first-visit', 'true');
      }
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to load notes' });
      console.error('Error loading notes:', error);
    }
  }, []);

  // Save notes to localStorage when they change
  useEffect(() => {
    try {
      if (notes.length > 0) {
        localStorage.setItem('markdown-notes', JSON.stringify(notes));
      }
    } catch (error) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Failed to save notes' });
      console.error('Error saving notes:', error);
    }
  }, [notes]);

  // Create a new note
  const createNewNote = useCallback(() => {
    const newNote = {
      ...DEFAULT_NOTE,
      id: uuidv4(),
      title: 'Untitled Note',
      content: '# Untitled Note\n\nStart writing here...',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    dispatch({ type: ACTIONS.ADD_NOTE, payload: newNote });
    dispatch({ type: ACTIONS.SET_ACTIVE_NOTE, payload: newNote.id });
    return newNote;
  }, []);

  // Update note content
  const updateNoteContent = useCallback((id, content) => {
    const title = content.split('\n')[0]?.replace(/^#\s*/, '') || 'Untitled Note';
    dispatch({
      type: ACTIONS.UPDATE_NOTE,
      payload: {
        id,
        content,
        title,
        updatedAt: new Date().toISOString(),
      },
    });
  }, []);

  // Update note title
  const updateNoteTitle = useCallback((id, title) => {
    dispatch({
      type: ACTIONS.UPDATE_NOTE,
      payload: {
        id,
        title: title || 'Untitled Note',
        updatedAt: new Date().toISOString(),
      },
    });
  }, []);

  // Delete a note
  const deleteNote = useCallback((id) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    
    if (updatedNotes.length === 0) {
      const newNote = { 
        ...DEFAULT_NOTE, 
        id: uuidv4(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      dispatch({ type: ACTIONS.ADD_NOTE, payload: newNote });
      dispatch({ type: ACTIONS.SET_ACTIVE_NOTE, payload: newNote.id });
    } else if (activeNoteId === id) {
      dispatch({ type: ACTIONS.SET_ACTIVE_NOTE, payload: updatedNotes[0].id });
    }
    
    dispatch({ type: ACTIONS.DELETE_NOTE, payload: id });
  }, [activeNoteId, notes]);

  // Set active note
  const setActiveNoteId = useCallback((id) => {
    dispatch({ type: ACTIONS.SET_ACTIVE_NOTE, payload: id });
  }, []);

  // Set search query
  const setSearchQuery = useCallback((query) => {
    dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query });
  }, []);

  // Get active note
  const activeNote = notes.find(note => note.id === activeNoteId) || notes[0];

  // Filter notes based on search query
  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Value to be provided by the context
  const value = {
    notes,
    activeNoteId,
    activeNote,
    filteredNotes,
    searchQuery,
    isLoading: state.isLoading,
    error: state.error,
    createNewNote,
    updateNoteContent,
    updateNoteTitle,
    deleteNote,
    setActiveNoteId,
    setSearchQuery,
  };

  return (
    <NoteContext.Provider value={value}>
      {children}
    </NoteContext.Provider>
  );
}

// Custom hook for using the note context
export function useNotes() {
  const context = useContext(NoteContext);
  if (context === undefined) {
    throw new Error('useNotes must be used within a NoteProvider');
  }
  return context;
}

export default NoteContext;
