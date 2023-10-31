import { GlobalStyles as GlobalStylesMui, useTheme } from '@mui/material';

export const GlobalStyles = () => {
  const theme = useTheme();

  const scrollbarSize = '10px';

  return (
    <GlobalStylesMui
      styles={{
        '*': {
          boxSizing: 'border-box',
          scrollBehavior: 'smooth',
        },
        body: {
          margin: 0,
          padding: 0,
          webkitFontSmoothing: 'antialiased',
          mozOsxFontSmoothing: 'grayscale',
        },
        '#root': {
          height: '100vh',
          width: '100vw',
        },
        '*::-webkit-scrollbar': {
          width: scrollbarSize,
          backgroundColor: theme.palette.background.paper,
        },
        '*::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.primary.light,
          '&:hover': {
            backgroundColor: theme.palette.primary.light,
          },
        },
        '*::-webkit-scrollbar:horizontal': {
          height: scrollbarSize,
        },
      }}
    />
  );
};
