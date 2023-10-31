import { UploadContainer } from '../BoxUpload/UploadContainer';
import { Box, Stack, Typography } from '@mui/material';

export const Header = () => {
  return (
    <Stack direction={'column'} alignItems={'center'} rowGap={2} pt={2}>
      <Typography fontSize={'6rem'} lineHeight={0.8}>
        {`{Json} Tree Viewer`}
      </Typography>
      <Typography>Simple JSON Viewer that runs completely on-client. No data exchange</Typography>
      <Box width={300} display={'flex'}>
        <UploadContainer />
      </Box>
    </Stack>
  );
};
