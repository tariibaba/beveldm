import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';
import PeriodicUpdate from './PeriodicUpdate';
import getFriendlyStorage from '../friendly-storage';

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
      Directory: {dirname}
      <br />
      <PeriodicUpdate start={status === 'started'}>
        {getFriendlyStorage(bytesDownloaded).size}&nbsp;
        {getFriendlyStorage(bytesDownloaded).unit} of&nbsp;
        {getFriendlyStorage(size).size}&nbsp;
        {getFriendlyStorage(size).unit}
      </PeriodicUpdate>
      <ProgressBar value={bytesDownloaded / size} />
      <DownloadActionButton id={id} status={status} />
    </div>
  );
}

export default connect()(Download);
