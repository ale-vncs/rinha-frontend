import { makeSx } from '@utils/makeSx';
import { grey } from '@mui/material/colors';

export const useUploadContainerStyle = makeSx((theme) => {
  return {
    boxUpload: (isDragging: boolean) => ({
      width: '100%',
      py: isDragging ? 3 : 0,
      borderRadius: 2,
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
      background: isDragging ? grey['400'] : grey['200'],
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
