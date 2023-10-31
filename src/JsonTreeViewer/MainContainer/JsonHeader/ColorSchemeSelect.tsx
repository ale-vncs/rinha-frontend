import { ChangeEvent } from 'react';
import { InputAdornment, MenuItem, TextField } from '@mui/material';
import { useThemeProvider } from '@hooks/useThemeProvider';
import { useJsonFeatureProvider } from '@hooks/useJsonFeatureProvider';

export const ColorSchemeSelect = () => {
  const { changeColorScheme, colorSchemeSelected } = useThemeProvider();
  const { jsonSelected } = useJsonFeatureProvider();

  const colorSchemeIndexList = [0, 1, 2];

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    changeColorScheme(Number(ev.target.value));
  };

  return (
    <TextField
      variant={'outlined'}
      size={'small'}
      select
      disabled={jsonSelected.status === 'LOADING'}
      value={colorSchemeSelected}
      onChange={onChange}
      InputProps={{
        startAdornment: <InputAdornment position="start">Color:</InputAdornment>,
      }}
    >
      {colorSchemeIndexList.map((option) => (
        <MenuItem key={option} value={option}>
          Scheme {option + 1}
        </MenuItem>
      ))}
    </TextField>
  );
};
