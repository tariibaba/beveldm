import React, { Fragment } from 'react';
import Download from './Download';
import { CircularProgress, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { connect } from 'react-redux';
import when from 'when-expression';

const useStyles = makeStyles(theme => ({
  main: {
    textAlign: 'center',
    position: 'relative',
    minHeight: '70%',
    height: '70%',
    backgroundColor: grey[100],
    overflowY: 'overlay',
    flex: '1 1 auto'
  },
  list: {
    position: 'relative',
    display: 'inline-block',
    width: 600,
    textAlign: 'left',
    marginTop: 15
  },
  gettingInfo: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center'
  }
}));

function DownloadList({ downloads = [] }) {
  const classes = useStyles();

  return (
    <div className={classes.main}>
      <div className={classes.list}>
        {downloads.map(download => (
          <Fragment key={download.id}>
            {download.status === 'gettinginfo' ? (
              <div className={classes.gettingInfo}>
                <CircularProgress />
              </div>
            ) : (
              <Download {...download} />
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default connect(({ downloads, downloadGroup }) => ({
  downloads: when(downloadGroup)({
    all: downloads,
    else: downloads.filter(download => download.type === downloadGroup)
  })
}))(DownloadList);
