import { Box, IconButton } from '@mui/material';
import { ModeNight, WbSunny } from '@mui/icons-material';
import { useToggleTheme } from '@hooks/useToggleTheme';

export const ToggleThemeMode = () => {
  const { isDarkTheme, toggleDarkTheme } = useToggleTheme();

  return (
    <Box position={'absolute'} top={10} right={10}>
      <IconButton onClick={toggleDarkTheme}>{isDarkTheme ? <ModeNight /> : <WbSunny />}</IconButton>
    </Box>
  );
};
