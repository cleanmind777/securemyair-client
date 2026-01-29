/** @format */

import { Dialog, DialogTitle, createTheme, ThemeProvider, IconButton } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Code } from "./Code";


let theme = createTheme({
  typography: { button: { textTransform: "none" } },
});
export default function MyDialog({email, open = true, onClose}) {
  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Verification Code
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
          <Code email={email} />
      </Dialog>
    </ThemeProvider>
  );
}
