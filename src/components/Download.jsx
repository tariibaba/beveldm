import React from 'react';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';
import PeriodicUpdate from './PeriodicUpdate';
import DownloadSpeed from './DownloadSpeed';
import { shell } from 'electron';
import path from 'path';
import { cancelDownloadThunk, removeDownloadThunk } from '../thunks';
import { prettyBytes } from './utilities';
import {
  LinearProgress,
  Card,
  CardContent,
  IconButton
} from '@material-ui/core';
import { WhiteButton } from './CustomButtons';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { grey, blue } from '@material-ui/core/colors';
import when from 'when-expression';
import DownloadMoreActions from './DownloadMoreActions';
import pathExists from 'path-exists';
import clsx from 'clsx';
import { downloadFileRemoved } from '../actions';

const useStyles = makeStyles(theme => ({
  cardContent: {
    margin: '3px',
    paddingTop: 0,
    minHeight: '100px',
    '&:last-child': {
      paddingBottom: 0
    }
  },
  iconButton: {
    float: 'right',
    marginRight: '-14px'
  },
  colorLinearProgress: {
    width: '90%',
    padding: 0,
    marginTop: '20px',
    backgroundColor: grey['A100']
  },
  filenameStylesDefault: {
    display: 'inline-block',
    fontWeight: 500,
    cursor: 'text'
  },
  filenameStylesError: {
    color: `${grey['700']}99 !important`,
    textDecoration: 'line-through'
  },
  filenameStylesComplete: {
    cursor: 'pointer'
  },
  linkButtonStylesDefault: {
    backgroundColor: 'transparent',
    border: 'none',
    color: blue['700'],
    fontSize: '1em',
    fontFamily: 'Roboto',
    margin: 0,
    padding: 0
  },
  urlStylesDefault: {
    display: 'inline-block',
    marginTop: '10px',
    color: grey['700'],
    cursor: 'pointer',
    maxWidth: '90%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  urlStylesError: {
    color: grey['700'] + '99'
  },
  showInFolderButtonStyles: {
    marginTop: '30px',
    marginBottom: '20px',
    cursor: 'pointer'
  },
  cardStylesDefault: {
    marginTop: '15px',
    marginBottom: '15px',
    boxShadow: '0 1px 3px' + grey['A200'],
    transition: 'none'
  },
  cardStylesError: {
    backgroundColor: '#ffffff99',
    boxShadow: 'none',
    border: '0.5px solid #e0e0e0'
  },
  moreVert: {
    float: 'right',
    clear: 'right',
    position: 'relative',
    marginRight: '-14px'
  }
}));

function Download({
  id,
  url,
  availableFilename,
  dirname,
  size,
  bytesDownloaded,
  status,
  dispatch,
  error,
  show
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
              <Close style={{ fontSize: '15px' }} />
            </IconButton>
          )}

          {/* More vert icon button */}
          <br />
          {status !== 'complete' && status !== 'removed' && (
            <div className={classes.moreVert}>
              <DownloadMoreActions id={id} currentUrl={url} />
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
              {availableFilename}
            </button>

            {/* Text that shows when the download status is 'canceled', 'error' or 'removed' */}
            <span
              style={{ marginLeft: 10, fontWeight: 500, color: '#00000099' }}
            >
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
            </span>
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
              {url}
            </button>
          </div>

          {/* Speed, bytes downloaded and size */}
          {!(status === 'complete' || inactive) && (
            <div style={{ marginTop: '20px' }}>
              <PeriodicUpdate start={status === 'progressing'}>
                <div>
                  <DownloadSpeed
                    bytesDownloaded={bytesDownloaded}
                    status={status}
                  />
                  {prettyBytes(bytesDownloaded)} of {prettyBytes(size)}
                  {status === 'paused' ? ', Paused' : null}
                </div>
              </PeriodicUpdate>
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
              Show in folder
            </button>
          )}

          {/* Progress bar */}
          {!(status === 'complete' || inactive) && (
            <PeriodicUpdate start={status === 'progressing'}>
              <LinearProgress
                value={(bytesDownloaded / size) * 100}
                variant="determinate"
                className={classes.colorLinearProgress}
              />
            </PeriodicUpdate>
          )}

          <DownloadActionButton id={id} status={status} />

          {/* Cancel button */}
          {!(status === 'complete' || inactive) && (
            <WhiteButton onClick={cancel} variant="contained" size="small">
              Cancel
            </WhiteButton>
          )}
          <br />
        </div>
      </CardContent>
    </Card>
  ) : null;
}

export default connect()(Download);
