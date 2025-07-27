import { useState } from 'react';
import { FiPalette, FiChevronDown, FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeSwitcher() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { isDarkMode, currentTheme, themes, toggleDarkMode, changeTheme } = useTheme();

  return (
    <div className="flex items-center space-x-2">
      {/* Theme Selector */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-1 p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          title="Change theme"
          aria-expanded={showDropdown}
          aria-haspopup="true"
        >
          <FiPalette className="w-5 h-5" aria-hidden="true" />
          <FiChevronDown className="w-4 h-4" aria-hidden="true" />
        </button>
        
        {showDropdown && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setShowDropdown(false)}
              aria-hidden="true"
            />
            <div 
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="theme-menu"
            >
              <div className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                Select Theme
              </div>
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    changeTheme(theme.id);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-2 ${
                    currentTheme.id === theme.id 
                      ? `bg-gray-100 dark:bg-gray-700 text-${theme.color.replace('bg-', 'text-')} dark:text-${theme.color.replace('bg-', 'text-')}` 
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  role="menuitem"
                >
                  <span 
                    className={`w-4 h-4 rounded-full ${theme.color} border border-gray-300 dark:border-gray-600`}
                    aria-hidden="true"
                  />
                  <span>{theme.name}</span>
                  {currentTheme.id === theme.id && (
                    <span className="ml-auto" aria-hidden="true">✓</span>
                  )}
                </button>
              ))}
              
              <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
              
              <button
                onClick={() => {
                  toggleDarkMode();
                  setShowDropdown(false);
                }}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2"
                role="menuitem"
              >
                {isDarkMode ? (
                  <>
                    <FiSun className="w-4 h-4" aria-hidden="true" />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <FiMoon className="w-4 h-4" aria-hidden="true" />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
