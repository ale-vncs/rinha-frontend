import { createContext, PropsWithChildren, useState } from 'react';
import { CssBaseline, useMediaQuery } from '@mui/material';
import { ThemeProvider as MaterialUIThemeProvider } from '@mui/material/styles';
import { useCustomTheme } from '@styles/useCustomTheme';
import { GlobalStyles } from '@styles/GlobalStyles';

interface ThemeContextProps {
  isDarkTheme: boolean;
  toggleDarkTheme: () => void;
  colorSchemeSelected: number;
  changeColorScheme: (colorSchemeIndex: number) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({} as never);

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  const [isDarkTheme, setIsDarkTheme] = useState(prefersDarkMode ?? false);
  const [colorScheme, setColorScheme] = useState(0);

  const theme = useCustomTheme(isDarkTheme, colorScheme);

  const toggleDarkTheme = () => {
    setIsDarkTheme((prev) => !prev);
  };

  const changeColorScheme = (colorSchemaIndex: number) => {
    setColorScheme(colorSchemaIndex);
  };

  return (
    <ThemeContext.Provider
      value={{ isDarkTheme, toggleDarkTheme, changeColorScheme, colorSchemeSelected: colorScheme }}
    >
      <MaterialUIThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles />
        {children}
      </MaterialUIThemeProvider>
    </ThemeContext.Provider>
  );
};
