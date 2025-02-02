import { InputAdornment, MenuItem, TextField } from '@mui/material';
import { useJsonFeatureProvider } from '@hooks/useJsonFeatureProvider';
import { ChangeEvent } from 'react';

export const TabSizeSelect = () => {
  const { tabSize, changeTabSize, jsonSelected } = useJsonFeatureProvider();

  const tabSizeList = [2, 4, 6, 8];

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    changeTabSize(Number(ev.target.value));
  };

  return (
    <TextField
      variant={'outlined'}
      size={'small'}
      select
      disabled={jsonSelected.status === 'LOADING'}
      value={tabSize}
      onChange={onChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">Tab:</InputAdornment>,
      }}
    >
      {tabSizeList.map((option) => (
        <MenuItem key={option} value={option}>
          {option}
        </MenuItem>
      ))}
    </TextField>
  );
};
