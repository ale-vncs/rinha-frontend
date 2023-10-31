import { ChangeEvent, DragEvent, useState } from 'react';
import { useJsonProvider } from '@hooks/useJsonProvider';
import { Box, Typography } from '@mui/material';
import { useUploadContainerStyle } from './useUploadContainerStyle';

export const UploadContainer = () => {
  const { readFile } = useJsonProvider();

  const [isDragging, setIsDragging] = useState(false);

  const classes = useUploadContainerStyle();

  const onDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    readFileList(e.dataTransfer.files);
  };

  const onSelectFile = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    readFileList(e.target.files);
    e.target.value = '';
  };

  const readFileList = (files: FileList | null) => {
    setIsDragging(false);
    if (!files) return;
    readFile(files[0]);
  };

  return (
    <Box
      component={'label'}
      sx={classes('boxUpload', isDragging)}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <Typography p={2}>{isDragging ? 'Drop json' : 'Click or drag your json here'}</Typography>
      <input accept={'application/json'} type={'file'} id={'upload'} onChange={onSelectFile} />
    </Box>
  );
};
