import React, { useState } from 'react';
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
  TextField,
} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { connect } from 'react-redux';
import {
  changeDownloadSpeedLimit,
  changePage,
  changeTheme,
  toggleAlwaysOpenDownloadsWhenDone,
  toggleStartDownloadsAutomatically,
  toggleUseCustomSaveFolder,
} from '../actions';
import { toggleLaunchAtStartup } from '../thunks';
import { prettyBytes, getBytes } from './utilities';
import { DOWNLOAD_SPEED_LIMIT_LIMIT } from '../constants';
import { useRef } from 'react';
import { useEffect } from 'react';

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
    color: theme.overrides.MuiAppBar.colorPrimary.color,
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
  });
};

function SettingsPage({
  dispatch,
  theme,
  alwaysOpenDownloadsWhenDone,
  startDownloadsAutomatically,
  launchAtStartup,
  useCustomSaveFolder,
  downloadSpeedLimit,
}) {
  const [appBarRaised, setAppBarRaised] = useState(false);
  const classes = useStyles();
  const userFriendlySpeedLimit = prettyBytes(downloadSpeedLimit);
  const speedLimitUnitSize = Number(userFriendlySpeedLimit.size);
  const speedLimitUnit = userFriendlySpeedLimit.unit.toLowerCase();
  const speedLimitInputRef = useRef();
  const [
    speedLimitUnitSizeTextFieldValue,
    setSpeedLimitUnitSizeTextFieldValue,
  ] = useState(userFriendlySpeedLimit.size);

  useEffect(() => {
    speedLimitInputRef.current.onchange = handleChangeSpeedLimitUnitSize;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [speedLimitUnit]);

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

  const handleToggleUseCustomFolder = (event) => {
    dispatch(toggleUseCustomSaveFolder(event.target.checked));
  };

  const handleInputSpeedLimitUnitSize = (event) => {
    setSpeedLimitUnitSizeTextFieldValue(event.target.value);
  };

  const handleChangeSpeedLimitUnitSize = (event) => {
    const value = Number(event.target.value);
    if (value && value > 0) {
      onDownloadSpeedLimitChanged(value, speedLimitUnit);
    } else {
      changeSpeedLimitUnitSizeTextFieldValue(downloadSpeedLimit);
    }
  };

  const handleChangeSpeedLimitUnit = (event) => {
    onDownloadSpeedLimitChanged(speedLimitUnitSize, event.target.value);
  };

  const onDownloadSpeedLimitChanged = (limitUnitSize, limitUnit) => {
    const speedLimitBytes = getBytes(limitUnitSize, limitUnit.toUpperCase());
    if (speedLimitBytes > DOWNLOAD_SPEED_LIMIT_LIMIT) {
      dispatch(changeDownloadSpeedLimit(DOWNLOAD_SPEED_LIMIT_LIMIT));
      changeSpeedLimitUnitSizeTextFieldValue(DOWNLOAD_SPEED_LIMIT_LIMIT);
    } else {
      dispatch(changeDownloadSpeedLimit(speedLimitBytes));
      changeSpeedLimitUnitSizeTextFieldValue(speedLimitBytes);
    }
  };

  const changeSpeedLimitUnitSizeTextFieldValue = (limitBytes) => {
    setSpeedLimitUnitSizeTextFieldValue(prettyBytes(limitBytes).size);
  };

  const handleScroll = (event) => setAppBarRaised(event.target.scrollTop > 0);

  return (
    <MuiThemeProvider
      theme={(outerTheme) =>
        outerTheme.palette.type === 'dark'
          ? muiDarkInnerTheme(outerTheme)
          : muiInnerTheme(outerTheme)
      }
    >
      <div className={classes.root}>
        <AppBar position="fixed" elevation={appBarRaised ? 4 : 0}>
          <Toolbar>
            <IconButton edge="start" onClick={handleGoBack}>
              <ArrowBack className={classes.arrowBack} />
            </IconButton>
            <Typography variant="h6">Settings</Typography>
          </Toolbar>
        </AppBar>
        <Toolbar />
        <div className={classes.body} onScroll={handleScroll}>
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
            <div className={classes.setting}>
              <Typography>
                Ask where to save each file before downloading
              </Typography>
              <Switch
                color="primary"
                checked={useCustomSaveFolder}
                onChange={handleToggleUseCustomFolder}
              />
            </div>
            <div className={classes.setting}>
              <Typography>Download speed limit</Typography>
              <div style={{ display: 'flex' }}>
                <TextField
                  style={{ width: 50 }}
                  inputProps={{ style: { textAlign: 'right' } }}
                  value={speedLimitUnitSizeTextFieldValue}
                  inputRef={speedLimitInputRef}
                  onChange={handleInputSpeedLimitUnitSize}
                  type="number"
                />
                <Select
                  value={speedLimitUnit}
                  onChange={handleChangeSpeedLimitUnit}
                >
                  <MenuItem value="b">B/s</MenuItem>
                  <MenuItem value="kb">KB/s</MenuItem>
                  <MenuItem value="mb">MB/s</MenuItem>
                  <MenuItem value="gb">GB/s</MenuItem>
                </Select>
              </div>
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
  useCustomSaveFolder: settings.useCustomSaveFolder,
  downloadSpeedLimit: settings.downloadSpeedLimit,
}))(SettingsPage);
