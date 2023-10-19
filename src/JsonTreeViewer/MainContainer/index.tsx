import { Grid } from '@mui/material';
import { JsonList } from './JsonList';
import { JsonTreeViewer } from './JsonTreeViewer.tsx';
import { useJsonProvider } from '../../hooks/useJsonProvider.ts';

export const MainContainer = () => {
  const { files } = useJsonProvider();

  if (!files.length) return;

  return (
    <Grid container direction={'row'} gap={1} height={'100%'} overflow={'auto'} py={1}>
      <Grid item xs={12} sm={3} overflow={'auto'} height={'100%'}>
        <JsonList />
      </Grid>
      <Grid item xs={12} sm overflow={'auto'} height={'100%'}>
        <JsonTreeViewer />
      </Grid>
    </Grid>
  );
};
