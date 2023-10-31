import { MoreVert } from '@mui/icons-material';
import { Dialog, DialogContent, DialogTitle, IconButton, Stack } from '@mui/material';
import { TabSizeSelect } from '@src/JsonTreeViewer/MainContainer/JsonHeader/TabSizeSelect';
import { ColorSchemeSelect } from '@src/JsonTreeViewer/MainContainer/JsonHeader/ColorSchemeSelect';
import { useState } from 'react';

export const MenuOptions = () => {
  const [openModal, setOpenModal] = useState(false);

  const toggleModal = () => {
    setOpenModal((prev) => !prev);
  };

  return (
    <>
      <IconButton onClick={toggleModal}>
        <MoreVert />
      </IconButton>
      <Dialog open={openModal} maxWidth={false} fullWidth onClose={toggleModal}>
        <DialogTitle>Options</DialogTitle>
        <DialogContent dividers>
          <Stack direction={'column'} gap={2}>
            <TabSizeSelect />
            <ColorSchemeSelect />
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
};
