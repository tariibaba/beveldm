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

const useStyles = makeStyles(theme => ({
  cardCanceled: {
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
  canceled: {
    color: grey['600'],
    textDecoration: 'line-through'
  },
  complete: {
    cursor: 'pointer'
  }
};

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
  const fullPath = path.resolve(dirname, filename);

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
      <Card className={status === 'canceled' ? classes.cardCanceled : {}}>
        <CardContent className={classes.cardContent}>
          <div>
            {(status === 'canceled' || status === 'complete') && (
              <IconButton className={classes.iconButton} onClick={remove}>
                <Close style={{ fontSize: '15px' }} />
              </IconButton>
            )}
            <br />
            <button
              className="Download-link-button Download-file"
              onClick={openFile}
              style={when(status)({
                canceled: filenameStyles.canceled,
                complete: filenameStyles.complete,
                else: {}
              })}
            >
              {filename}
            </button>
            <span style={{ marginLeft: 10, fontWeight: 500 }}>
              {when(status)({
                canceled: 'Canceled',
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
            {status !== 'complete' && status !== 'canceled' && (
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
            {status !== 'complete' && status !== 'canceled' && (
              <PeriodicUpdate start={status === 'started'}>
                <LinearProgress
                  value={(bytesDownloaded / size) * 100}
                  variant="determinate"
                  style={{ width: '100%', padding: '0', marginBottom: '10px' }}
                />
              </PeriodicUpdate>
            )}
            <DownloadActionButton id={id} status={status} />
            {status !== 'canceled' && status !== 'complete' && (
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
