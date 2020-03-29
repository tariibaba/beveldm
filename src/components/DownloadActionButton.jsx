import React from 'react';
import { connect } from 'react-redux';
import {
  startDownload,
  pauseDownloadThunk,
  resumeDownload
} from '../thunks';
import { Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  }
}));

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
        dispatch(pauseDownloadThunk(id));
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

  const classes = useStyles();

  return status !== 'complete' && status !== 'removed' ?
     (
      <Button
        onClick={handleClick}
        variant="contained"
        size="small"
        className={classes.root}
        color={action === 'Pause' ? 'secondary' : 'primary'}
      >
        {action}
      </Button>
    ) :null;
}

export default connect()(DownloadActionButton);
