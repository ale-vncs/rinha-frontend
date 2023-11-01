import {
  Button,
  ButtonGroup,
  CircularProgress,
  InputAdornment,
  Paper,
  Popper,
  Stack,
  TextField,
  ToggleButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { FormatSize, KeyboardArrowDown, KeyboardArrowUp, SearchRounded } from '@mui/icons-material';
import { useJsonFeatureProvider } from '@hooks/useJsonFeatureProvider';
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
    isSearching,
    jsonSelected,
  } = useJsonFeatureProvider();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    searchWord(searchValue);
  }, [searchValue]);

  window.onkeydown = (e: KeyboardEvent) => {
    if (e.ctrlKey && e.code === 'KeyF') {
      e.preventDefault();
      const el = document.getElementById('search-input');
      setAnchorEl(el);
      el?.focus();
      setTimeout(() => {
        setAnchorEl(null);
      }, 2500);
    }
  };

  const open = Boolean(anchorEl);
  const popperId = open ? 'simple-popper' : undefined;

  return (
    <Stack direction={'row'} columnGap={0.5}>
      <TextField
        id={'search-input'}
        aria-describedby={popperId}
        variant={'outlined'}
        size={'small'}
        placeholder={`Search in ${jsonSelected.name}`}
        fullWidth
        disabled={jsonSelected.status === 'LOADING'}
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
              {!!wordSearch && !isSearching && (
                <Typography variant={'body2'}>{wordSearchPosition.total} occurrence(s) found</Typography>
              )}
              {isSearching && <CircularProgress size={16} />}
              <Tooltip title={'Match Case'}>
                <span>
                  <ToggleButton
                    value="check"
                    size={'small'}
                    sx={{ p: 0.25, ml: 1 }}
                    selected={isCaseSensitive}
                    disabled={jsonSelected.status === 'LOADING'}
                    onChange={toggleCaseSensitive}
                    color="primary"
                  >
                    <FormatSize sx={{ fontSize: 18 }} />
                  </ToggleButton>
                </span>
              </Tooltip>
            </InputAdornment>
          ),
        }}
      />
      <Popper id={popperId} open={open} anchorEl={anchorEl} placement={'top-start'}>
        <Paper sx={{ p: 1, bgcolor: 'primary.main' }}>
          <Typography color={'white.main'}>Type to search</Typography>
        </Paper>
      </Popper>
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
