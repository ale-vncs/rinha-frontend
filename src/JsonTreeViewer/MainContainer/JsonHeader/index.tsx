import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { FileData } from '../../../providers/JsonProvider.tsx';

interface JsonHeaderProps {
  jsonSelected: FileData;
}

export const JsonHeader = ({ jsonSelected }: JsonHeaderProps) => {
  return (
    <Grid container direction={'row'} gap={1} position={'relative'} p={1}>
      <Grid item xs>
        <Typography>{jsonSelected?.name}</Typography>
      </Grid>
      <Box position={'absolute'} bottom={0} left={0} width={'100%'}>
        {jsonSelected.status === 'LOADING' && <LinearProgress />}
      </Box>
    </Grid>
  );
};
