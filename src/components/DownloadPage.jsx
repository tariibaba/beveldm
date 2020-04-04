import React from 'react';
import AddNewDownload from './AddNewDownload';
import DownloadList from './DownloadList';
import CustomSnackbar from './CustomSnackbar';
import NewDownloadDialog from './NewDownloadDialog';
import ChangeUrlDialog from './ChangeUrlDialog';
import YoutubeChooseFormat from './YouTubeChooseFormat';
import DownloadAppBar from './DownloadAppBar';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column'
  }
}));

function DownloadPage() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <DownloadAppBar />
      <AddNewDownload />
      <NewDownloadDialog />
      <ChangeUrlDialog />
      <YoutubeChooseFormat />
      <DownloadList />
      <CustomSnackbar />
    </div>
  );
}

export default DownloadPage;
