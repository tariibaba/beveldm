import React from 'react';
import { connect } from 'react-redux';
import {
  startDownload,
  pauseDownload,
  resumeDownload
} from '../thunks';
import { BlueButton, WhiteButton } from './CustomButtons';

function DownloadActionButton({ id, status, dispatch }) {
  let action;
  switch (status) {
    case 'notstarted':
      action = 'Start';
      break;
    case 'progressing':
      action = 'Pause';
      break;
    case 'paused':
      action = 'Resume';
      break;
    case 'canceled':
    case 'error':
      action = 'Retry';
      break;
    default:
      action = 'Start';
      break;
  }

  const handleClick = async () => {
    switch (status) {
      case 'notstarted':
        dispatch(startDownload(id));
        break;
      case 'progressing':
        dispatch(pauseDownload(id));
        break;
      case 'paused':
      case 'canceled':
      case 'error':
        dispatch(resumeDownload(id));
        break;
      default:
        break;
    }
  };

  if (status !== 'complete' && status !== 'removed') {
    const Button = action === 'Pause' ? WhiteButton : BlueButton;
    return (
      <Button
        onClick={handleClick}
        variant="contained"
        size="small"
        style={{ marginRight: '5px' }}
      >
        {action}
      </Button>
    );
  } else return null;
}

export default connect()(DownloadActionButton);
