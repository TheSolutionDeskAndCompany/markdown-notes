import { useState, useMemo, useCallback } from 'react';
import { FiSearch, FiTrash2 } from 'react-icons/fi';
import { useNotes } from '../../context/NoteContext';

// Format date to a readable format
const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function NoteList() {
  const { 
    filteredNotes, 
    activeNoteId, 
    setActiveNoteId, 
    deleteNote,
    searchQuery,
    setSearchQuery,
    notes
  } = useNotes();
  
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  
  // Debounce search input
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setLocalSearchQuery(value);
    
    // Debounce the search to avoid too many re-renders
    const timeoutId = setTimeout(() => {
      setSearchQuery(value);
    }, 300);
    
    return () => clearTimeout(timeoutId);
  }, [setSearchQuery]);
  
  // Memoize the notes list to prevent unnecessary re-renders
  const notesList = useMemo(() => {
    if (!filteredNotes.length) {
      return (
        <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
          {searchQuery ? 'No matching notes found' : 'No notes yet'}
        </div>
      );
    }
    
    return (
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {filteredNotes.map((note) => (
          <li key={note.id}>
            <button
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                activeNoteId === note.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
              }`}
              onClick={() => setActiveNoteId(note.id)}
              aria-current={activeNoteId === note.id ? 'true' : 'false'}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {note.title || 'Untitled Note'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {formatDate(note.updatedAt)}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this note?')) {
                      deleteNote(note.id);
                    }
                  }}
                  className="ml-2 p-1 text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label={`Delete note: ${note.title}`}
                >
                  <FiTrash2 className="h-4 w-4" />
                </button>
              </div>
            </button>
          </li>
        ))}
      </ul>
    );
  }, [filteredNotes, activeNoteId, searchQuery, setActiveNoteId, deleteNote]);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FiSearch className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search notes..."
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            value={localSearchQuery}
            onChange={handleSearchChange}
            aria-label="Search notes"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {notes.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
            <p>No notes yet. Create your first note!</p>
          </div>
        ) : (
          notesList
        )}
      </div>
      <div className="p-2 text-xs text-center text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
        {filteredNotes.length} {filteredNotes.length === 1 ? 'note' : 'notes'}
      </div>
    </div>
  );
}
