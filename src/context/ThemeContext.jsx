import { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Theme definitions
const THEMES = [
  { id: 'blue', name: 'Ocean', color: 'bg-blue-600' },
  { id: 'purple', name: 'Purple Haze', color: 'bg-purple-600' },
  { id: 'emerald', name: 'Emerald', color: 'bg-emerald-600' },
  { id: 'rose', name: 'Rose', color: 'bg-rose-500' },
];

// Initial state
const initialState = {
  isDarkMode: false,
  currentTheme: 'blue',
  isFullscreen: false,
  themes: THEMES,
};

// Create context
const ThemeContext = createContext();

// Provider component
export function ThemeProvider({ children }) {
  const [state, setState] = useState(initialState);
  const { isDarkMode, currentTheme, isFullscreen, themes } = state;

  // Load theme from localStorage on initial render
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('markdown-notes-theme');
      const savedColorTheme = localStorage.getItem('markdown-notes-color-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      // Set dark mode based on saved preference or system preference
      const darkMode = savedTheme 
        ? savedTheme === 'dark' 
        : prefersDark;
      
      // Set color theme
      const theme = savedColorTheme || 'blue';
      
      setState(prev => ({
        ...prev,
        isDarkMode: darkMode,
        currentTheme: theme,
      }));

      // Apply dark mode class to document
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !isDarkMode;
    
    setState(prev => ({
      ...prev,
      isDarkMode: newDarkMode,
    }));

    // Save to localStorage
    localStorage.setItem('markdown-notes-theme', newDarkMode ? 'dark' : 'light');
    
    // Apply to document
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Change theme
  const changeTheme = useCallback((themeId) => {
    setState(prev => ({
      ...prev,
      currentTheme: themeId,
    }));
    
    // Save to localStorage
    localStorage.setItem('markdown-notes-color-theme', themeId);
  }, []);

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setState(prev => ({ ...prev, isFullscreen: true }));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setState(prev => ({ ...prev, isFullscreen: false }));
      }
    }
  }, []);

  // Get current theme
  const getCurrentTheme = useCallback(() => {
    return themes.find(t => t.id === currentTheme) || themes[0];
  }, [currentTheme, themes]);

  // Value to be provided by the context
  const value = {
    isDarkMode,
    currentTheme: getCurrentTheme(),
    isFullscreen,
    themes,
    toggleDarkMode,
    changeTheme,
    toggleFullscreen,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook for using the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
