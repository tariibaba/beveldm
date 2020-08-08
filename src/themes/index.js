import { createMuiTheme } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';
import hexToRgba from 'hex-to-rgba';
import '../font-faces/nutino-sans.css';

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: blue[700],
    },
    background: {
      default: grey[100],
    },
    custom: {
      cardDefault: '#fff',
      cardError: hexToRgba('#fff', 0.6),
      cardErrorBorder: '#e0e0e0',
      urlDefault: undefined,
      urlError: hexToRgba('#999ea4', 0.7),
      progressText: undefined,
      filenameDefault: blue[700],
      filenameError: hexToRgba('#999ea4', 0.7),
      filenameComplete: blue[700],
      showInFolder: blue[700],
      downloadStatusText: '#999ea4',
      downloadGroupSelected: '#8ab4f8',
      drawer: '#fff',
      noDownloads: grey[600],
    },
  },
  typography: {
    allVariants: {
      fontFamily: 'Nutino Sans',
    },
  },
  overrides: {
    MuiButton: {
      contained: {
        textTransform: 'none',
        boxSizing: 'content-box',
        minWidth: 'auto',
        padding: '5px 16px !important',
      },
      containedSecondary: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: `0.5px solid ${hexToRgba('#999ea4', 0.6)}`,
        color: blue[700],
        '&:hover': {
          backgroundColor: hexToRgba('#8ab4f8', 0.1),
        },
      },
    },
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: grey[300],
      },
    },
    MuiAppBar: {
      colorPrimary: {
        color: '#000',
        backgroundColor: grey[100],
      },
    },
  },
});

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#8ab4f8',
    },
    secondary: {
      main: '#202124',
    },
    background: {
      default: '#202124',
    },
    text: {
      primary: grey[300],
    },
    custom: {
      cardDefault: '#202124',
      cardError: '#202124',
      cardErrorBorder: hexToRgba('#e0e0e0', 0.15),
      urlDefault: '#999ea4',
      urlError: hexToRgba('#999ea4', 0.7),
      progressText: '#999ea4',
      filenameDefault: '#999ea4',
      filenameError: hexToRgba('#999ea4', 0.7),
      filenameComplete: '#8ab4f8',
      showInFolder: '#8ab4f8',
      downloadStatusText: hexToRgba('#999ea4', 0.9),
      downloadGroupSelected: '#8ab4f8',
      drawer: '#202124',
      groupedDownloadsDate: '#999ea4',
      noDownloads: '#999ea4',
    },
  },
  typography: {
    allVariants: {
      fontFamily: 'Nutino Sans',
      color: grey[300],
    },
    h6: {
      color: '#fff',
    },
  },
  overrides: {
    MuiButton: {
      contained: {
        textTransform: 'none',
        boxSizing: 'content-box',
        minWidth: 'auto',
        padding: '5px 16px !important',
      },
      containedPrimary: {
        backgroundColor: '#8ab4f8',
        color: '#202124',
      },
      containedSecondary: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: `0.5px solid ${hexToRgba('#999ea4', 0.6)}`,
        color: '#8ab4f8',
        '&:hover': {
          backgroundColor: hexToRgba('#8ab4f8', 0.1),
        },
      },
    },
    MuiLinearProgress: {
      barColorPrimary: {
        backgroundColor: '#8ab4f8',
      },
      colorPrimary: {
        backgroundColor: hexToRgba('#8ab4f8', 0.1),
      },
    },
    MuiListItem: {
      root: {
        color: '#999ea4',
      },
    },
    MuiListItemIcon: {
      root: {
        color: '#999ea4',
      },
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: '#424242',
        color: '#fff',
      },
    },
    MuiSvgIcon: {
      fontSizeSmall: {
        color: '#999ea4',
      },
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#202124',
        color: '#fff',
      },
    },
  },
});
