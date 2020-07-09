import React, { useState } from 'react';
import AddNewDownload from './AddNewDownload';
import DownloadList from './DownloadList';
import NewDownloadDialog from './NewDownloadDialog';
import ChangeUrlDialog from './ChangeUrlDialog';
import YoutubeChooseFormat from './YouTubeChooseFormat';
import DownloadAppBar from './DownloadAppBar';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexFlow: 'column',
  },
}));

function DownloadPage() {
  const [appBarRaised, setAppBarRaised] = useState(false);
  const classes = useStyles();

  const handleScroll = (scrollTop) => setAppBarRaised(scrollTop > 0);

  return (
    <div className={classes.root}>
      <DownloadAppBar raised={appBarRaised} />
      <AddNewDownload />
      <NewDownloadDialog />
      <ChangeUrlDialog />
      <YoutubeChooseFormat />
      <DownloadList onScroll={handleScroll} />
    </div>
  );
}

export default DownloadPage;
