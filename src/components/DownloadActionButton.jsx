import React from 'react';
import { connect } from 'react-redux';
import {
  thunkStartDownload,
  thunkPauseDownload,
  thunkResumeDownload
} from '../thunks';
import { BlueButton, WhiteButton } from './CustomButtons';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  button: {
    marginRight: '5px'
  }
}));

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
        dispatch(thunkStartDownload(id));
        break;
      case 'started':
        dispatch(thunkPauseDownload(id));
        break;
      case 'paused':
      case 'canceled':
      case 'error':
        dispatch(thunkResumeDownload(id));
        break;
      default:
        break;
    }
  };

  if (status !== 'complete' && status !== 'deleted') {
    const Button =
      status === 'paused' || status === 'notstarted' || status === 'canceled' || status === 'error'
        ? BlueButton
        : WhiteButton;
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
