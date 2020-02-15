import React, { useEffect, useState } from 'react';
import DownloadList from './components/DownloadList';
import { ipcRenderer } from 'electron';
import { loadState, updateDownloadsProgressPeriodically } from './thunks';
import './App.css';
import DownloadAppBar from './components/DownloadAppBar';
import { grey, blue } from '@material-ui/core/colors';
import { createMuiTheme, Toolbar } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import CustomSnackbar from './components/CustomSnackbar';
import { useSelector, useDispatch } from 'react-redux';
import { saveState } from './utilities';

const styles = {
  App: {
    backgroundColor: grey['100'],
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  }
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue['700']
    }
  }
});

function App() {
  const [loaded, setLoaded] = useState(false);
  const state = useSelector(state => state);
  const dispatch = useDispatch();

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
        ipcRenderer.send('react-loaded', null);
      });
    }
  }, [loaded, dispatch]);

  return loaded ? (
    <ThemeProvider theme={theme}>
      <div style={{ height: '100%' }}>
        <div style={styles.App}>
          <DownloadAppBar />
          <Toolbar />
          <DownloadList />
          <CustomSnackbar />
        </div>
      </div>
    </ThemeProvider>
  ) : null;
}

export default App;
