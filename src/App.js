import React from 'react';
import DownloadList from './components/DownloadList';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { saveState, loadState } from './thunks';
import './App.css';
import DownloadAppBar from './components/DownloadAppBar';
import { grey, blue } from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/styles';

const styles = {
  App: {
    backgroundColor: grey['100'],
    width: '100%',
    height: '100%'
  }
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: blue['700']
    }
  }
});

function App({ dispatch }) {
  ipcRenderer.on('close', async () => {
    await dispatch(saveState());
    ipcRenderer.send('saved', null);
  });

  dispatch(loadState());

  return (
    <ThemeProvider theme={theme}>
      <div style={{ height: '100%' }}>
        <div style={styles.App}>
          <DownloadAppBar />
          <DownloadList />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default connect()(App);
