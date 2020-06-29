import React, { Fragment } from 'react';
import Download from './Download';
import { CircularProgress, makeStyles, Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import when from 'when-expression';
import moment from 'moment';
import groupBy from 'lodash.groupby';

const useStyles = makeStyles((theme) => ({
  main: {
    textAlign: 'center',
    position: 'relative',
    minHeight: '70%',
    height: '70%',
    backgroundColor: theme.palette.background.default,
    overflowY: 'overlay',
    flex: '1 1 auto',
    display: 'flex',
    alignItems: 'center',
    flexFlow: 'column',
  },
  list: {
    position: 'relative',
    display: 'block',
    width: 600,
    textAlign: 'left',
    marginTop: theme.spacing(2),
  },
  gettingInfo: {
    marginTop: 15,
    marginBottom: 15,
    textAlign: 'center',
  },
}));

function DownloadList({ downloads = [] }) {
  const classes = useStyles();

  const grouped = groupBy(downloads, (download) =>
    moment(download.timestamp).startOf('day').toDate().getTime()
  );

  return (
    <div className={classes.main}>
      {Object.keys(grouped)
        .sort()
        .reverse()
        .map((day) => (
          <div key={day} className={classes.list}>
            {grouped[day].some(
              (download) => download.status !== 'getting info' && download.show
            ) > 0 && (
              <Typography style={{ fontWeight: 500, fontSize: 14 }}>
                {moment(Number.parseInt(day)).format('MMMM D, YYYY')}
              </Typography>
            )}
            {grouped[day].map((download) => (
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
        ))}
    </div>
  );
}

export default connect(({ downloads, downloadGroup }) => ({
  downloads: when(downloadGroup)({
    all: Object.values(downloads.byId),
    else: Object.values(downloads.byId).filter(
      (download) => download.type === downloadGroup
    ),
  }),
  test: downloads,
}))(DownloadList);
