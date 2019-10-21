import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';
import PeriodicUpdate from './PeriodicUpdate';
import getFriendlyStorage from '../friendly-storage';
import DownloadSpeed from './DownloadSpeed';
import { shell } from 'electron';
import path from 'path';
import { thunkCancelDownload } from '../thunks';
import { removeDownload } from '../actions';
import fs from 'fs';

function Download({
  id,
  url,
  filename,
  dirname,
  size,
  bytesDownloaded,
  status,
  dispatch
}) {
  const fullPath = path.resolve(dirname, filename);
  
  const openFolder = () => {
    shell.showItemInFolder(fullPath);
  };

  const openFile = () => {
    shell.openItem(fullPath);
  };

  const cancel = () => {
    dispatch(thunkCancelDownload(id));
    fs.unlink(fullPath, () => {});
  };

  const remove = () => {
    dispatch(removeDownload(id));
  };

  return (
    <div>
      {url}
      <br />
      {status === 'complete' ? <button onClick={openFile}>{filename}</button> : filename}
      <br />
      {(status !== 'complete' && status !== 'canceled') && (
        <PeriodicUpdate start={status === 'started'} interval={500}>
          <DownloadSpeed bytesDownloaded={bytesDownloaded} status={status} />
          {getFriendlyStorage(bytesDownloaded).size}&nbsp;
          {getFriendlyStorage(bytesDownloaded).unit} of&nbsp;
          {getFriendlyStorage(size).size}&nbsp;
          {getFriendlyStorage(size).unit}
          <br />
        </PeriodicUpdate>
      )}
      {status === 'complete' && <button onClick={openFolder}>Show in folder</button>}
      {(status !== 'complete' && status !== 'canceled') && <ProgressBar value={bytesDownloaded / size} />}
      {status !== 'canceled' && <DownloadActionButton id={id} status={status} />}
      {status === 'canceled' && <span>Canceled</span>}
      {status !== 'canceled' && <button onClick={cancel}>Cancel</button>}<br />
      {(status === 'canceled' || status === 'complete') && <button onClick={remove}>Remove</button>}
    </div>
  );
}

export default connect()(Download);
