/** @format */

import { Dialog, DialogTitle, createTheme, ThemeProvider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Email from './Email';
import { useState } from 'react';
import { Code } from './Code';
import NewPass from './NewPass';

let theme = createTheme({
  typography: { button: { textTransform: 'none' } },
});
export default function MyDialog({ open = true, onClose }) {
  const [page, setPage] = useState(1);
  const [email, setEmail] = useState();

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Reset Password
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        {page === 1 ? (
          <Email next={setPage} email={setEmail} />
        ) : page === 2 ? (
          <Code email={email} next={setPage} />
        ) : (
          <NewPass email={email} next={setPage} />
        )}
      </Dialog>
    </ThemeProvider>
  );
}
