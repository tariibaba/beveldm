import React from 'react';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';
import { shell } from 'electron';
import path from 'path';
import { cancelDownloadThunk, removeDownloadThunk } from '../thunks';
import { prettyBytes } from './utilities';
import {
  LinearProgress,
  Card,
  CardContent,
  IconButton,
  Button,
  Typography,
  MuiThemeProvider,
  createMuiTheme
} from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import when from 'when-expression';
import DownloadMoreActions from './DownloadMoreActions';
import pathExists from 'path-exists';
import clsx from 'clsx';
import { downloadFileRemoved } from '../actions';

const useStyles = makeStyles(theme => ({
  cardContent: {
    margin: '3px',
    paddingTop: 0,
    paddingRight: 0,
    minHeight: '100px',
    '&:last-child': {
      paddingBottom: 0
    }
  },
  iconButton: {
    float: 'right'
  },
  colorLinearProgress: {
    width: '90%',
    padding: 0,
    marginTop: 20
  },
  filenameStylesDefault: {
    display: 'inline-block',
    cursor: 'text',
    marginTop: '10px !important',
    color: theme.palette.custom.filenameDefault
  },
  filenameStylesError: {
    color: `${theme.palette.custom.filenameError}`,
    textDecoration: 'line-through'
  },
  filenameStylesComplete: {
    cursor: 'pointer'
  },
  linkButtonStylesDefault: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1em',
    margin: 0,
    padding: 0
  },
  urlStylesDefault: {
    display: 'inline-block',
    marginTop: '10px',
    color: theme.palette.custom.urlDefault,
    cursor: 'pointer',
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  urlStylesError: {
    color: theme.palette.custom.urlError
  },
  showInFolderButtonStyles: {
    marginTop: '30px',
    marginBottom: '20px',
    cursor: 'pointer',
    color: theme.palette.custom.showInFolder
  },
  cardStylesDefault: {
    marginTop: '15px',
    marginBottom: '15px',
    boxShadow: theme.shadows[3],
    transition: 'none',
    background: theme.palette.custom.cardDefault
  },
  cardStylesError: {
    backgroundColor: theme.palette.custom.cardError,
    boxShadow: 'none',
    border: `0.5px solid ${theme.palette.custom.cardErrorBorder}`
  },
  moreVert: {
    float: 'right',
    clear: 'right'
  },
  progressText: {
    marginTop: theme.spacing(2),
    color: theme.palette.custom.progressText
  },
  cancelButton: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1)
  },
  statusText: {
    marginLeft: 10,
    fontWeight: 500,
    display: 'inline',
    color: theme.palette.custom.downloadStatusText
  }
}));

function Download({
  id,
  url,
  availableFilename,
  dirname,
  size,
  bytesDownloadedShown,
  speed,
  status,
  dispatch,
  error,
  show,
  openWhenDone
}) {
  const fullPath = path.join(dirname, availableFilename);

  const openFolder = async () => {
    if (!(await pathExists(fullPath))) {
      dispatch(downloadFileRemoved(id));
    } else {
      shell.showItemInFolder(fullPath);
    }
  };

  const openFile = async () => {
    if (status === 'complete') {
      if (!(await pathExists(fullPath))) {
        dispatch(downloadFileRemoved(id));
      } else {
        shell.openItem(fullPath);
      }
    }
  };

  const openUrl = () => {
    shell.openExternal(url);
  };

  const cancel = () => {
    dispatch(cancelDownloadThunk(id));
  };

  const remove = () => {
    dispatch(removeDownloadThunk(id));
  };

  const classes = useStyles();
  const inactive =
    status === 'canceled' || status === 'error' || status === 'removed';

  return show ? (
    <MuiThemeProvider
      theme={outerTheme =>
        createMuiTheme({
          ...outerTheme,
          typography: { ...outerTheme.typography, body1: { fontSize: 13 } }
        })
      }
    >
      <Card
        className={clsx(
          classes.cardStylesDefault,
          inactive && classes.cardStylesError
        )}
      >
        <CardContent className={classes.cardContent}>
          <div>
            {/* Close icon button */}
            {(status === 'complete' || inactive) && (
              <IconButton className={classes.iconButton} onClick={remove}>
                <Close fontSize="small" style={{ fontSize: '15px' }} />
              </IconButton>
            )}

            {/* More vert icon button */}
            {status !== 'complete' && status !== 'removed' && (
              <div className={classes.moreVert}>
                <DownloadMoreActions
                  id={id}
                  currentUrl={url}
                  openWhenDone={openWhenDone}
                />
              </div>
            )}

            {/* Available file name */}
            <div>
              <button
                onClick={openFile}
                className={clsx(
                  classes.linkButtonStylesDefault,
                  classes.filenameStylesDefault,
                  when(status)({
                    canceled: classes.filenameStylesError,
                    complete: classes.filenameStylesComplete,
                    error: classes.filenameStylesError,
                    removed: classes.filenameStylesError,
                    else: null
                  })
                )}
              >
                <Typography style={{ fontWeight: 500, color: 'inherit' }}>
                  {availableFilename}
                </Typography>
              </button>

              {/* Text that shows when the download status is 'canceled', 'error' or 'removed' */}
              <Typography className={classes.statusText}>
                {when(status)({
                  canceled: 'Canceled',
                  error: error
                    ? when(error.code)({
                        EFILECHANGED: 'File changed',
                        ECONNREFUSED: 'Network error',
                        ENOTFOUND: 'Network error',
                        ECONNRESET: 'Network error',
                        EFORBIDDEN: 'Forbidden',
                        else: null
                      })
                    : null,
                  removed: 'Removed',
                  else: null
                })}
              </Typography>
            </div>

            {/* URL */}
            <div>
              <button
                onClick={openUrl}
                className={clsx(
                  classes.linkButtonStylesDefault,
                  classes.urlStylesDefault,
                  inactive && classes.urlStylesError
                )}
              >
                <Typography style={{ color: 'inherit' }}>{url}</Typography>
              </button>
            </div>

            {/* Speed, bytes downloaded and size */}
            {!(status === 'complete' || inactive) && (
              <div className={classes.progressText}>
                <div>
                  <Typography>
                    {status === 'progressing' && prettyBytes(speed) + '/s - '}
                    {prettyBytes(bytesDownloadedShown)} of {prettyBytes(size)}
                    {status === 'paused' ? ', Paused' : null}
                  </Typography>
                </div>
              </div>
            )}

            {/* Button to open download folder */}
            {status === 'complete' && (
              <button
                onClick={openFolder}
                className={clsx(
                  classes.linkButtonStylesDefault,
                  classes.showInFolderButtonStyles
                )}
              >
                <Typography style={{ color: 'inherit' }}>
                  Show in folder
                </Typography>
              </button>
            )}

            {/* Progress bar */}
            {!(status === 'complete' || inactive) && (
              <LinearProgress
                value={(bytesDownloadedShown / size) * 100}
                variant="determinate"
                className={classes.colorLinearProgress}
              />
            )}

            <DownloadActionButton id={id} status={status} />

            {/* Cancel button */}
            {!(status === 'complete' || inactive) && (
              <Button
                variant="contained"
                color="secondary"
                onClick={cancel}
                size="small"
                className={classes.cancelButton}
              >
                Cancel
              </Button>
            )}
            <br />
          </div>
        </CardContent>
      </Card>
    </MuiThemeProvider>
  ) : null;
}

export default connect()(Download);
