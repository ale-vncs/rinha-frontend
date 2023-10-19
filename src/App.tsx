import { Container, Stack } from '@mui/material';
import { Header } from './JsonTreeViewer/Header';
import { MainContainer } from './JsonTreeViewer/MainContainer';

export const App = () => {
  return (
    <Container sx={{ height: '100%' }}>
      <Stack direction={'column'} alignItems={'center'} height={'100%'} gap={2} overflow={'auto'}>
        <Header />
        <MainContainer />
      </Stack>
    </Container>
  );
};
