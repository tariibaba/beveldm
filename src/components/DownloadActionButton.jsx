import React from 'react';
import { connect } from 'react-redux';
import {
  thunkStartDownload,
  thunkPauseDownload,
  thunkResumeDownload
} from '../thunks';

function DownloadActionButton({ id, status, dispatch }) {
  let action;
  switch (status) {
    case 'notstarted':
    case 'starting':
      action = 'Start';
      break;
    case 'started':
      action = 'Pause';
      break;
    case 'paused':
    case 'resuming':
      action = 'Resume';
      break;
    case 'canceled':
      action = 'Retry';
      break;
    default:
      action = 'Start';
      break;
  }

  const handleClick = () => {
    switch (status) {
      case 'notstarted':
        dispatch(thunkStartDownload(id));
        break;
      case 'started':
        dispatch(thunkPauseDownload(id));
        break;
      case 'paused':
        dispatch(thunkResumeDownload(id));
        break;
      case 'canceled':
        dispatch(thunkResumeDownload(id));
        break;
      default:
        break;
    }
  };

  return (
    status !== 'complete' && <button onClick={handleClick}>{action}</button>
  );
}

export default connect()(DownloadActionButton);
