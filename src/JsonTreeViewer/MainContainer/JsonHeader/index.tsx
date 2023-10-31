import { Box, Divider, Grid, Hidden, LinearProgress, Typography } from '@mui/material';
import { FileData } from '@providers/JsonProvider';
import { SearchInput } from './SearchInput';
import { TabSizeSelect } from './TabSizeSelect';
import { ColorSchemeSelect } from './ColorSchemeSelect';
import { MenuOptions } from '@src/JsonTreeViewer/MainContainer/JsonHeader/MenuOptions';

interface JsonHeaderProps {
  jsonSelected: FileData;
}

export const JsonHeader = ({ jsonSelected }: JsonHeaderProps) => {
  return (
    <Grid container direction={'row'} gap={1} alignItems={'center'} position={'relative'} p={0.5}>
      <Grid item xs={12}>
        <Typography textAlign={'center'}>{jsonSelected.name}</Typography>
      </Grid>
      <Grid item xs>
        <SearchInput key={jsonSelected.id} />
      </Grid>
      <Separator />
      <Hidden smDown>
        <Grid item>
          <TabSizeSelect />
        </Grid>
      </Hidden>
      <Hidden smDown>
        <Grid item>
          <ColorSchemeSelect />
        </Grid>
      </Hidden>
      <Hidden smUp>
        <Grid item>
          <MenuOptions />
        </Grid>
      </Hidden>
      <Box position={'absolute'} bottom={-2} left={0} width={'100%'}>
        {jsonSelected.status === 'LOADING' && <LinearProgress />}
      </Box>
    </Grid>
  );
};

const Separator = () => {
  return (
    <Grid item height={'40px'} display={'flex'}>
      <Divider orientation={'vertical'} flexItem variant={'fullWidth'} />
    </Grid>
  );
};
