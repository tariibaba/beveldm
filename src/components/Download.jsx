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
import './Download.css';
import { WhiteButton } from './CustomButtons';
import { Close } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import { grey } from '@material-ui/core/colors';
import when from 'when-expression';
import DownloadMoreActions from './DownloadMoreActions';

const useStyles = makeStyles(theme => ({
  cardError: {
    backgroundColor: '#fbfbfb',
    boxShadow: 'none',
    border: '0.5px solid #e0e0e0'
  },
  cardContent: {
    margin: '3px',
    paddingTop: 0
  },
  iconButton: {
    float: 'right',
    marginRight: '-14px'
  }
}));

const filenameStyles = {
  error: {
    color: grey['600'],
    textDecoration: 'line-through'
  },
  complete: {
    cursor: 'pointer'
  }
};

const moreVert = {
  float: 'right',
  position: 'absolute',
  right: 0,
  top: '25%',
  bottom: '100%'
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
  error
}) {
  const fullPath = path.resolve(dirname, availableFilename);

  const openFolder = () => {
    shell.showItemInFolder(fullPath);
  };

  const openFile = () => {
    if (status === 'complete') shell.openItem(fullPath);
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

  return (
    <div className="Download">
      <Card
        style={{ position: 'relative' }}
        className={
          status === 'canceled' || status === 'error' ? classes.cardError : {}
        }
      >
        <CardContent className={classes.cardContent}>
          <div>
            {(status === 'canceled' ||
              status === 'complete' ||
              status === 'error') && (
              <IconButton className={classes.iconButton} onClick={remove}>
                <Close style={{ fontSize: '15px' }} />
              </IconButton>
            )}
            <br />
            {status !== 'complete' && (
              <div style={moreVert}>
                <DownloadMoreActions id={id} currentUrl={url} />
              </div>
            )}
            <button
              className="Download-link-button Download-file"
              onClick={openFile}
              style={when(status)({
                canceled: filenameStyles.error,
                complete: filenameStyles.complete,
                error: filenameStyles.error,
                else: {}
              })}
            >
              {availableFilename}
            </button>
            <span style={{ marginLeft: 10, fontWeight: 500 }}>
              {when(status)({
                canceled: 'Canceled',
                error: error
                  ? when(error.code)({
                      ERR_FILE_CHANGED: 'File changed',
                      else: null
                    })
                  : null,
                else: null
              })}
            </span>
            <br />
            <div>
              <button
                className="Download-link-button Download-url"
                onClick={openUrl}
              >
                {url}
              </button>
            </div>
            <br />
            {status !== 'complete' &&
              status !== 'canceled' &&
              status !== 'error' && (
                <PeriodicUpdate start={status === 'started'} interval={500}>
                  <div style={{ marginBottom: '10px' }}>
                    <DownloadSpeed
                      bytesDownloaded={bytesDownloaded}
                      status={status}
                    />
                    {prettyBytes(bytesDownloaded)} of {prettyBytes(size)}
                  </div>
                </PeriodicUpdate>
              )}
            {status === 'complete' && (
              <button
                className="Download-link-button Download-show-in-folder"
                onClick={openFolder}
              >
                Show in folder
              </button>
            )}
            {status !== 'complete' &&
              status !== 'canceled' &&
              status !== 'error' && (
                <PeriodicUpdate start={status === 'started'}>
                  <LinearProgress
                    value={(bytesDownloaded / size) * 100}
                    variant="determinate"
                    style={{
                      width: '100%',
                      padding: '0',
                      marginBottom: '10px'
                    }}
                  />
                </PeriodicUpdate>
              )}
            <DownloadActionButton id={id} status={status} />
            {status !== 'canceled' &&
              status !== 'complete' &&
              status !== 'error' && (
                <WhiteButton onClick={cancel} variant="contained" size="small">
                  Cancel
                </WhiteButton>
              )}
            <br />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default connect()(Download);
