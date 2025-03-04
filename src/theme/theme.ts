import { createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';
import { siteConfig } from '../components';

// Create a theme instance
const getTheme = (mode: PaletteMode) => {
  // Get colors from site config or use defaults
  const primaryColor = siteConfig?.colors?.primary || '#2E8555';
  const primaryLightColor = siteConfig?.colors?.light || '#4CAF50';
  const primaryDarkColor = siteConfig?.colors?.dark || '#1B5E20';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        light: primaryLightColor,
        dark: primaryDarkColor,
      },
      secondary: {
        main: '#19857b',
      },
      background: {
        default: mode === 'light' ? '#f5f5f5' : '#121212',
        paper: mode === 'light' ? '#ffffff' : '#1e1e1e',
      },
    },
    typography: {
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      h1: {
        fontSize: '30px',
        fontWeight: 700,
        letterSpacing: '-0.75px',
        lineHeight: '36px',
        margin: 0,
        color: mode === 'light' ? 'rgb(27, 29, 23)' : '#F3F4F6',
        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      },
      h2: {
        fontSize: '24px',
        fontWeight: 600,
        letterSpacing: '-0.6px',
        lineHeight: '32px',
        marginTop: 0,
        marginBottom: '16px',
        color: mode === 'light' ? 'rgb(17, 24, 39)' : '#E5E7EB',
        borderBottom: 0,
        display: 'flex',
      },
      h3: {
        fontSize: '1.5rem',
        fontWeight: 600,
      },
      h4: {
        fontSize: '1.25rem',
        fontWeight: 600,
      },
      h5: {
        fontSize: '1.1rem',
        fontWeight: 600,
      },
      h6: {
        fontSize: '1rem',
        fontWeight: 600,
      },
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            borderRadius: '6px',
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            },
          },
        },
      },
      MuiDrawer: {
        styleOverrides: {
          paper: {
            backgroundColor: mode === 'light' ? '#ffffff' : '#1e1e1e',
          },
        },
      },
    },
  });
};

export default getTheme; 