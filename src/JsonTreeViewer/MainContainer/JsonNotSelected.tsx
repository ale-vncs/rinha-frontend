import { Paper, Stack, Typography } from '@mui/material';

export const JsonNotSelected = () => {
  return (
    <Stack
      component={Paper}
      variant={'outlined'}
      direction={'column'}
      justifyContent={'center'}
      alignItems={'center'}
      width={'100%'}
      height={'100%'}
    >
      <Typography fontSize={'2rem'} textAlign={'center'}>
        Select a json in side menu
      </Typography>
    </Stack>
  );
};
