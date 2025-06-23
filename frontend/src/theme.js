import { createTheme } from '@mui/material/styles';

const getTheme = (mode) => createTheme({
  palette: {
    mode,
    primary: {
      main: '#3A8DFF', // Soft blue
      contrastText: '#fff',
    },
    secondary: {
      main: '#FF6B6B', // Vibrant coral
      contrastText: '#fff',
    },
    background: {
      default: mode === 'dark' ? '#181A20' : '#F4F8FB', // Gentle light background
      paper: mode === 'dark' ? '#23272F' : '#fff',
    },
    text: {
      primary: mode === 'dark' ? '#F4F8FB' : '#222B45',
      secondary: mode === 'dark' ? '#B0B3B8' : '#6B7280',
    },
    divider: mode === 'dark' ? '#2D3748' : '#E0E7EF',
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