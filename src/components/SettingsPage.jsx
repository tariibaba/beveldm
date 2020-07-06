import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Select,
  MenuItem,
  IconButton,
  MuiThemeProvider,
  createMuiTheme,
  Switch,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { connect } from 'react-redux';
import {
  changePage,
  changeTheme,
  toggleAlwaysOpenDownloadsWhenDone,
  toggleStartDownloadsAutomatically,
} from '../actions';
import { toggleLaunchAtStartup } from '../thunks';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexFlow: 'column',
    height: '100%',
  },
  body: {
    flex: 1,
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    justifyContent: 'center',
  },
  settings: {
    width: 500,
    marginTop: theme.spacing(2),
    [theme.breakpoints.down(640)]: {
      width: '80%',
    },
  },
  setting: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  arrowBack: {
    color: '#fff',
  },
}));

const muiInnerTheme = (outerTheme) =>
  createMuiTheme({
    ...outerTheme,
    typography: {
      ...outerTheme.typography,
      body1: {
        ...outerTheme.typography.body1,
        fontSize: 15,
      },
    },
  });

const muiDarkInnerTheme = (outerTheme) => {
  const innerTheme = muiInnerTheme(outerTheme);
  return createMuiTheme({
    ...innerTheme,
    palette: {
      ...innerTheme.palette,
      text: {
        ...innerTheme.palette.text,
        primary: '#fff',
      },
    },
    typography: {
      ...innerTheme.typography,
      allVariants: {
        ...innerTheme.typography.allVariants,
        color: '#fff',
      },
    },
  });
};

function SettingsPage({
  dispatch,
  theme,
  alwaysOpenDownloadsWhenDone,
  startDownloadsAutomatically,
  launchAtStartup,
}) {
  const handleGoBack = () => {
    dispatch(changePage('downloads'));
  };

  const handleThemeChange = (event) => {
    dispatch(changeTheme(event.target.value));
  };

  const handleToggleAlwaysOpenDownloadsWhenDone = (event) => {
    dispatch(toggleAlwaysOpenDownloadsWhenDone(event.target.checked));
  };

  const handleToggleStartDownloadsAutomatically = (event) => {
    dispatch(toggleStartDownloadsAutomatically(event.target.checked));
  };

  const handleToggleLaunchAtStartup = (event) => {
    dispatch(toggleLaunchAtStartup(event.target.checked));
  };

  const classes = useStyles();

  return (
    <MuiThemeProvider
      theme={(outerTheme) =>
        outerTheme.palette.type === 'dark'
          ? muiDarkInnerTheme(outerTheme)
          : muiInnerTheme(outerTheme)
      }
    >
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <IconButton edge="start" onClick={handleGoBack}>
              <ArrowBack className={classes.arrowBack} />
            </IconButton>
            <Typography variant="h6">Settings</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <div className={classes.body}>
          <div className={classes.settings}>
            <div className={classes.setting}>
              <Typography>Theme</Typography>
              <Select onChange={handleThemeChange} value={theme}>
                <MenuItem value="light">Light</MenuItem>
                <MenuItem value="dark">Dark</MenuItem>
                <MenuItem value="system">System</MenuItem>
              </Select>
            </div>
            <div className={classes.setting}>
              <Typography>Always open downloads when done</Typography>
              <Switch
                color="primary"
                checked={alwaysOpenDownloadsWhenDone}
                onChange={handleToggleAlwaysOpenDownloadsWhenDone}
              />
            </div>
            <div className={classes.setting}>
              <Typography>Start downloads automatically</Typography>
              <Switch
                color="primary"
                checked={startDownloadsAutomatically}
                onChange={handleToggleStartDownloadsAutomatically}
              />
            </div>
            <div className={classes.setting}>
              <Typography>Launch at startup (minimized)</Typography>
              <Switch
                color="primary"
                checked={launchAtStartup}
                onChange={handleToggleLaunchAtStartup}
              />
            </div>
          </div>
        </div>
      </div>
    </MuiThemeProvider>
  );
}

export default connect(({ settings }) => ({
  theme: settings.theme,
  alwaysOpenDownloadsWhenDone: settings.alwaysOpenDownloadsWhenDone,
  startDownloadsAutomatically: settings.startDownloadsAutomatically,
  launchAtStartup: settings.launchAtStartup,
}))(SettingsPage);
