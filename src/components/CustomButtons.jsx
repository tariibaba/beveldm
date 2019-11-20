import { withStyles } from '@material-ui/styles';
import { Button } from '@material-ui/core';
import { blue } from '@material-ui/core/colors';

export const ThemeButton = withStyles({
  root: {
    textTransform: 'none',
    boxShadow: 'none',
    border: '0.5px solid #e0e0e0',
    marginTop: '15px',
    marginBottom: '10px',
    padding: '5px 15px',
    '&:hover': {
      boxShadow: 'none',
      backgroundColor: 'transparent',
    },
    '&:active': {
      boxShadow: 'none',
      backgroundColor: 'transparent'
    }
  }
})(Button);

export const WhiteButton = withStyles({
  root: {
    color: blue['A700'],
    backgroundColor: 'white',
    '&:hover': {
      backgroundColor: blue['50']
    },
  }
})(ThemeButton);

export const BlueButton = withStyles({
  root: {
    color: 'white',
    backgroundColor: blue['600'],
    borderColor: blue['600'],
    '&:hover': {
      backgroundColor: blue['600'],
    }
  }
})(ThemeButton);
