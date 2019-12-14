import React from 'react';
import { connect } from 'react-redux';
import DownloadActionButton from './DownloadActionButton';
import PeriodicUpdate from './PeriodicUpdate';
import DownloadSpeed from './DownloadSpeed';
import { shell } from 'electron';
import path from 'path';
import { thunkCancelDownload, thunkRemoveDownload } from '../thunks';
import prettyBytes from '../pretty-bytes';
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
import { downloadRemoved } from '../actions';
import clsx from 'clsx';

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
    padding: '0',
    marginTop: '20px',
    backgroundColor: grey['A100']
  },
  filenameStylesDefault: {
    display: 'inline-block',
    fontWeight: '500',
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
    boxShadow: '0px 1px 3px' + grey['A200'],
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
    if (!(await pathExists(fullPath))) dispatch(downloadRemoved(id));
    else shell.showItemInFolder(fullPath);
  };

  const openFile = async () => {
    if (status === 'complete') {
      if (!(await pathExists(fullPath))) dispatch(downloadRemoved(id));
      else shell.openItem(fullPath);
    }
  };

  const openUrl = () => {
    shell.openExternal(url);
  };

  const cancel = () => {
    dispatch(thunkCancelDownload(id));
  };

  const remove = () => {
    dispatch(thunkRemoveDownload(id));
  };

  const classes = useStyles();

  return show ? (
    <Card
      className={clsx(
        classes.cardStylesDefault,
        (status === 'canceled' || status === 'error' || status === 'removed') &&
          classes.cardStylesError
      )}
    >
      <CardContent className={classes.cardContent}>
        <div>
          {/* Close icon button */}
          {(status === 'canceled' ||
            status === 'complete' ||
            status === 'error' ||
            status === 'removed') && (
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
                      ERR_FILE_CHANGED: 'File changed',
                      ECONNREFUSED: 'Network error',
                      ENOTFOUND: 'Network error',
                      ECONNRESET: 'Network error',
                      ERR_FORBIDDEN: 'Forbidden',
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
                status === 'error' ||
                  status === 'removed' ||
                  status === 'canceled'
                  ? classes.urlStylesError
                  : null
              )}
            >
              {url}
            </button>
          </div>

          {/* Speed, bytes downloaded and size */}
          {status !== 'complete' &&
            status !== 'canceled' &&
            status !== 'error' &&
            status !== 'removed' && (
              <div style={{ marginTop: '20px' }}>
                <PeriodicUpdate start={status === 'progressing'} interval={500}>
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
          {status !== 'complete' &&
            status !== 'canceled' &&
            status !== 'error' &&
            status !== 'removed' && (
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
          {status !== 'canceled' &&
            status !== 'complete' &&
            status !== 'error' &&
            status !== 'removed' && (
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
