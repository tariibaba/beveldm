import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';
import PeriodicUpdate from './PeriodicUpdate';
import getFriendlyStorage from '../friendly-storage';
import DownloadSpeed from './DownloadSpeed';
import { shell } from 'electron';
import path from 'path';

function Download({
  id,
  url,
  filename,
  dirname,
  size,
  bytesDownloaded,
  status,
  resumable
}) {
  const openFolder = () => {
    const fullPath = path.resolve(dirname, filename);
    shell.showItemInFolder(fullPath);
  };

  const openFile = () => {
    const fullPath = path.resolve(dirname, filename);
    shell.openItem(fullPath);
  };

  return (
    <div>
      {url}
      <br />
      {status === 'complete' ? <button onClick={openFile}>{filename}</button> : filename}
      <br />
      {status !== 'complete' && (
        <PeriodicUpdate start={status === 'started'}>
          <DownloadSpeed bytesDownloaded={bytesDownloaded} status={status} />
          {getFriendlyStorage(bytesDownloaded).size}&nbsp;
          {getFriendlyStorage(bytesDownloaded).unit} of&nbsp;
          {getFriendlyStorage(size).size}&nbsp;
          {getFriendlyStorage(size).unit}
          <br />
        </PeriodicUpdate>
      )}
      {status === 'complete' && <button onClick={openFolder}>Show in folder</button>}
      {status !== 'complete' && <ProgressBar value={bytesDownloaded / size} />}
      <DownloadActionButton id={id} status={status} resumable={resumable}/>
    </div>
  );
}

export default connect()(Download);
