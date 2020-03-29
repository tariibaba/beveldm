import { createMuiTheme } from '@material-ui/core';
import { blue, grey } from '@material-ui/core/colors';

export const lightTheme = createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: blue[700]
    },
    background: {
      default: grey[100]
    },
    custom: {
      cardDefault: '#fff',
      cardError: '#ffffff99',
      cardErrorBorder: '#e0e0e0',
      urlDefault: undefined,
      urlError: '#999ea4b3',
      progressText: undefined,
      filenameDefault: blue[700],
      filenameError: '#999ea4',
      showInFolder: blue[700],
      downloadStatusText: '#999ea4',
      downloadGroupSelected: '#8ab4f8',
      drawer: '#fff'
    }
  },
  overrides: {
    MuiButton: {
      contained: {
        textTransform: 'none',
        boxSizing: 'content-box',
        minWidth: 'auto',
        padding: '5px 16px !important'
      },
      containedSecondary: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: '0.5px solid #999ea499',
        color: blue[700],
        '&:hover': {
          backgroundColor: '#8ab4f81a'
        }
      }
    },
    MuiLinearProgress: {
      colorPrimary: {
        backgroundColor: grey[300]
      }
    }
  }
});

export const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#8ab4f8'
    },
    secondary: {
      main: '#202124'
    },
    background: {
      default: '#202124'
    },
    text: {
      primary: '#999ea4'
    },
    custom: {
      cardDefault: '#202124',
      cardError: '#202124',
      cardErrorBorder: '#e0e0e02a',
      urlDefault: '#999ea4',
      urlError: '#999ea4b3',
      progressText: '#999ea4',
      filenameDefault: '#8ab4f8',
      filenameError: '#999ea4',
      showInFolder: '#999ea4',
      downloadStatusText: undefined,
      downloadGroupSelected: '#8ab4f8',
      drawer: '#202124'
    }
  },
  overrides: {
    MuiButton: {
      contained: {
        textTransform: 'none',
        boxSizing: 'content-box',
        minWidth: 'auto',
        padding: '5px 16px !important'
      },
      containedPrimary: {
        backgroundColor: '#8ab4f8',
        color: '#202124'
      },
      containedSecondary: {
        backgroundColor: 'transparent',
        boxShadow: 'none',
        border: '0.5px solid #999ea499',
        color: '#8ab4f8',
        '&:hover': {
          backgroundColor: '#8ab4f81a'
        }
      }
    },
    MuiLinearProgress: {
      barColorPrimary: {
        backgroundColor: '#8ab4f8'
      },
      colorPrimary: {
        backgroundColor: '#8ab4f81a'
      }
    },
    MuiListItem: {
      root: {
        color: '#999ea4'
      }
    },
    MuiListItemIcon: {
      root: {
        color: '#999ea4'
      }
    },
    MuiSnackbarContent: {
      root: {
        backgroundColor: '#424242',
        color: '#fff'
      }
    },
    MuiSvgIcon: {
      fontSizeSmall: {
        color: '#999ea4'
      }
    },
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: '#202124',
        color: '#999ea4'
      }
    },
    MuiTypography: {
      h6: {
        color: '#fff'
      }
    }
  }
});
