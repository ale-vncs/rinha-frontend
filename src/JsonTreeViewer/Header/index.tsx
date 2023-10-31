import { UploadContainer } from '../BoxUpload/UploadContainer';
import { Box, Stack, Typography } from '@mui/material';
import { ToggleThemeMode } from '@src/JsonTreeViewer/Header/ToggleThemeMode';

export const Header = () => {
  return (
    <Stack direction={'column'} alignItems={'center'} rowGap={2} pt={2}>
      <Typography variant={'h2'} textAlign={'center'} lineHeight={0.8} px={2}>
        Json Tree Viewer
      </Typography>
      <Typography textAlign={'center'}>Simple JSON Viewer that runs completely on-client. No data exchange</Typography>
      <Box
        width={{
          xs: '100%',
          sm: 300,
        }}
        sx={{
          transition: 'width .2s ease',
        }}
        display={'flex'}
      >
        <UploadContainer />
      </Box>
      <ToggleThemeMode />
    </Stack>
  );
};
