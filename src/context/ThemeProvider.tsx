import Cookies from 'js-cookie';
import * as React from 'react';

enum Theme {
  DARK = 'dark',
  LIGHT = 'light',
}
const themes: Array<Theme> = Object.values(Theme);

interface ThemeContextType {
  theme: Theme | null;
  handleUpdateTheme: (value: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextType | undefined>(
  undefined
);

const prefersDarkMQ = '(prefers-color-scheme: dark)';
const getPreferredTheme = () =>
  window.matchMedia(prefersDarkMQ).matches ? Theme.DARK : Theme.LIGHT;

function ThemeProvider({
  children,
  specifiedTheme,
}: {
  children: React.ReactNode;
  specifiedTheme: Theme | null;
}) {
  const [theme, setTheme] = React.useState<Theme | null>(() => {
    if (specifiedTheme) {
      if (themes.includes(specifiedTheme)) {
        return specifiedTheme;
      }
      return null;
    }

    if (typeof document === 'undefined') {
      return null;
    }

    return getPreferredTheme();
  });

  function handleUpdateTheme(value: Theme) {
    Cookies.set('theme', value);
    setTheme(value);
  }

  const mountRun = React.useRef(false);

  React.useEffect(() => {
    if (!mountRun.current) {
      mountRun.current = true;
      return;
    }
    if (!theme) {
      return;
    }

    const body = document.querySelector('body');
    if (theme === Theme.DARK) {
      body?.classList.add('dark');
    } else {
      body?.classList.remove('dark');
    }
  }, [theme]);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia(prefersDarkMQ);
    const handleChange = () => {
      setTheme(mediaQuery.matches ? Theme.DARK : Theme.LIGHT);
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, handleUpdateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

function useTheme() {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

function isTheme(value: unknown): value is Theme {
  return typeof value === 'string' && themes.includes(value as Theme);
}

export { isTheme, Theme, ThemeProvider, useTheme };
