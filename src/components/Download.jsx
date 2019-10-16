import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';
import PeriodicUpdate from './PeriodicUpdate';
import getFriendlyStorage from '../friendly-storage';
import DownloadSpeed from './DownloadSpeed';

function Download({
  id,
  url,
  filename,
  dirname,
  size,
  bytesDownloaded,
  status
}) {
  return (
    <div>
      Url: {url}
      <br />
      Name: {filename}
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
      {status !== 'complete' && <ProgressBar value={bytesDownloaded / size} />}
      <DownloadActionButton id={id} status={status} />
    </div>
  );
}

export default connect()(Download);
