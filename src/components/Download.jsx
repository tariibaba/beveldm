import React, { useEffect } from 'react';
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
} from '@material-ui/core';
import { Close, FolderOpen } from '@material-ui/icons';
import { makeStyles } from '@material-ui/styles';
import when from 'when-expression';
import DownloadMoreActions from './DownloadMoreActions';
import pathExists from 'path-exists';
import clsx from 'clsx';
import { downloadFileRemoved } from '../actions';
import humanizeDuration from 'humanize-duration';
import DownloadUrl from './DownloadUrl';
import fs from 'fs';
import os from 'os';

const humanizer = humanizeDuration.humanizer({
  largest: 2,
  units: ['w', 'd', 'h', 'm', 's'],
  languages: {
    shortEn: {
      w: () => 'weeks',
      d: () => 'days',
      h: () => 'hours',
      m: () => 'mins',
      s: () => 'secs',
    },
  },
  maxDecimalPoints: 0,
  delimiter: ' and ',
});
const humanizerPluralFilterRegex = /(^1 [(week)(day)(hour)(min)(sec)]+)s/g;

const useStyles = makeStyles((theme) => ({
  cardContent: {
    margin: '3px',
    paddingTop: 0,
    paddingRight: 0,
    minHeight: '100px',
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  iconButton: {
    float: 'right',
  },
  colorLinearProgress: {
    width: '90%',
    padding: 0,
    marginTop: 20,
  },
  filenameStylesDefault: {
    display: 'inline-block',
    cursor: 'text',
    marginTop: '10px !important',
    color: theme.palette.custom.filenameDefault,
    fontSize: 13,
    maxWidth: '90%'
  },
  filenameStylesError: {
    color: theme.palette.custom.filenameError,
    textDecoration: 'line-through',
  },
  filenameStylesComplete: {
    cursor: 'pointer',
    color: theme.palette.custom.filenameComplete,
  },
  linkButtonStylesDefault: {
    backgroundColor: 'transparent',
    border: 'none',
    fontSize: '1em',
    margin: 0,
    padding: 0,
  },

  showInFolder: {
    marginBottom: 5,
    position: 'relative',
    '--padding': '12px',
    padding: 'var(--padding)',
    right: 'var(--padding)',
    color: theme.palette.custom.showInFolder,
  },
  cardStylesDefault: {
    marginTop: '15px',
    marginBottom: '15px',
    boxShadow: theme.shadows[3],
    transition: 'none',
    background: theme.palette.custom.cardDefault,
  },
  cardStylesError: {
    backgroundColor: theme.palette.custom.cardError,
    boxShadow: 'none',
    border: `0.5px solid ${theme.palette.custom.cardErrorBorder}`,
  },
  moreVert: {
    float: 'right',
    clear: 'right',
  },
  progressText: {
    color: theme.palette.custom.progressText,
  },
  cancelButton: {
    marginLeft: theme.spacing(1),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(1),
  },
  statusText: {
    marginLeft: 10,
    fontWeight: 500,
    display: 'inline',
    color: theme.palette.custom.downloadStatusText,
  },
  typography: {
    fontSize: 13,
  },
  linerProgressBar: {
    transition: 'none',
  },
  filenameText: {
    maxWidth: '100%',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    textAlign: 'left'
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
  openWhenDone,
  limitSpeed,
}) {
  const fullPath = path.join(dirname, availableFilename);
  const secondsLeft = ((size - bytesDownloadedShown) / speed) * 1000;
  const humanizedDuration = humanizer(secondsLeft, {
    language: 'shortEn',
  }).replace(humanizerPluralFilterRegex, '$1');

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

  const cancel = () => {
    dispatch(cancelDownloadThunk(id));
  };

  const remove = () => {
    dispatch(removeDownloadThunk(id));
  };

  const showExtIcon = async () => {
    const filePath = path.join(os.tmpdir(), `for-ext${path.extname(availableFilename)}`);
    await fs.open(filePath, 'w');
  }

  useEffect(() => {
    if (status === 'notstarted') {
      showExtIcon();
    }
  }, [status])

  const classes = useStyles();
  const inactive =
    status === 'canceled' || status === 'error' || status === 'removed';
  const prettyBytesStringFormat = (bytes) => {
    const userFriendlyBytes = prettyBytes(bytes);
    return `${userFriendlyBytes.size} ${userFriendlyBytes.unit}`;
  };

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
              <Close fontSize="small" style={{ fontSize: '15px' }} />
            </IconButton>
          )}

          {/* More vert icon button */}
          {status !== 'complete' && (
            <div className={classes.moreVert}>
              <DownloadMoreActions
                id={id}
                currentUrl={url}
                openWhenDone={openWhenDone}
                status={status}
                limitSpeed={limitSpeed}
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
                  else: null,
                })
              )}
            >
              <Typography
                style={{ fontWeight: 500, color: 'inherit' }}
                className={clsx(classes.typography, classes.filenameText)}
              >
                {availableFilename}
              </Typography>
            </button>

            {/* Text that shows when the download status is 'canceled', 'error' or 'removed' */}
            <Typography
              className={clsx(classes.statusText, classes.typography)}
            >
              {when(status)({
                canceled: 'Canceled',
                error: error
                  ? when(error.code)({
                      EFILECHANGED: 'Failed - File changed at server',
                      ECONNREFUSED: "Failed - Can't connect",
                      ENOTFOUND: "Failed - Can't connect",
                      ECONNRESET: "Failed - Can't connect",
                      EFORBIDDEN:
                        "Failed - Can't resume from this URL (HTTP 403)",
                      ETIMEDOUT: "Failed - Can't connect",
                      ERANGENOTSATISFIABLE:
                        "Failed - Can't resume from this URL (HTTP 416)",
                      HPE_INVALID_CONTENT_LENGTH:
                        'Failed - File changed at server',
                      else: null,
                    })
                  : null,
                removed: 'Removed',
                else: null,
              })}
            </Typography>
          </div>

          {/* URL */}
          <DownloadUrl id={id} url={url} inactive={inactive} status={status} />

          {/* Speed, bytes downloaded and size */}
          {!(status === 'complete' || inactive) && (
            <div className={classes.progressText}>
              <Typography
                className={clsx(classes.progressText, classes.typography)}
              >
                {status === 'progressing' &&
                  prettyBytesStringFormat(speed) + '/s - '}
                {prettyBytesStringFormat(bytesDownloadedShown)} of{' '}
                {prettyBytesStringFormat(size)}
                {status === 'paused' && ', Paused'}
                {status === 'progressing' &&
                  speed > 0 &&
                  `, ${humanizedDuration} left`}
              </Typography>
            </div>
          )}

          {/* Button to open download folder */}
          {status === 'complete' && (
            <IconButton onClick={openFolder} className={classes.showInFolder}>
              <FolderOpen />
            </IconButton>
          )}

          {/* Progress bar */}
          {!(status === 'complete' || inactive) && (
            <LinearProgress
              value={(bytesDownloadedShown / size) * 100}
              variant="determinate"
              className={classes.colorLinearProgress}
              classes={{
                bar: bytesDownloadedShown === 0 && classes.linerProgressBar,
              }}
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
  ) : null;
}

export default connect()(Download);
