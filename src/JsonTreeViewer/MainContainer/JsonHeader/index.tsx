import { Box, Divider, Grid, LinearProgress, Typography } from '@mui/material';
import { FileData } from '@providers/JsonProvider';
import { SearchInput } from './SearchInput';
import { TabSizeSelect } from './TabSizeSelect';
import { ColorSchemeSelect } from './ColorSchemeSelect';

interface JsonHeaderProps {
  jsonSelected: FileData;
}

export const JsonHeader = ({ jsonSelected }: JsonHeaderProps) => {
  return (
    <Grid container direction={'row'} gap={1} alignItems={'center'} position={'relative'} p={0.5}>
      <Grid item>
        <Typography>{jsonSelected.name}</Typography>
      </Grid>
      <Separator />
      <Grid item xs>
        <SearchInput key={jsonSelected.id} />
      </Grid>
      <Separator />
      <Grid item>
        <TabSizeSelect />
      </Grid>
      <Grid item>
        <ColorSchemeSelect />
      </Grid>
      <Box position={'absolute'} bottom={-2} left={0} width={'100%'}>
        {jsonSelected.status === 'LOADING' && <LinearProgress />}
      </Box>
    </Grid>
  );
};

const Separator = () => {
  return (
    <Grid item height={'100%'} display={'flex'}>
      <Divider orientation={'vertical'} flexItem variant={'fullWidth'} />
    </Grid>
  );
};
