import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import AddNewDownload from './AddNewDownload';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    marginBottom: 15
  },
}));

function DownloadAppBar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Downloads</Typography>
          <AddNewDownload />
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default DownloadAppBar;
