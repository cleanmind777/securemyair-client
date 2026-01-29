/** @format */

import { Control, Dashboard, Login, Machines } from './pages';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Protected from './context/Protected';
import { createTheme, responsiveFontSizes, ThemeProvider } from '@mui/material/styles';

let theme = createTheme();
theme = responsiveFontSizes(theme, { factor: 10 });

function App() {
  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Protected />}>
            <Route path="/" element={<Machines />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/control" element={<Control />} />
            <Route path="/*" element={<Machines />} />
          </Route>
        </Routes>
      </HashRouter>
    </ThemeProvider>
  );
}

export default App;
