import { FiPlus } from 'react-icons/fi';
import { useNotes } from '../../context/NoteContext';
import { useTheme } from '../../context/ThemeContext';
import ThemeSwitcher from '../ThemeSwitcher/ThemeSwitcher';

export default function Header() {
  const { createNewNote } = useNotes();
  const { currentTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Markdown Notes</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={createNewNote}
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white ${currentTheme.color} hover:${currentTheme.color.replace('600', '700')} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${currentTheme.color.replace('600', '500')}`}
            >
              <FiPlus className="mr-2 h-4 w-4" />
              New Note
            </button>
            <ThemeSwitcher />
          </div>
        </div>
      </div>
    </header>
  );
}
