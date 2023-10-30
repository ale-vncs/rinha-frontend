import { JsonTreeViewer } from './JsonTreeViewer';
import { useJsonProvider } from '@hooks/useJsonProvider';
import { Box } from '@mui/material';

export const MainContainer = () => {
  const { jsonSelected } = useJsonProvider();

  if (!jsonSelected) return;

  return (
    <Box width={'100%'} height={'100%'} py={1}>
      <JsonTreeViewer />
    </Box>
  );
};
