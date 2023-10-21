import {
  Button,
  ButtonGroup,
  InputAdornment,
  Stack,
  TextField,
  ToggleButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { FormatSize, KeyboardArrowDown, KeyboardArrowUp, SearchRounded } from '@mui/icons-material';
import { useJsonFeatureProvider } from '../../../hooks/useJsonFeatureProvider.ts';
import { useEffect, useState } from 'react';

export const SearchInput = () => {
  const {
    searchWord,
    wordSearchPosition,
    wordSearch,
    toggleCaseSensitive,
    isCaseSensitive,
    nextWordFound,
    previousWordFound,
  } = useJsonFeatureProvider();

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    searchWord(searchValue);
  }, [searchValue]);

  return (
    <Stack direction={'row'} columnGap={0.5}>
      <TextField
        variant={'outlined'}
        size={'small'}
        placeholder={'Search'}
        fullWidth
        value={searchValue}
        onChange={(ev) => setSearchValue(ev.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchRounded />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              {!!wordSearch && (
                <Typography variant={'body2'}>{wordSearchPosition.total} occurrence(s) found</Typography>
              )}
              <Tooltip title={'Match Case'}>
                <ToggleButton
                  value="check"
                  size={'small'}
                  sx={{ p: 0.25, ml: 1 }}
                  selected={isCaseSensitive}
                  onChange={toggleCaseSensitive}
                  color="primary"
                >
                  <FormatSize sx={{ fontSize: 18 }} />
                </ToggleButton>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      {!!wordSearchPosition.total && (
        <ButtonGroup variant="outlined" size={'small'}>
          <Button onClick={nextWordFound}>
            <KeyboardArrowDown />
          </Button>
          <Button onClick={previousWordFound}>
            <KeyboardArrowUp />
          </Button>
        </ButtonGroup>
      )}
    </Stack>
  );
};
