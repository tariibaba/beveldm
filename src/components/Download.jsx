import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';
import PeriodicUpdate from './PeriodicUpdate';
import DownloadSpeed from './DownloadSpeed';
import { shell } from 'electron';
import path from 'path';
import { thunkCancelDownload, thunkRemoveDownload } from '../thunks';
import prettyBytes from '../pretty-bytes';

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
  };

  const remove = () => {
    dispatch(thunkRemoveDownload(id));
  };

  return (
    <div>
      {url}
      <br />
      {status === 'complete' ? (
        <button onClick={openFile}>{filename}</button>
      ) : (
        filename
      )}
      <br />
      {status !== 'complete' && status !== 'canceled' && (
        <PeriodicUpdate start={status === 'started'} interval={500}>
          <DownloadSpeed bytesDownloaded={bytesDownloaded} status={status} />
          {prettyBytes(bytesDownloaded)} of {prettyBytes(size)}
          <br />
        </PeriodicUpdate>
      )}
      {status === 'complete' && (
        <button onClick={openFolder}>Show in folder</button>
      )}
      {status !== 'complete' && status !== 'canceled' && (
        <ProgressBar value={bytesDownloaded / size} />
      )}
      {status === 'canceled' && (
        <>
          Canceled
          <br />
        </>
      )}
      <DownloadActionButton id={id} status={status} />
      {status !== 'canceled' && status !== 'complete' && (
        <button onClick={cancel}>Cancel</button>
      )}
      <br />
      {(status === 'canceled' || status === 'complete') && (
        <button onClick={remove}>Remove</button>
      )}
    </div>
  );
}

export default connect()(Download);
