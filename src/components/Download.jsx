import React from 'react';
import ProgressBar from './ProgressBar';
import { connect } from 'react-redux';
import { thunkStartDownload, thunkPauseDownload } from '../thunks';

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
  let action;
  switch (status) {
    case 'notstarted':
      action = 'Start';
      break;
    case 'started':
      action = 'Pause';
      break;
    case 'paused':
      action = 'Resume';
      break;
    default:
      action = 'Start';
      break;
  }

  const handleAction = async () => {
    switch (status) {
      case 'notstarted':
        dispatch(thunkStartDownload(id));
        break;
      case 'started':
        dispatch(thunkPauseDownload(id));
        break;
      default:
        break;
    }
  };

  return (
    <div>
      Url: {url}
      <br />
      Name: {filename}
      <br />
      Directory: {dirname}
      <br />
      Size: {size}
      <ProgressBar value={bytesDownloaded / size} />
      <button onClick={handleAction}>{action}</button>
    </div>
  );
}

export default connect()(Download);
