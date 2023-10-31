import { Box, IconButton } from '@mui/material';
import { ModeNight, WbSunny } from '@mui/icons-material';
import { useThemeProvider } from '@hooks/useThemeProvider';

export const ToggleThemeMode = () => {
  const { isDarkTheme, toggleDarkTheme } = useThemeProvider();

  return (
    <Box position={'fixed'} top={2} right={2}>
      <IconButton onClick={toggleDarkTheme}>{isDarkTheme ? <ModeNight /> : <WbSunny />}</IconButton>
    </Box>
  );
};
