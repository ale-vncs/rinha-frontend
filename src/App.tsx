import { Container, Stack } from '@mui/material';
import { Header } from './JsonTreeViewer/Header';
import { MainContainer } from './JsonTreeViewer/MainContainer';
import { ToggleThemeMode } from '@src/JsonTreeViewer/ToggleThemeMode';

export const App = () => {
  return (
    <Container sx={{ height: '100%' }}>
      <Stack direction={'column'} alignItems={'center'} height={'100%'} gap={2} overflow={'auto'} position={'relative'}>
        <Header />
        <ToggleThemeMode />
        <MainContainer />
      </Stack>
    </Container>
  );
};
