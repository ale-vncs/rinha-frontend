import { useJsonProvider } from '@hooks/useJsonProvider';
import { Box, ButtonBase, CircularProgress, Paper, Stack, Typography, useTheme } from '@mui/material';
import { FileData } from '@providers/JsonProvider';
import { green, grey, red } from '@mui/material/colors';
import { UploadContainer } from '@src/JsonTreeViewer/BoxUpload/UploadContainer';
import { LockClock, PauseCircle } from '@mui/icons-material';

export const JsonList = () => {
  const { palette } = useTheme();
  const { files, selectJsonById, jsonSelected } = useJsonProvider();

  if (!files.length) {
    return <p className={'text-center'}>No json :(</p>;
  }

  const onClickCard = (jsonId: string) => {
    const jsonData = files.find((item) => item.id === jsonId);
    if (!jsonData) return;
    selectJsonById(jsonData.id);
  };

  const getColorsByStatus = (status: FileData['status']) => {
    const backgroundColorByStatus: Record<FileData['status'], Record<number | string, string>> = {
      AVAILABLE: green,
      ERROR: red,
      LOADING: grey,
      WAITING: grey,
    };

    const color = backgroundColorByStatus[status];

    return {
      background: color['A200'],
      border: color['900'],
      font: palette.getContrastText(color['A200']),
    };
  };

  return (
    <Stack component={Paper} variant={'outlined'} direction={'column'} height={'100%'} p={1} rowGap={1}>
      <Stack direction={'column'} flex={1} rowGap={1} overflow={'auto'}>
        {files.map((item) => {
          const { background, font } = getColorsByStatus(item.status);
          const isSelected = item.id === jsonSelected?.id;

          return (
            <ButtonBase key={item.id} onClick={() => onClickCard(item.id)}>
              <Stack
                component={Paper}
                variant={'outlined'}
                justifyContent={'space-between'}
                alignItems={'center'}
                direction={'row'}
                width={'100%'}
                sx={{
                  color: font,
                  background,
                  p: 1,
                  cursor: item.status === 'AVAILABLE' ? 'pointer' : null,
                }}
              >
                <Typography pl={isSelected ? 2 : 0} sx={{ transition: 'padding .3s ease' }}>
                  {item.name}
                </Typography>
                {item.status === 'WAITING' && <PauseCircle />}
                {item.status === 'LOADING' && <CircularProgress size={16} color={'inherit'} />}
                {item.status === 'ERROR' && (
                  <Box
                    component={'span'}
                    width={24}
                    height={24}
                    textAlign={'center'}
                    borderRadius={'50%'}
                    bgcolor={red[500]}
                    color={'white'}
                    lineHeight={2}
                  >
                    !
                  </Box>
                )}
                {isSelected && (
                  <Box position={'absolute'} left={3} top={3} bottom={3} width={5} bgcolor={'white'} borderRadius={2} />
                )}
              </Stack>
            </ButtonBase>
          );
        })}
      </Stack>
      <UploadContainer />
    </Stack>
  );
};
