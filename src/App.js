/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { loadState, updateDownloadsProgressPeriodically } from './thunks';
import './App.css';
import { ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import DownloadPage from './components/DownloadPage';
import { lightTheme, darkTheme } from './themes';
import { toggleDarkMode } from './actions';
import SettingsPage from './components/SettingsPage';
import { connect } from 'react-redux';
import { cleanUp } from './utilities';
import CustomSnackbar from './components/CustomSnackbar';

function App({ page }) {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector((state) => state);
  const theme = state.settings.theme;
  const minimizeAppOnWindowClose = state.settings.minimizeAppOnWindowClose;
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.removeAllListeners('system-theme-changed');
    ipcRenderer.on('system-theme-changed', (_event, isDarkMode) => {
      dispatch(
        toggleDarkMode(theme === 'dark' || (theme === 'system' && isDarkMode))
      );
    });

    ipcRenderer.send('change-theme', theme);
  }, [theme]);

  useEffect(() => {
    ipcRenderer.send('minimize-on-close-attempt', minimizeAppOnWindowClose);
  }, [minimizeAppOnWindowClose]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('before-close');
    ipcRenderer.on('before-close', async () => {
      await cleanUp(state);
      ipcRenderer.send('saved', null);
    });
  }, [state]);

  useEffect(() => {
    if (!loaded) {
      dispatch(loadState()).then(() => {
        setLoaded(true);
        dispatch(updateDownloadsProgressPeriodically());
        ipcRenderer.send('react-loaded');
        ipcRenderer.send('change-theme', state.settings.theme);
      });
    }
  }, [loaded]);

  return loaded ? (
    <ThemeProvider theme={state.settings.darkMode ? darkTheme : lightTheme}>
      {page === 'downloads' && <DownloadPage />}
      {page === 'settings' && <SettingsPage />}
      <CustomSnackbar />
    </ThemeProvider>
  ) : null;
}

export default connect(({ page }) => ({ page }))(App);
