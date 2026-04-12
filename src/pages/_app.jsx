import { useMemo, useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { UserProvider } from '../lib/context/UserContext';

export default function App({ Component, pageProps }) {
  const [mode, setMode] = useState('light');

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          primary: {
            main: '#00695f',
          },
          secondary: {
            main: '#ff6f00',
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <UserProvider>
        <AppBar position="sticky" color="transparent" elevation={0}>
          <Container maxWidth="lg">
            <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
              <Typography variant="h6" component="p">
                Trading Journal
              </Typography>
              <IconButton
                aria-label="toggle color mode"
                onClick={() => setMode((previous) => (previous === 'light' ? 'dark' : 'light'))}
              >
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Toolbar>
          </Container>
        </AppBar>
        <Box component="main" sx={{ py: 4 }}>
          <Container maxWidth="lg">
            <Component {...pageProps} />
          </Container>
        </Box>
      </UserProvider>
    </ThemeProvider>
  );
}
