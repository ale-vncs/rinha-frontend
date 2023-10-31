import { createTheme, responsiveFontSizes } from '@mui/material/styles';
import { useMemo } from 'react';

export const useCustomTheme = (isDarkTheme: boolean, colorSchemeIndex: number) => {
  const colorSchemeList = [
    {
      lineHover: '#53A9FF19',
      key: '#da6972',
      bracket: '#afafaf',
      normal: '#757575',
      string: '#8dbd6d',
      link: '#5c7fde',
      number: '#e468cc',
      boolean: '#d88f6d',
    },
    {
      lineHover: '#53A9FF19',
      key: '#89cac3',
      bracket: '#ec9e1c',
      normal: '#acc7c3',
      string: '#c68970',
      link: '#9a765e',
      number: '#a9bf81',
      boolean: '#2f65b0',
    },
    {
      lineHover: '#53A9FF19',
      key: '#c56e82',
      bracket: '#bbbdc3',
      normal: '#bbbdc3',
      string: '#6aaa72',
      link: '#6aaa72',
      number: '#2aabb7',
      boolean: '#ce8d6d',
    },
  ];

  const colorSchemeSelected = colorSchemeList[colorSchemeIndex];

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
              default: isDarkTheme ? '#282A36' : '#fff',
              paper: isDarkTheme ? '#282A36' : '#fff',
              dark: '#263238',
            },
            text: {
              primary: isDarkTheme ? '#F8F8F2' : 'rgb(0, 0, 0, 0.87)',
            },
            jsonViewerColors: {
              lineHover: {
                main: colorSchemeSelected.lineHover,
              },
              key: {
                main: colorSchemeSelected.key,
              },
              bracket: {
                main: colorSchemeSelected.bracket,
              },
              normal: {
                main: colorSchemeSelected.normal,
              },
              string: {
                main: colorSchemeSelected.string,
              },
              link: {
                main: colorSchemeSelected.link,
              },
              number: {
                main: colorSchemeSelected.number,
              },
              boolean: {
                main: colorSchemeSelected.boolean,
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
    [isDarkTheme, colorSchemeSelected],
  );
};
