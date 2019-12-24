import React, { useEffect, useState } from 'react';
import DownloadList from './components/DownloadList';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { saveState, loadState } from './thunks';
import './App.css';
import DownloadAppBar from './components/DownloadAppBar';
import { grey, blue } from '@material-ui/core/colors';
import { createMuiTheme, Toolbar } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';
import CustomSnackbar from './components/CustomSnackbar';

const styles = {
  App: {
    backgroundColor: grey['100'],
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  },
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue['700']
    }
  }
});

function App({ dispatch }) {
  ipcRenderer.on('before-close', async () => {
    await dispatch(saveState());
    ipcRenderer.send('saved', null);
  });

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      dispatch(loadState()).then(() => {
        setLoaded(true);
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

export default connect()(App);
