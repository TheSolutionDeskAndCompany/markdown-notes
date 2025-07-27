import { useState, useEffect, useRef, useCallback } from 'react';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { useNotes } from '../../context/NoteContext';

export default function NoteEditor() {
  const { activeNote, updateNoteContent, updateNoteTitle } = useNotes();
  const [content, setContent] = useState('');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState('');
  const titleInputRef = useRef(null);
  const textareaRef = useRef(null);

  // Update local state when active note changes
  useEffect(() => {
    if (activeNote) {
      setContent(activeNote.content || '');
      setTitle(activeNote.title || 'Untitled Note');
    }
  }, [activeNote]);

  // Focus the editor when active note changes
  useEffect(() => {
    if (activeNote && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [activeNote]);

  // Handle content changes with debounce
  useEffect(() => {
    if (!activeNote) return;
    
    const timer = setTimeout(() => {
      if (content !== activeNote.content) {
        updateNoteContent(activeNote.id, content);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [content, activeNote, updateNoteContent]);

  // Handle title update
  const handleTitleUpdate = useCallback(() => {
    if (!activeNote) return;
    
    const newTitle = title.trim() || 'Untitled Note';
    updateNoteTitle(activeNote.id, newTitle);
    setIsEditingTitle(false);
  }, [activeNote, title, updateNoteTitle]);

  // Handle keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // Save: Ctrl+S or Cmd+S
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      // Show save indicator
      const saveBtn = document.querySelector('[aria-label="Save note"]');
      if (saveBtn) {
        saveBtn.classList.add('animate-ping');
        setTimeout(() => saveBtn.classList.remove('animate-ping'), 1000);
      }
    }
    
    // New line with Shift+Enter
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newValue = content.substring(0, start) + '\n' + content.substring(end);
      setContent(newValue);
      
      // Move cursor to the new line
      setTimeout(() => {
        textareaRef.current.selectionStart = start + 1;
        textareaRef.current.selectionEnd = start + 1;
      }, 0);
    }
  }, [content]);

  if (!activeNote) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
        <p>Select a note or create a new one</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
      {/* Editor header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            {isEditingTitle ? (
              <div className="flex items-center">
                <input
                  ref={titleInputRef}
                  type="text"
                  className="text-xl font-semibold bg-transparent border-b border-blue-500 focus:outline-none focus:ring-0 w-full text-gray-900 dark:text-white"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleUpdate}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleTitleUpdate();
                    } else if (e.key === 'Escape') {
                      setIsEditingTitle(false);
                      setTitle(activeNote.title);
                    }
                  }}
                  autoFocus
                />
                <button
                  onClick={() => {
                    setIsEditingTitle(false);
                    setTitle(activeNote.title);
                  }}
                  className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  aria-label="Cancel editing"
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
                  onClick={() => {
                    setIsEditingTitle(true);
                    setTimeout(() => titleInputRef.current?.focus(), 0);
                  }}
                  className="ml-2 p-1 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                  aria-label="Edit title"
                >
                  <FiEdit2 className="h-4 w-4" />
                </button>
              </div>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Last updated: {new Date(activeNote.updatedAt).toLocaleString()}
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
              aria-label="Export note as Markdown file"
            >
              <FiSave className="mr-2 h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>
      
      {/* Editor content */}
      <div className="flex-1 flex flex-col">
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">EDITOR</span>
          {activeNote && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {content.length} characters • {content.split(/\s+/).filter(Boolean).length} words
            </span>
          )}
        </div>
        <div className="flex-1 overflow-auto">
          <textarea
            ref={textareaRef}
            className="w-full h-full p-4 text-gray-900 dark:text-white bg-white dark:bg-gray-900 focus:outline-none resize-none focus:ring-2 focus:ring-blue-500 font-mono text-sm leading-relaxed"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start writing your markdown here..."
            spellCheck="false"
            aria-label="Note content"
          />
        </div>
      </div>
    </div>
  );
}
