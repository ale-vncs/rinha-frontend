import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { useMemo } from 'react';

export const useCustomTheme = (isDarkTheme: boolean) => {
  return useMemo(
    () =>
      responsiveFontSizes(
        createTheme({
          palette: {
            mode: isDarkTheme ? 'dark' : 'light',
            primary: {
              main: '#4799be',
            },
            secondary: {
              main: '#d5718e',
            },
            white: {
              main: '#FFF',
              contrastText: '#000',
            },
            background: {
              default: isDarkTheme ? '#282A36' : undefined,
              paper: isDarkTheme ? '#282A36' : undefined,
              dark: '#263238',
            },
            text: {
              primary: isDarkTheme ? '#F8F8F2' : 'rgb(0, 0, 0, 0.87)',
            },
            jsonViewerColors: {
              lineHover: {
                main: '#53A9FF19',
              },
              key: {
                main: '#da6972',
              },
              bracket: {
                main: '#afafaf',
              },
              normal: {
                main: '#757575',
              },
              string: {
                main: '#8dbd6d',
              },
              link: {
                main: '#5c7fde',
              },
              number: {
                main: '#e468cc',
              },
              boolean: {
                main: '#d88f6d',
              },
            },
          },
          typography: {
            fontFamily: 'Nunito, sans-serif',
          },
          components: {
            MuiButton: {
              styleOverrides: {
                root: {
                  textTransform: 'unset',
                },
              },
            },
          },
        }),
      ),
    [isDarkTheme],
  );
};
