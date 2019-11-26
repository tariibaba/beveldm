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
import { makeStyles, withStyles } from '@material-ui/styles';
import { grey, blue } from '@material-ui/core/colors';
import when from 'when-expression';
import DownloadMoreActions from './DownloadMoreActions';
import pathExists from 'path-exists';
import { downloadRemoved } from '../actions';

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
    width: '95%',
    padding: '0',
    marginTop: '20px',
    backgroundColor: grey['A100']
  }
}));

const filenameStyles = {
  default: {
    display: 'inline-block',
    fontWeight: '500',
    cursor: 'text'
  },
  error: {
    color: grey['700'] + '99',
    textDecoration: 'line-through'
  },
  complete: {
    cursor: 'pointer'
  }
};

const linkButtonStyles = {
  default: {
    backgroundColor: 'transparent',
    border: 'none',
    color: blue['700'],
    fontSize: '1em',
    fontFamily: 'Roboto',
    margin: 0,
    padding: 0
  }
};

const urlStyles = {
  default: {
    display: 'inline-block',
    marginTop: '10px',
    color: grey['700'],
    cursor: 'pointer'
  },
  error: {
    color: grey['700'] + '99',
  }
};

const showInFolderButtonStyles = {
  marginTop: '30px',
  marginBottom: '20px',
  cursor: 'pointer'
};

const cardStyles = {
  default: {
    marginTop: '15px',
    marginBottom: '15px',
    boxShadow: '0px 1px 3px' + grey['A200'],
    transition: 'none'
  },
  error: {
    backgroundColor: '#ffffff99',
    boxShadow: 'none',
    border: '0.5px solid #e0e0e0'
  }
};

const moreVert = {
  float: 'right',
  clear: 'right',
  position: 'relative',
  marginRight: '-14px'
};

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
  const fullPath = path.resolve(dirname, availableFilename);

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
      style={{
        ...cardStyles.default,
        ...(status === 'canceled' || status === 'error' || status === 'deleted'
          ? cardStyles.error
          : {})
      }}
    >
      <CardContent className={classes.cardContent}>
        <div>
          {(status === 'canceled' ||
            status === 'complete' ||
            status === 'error' ||
            status === 'deleted') && (
            <IconButton className={classes.iconButton} onClick={remove}>
              <Close style={{ fontSize: '15px' }} />
            </IconButton>
          )}
          <br />
          {status !== 'complete' && status !== 'deleted' && (
            <div style={moreVert}>
              <DownloadMoreActions id={id} currentUrl={url} />
            </div>
          )}
          <div>
            <button
              onClick={openFile}
              style={{
                ...linkButtonStyles.default,
                ...filenameStyles.default,
                ...when(status)({
                  canceled: filenameStyles.error,
                  complete: filenameStyles.complete,
                  error: filenameStyles.error,
                  deleted: filenameStyles.error,
                  else: {}
                })
              }}
            >
              {availableFilename}
            </button>
            <span style={{ marginLeft: 10, fontWeight: 500, color: '#000000cd' }}>
              {when(status)({
                canceled: 'Canceled',
                error: error
                  ? when(error.code)({
                      ERR_FILE_CHANGED: 'File changed',
                      ECONNREFUSED: 'Network error',
                      else: null
                    })
                  : null,
                deleted: 'Deleted',
                else: null
              })}
            </span>
          </div>
          <div>
            <button
              onClick={openUrl}
              style={{
                ...linkButtonStyles.default,
                ...urlStyles.default,
                ...(status === 'error' ||
                status === 'deleted' ||
                status === 'canceled'
                  ? urlStyles.error
                  : {})
              }}
            >
              {url}
            </button>
          </div>
          {status !== 'complete' &&
            status !== 'canceled' &&
            status !== 'error' &&
            status !== 'deleted' && (
              <div style={{ marginTop: '20px' }}>
                <PeriodicUpdate start={status === 'started'} interval={500}>
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
          {status === 'complete' && (
            <button
              onClick={openFolder}
              style={{
                ...linkButtonStyles.default,
                ...showInFolderButtonStyles
              }}
            >
              Show in folder
            </button>
          )}
          {status !== 'complete' &&
            status !== 'canceled' &&
            status !== 'error' &&
            status !== 'deleted' && (
              <PeriodicUpdate start={status === 'started'}>
                <LinearProgress
                  value={(bytesDownloaded / size) * 100}
                  variant="determinate"
                  className={classes.colorLinearProgress}
                />
              </PeriodicUpdate>
            )}
          <DownloadActionButton id={id} status={status} />
          {status !== 'canceled' &&
            status !== 'complete' &&
            status !== 'error' &&
            status !== 'deleted' && (
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
