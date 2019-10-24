import React from 'react';
import AddNewDownload from './components/AddNewDownload';
import DownloadList from './components/DownloadList';
import { connect } from 'react-redux';
import { ipcRenderer } from 'electron';
import { saveState, loadState } from './thunks';

function App({ dispatch }) {
  ipcRenderer.on('close', async () => {
    await dispatch(saveState());
    ipcRenderer.send('saved', null);
  });

  dispatch(loadState());

  return (
    <div className="App">
      <AddNewDownload />
      <DownloadList />
    </div>
  );
}

export default connect()(App);
