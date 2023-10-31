import { makeSx } from '@src/styles/makeSx';
import { grey } from '@mui/material/colors';

export const useUploadContainerStyle = makeSx((theme) => {
  const isDarkTheme = theme.palette.mode === 'dark';

  return {
    boxUpload: (isDragging: boolean) => ({
      width: '100%',
      py: isDragging ? 3 : 0,
      borderRadius: 1,
      borderColor: theme.palette.grey.A200,
      borderWidth: 2,
      borderStyle: isDragging ? 'dashed' : 'none',
      boxShadow: theme.shadows[2],
      textAlign: 'center',
      color: theme.palette.grey['800'],
      cursor: 'pointer',
      transition: theme.transitions.create(['background', 'padding'], {
        easing: 'ease',
        duration: 200,
      }),
      background: isDragging ? grey[isDarkTheme ? '600' : '400'] : grey[isDarkTheme ? '400' : '200'],
      '&: hover': {
        background: grey['400'],
      },
      '& > input': {
        display: 'none',
      },
      '& > p': {
        pointerEvents: 'none',
      },
    }),
  };
});
