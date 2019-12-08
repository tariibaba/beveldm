import React, { Fragment } from 'react';
import Download from './Download';
import { connect } from 'react-redux';
import { CircularProgress, makeStyles } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

const useStyles = makeStyles(theme => ({
  main: {
    textAlign: 'center',
    minHeight: '100%',
    backgroundColor: grey['100']
  },
  list: {
    display: 'inline-block',
    width: '600px',
    textAlign: 'left',
    marginTop: theme.spacing(10)
  },
  gettingInfo: {
    marginTop: '15px',
    marginBottom: '15px',
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

export default connect(state => ({
  downloads: state.downloads
}))(DownloadList);
