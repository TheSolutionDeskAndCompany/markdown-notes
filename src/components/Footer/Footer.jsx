import { useNotes } from '../../context/NoteContext';

export default function Footer() {
  const { notes } = useNotes();
  const currentYear = new Date().getFullYear();

  const handleKeyboardShortcuts = (e) => {
    e.preventDefault();
    // Show keyboard shortcuts modal
    alert('Keyboard Shortcuts:\n\n' +
      '• Ctrl+N: New Note\n' +
      '• Ctrl+S: Save (auto-saves)\n' +
      '• Ctrl+D: Toggle Dark Mode\n' +
      '• F11: Toggle Fullscreen');
  };

  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-2 px-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {notes.length} note{notes.length !== 1 ? 's' : ''} • {currentYear} Markdown Notes
        </p>
        <div className="flex items-center space-x-4">
          <button
            onClick={handleKeyboardShortcuts}
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors focus:outline-none"
            aria-label="View keyboard shortcuts"
          >
            Keyboard Shortcuts
          </button>
          <a
            href="https://github.com/yourusername/markdown-notes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
            aria-label="View on GitHub"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
