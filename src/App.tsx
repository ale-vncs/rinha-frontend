import { Container, Stack } from '@mui/material';
import { Header } from './JsonTreeViewer/Header';
import { MainContainer } from './JsonTreeViewer/MainContainer';

export const App = () => {
  return (
    <Container sx={{ height: '100%' }}>
      <Stack
        direction={'column'}
        alignItems={'center'}
        justifyContent={'center'}
        height={'100%'}
        gap={2}
        position={'relative'}
      >
        <Header />
        <MainContainer />
      </Stack>
    </Container>
  );
};
