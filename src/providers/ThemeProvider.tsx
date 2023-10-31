import { createContext, PropsWithChildren, useState } from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider as MaterialUIThemeProvider } from '@mui/material/styles';
import { useCustomTheme } from '@styles/useCustomTheme';
import { GlobalStyles } from '@styles/GlobalStyles';

interface ThemeContextProps {
  isDarkTheme: boolean;
  toggleDarkTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextProps>({} as never);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [isDarkTheme, setIsDarkTheme] = useState(prefersDarkMode ?? false);

  const theme = useCustomTheme(isDarkTheme);

  const toggleDarkTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleDarkTheme }}>
      <MaterialUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MaterialUIThemeProvider>
    </ThemeContext.Provider>
  );
};
