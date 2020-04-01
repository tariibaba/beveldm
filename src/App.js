import React, { useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';
import { loadState, updateDownloadsProgressPeriodically } from './thunks';
import './App.css';
import { ThemeProvider } from '@material-ui/styles';
import { useSelector, useDispatch } from 'react-redux';
import { saveState } from './utilities';
import DownloadPage from './components/DownloadPage';
import { lightTheme, darkTheme } from './themes';
import { toggleDarkMode } from './actions';
import SettingsPage from './components/SettingsPage';
import { connect } from 'react-redux';

function App({ page }) {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector(state => state);
  const theme = state.settings.theme;
  const dispatch = useDispatch();

  useEffect(() => {
    ipcRenderer.removeAllListeners('system-theme-changed');
    ipcRenderer.on('system-theme-changed', (_event, isDarkMode) => {
      dispatch(
        toggleDarkMode(theme === 'dark' || (theme === 'system' && isDarkMode))
      );
    });

    ipcRenderer.send('change-theme', theme);
  }, [dispatch, theme]);

  useEffect(() => {
    ipcRenderer.removeAllListeners('before-close');
    ipcRenderer.on('before-close', async () => {
      await saveState(state);
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
  }, [loaded, dispatch]);

  return loaded ? (
    <ThemeProvider theme={state.settings.darkMode ? darkTheme : lightTheme}>
      {page === 'downloads' && <DownloadPage />}
      {page === 'settings' && <SettingsPage />}
    </ThemeProvider>
  ) : null;
}

export default connect(({ page }) => ({ page }))(App);
