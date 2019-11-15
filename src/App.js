import React from 'react';
import DownloadList from './components/DownloadList';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { saveState, loadState } from './thunks';
import './App.css';
import DownloadAppBar from './components/DownloadAppBar';
import { grey } from '@material-ui/core/colors';

const styles = {
  App: {
    backgroundColor: grey['100'],
    width: '100%',
    height: '100%'
  }
};

function App({ dispatch }) {
  ipcRenderer.on('close', async () => {
    await dispatch(saveState());
    ipcRenderer.send('saved', null);
  });

  dispatch(loadState());

  return (
    <div style={{ height: '100%' }}>
      <div style={styles.App}>
        <DownloadAppBar />
        <DownloadList />
      </div>
    </div>
  );
}

export default connect()(App);
