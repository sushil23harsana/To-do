import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#6C63FF', // Modern purple
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF6584', // Modern pink
      contrastText: '#fff',
    },
    background: {
      default: mode === 'dark' ? '#181A20' : '#F7F8FA',
      paper: mode === 'dark' ? '#23272F' : '#fff',
    },
    text: {
      primary: mode === 'dark' ? '#fff' : '#222B45',
      secondary: mode === 'dark' ? '#B0B3B8' : '#8F9BB3',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
    h4: {
      fontWeight: 800,
      letterSpacing: 1.5,
    },
    h5: {
      fontWeight: 700,
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 18, // More rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
});

export default getTheme; 