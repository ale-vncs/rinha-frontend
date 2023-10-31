import { Box, IconButton } from '@mui/material';
import { ModeNight, WbSunny } from '@mui/icons-material';
import { useThemeProvider } from '@hooks/useThemeProvider';

export const ToggleThemeMode = () => {
  const { isDarkTheme, toggleDarkTheme } = useThemeProvider();

  return (
    <Box position={'absolute'} top={10} right={10}>
      <IconButton onClick={toggleDarkTheme}>{isDarkTheme ? <ModeNight /> : <WbSunny />}</IconButton>
    </Box>
  );
};
