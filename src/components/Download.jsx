import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';

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
      {bytesDownloaded} of {size}
      <ProgressBar value={bytesDownloaded / size} />
      <DownloadActionButton id={id} status={status} />
    </div>
  );
}

export default connect()(Download);
